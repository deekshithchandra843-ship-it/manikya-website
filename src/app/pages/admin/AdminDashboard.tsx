import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  LayoutDashboard, Briefcase, Image, Mail, LogOut,
  Plus, Edit, Trash2, Save, X, TrendingUp, Search, Download,
  MessageSquare, Phone, User, ChevronDown, ChevronUp, CheckCircle,
  Clock, StickyNote, Send, Bell, RefreshCw, BarChart2, Sparkles, Menu,
} from 'lucide-react';
import { servicesApi, contactApi, analyticsApi, tokenStore } from '../../../lib/api';
import type { Service, ContactLead, AnalyticsOverview } from '../../../lib/api';

type Tab = 'overview' | 'contacts' | 'services' | 'analytics';
type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

interface ClientProfile {
  key: string; name: string; email?: string; phone?: string;
  leads: ContactLead[]; lastContact: string; totalEnquiries: number;
}

const COLORS = { new:'#f59e0b', contacted:'#3b82f6', closed:'#10b981' };

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:4, height:6, overflow:'hidden', flex:1 }}>
      <div style={{ width:`${max?(value/max)*100:0}%`, height:'100%', background:color, borderRadius:4, transition:'width 1s ease' }}/>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }: { label:string; value:number|string; icon:React.ReactNode; color:string; sub?:string }) {
  return (
    <div style={{ background:'linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'18px 16px', display:'flex', alignItems:'center', gap:14 }}>
      <div style={{ width:48, height:48, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 8px 20px ${color}40` }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:3 }}>{label}</div>
        <div style={{ color:'#fff', fontFamily:'DM Sans,sans-serif', fontSize:'1.8rem', fontWeight:800, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', marginTop:3 }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]           = useState<Tab>('overview');
  const [services, setServices]             = useState<Service[]>([]);
  const [contactLeads, setContactLeads]     = useState<ContactLead[]>([]);
  const [overview, setOverview]             = useState<AnalyticsOverview|null>(null);
  const [editingService, setEditingService] = useState<Service|null>(null);
  const [newService, setNewService]         = useState({ title:'', description:'' });
  const [loading, setLoading]               = useState(true);
  const [refreshing, setRefreshing]         = useState(false);
  const [searchQuery, setSearchQuery]       = useState('');
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all');
  const [expandedLead, setExpandedLead]     = useState<string|null>(null);
  const [viewMode, setViewMode]             = useState<'table'|'profiles'>('table');
  const [sidebarOpen, setSidebarOpen]       = useState(false);
  const [notes, setNotes]                   = useState<Record<string,string>>(() => {
    try { return JSON.parse(localStorage.getItem('admin_notes')||'{}'); } catch { return {}; }
  });
  const [editingNote, setEditingNote]       = useState<string|null>(null);
  const [noteText, setNoteText]             = useState('');

  useEffect(() => {
    if (!localStorage.getItem('admin_logged_in')) { navigate('/admin'); return; }
    loadData();
  }, [navigate]);

  // Close sidebar on tab change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [activeTab]);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [svcs, leads, ov] = await Promise.all([servicesApi.getAll(), contactApi.getAll(), analyticsApi.overview()]);
      setServices(svcs); setContactLeads(leads); setOverview(ov);
    } catch { tokenStore.clearAdmin(); navigate('/admin'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleLogout = () => { tokenStore.clearAdmin(); navigate('/admin'); };

  const handleAddService    = async () => { if (!newService.title||!newService.description) return; await servicesApi.create(newService); setNewService({title:'',description:''}); setServices(await servicesApi.getAll()); };
  const handleDeleteService = async (id: number) => { if (!confirm('Delete?')) return; await servicesApi.remove(id); setServices(services.filter(s=>s.id!==id)); };
  const handleSaveEdit      = async () => { if (!editingService) return; await servicesApi.update(editingService.id,{title:editingService.title,description:editingService.description}); setServices(services.map(s=>s.id===editingService.id?editingService:s)); setEditingService(null); };

  const handleUpdateStatus = async (id: string, status: string) => { await contactApi.updateStatus(id,status); setContactLeads(l=>l.map(x=>x.id===id?{...x,status}:x)); };
  const handleDeleteLead   = async (id: string) => { if (!confirm('Delete?')) return; await contactApi.delete(id); setContactLeads(l=>l.filter(x=>x.id!==id)); };
  const handleSaveNote     = (id: string) => { const u={...notes,[id]:noteText}; setNotes(u); localStorage.setItem('admin_notes',JSON.stringify(u)); setEditingNote(null); };

  const handleExport = () => {
    const h=['Name','Email','Phone','Interest','Message','Status','Date','Notes'];
    const r=filteredLeads.map(l=>[l.name,l.email||'',l.phone||'',l.interest||'',`"${(l.message||'').replace(/"/g,'""')}"`,l.status,new Date(l.created_at).toLocaleDateString(),`"${(notes[l.id]||'').replace(/"/g,'""')}"`]);
    const csv=[h,...r].map(x=>x.join(',')).join('\n');
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=`leads-${new Date().toISOString().slice(0,10)}.csv`; a.click();
  };

  const filteredLeads = useMemo(() => contactLeads.filter(l => {
    const ms = statusFilter==='all'||l.status===statusFilter;
    const q  = searchQuery.toLowerCase();
    const mq = !q||[l.name,l.email||'',l.phone||'',l.interest||'',l.message||''].some(v=>v.toLowerCase().includes(q));
    return ms&&mq;
  }), [contactLeads,statusFilter,searchQuery]);

  const clientProfiles = useMemo(():ClientProfile[] => {
    const map:Record<string,ClientProfile>={};
    contactLeads.forEach(l=>{ const k=l.email||l.phone||l.name; if(!map[k]) map[k]={key:k,name:l.name,email:l.email,phone:l.phone,leads:[],lastContact:l.created_at,totalEnquiries:0}; map[k].leads.push(l); map[k].totalEnquiries++; if(new Date(l.created_at)>new Date(map[k].lastContact)) map[k].lastContact=l.created_at; });
    return Object.values(map).sort((a,b)=>new Date(b.lastContact).getTime()-new Date(a.lastContact).getTime());
  }, [contactLeads]);

  const interestData = useMemo(() => {
    const m:Record<string,number>={};
    contactLeads.forEach(l=>{ const k=l.interest||'General'; m[k]=(m[k]||0)+1; });
    return Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,6);
  }, [contactLeads]);

  const weeklyData = useMemo(() => {
    const days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const counts=Array(7).fill(0);
    contactLeads.forEach(l=>{ const d=new Date(l.created_at); const diff=Math.floor((Date.now()-d.getTime())/(86400000)); if(diff<7) counts[d.getDay()]++; });
    return days.map((d,i)=>({day:d,count:counts[i]}));
  }, [contactLeads]);

  const statusCounts = useMemo(() => ({
    new: contactLeads.filter(l=>l.status==='new').length,
    contacted: contactLeads.filter(l=>l.status==='contacted').length,
    closed: contactLeads.filter(l=>l.status==='closed').length,
  }), [contactLeads]);

  const tabs = [
    {id:'overview' as Tab, label:'Overview',  icon:<LayoutDashboard size={18}/>},
    {id:'contacts' as Tab, label:'Contacts',  icon:<Mail size={18}/>, badge: statusCounts.new},
    {id:'services' as Tab, label:'Services',  icon:<Briefcase size={18}/>},
    {id:'analytics' as Tab, label:'Analytics',icon:<BarChart2 size={18}/>},
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0a0f1e', color:'#fff' }}>
      <style>{`
        * { box-sizing:border-box; }
        @keyframes spin { to{transform:rotate(360deg)} }

        .dash-input { width:100%; padding:10px 14px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.9rem; outline:none; }
        .dash-input:focus { border-color:#f59e0b; }
        .dash-input::placeholder { color:rgba(255,255,255,0.3); }
        .dash-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 16px; border-radius:8px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:0.85rem; cursor:pointer; border:none; transition:all .2s; white-space:nowrap; }
        .lead-row { border-bottom:1px solid rgba(255,255,255,0.06); padding:14px; transition:background .2s; }
        .lead-row:hover { background:rgba(255,255,255,0.03); }
        .status-sel { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:6px 10px; font-family:'DM Sans',sans-serif; font-size:0.8rem; cursor:pointer; outline:none; width:100%; }

        /* Mobile bottom nav */
        .mob-nav { display:none; position:fixed; bottom:0; left:0; right:0; background:#0d1526; border-top:1px solid rgba(255,255,255,0.1); z-index:100; padding:0 4px; padding-bottom:env(safe-area-inset-bottom); }
        .mob-nav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; padding:10px 4px; border:none; background:transparent; color:rgba(255,255,255,0.45); font-family:'DM Sans',sans-serif; font-size:0.6rem; font-weight:600; cursor:pointer; transition:all .2s; position:relative; }
        .mob-nav-btn.active { color:#f59e0b; }
        .mob-badge { position:absolute; top:6px; right:calc(50% - 14px); background:#ef4444; color:#fff; border-radius:50%; width:15px; height:15px; display:flex; align-items:center; justify-content:center; font-size:0.55rem; font-weight:800; }

        /* Desktop sidebar */
        .desk-sidebar { display:block; width:200px; flex-shrink:0; }

        @media(max-width:768px) {
          .desk-sidebar { display:none !important; }
          .mob-nav { display:flex !important; }
          .main-content { padding:12px 12px 80px !important; }
          .header-subtitle { display:none; }
          .header-actions-full { display:none !important; }
          .header-actions-mob { display:flex !important; }
          .stat-grid { grid-template-columns:1fr 1fr !important; gap:10px !important; }
          .charts-row { grid-template-columns:1fr !important; }
          .interest-grid { grid-template-columns:1fr 1fr !important; }
          .quick-actions { grid-template-columns:1fr !important; }
          .contacts-header { flex-direction:column !important; align-items:flex-start !important; }
          .filter-row { flex-direction:column !important; }
          .filter-btns { overflow-x:auto; display:flex; gap:6px; padding-bottom:4px; scrollbar-width:none; }
          .filter-btns::-webkit-scrollbar { display:none; }
          .filter-btn { flex-shrink:0; }
          .lead-actions-row { flex-wrap:wrap; gap:6px; }
          .expanded-grid { grid-template-columns:1fr !important; }
          .service-add-grid { grid-template-columns:1fr !important; }
          .analytics-header { flex-direction:column; align-items:flex-start !important; gap:10px; }
          .analytics-stat-grid { grid-template-columns:1fr 1fr !important; }
          .profile-header { flex-direction:column; align-items:flex-start !important; gap:8px; }
        }
        @media(max-width:400px) {
          .stat-grid { grid-template-columns:1fr !important; }
          .interest-grid { grid-template-columns:1fr !important; }
          .analytics-stat-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 16px', position:'sticky', top:0, zIndex:50 }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:58 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:'linear-gradient(135deg,#1a3a5c,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:'1rem' }}>M</span>
            </div>
            <div>
              <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', color:'#fff', lineHeight:1 }}>Admin Dashboard</div>
              <div className="header-subtitle" style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', color:'rgba(255,255,255,0.4)' }}>Manikya Money Service Pvt. Ltd.</div>
            </div>
          </div>

          {/* Desktop header actions */}
          <div className="header-actions-full" style={{ display:'flex', alignItems:'center', gap:8 }}>
            {statusCounts.new > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 11px', background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20 }}>
                <Bell size={13} color="#f59e0b"/>
                <span style={{ color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontSize:'0.75rem', fontWeight:700 }}>{statusCounts.new} new</span>
              </div>
            )}
            <button className="dash-btn" onClick={() => loadData(true)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)' }}>
              <RefreshCw size={14} style={{ animation:refreshing?'spin 1s linear infinite':'none' }}/> Refresh
            </button>
            <button className="dash-btn" onClick={handleLogout} style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.2)' }}>
              <LogOut size={14}/> Logout
            </button>
          </div>

          {/* Mobile header actions */}
          <div className="header-actions-mob" style={{ display:'none', alignItems:'center', gap:8 }}>
            {statusCounts.new > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:4, padding:'4px 9px', background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20 }}>
                <Bell size={12} color="#f59e0b"/>
                <span style={{ color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:700 }}>{statusCounts.new}</span>
              </div>
            )}
            <button onClick={() => loadData(true)} style={{ width:34, height:34, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <RefreshCw size={15} color="rgba(255,255,255,0.6)" style={{ animation:refreshing?'spin 1s linear infinite':'none' }}/>
            </button>
            <button onClick={handleLogout} style={{ width:34, height:34, borderRadius:8, background:'rgba(239,68,68,0.15)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <LogOut size={15} color="#fca5a5"/>
            </button>
          </div>
        </div>
      </header>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:'20px 20px', display:'flex', gap:20 }}>

        {/* ── DESKTOP SIDEBAR ── */}
        <nav className="desk-sidebar">
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:10, position:'sticky', top:78 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.88rem', marginBottom:4, background:activeTab===t.id?'linear-gradient(135deg,#f59e0b,#d97706)':'transparent', color:activeTab===t.id?'#000':'rgba(255,255,255,0.6)', transition:'all .2s', position:'relative' }}>
                {t.icon} {t.label}
                {t.badge ? <span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.65rem', fontWeight:800 }}>{t.badge}</span> : null}
              </button>
            ))}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:8, paddingTop:8 }}>
              <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:10, textDecoration:'none', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif', fontSize:'0.85rem' }}>
                ← View Website
              </Link>
            </div>
          </div>
        </nav>

        {/* ── MAIN CONTENT ── */}
        <main className="main-content" style={{ flex:1, minWidth:0, padding:0 }}>

          {/* ── OVERVIEW ── */}
          {activeTab==='overview' && (
            <div>
              <div style={{ marginBottom:20 }}>
                <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,4vw,1.6rem)', margin:'0 0 4px' }}>Dashboard Overview</h2>
                <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', margin:0 }}>Live data from your database</p>
              </div>

              <div className="stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:14, marginBottom:20 }}>
                <StatCard label="Total Services" value={loading?'—':overview?.services??services.length} icon={<Briefcase size={22} color="#fff"/>} color="#3b82f6" sub="Active services"/>
                <StatCard label="Contact Leads" value={loading?'—':overview?.contacts??contactLeads.length} icon={<Mail size={22} color="#fff"/>} color="#10b981" sub={`${statusCounts.new} new`}/>
                <StatCard label="Gallery Images" value={loading?'—':overview?.gallery??0} icon={<Image size={22} color="#fff"/>} color="#8b5cf6"/>
                <StatCard label="Verified Users" value={loading?'—':overview?.verified_users??0} icon={<User size={22} color="#fff"/>} color="#f59e0b"/>
              </div>

              <div className="charts-row" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
                {/* Lead status */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 16px', color:'#fff' }}>Lead Status</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {[{label:'New',count:statusCounts.new,color:'#f59e0b'},{label:'Contacted',count:statusCounts.contacted,color:'#3b82f6'},{label:'Closed',count:statusCounts.closed,color:'#10b981'}].map(s=>(
                      <div key={s.label} style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:9, height:9, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.82rem', width:72 }}>{s.label}</span>
                        <MiniBar value={s.count} max={contactLeads.length} color={s.color}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'#fff', fontWeight:700, fontSize:'0.88rem', width:22, textAlign:'right' }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:16, paddingTop:14, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}>Total Leads</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'#fff', fontWeight:800, fontSize:'1rem' }}>{contactLeads.length}</span>
                  </div>
                </div>

                {/* Weekly bar chart */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 16px', color:'#fff' }}>This Week</h3>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:90 }}>
                    {weeklyData.map((d,i) => {
                      const max=Math.max(...weeklyData.map(x=>x.count),1);
                      const h=Math.max((d.count/max)*70,4);
                      return (
                        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5 }}>
                          <div style={{ width:'100%', height:h, background:d.count>0?'linear-gradient(180deg,#f59e0b,#d97706)':'rgba(255,255,255,0.08)', borderRadius:'3px 3px 0 0', transition:'height 1s ease', position:'relative' }}>
                            {d.count>0 && <div style={{ position:'absolute', top:-18, left:'50%', transform:'translateX(-50%)', color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontSize:'0.65rem', fontWeight:700 }}>{d.count}</div>}
                          </div>
                          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.62rem', color:'rgba(255,255,255,0.4)' }}>{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {interestData.length > 0 && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20, marginBottom:14 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 14px', color:'#fff' }}>Enquiry by Service</h3>
                  <div className="interest-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
                    {interestData.map(([label,count],i) => {
                      const colors=['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4'];
                      const c=colors[i%colors.length];
                      const pct=Math.round((count/contactLeads.length)*100);
                      return (
                        <div key={label} style={{ background:`${c}10`, border:`1px solid ${c}25`, borderRadius:12, padding:'12px 14px' }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.75rem', marginBottom:6, lineHeight:1.4 }}>{label}</div>
                          <div style={{ display:'flex', alignItems:'baseline', gap:6 }}>
                            <span style={{ fontFamily:'DM Sans,sans-serif', color:c, fontWeight:800, fontSize:'1.3rem' }}>{count}</span>
                            <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.72rem' }}>{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="quick-actions" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:10 }}>
                {[
                  {label:'View All Leads',   icon:<Mail size={15}/>,     tab:'contacts' as Tab,  color:'#10b981'},
                  {label:'Manage Services',  icon:<Briefcase size={15}/>, tab:'services' as Tab,  color:'#3b82f6'},
                  {label:'Analytics',        icon:<TrendingUp size={15}/>,tab:'analytics' as Tab, color:'#8b5cf6'},
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab)} style={{ display:'flex', alignItems:'center', gap:10, padding:'13px 16px', background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:12, cursor:'pointer', color:a.color, fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.85rem' }}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab==='contacts' && (
            <div>
              <div className="contacts-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, gap:12 }}>
                <div>
                  <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,4vw,1.6rem)', margin:'0 0 2px' }}>Contact Leads</h2>
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.82rem', margin:0 }}>{filteredLeads.length} of {contactLeads.length} leads</p>
                </div>
                <div style={{ display:'flex', gap:8, flexShrink:0 }}>
                  <button className="dash-btn" onClick={() => setViewMode(viewMode==='table'?'profiles':'table')} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)', padding:'8px 12px' }}>
                    <User size={14}/> <span style={{ display:'none' }}>{viewMode==='table'?'Client View':'Table View'}</span>
                  </button>
                  <button className="dash-btn" onClick={handleExport} style={{ background:'#10b981', color:'#fff', padding:'8px 12px' }}>
                    <Download size={14}/> <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Search & filter */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:14, marginBottom:14 }}>
                <div className="filter-row" style={{ display:'flex', gap:10 }}>
                  <div style={{ position:'relative', flex:1 }}>
                    <Search size={14} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)' }}/>
                    <input className="dash-input" style={{ paddingLeft:33 }} placeholder="Search..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                  </div>
                  <div className="filter-btns" style={{ display:'flex', gap:6 }}>
                    {(['all','new','contacted','closed'] as StatusFilter[]).map(s=>(
                      <button key={s} className="dash-btn filter-btn" onClick={() => setStatusFilter(s)}
                        style={{ background:statusFilter===s?COLORS[s as keyof typeof COLORS]||'#f59e0b':'rgba(255,255,255,0.06)', color:statusFilter===s?'#000':'rgba(255,255,255,0.6)', textTransform:'capitalize', padding:'8px 12px', fontSize:'0.78rem' }}>
                        {s}{s!=='all'?` (${contactLeads.filter(l=>l.status===s).length})`:''}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table view */}
              {viewMode==='table' && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                  {loading ? (
                    <div style={{ padding:50, textAlign:'center', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif' }}>Loading leads...</div>
                  ) : filteredLeads.length===0 ? (
                    <div style={{ padding:50, textAlign:'center', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif' }}>No leads found.</div>
                  ) : filteredLeads.map(lead => (
                    <div key={lead.id}>
                      <div className="lead-row">
                        <div style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                          <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#1a3a5c,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <span style={{ color:'#fff', fontWeight:700, fontSize:'0.95rem' }}>{lead.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            {/* Name + badges */}
                            <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap', marginBottom:4 }}>
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff', fontSize:'0.95rem' }}>{lead.name}</span>
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', fontWeight:600, padding:'2px 7px', borderRadius:20, background:lead.status==='new'?'rgba(245,158,11,0.2)':lead.status==='contacted'?'rgba(59,130,246,0.2)':'rgba(16,185,129,0.2)', color:lead.status==='new'?'#f59e0b':lead.status==='contacted'?'#60a5fa':'#34d399' }}>{lead.status}</span>
                              {lead.interest && <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', color:'#a78bfa', background:'rgba(139,92,246,0.15)', padding:'2px 7px', borderRadius:20 }}>{lead.interest}</span>}
                            </div>
                            {/* Contact info */}
                            <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:4 }}>
                              {lead.email && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:3 }}><Mail size={10}/>{lead.email}</span>}
                              {lead.phone && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.78rem', display:'flex', alignItems:'center', gap:3 }}><Phone size={10}/>{lead.phone}</span>}
                              <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>{new Date(lead.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                            </div>
                            <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.8rem', margin:'0 0 6px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.message}</p>
                            {notes[lead.id] && <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#fbbf24', background:'rgba(245,158,11,0.1)', padding:'3px 9px', borderRadius:6, margin:0, display:'inline-block' }}>📌 {notes[lead.id]}</p>}

                            {/* Mobile quick actions row */}
                            <div className="lead-actions-row" style={{ display:'flex', gap:6, marginTop:8, alignItems:'center' }}>
                              <select className="status-sel" value={lead.status} onChange={e=>handleUpdateStatus(lead.id,e.target.value)} style={{ flex:1, maxWidth:130 }}>
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                              </select>
                              {lead.email && <a href={`mailto:${lead.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.&body=Dear ${lead.name},%0A%0A`} style={{ width:32, height:32, borderRadius:8, background:'rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#60a5fa', textDecoration:'none', flexShrink:0 }}><Send size={13}/></a>}
                              {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ width:32, height:32, borderRadius:8, background:'rgba(34,197,94,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#4ade80', textDecoration:'none', flexShrink:0 }}><MessageSquare size={13}/></a>}
                              {lead.phone && <a href={`tel:${lead.phone}`} style={{ width:32, height:32, borderRadius:8, background:'rgba(168,85,247,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#c084fc', textDecoration:'none', flexShrink:0 }}><Phone size={13}/></a>}
                              <button onClick={() => { setExpandedLead(expandedLead===lead.id?null:lead.id); }} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)', flexShrink:0 }}>
                                {expandedLead===lead.id?<ChevronUp size={13}/>:<ChevronDown size={13}/>}
                              </button>
                              <button onClick={() => handleDeleteLead(lead.id)} style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.15)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171', flexShrink:0 }}><Trash2 size={13}/></button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {expandedLead===lead.id && (
                        <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:16 }}>
                          <div className="expanded-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                            <div>
                              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Full Message</div>
                              <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'12px 14px', margin:0, lineHeight:1.6 }}>{lead.message}</p>
                            </div>
                            <div>
                              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, display:'flex', alignItems:'center', gap:5 }}>
                                <StickyNote size={11}/> Internal Note
                              </div>
                              {editingNote===lead.id ? (
                                <div>
                                  <textarea value={noteText} onChange={e=>setNoteText(e.target.value)} rows={3} className="dash-input" placeholder="Add note..." style={{ resize:'vertical', marginBottom:8 }}/>
                                  <div style={{ display:'flex', gap:8 }}>
                                    <button className="dash-btn" onClick={() => handleSaveNote(lead.id)} style={{ background:'#f59e0b', color:'#000' }}><Save size={12}/> Save</button>
                                    <button className="dash-btn" onClick={() => setEditingNote(null)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)' }}><X size={12}/> Cancel</button>
                                  </div>
                                </div>
                              ) : (
                                <div onClick={() => { setEditingNote(lead.id); setNoteText(notes[lead.id]||''); }} style={{ cursor:'pointer', fontFamily:'DM Sans,sans-serif', color:notes[lead.id]?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.25)', fontSize:'0.85rem', background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', minHeight:60, lineHeight:1.6 }}>
                                  {notes[lead.id]||'Tap to add a note...'}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Profiles view */}
              {viewMode==='profiles' && (
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {clientProfiles.map(p => (
                    <div key={p.key} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                      <div className="profile-header" style={{ padding:'14px 16px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <span style={{ color:'#000', fontWeight:800, fontSize:'1rem' }}>{p.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff', fontSize:'0.95rem' }}>{p.name}</div>
                            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                              {p.email && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.75rem' }}>{p.email}</span>}
                              {p.phone && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.75rem' }}>{p.phone}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign:'right', flexShrink:0 }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'#f59e0b', fontWeight:800, fontSize:'1.4rem', lineHeight:1 }}>{p.totalEnquiries}</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.7rem' }}>Enquir{p.totalEnquiries>1?'ies':'y'}</div>
                        </div>
                      </div>
                      {p.leads.map(l => (
                        <div key={l.id} style={{ padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', gap:6, marginBottom:4, flexWrap:'wrap' }}>
                              {l.interest && <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', color:'#a78bfa', background:'rgba(139,92,246,0.15)', padding:'2px 7px', borderRadius:20 }}>{l.interest}</span>}
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.68rem', color:'rgba(255,255,255,0.4)' }}>{new Date(l.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                            </div>
                            <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.6)', fontSize:'0.82rem', margin:0 }}>{l.message}</p>
                          </div>
                          <select className="status-sel" value={l.status} onChange={e=>handleUpdateStatus(l.id,e.target.value)} style={{ flexShrink:0, width:'auto', minWidth:90 }}>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      ))}
                      <div style={{ padding:'12px 16px', display:'flex', gap:8, flexWrap:'wrap' }}>
                        {p.email && <a href={`mailto:${p.email}`} className="dash-btn" style={{ background:'rgba(59,130,246,0.2)', color:'#60a5fa', textDecoration:'none', fontSize:'0.78rem', padding:'7px 12px' }}><Mail size={12}/> Email</a>}
                        {p.phone && <a href={`https://wa.me/${p.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="dash-btn" style={{ background:'rgba(34,197,94,0.2)', color:'#4ade80', textDecoration:'none', fontSize:'0.78rem', padding:'7px 12px' }}><MessageSquare size={12}/> WhatsApp</a>}
                        {p.phone && <a href={`tel:${p.phone}`} className="dash-btn" style={{ background:'rgba(168,85,247,0.2)', color:'#c084fc', textDecoration:'none', fontSize:'0.78rem', padding:'7px 12px' }}><Phone size={12}/> Call</a>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SERVICES ── */}
          {activeTab==='services' && (
            <div>
              <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,4vw,1.6rem)', margin:'0 0 20px' }}>Manage Services</h2>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20, marginBottom:16 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff', margin:'0 0 14px', fontSize:'0.95rem' }}>Add New Service</h3>
                <div className="service-add-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                  <input className="dash-input" placeholder="Service Title" value={newService.title} onChange={e=>setNewService({...newService,title:e.target.value})}/>
                  <input className="dash-input" placeholder="Short Description" value={newService.description} onChange={e=>setNewService({...newService,description:e.target.value})}/>
                </div>
                <button className="dash-btn" onClick={handleAddService} style={{ background:'#f59e0b', color:'#000' }}><Plus size={15}/> Add Service</button>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                {services.map((s,i) => (
                  <div key={s.id} style={{ padding:'14px 16px', borderBottom:i<services.length-1?'1px solid rgba(255,255,255,0.06)':'none', display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:34, height:34, borderRadius:10, background:'rgba(245,158,11,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Sparkles size={15} color="#f59e0b"/>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      {editingService?.id===s.id ? (
                        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                          <input className="dash-input" value={editingService.title} onChange={e=>setEditingService({...editingService,title:e.target.value})}/>
                          <input className="dash-input" value={editingService.description} onChange={e=>setEditingService({...editingService,description:e.target.value})}/>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, color:'#fff', marginBottom:2, fontSize:'0.9rem' }}>{s.title}</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.82rem' }}>{s.description}</div>
                        </>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                      {editingService?.id===s.id ? (
                        <>
                          <button className="dash-btn" onClick={handleSaveEdit} style={{ background:'#10b981', color:'#fff', padding:'7px 12px' }}><Save size={14}/></button>
                          <button className="dash-btn" onClick={()=>setEditingService(null)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', padding:'7px 12px' }}><X size={14}/></button>
                        </>
                      ) : (
                        <>
                          <button className="dash-btn" onClick={()=>setEditingService(s)} style={{ background:'rgba(59,130,246,0.2)', color:'#60a5fa', padding:'7px 12px' }}><Edit size={14}/></button>
                          <button className="dash-btn" onClick={()=>handleDeleteService(s.id)} style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', padding:'7px 12px' }}><Trash2 size={14}/></button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
                {services.length===0 && <div style={{ padding:40, textAlign:'center', color:'rgba(255,255,255,0.3)', fontFamily:'DM Sans,sans-serif' }}>No services yet.</div>}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab==='analytics' && (
            <div>
              <div className="analytics-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'clamp(1.3rem,4vw,1.6rem)', margin:0 }}>Analytics</h2>
                <Link to="/admin/analytics" style={{ display:'flex', alignItems:'center', gap:6, padding:'8px 14px', background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, color:'#f59e0b', textDecoration:'none', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.82rem', flexShrink:0 }}>
                  <TrendingUp size={13}/> Login Analytics
                </Link>
              </div>

              <div className="analytics-stat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:20 }}>
                <StatCard label="Total Leads" value={contactLeads.length} icon={<Mail size={20} color="#fff"/>} color="#3b82f6"/>
                <StatCard label="New Leads" value={statusCounts.new} icon={<Bell size={20} color="#fff"/>} color="#f59e0b" sub="Awaiting response"/>
                <StatCard label="Conversion" value={`${contactLeads.length?Math.round((statusCounts.closed/contactLeads.length)*100):0}%`} icon={<CheckCircle size={20} color="#fff"/>} color="#10b981"/>
                <StatCard label="Response Rate" value={`${contactLeads.length?Math.round(((statusCounts.contacted+statusCounts.closed)/contactLeads.length)*100):0}%`} icon={<TrendingUp size={20} color="#fff"/>} color="#8b5cf6"/>
              </div>

              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20, marginBottom:14 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 16px', color:'#fff' }}>Enquiries by Service Type</h3>
                {interestData.length===0 ? (
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'16px 0' }}>No data yet</p>
                ) : interestData.map(([label,count],i) => {
                  const colors=['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4'];
                  const c=colors[i%colors.length];
                  const max=interestData[0][1];
                  return (
                    <div key={label} style={{ marginBottom:12 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.82rem' }}>{label}</span>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:c, fontWeight:700, fontSize:'0.82rem' }}>{count}</span>
                      </div>
                      <MiniBar value={count} max={max} color={c}/>
                    </div>
                  );
                })}
              </div>

              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:20 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'0.95rem', margin:'0 0 14px', color:'#fff' }}>Recent Activity</h3>
                {contactLeads.slice(0,5).map(l => (
                  <div key={l.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:l.status==='new'?'#f59e0b':l.status==='contacted'?'#3b82f6':'#10b981', flexShrink:0 }}/>
                    <div style={{ flex:1, minWidth:0 }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', fontWeight:600 }}>{l.name}</span>
                      {l.interest && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.78rem' }}> — {l.interest}</span>}
                    </div>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', fontSize:'0.72rem', flexShrink:0 }}>{new Date(l.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="mob-nav">
        {tabs.map(t => (
          <button key={t.id} className={`mob-nav-btn ${activeTab===t.id?'active':''}`} onClick={() => setActiveTab(t.id)}>
            {t.badge ? <span className="mob-badge">{t.badge > 9 ? '9+' : t.badge}</span> : null}
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
        <Link to="/" style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, padding:'10px 4px', color:'rgba(255,255,255,0.35)', fontFamily:'DM Sans,sans-serif', fontSize:'0.6rem', fontWeight:600, textDecoration:'none' }}>
          <span style={{ fontSize:'1rem', lineHeight:1 }}>←</span>
          <span>Site</span>
        </Link>
      </nav>
    </div>
  );
}
