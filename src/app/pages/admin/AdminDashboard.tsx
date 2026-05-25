import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  LayoutDashboard, Briefcase, Image, Mail, ShoppingBag, LogOut,
  Plus, Edit, Trash2, Save, X, TrendingUp, Search, Download,
  MessageSquare, Phone, User, ChevronDown, ChevronUp, CheckCircle,
  Clock, StickyNote, Send, Bell, RefreshCw, BarChart2, Sparkles,
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
      <div style={{ width:`${max ? (value/max)*100 : 0}%`, height:'100%', background:color, borderRadius:4, transition:'width 1s ease' }}/>
    </div>
  );
}

function StatCard({ label, value, icon, color, sub }: { label:string; value:number|string; icon:React.ReactNode; color:string; sub?:string }) {
  return (
    <div style={{ background:'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:'24px 20px', display:'flex', alignItems:'center', gap:16, transition:'all .3s' }}>
      <div style={{ width:52, height:52, borderRadius:14, background:color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 8px 20px ${color}40` }}>
        {icon}
      </div>
      <div style={{ flex:1 }}>
        <div style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Sans,sans-serif', fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>{label}</div>
        <div style={{ color:'#fff', fontFamily:'DM Sans,sans-serif', fontSize:'2rem', fontWeight:800, lineHeight:1 }}>{value}</div>
        {sub && <div style={{ color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif', fontSize:'0.75rem', marginTop:4 }}>{sub}</div>}
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
  const [notes, setNotes]                   = useState<Record<string,string>>(() => {
    try { return JSON.parse(localStorage.getItem('admin_notes')||'{}'); } catch { return {}; }
  });
  const [editingNote, setEditingNote]       = useState<string|null>(null);
  const [noteText, setNoteText]             = useState('');

  useEffect(() => {
    if (!localStorage.getItem('admin_logged_in')) { navigate('/admin'); return; }
    loadData();
  }, [navigate]);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true); else setRefreshing(true);
    try {
      const [svcs, leads, ov] = await Promise.all([servicesApi.getAll(), contactApi.getAll(), analyticsApi.overview()]);
      setServices(svcs); setContactLeads(leads); setOverview(ov);
    } catch { tokenStore.clearAdmin(); navigate('/admin'); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const handleLogout = () => { tokenStore.clearAdmin(); navigate('/admin'); };

  // Services
  const handleAddService    = async () => { if (!newService.title||!newService.description) return; await servicesApi.create(newService); setNewService({title:'',description:''}); setServices(await servicesApi.getAll()); };
  const handleDeleteService = async (id: number) => { if (!confirm('Delete?')) return; await servicesApi.remove(id); setServices(services.filter(s=>s.id!==id)); };
  const handleSaveEdit      = async () => { if (!editingService) return; await servicesApi.update(editingService.id,{title:editingService.title,description:editingService.description}); setServices(services.map(s=>s.id===editingService.id?editingService:s)); setEditingService(null); };

  // Contacts
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

  // Chart data
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
    {id:'overview' as Tab, label:'Overview', icon:<LayoutDashboard size={18}/>},
    {id:'contacts' as Tab, label:'Contacts', icon:<Mail size={18}/>, badge: statusCounts.new},
    {id:'services' as Tab, label:'Services', icon:<Briefcase size={18}/>},
    {id:'analytics' as Tab, label:'Analytics', icon:<BarChart2 size={18}/>},
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#0a0f1e', color:'#fff' }}>
      <style>{`
        .dash-input { width:100%; padding:10px 14px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.12); border-radius:8px; color:#fff; font-family:'DM Sans',sans-serif; font-size:0.9rem; outline:none; box-sizing:border-box; }
        .dash-input:focus { border-color:#f59e0b; }
        .dash-input::placeholder { color:rgba(255,255,255,0.3); }
        .dash-btn { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; border-radius:8px; font-family:'DM Sans',sans-serif; font-weight:600; font-size:0.85rem; cursor:pointer; border:none; transition:all .2s; }
        .lead-row { border-bottom:1px solid rgba(255,255,255,0.06); padding:16px; transition:background .2s; }
        .lead-row:hover { background:rgba(255,255,255,0.03); }
        .status-sel { background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:6px; color:#fff; padding:5px 10px; font-family:'DM Sans',sans-serif; font-size:0.8rem; cursor:pointer; outline:none; }
      `}</style>

      {/* Header */}
      <header style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', padding:'0 24px' }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <div style={{ width:40, height:40, borderRadius:12, background:'linear-gradient(135deg,#1a3a5c,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <span style={{ color:'#fff', fontWeight:800, fontSize:'1.1rem' }}>M</span>
            </div>
            <div>
              <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', color:'#fff' }}>Admin Dashboard</div>
              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.4)' }}>Manikya Money Service Pvt. Ltd.</div>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            {statusCounts.new > 0 && (
              <div style={{ display:'flex', alignItems:'center', gap:6, padding:'6px 12px', background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:20 }}>
                <Bell size={14} color="#f59e0b"/>
                <span style={{ color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontSize:'0.78rem', fontWeight:700 }}>{statusCounts.new} new lead{statusCounts.new>1?'s':''}</span>
              </div>
            )}
            <button className="dash-btn" onClick={() => loadData(true)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)' }}>
              <RefreshCw size={14} style={{ animation:refreshing?'spin 1s linear infinite':'none' }}/> Refresh
            </button>
            <button className="dash-btn" onClick={handleLogout} style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.2)' }}>
              <LogOut size={14}/> Logout
            </button>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </header>

      <div style={{ maxWidth:1400, margin:'0 auto', padding:24, display:'flex', gap:24 }}>

        {/* Sidebar */}
        <nav style={{ width:200, flexShrink:0 }}>
          <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:12, position:'sticky', top:24 }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:10, border:'none', cursor:'pointer', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.88rem', marginBottom:4, background:activeTab===t.id?'linear-gradient(135deg,#f59e0b,#d97706)':'transparent', color:activeTab===t.id?'#000':'rgba(255,255,255,0.6)', transition:'all .2s', position:'relative' }}>
                {t.icon} {t.label}
                {t.badge ? <span style={{ marginLeft:'auto', background:'#ef4444', color:'#fff', borderRadius:'50%', width:18, height:18, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.68rem', fontWeight:800 }}>{t.badge}</span> : null}
              </button>
            ))}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.08)', marginTop:8, paddingTop:8 }}>
              <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, padding:'11px 14px', borderRadius:10, textDecoration:'none', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif', fontSize:'0.85rem' }}>
                ← View Website
              </Link>
            </div>
          </div>
        </nav>

        {/* Main */}
        <main style={{ flex:1, minWidth:0 }}>

          {/* ── OVERVIEW ── */}
          {activeTab==='overview' && (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <div>
                  <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.6rem', margin:'0 0 4px' }}>Dashboard Overview</h2>
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', margin:0 }}>Live data from your database</p>
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:16, marginBottom:24 }}>
                <StatCard label="Total Services" value={loading?'—':overview?.services??services.length} icon={<Briefcase size={24} color="#fff"/>} color="#3b82f6" sub="Active services"/>
                <StatCard label="Contact Leads" value={loading?'—':overview?.contacts??contactLeads.length} icon={<Mail size={24} color="#fff"/>} color="#10b981" sub={`${statusCounts.new} new`}/>
                <StatCard label="Gallery Images" value={loading?'—':overview?.gallery??0} icon={<Image size={24} color="#fff"/>} color="#8b5cf6"/>
                <StatCard label="Verified Users" value={loading?'—':overview?.verified_users??0} icon={<User size={24} color="#fff"/>} color="#f59e0b"/>
              </div>

              {/* Charts row */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>

                {/* Lead status donut */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 20px', color:'#fff' }}>Lead Status</h3>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    {[
                      {label:'New',       count:statusCounts.new,       color:'#f59e0b'},
                      {label:'Contacted', count:statusCounts.contacted, color:'#3b82f6'},
                      {label:'Closed',    count:statusCounts.closed,    color:'#10b981'},
                    ].map(s => (
                      <div key={s.label} style={{ display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:s.color, flexShrink:0 }}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.85rem', width:80 }}>{s.label}</span>
                        <MiniBar value={s.count} max={contactLeads.length} color={s.color}/>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'#fff', fontWeight:700, fontSize:'0.9rem', width:24, textAlign:'right' }}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid rgba(255,255,255,0.06)', display:'flex', justifyContent:'space-between' }}>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}>Total Leads</span>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'#fff', fontWeight:800, fontSize:'1.1rem' }}>{contactLeads.length}</span>
                  </div>
                </div>

                {/* Weekly activity */}
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 20px', color:'#fff' }}>This Week's Activity</h3>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:100 }}>
                    {weeklyData.map((d,i) => {
                      const max = Math.max(...weeklyData.map(x=>x.count),1);
                      const h   = Math.max((d.count/max)*80,4);
                      return (
                        <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                          <div style={{ width:'100%', height:h, background:d.count>0?'linear-gradient(180deg,#f59e0b,#d97706)':'rgba(255,255,255,0.08)', borderRadius:'4px 4px 0 0', transition:'height 1s ease', position:'relative' }}>
                            {d.count>0 && <div style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', color:'#f59e0b', fontFamily:'DM Sans,sans-serif', fontSize:'0.7rem', fontWeight:700 }}>{d.count}</div>}
                          </div>
                          <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.7rem', color:'rgba(255,255,255,0.4)' }}>{d.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Interest breakdown */}
              {interestData.length > 0 && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24, marginBottom:16 }}>
                  <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 16px', color:'#fff' }}>Enquiry by Service</h3>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12 }}>
                    {interestData.map(([label,count],i) => {
                      const colors=['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4'];
                      const c = colors[i%colors.length];
                      const pct = Math.round((count/contactLeads.length)*100);
                      return (
                        <div key={label} style={{ background:`${c}10`, border:`1px solid ${c}25`, borderRadius:12, padding:'14px 16px' }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.78rem', marginBottom:8, lineHeight:1.4 }}>{label}</div>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <span style={{ fontFamily:'DM Sans,sans-serif', color:c, fontWeight:800, fontSize:'1.4rem' }}>{count}</span>
                            <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick actions */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:12 }}>
                {[
                  {label:'View All Leads', icon:<Mail size={16}/>, tab:'contacts' as Tab, color:'#10b981'},
                  {label:'Manage Services', icon:<Briefcase size={16}/>, tab:'services' as Tab, color:'#3b82f6'},
                  {label:'Analytics', icon:<TrendingUp size={16}/>, tab:'analytics' as Tab, color:'#8b5cf6'},
                ].map(a => (
                  <button key={a.label} onClick={() => setActiveTab(a.tab)} style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px', background:`${a.color}15`, border:`1px solid ${a.color}30`, borderRadius:12, cursor:'pointer', color:a.color, fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.88rem' }}>
                    {a.icon} {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── CONTACTS ── */}
          {activeTab==='contacts' && (
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
                <div>
                  <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.6rem', margin:'0 0 4px' }}>Contact Leads</h2>
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.85rem', margin:0 }}>{filteredLeads.length} of {contactLeads.length} leads</p>
                </div>
                <div style={{ display:'flex', gap:10 }}>
                  <button className="dash-btn" onClick={() => setViewMode(viewMode==='table'?'profiles':'table')} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.7)', border:'1px solid rgba(255,255,255,0.1)' }}>
                    <User size={14}/> {viewMode==='table'?'Client View':'Table View'}
                  </button>
                  <button className="dash-btn" onClick={handleExport} style={{ background:'#10b981', color:'#fff' }}>
                    <Download size={14}/> Export CSV
                  </button>
                </div>
              </div>

              {/* Search & filter */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:14, padding:16, marginBottom:16 }}>
                <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
                  <div style={{ position:'relative', flex:1, minWidth:200 }}>
                    <Search size={15} color="rgba(255,255,255,0.3)" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)' }}/>
                    <input className="dash-input" style={{ paddingLeft:36 }} placeholder="Search leads..." value={searchQuery} onChange={e=>setSearchQuery(e.target.value)}/>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    {(['all','new','contacted','closed'] as StatusFilter[]).map(s => (
                      <button key={s} onClick={() => setStatusFilter(s)} className="dash-btn"
                        style={{ background:statusFilter===s?COLORS[s as keyof typeof COLORS]||'#f59e0b':'rgba(255,255,255,0.06)', color:statusFilter===s?'#000':'rgba(255,255,255,0.6)', textTransform:'capitalize' }}>
                        {s}{s!=='all'?` (${contactLeads.filter(l=>l.status===s).length})`:''}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table view */}
              {viewMode==='table' && (
                <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                  {loading ? (
                    <div style={{ padding:60, textAlign:'center', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif' }}>Loading leads...</div>
                  ) : filteredLeads.length===0 ? (
                    <div style={{ padding:60, textAlign:'center', color:'rgba(255,255,255,0.4)', fontFamily:'DM Sans,sans-serif' }}>No leads found.</div>
                  ) : filteredLeads.map(lead => (
                    <div key={lead.id}>
                      <div className="lead-row">
                        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
                          <div style={{ width:40, height:40, borderRadius:'50%', background:'linear-gradient(135deg,#1a3a5c,#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                            <span style={{ color:'#fff', fontWeight:700, fontSize:'1rem' }}>{lead.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff' }}>{lead.name}</span>
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:600, padding:'2px 8px', borderRadius:20, background:lead.status==='new'?'rgba(245,158,11,0.2)':lead.status==='contacted'?'rgba(59,130,246,0.2)':'rgba(16,185,129,0.2)', color:lead.status==='new'?'#f59e0b':lead.status==='contacted'?'#60a5fa':'#34d399' }}>
                                {lead.status}
                              </span>
                              {lead.interest && <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#a78bfa', background:'rgba(139,92,246,0.15)', padding:'2px 8px', borderRadius:20 }}>{lead.interest}</span>}
                            </div>
                            <div style={{ display:'flex', gap:16, flexWrap:'wrap' }}>
                              {lead.email && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:4 }}><Mail size={11}/>{lead.email}</span>}
                              {lead.phone && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.82rem', display:'flex', alignItems:'center', gap:4 }}><Phone size={11}/>{lead.phone}</span>}
                              <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', fontSize:'0.78rem' }}>{new Date(lead.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                            </div>
                            <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.82rem', margin:'6px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'100%' }}>{lead.message}</p>
                            {notes[lead.id] && <p style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.75rem', color:'#fbbf24', background:'rgba(245,158,11,0.1)', padding:'4px 10px', borderRadius:6, margin:'6px 0 0', display:'inline-block' }}>📌 {notes[lead.id]}</p>}
                          </div>
                          <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                            <select className="status-sel" value={lead.status} onChange={e=>handleUpdateStatus(lead.id,e.target.value)}>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="closed">Closed</option>
                            </select>
                            {lead.email && <a href={`mailto:${lead.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.&body=Dear ${lead.name},%0A%0AThank you for contacting us.%0A%0ARegards,%0AManikya Money Service Pvt. Ltd.`} style={{ width:32, height:32, borderRadius:8, background:'rgba(59,130,246,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#60a5fa', textDecoration:'none' }}><Send size={14}/></a>}
                            {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" style={{ width:32, height:32, borderRadius:8, background:'rgba(34,197,94,0.2)', display:'flex', alignItems:'center', justifyContent:'center', color:'#4ade80', textDecoration:'none' }}><MessageSquare size={14}/></a>}
                            <button onClick={() => { setExpandedLead(expandedLead===lead.id?null:lead.id); }} style={{ width:32, height:32, borderRadius:8, background:'rgba(255,255,255,0.06)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'rgba(255,255,255,0.5)' }}>
                              {expandedLead===lead.id?<ChevronUp size={14}/>:<ChevronDown size={14}/>}
                            </button>
                            <button onClick={() => handleDeleteLead(lead.id)} style={{ width:32, height:32, borderRadius:8, background:'rgba(239,68,68,0.15)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#f87171' }}><Trash2 size={14}/></button>
                          </div>
                        </div>
                      </div>
                      {expandedLead===lead.id && (
                        <div style={{ background:'rgba(255,255,255,0.02)', borderTop:'1px solid rgba(255,255,255,0.06)', padding:20 }}>
                          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                            <div>
                              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8 }}>Full Message</div>
                              <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.88rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, padding:'12px 14px', margin:0, lineHeight:1.6 }}>{lead.message}</p>
                            </div>
                            <div>
                              <div style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:8, display:'flex', alignItems:'center', gap:6 }}>
                                <StickyNote size={12}/> Internal Note
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
                                <div onClick={() => { setEditingNote(lead.id); setNoteText(notes[lead.id]||''); }} style={{ cursor:'pointer', fontFamily:'DM Sans,sans-serif', color:notes[lead.id]?'rgba(255,255,255,0.7)':'rgba(255,255,255,0.25)', fontSize:'0.88rem', background:'rgba(255,255,255,0.04)', border:'1px dashed rgba(255,255,255,0.1)', borderRadius:10, padding:'12px 14px', minHeight:60, lineHeight:1.6 }}>
                                  {notes[lead.id]||'Click to add a note...'}
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ marginTop:14, display:'flex', gap:10, flexWrap:'wrap' }}>
                            {lead.email && <a href={`mailto:${lead.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.&body=Dear ${lead.name},%0A%0A`} className="dash-btn" style={{ background:'rgba(59,130,246,0.2)', color:'#60a5fa', textDecoration:'none' }}><Mail size={13}/> Reply via Email</a>}
                            {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}?text=Hello ${encodeURIComponent(lead.name)}, thank you for contacting Manikya Money Service Pvt. Ltd.`} target="_blank" rel="noreferrer" className="dash-btn" style={{ background:'rgba(34,197,94,0.2)', color:'#4ade80', textDecoration:'none' }}><MessageSquare size={13}/> WhatsApp</a>}
                            {lead.phone && <a href={`tel:${lead.phone}`} className="dash-btn" style={{ background:'rgba(168,85,247,0.2)', color:'#c084fc', textDecoration:'none' }}><Phone size={13}/> Call</a>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Profiles view */}
              {viewMode==='profiles' && (
                <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
                  {clientProfiles.map(p => (
                    <div key={p.key} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                      <div style={{ padding:'16px 20px', background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
                          <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#f59e0b,#d97706)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <span style={{ color:'#000', fontWeight:800, fontSize:'1.1rem' }}>{p.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff', fontSize:'1rem' }}>{p.name}</div>
                            <div style={{ display:'flex', gap:12 }}>
                              {p.email && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.8rem' }}>{p.email}</span>}
                              {p.phone && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.8rem' }}>{p.phone}</span>}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'#f59e0b', fontWeight:800, fontSize:'1.6rem' }}>{p.totalEnquiries}</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.75rem' }}>Enquir{p.totalEnquiries>1?'ies':'y'}</div>
                        </div>
                      </div>
                      {p.leads.map(l => (
                        <div key={l.id} style={{ padding:'12px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12 }}>
                          <div>
                            <div style={{ display:'flex', gap:8, marginBottom:4 }}>
                              {l.interest && <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'#a78bfa', background:'rgba(139,92,246,0.15)', padding:'2px 8px', borderRadius:20 }}>{l.interest}</span>}
                              <span style={{ fontFamily:'DM Sans,sans-serif', fontSize:'0.72rem', color:'rgba(255,255,255,0.4)' }}>{new Date(l.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</span>
                            </div>
                            <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.6)', fontSize:'0.85rem', margin:0 }}>{l.message}</p>
                          </div>
                          <select className="status-sel" value={l.status} onChange={e=>handleUpdateStatus(l.id,e.target.value)} style={{ flexShrink:0 }}>
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      ))}
                      <div style={{ padding:'12px 20px', display:'flex', gap:10 }}>
                        {p.email && <a href={`mailto:${p.email}`} className="dash-btn" style={{ background:'rgba(59,130,246,0.2)', color:'#60a5fa', textDecoration:'none', fontSize:'0.8rem', padding:'7px 14px' }}><Mail size={12}/> Email</a>}
                        {p.phone && <a href={`https://wa.me/${p.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="dash-btn" style={{ background:'rgba(34,197,94,0.2)', color:'#4ade80', textDecoration:'none', fontSize:'0.8rem', padding:'7px 14px' }}><MessageSquare size={12}/> WhatsApp</a>}
                        {p.phone && <a href={`tel:${p.phone}`} className="dash-btn" style={{ background:'rgba(168,85,247,0.2)', color:'#c084fc', textDecoration:'none', fontSize:'0.8rem', padding:'7px 14px' }}><Phone size={12}/> Call</a>}
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
              <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.6rem', margin:'0 0 24px' }}>Manage Services</h2>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24, marginBottom:20 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, color:'#fff', margin:'0 0 16px', fontSize:'1rem' }}>Add New Service</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <input className="dash-input" placeholder="Service Title" value={newService.title} onChange={e=>setNewService({...newService,title:e.target.value})}/>
                  <input className="dash-input" placeholder="Short Description" value={newService.description} onChange={e=>setNewService({...newService,description:e.target.value})}/>
                </div>
                <button className="dash-btn" onClick={handleAddService} style={{ background:'#f59e0b', color:'#000' }}><Plus size={16}/> Add Service</button>
              </div>
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, overflow:'hidden' }}>
                {services.map((s,i) => (
                  <div key={s.id} style={{ padding:'16px 20px', borderBottom:i<services.length-1?'1px solid rgba(255,255,255,0.06)':'none', display:'flex', alignItems:'center', gap:16 }}>
                    <div style={{ width:36, height:36, borderRadius:10, background:'rgba(245,158,11,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Sparkles size={16} color="#f59e0b"/>
                    </div>
                    <div style={{ flex:1 }}>
                      {editingService?.id===s.id ? (
                        <div style={{ display:'flex', gap:10 }}>
                          <input className="dash-input" value={editingService.title} onChange={e=>setEditingService({...editingService,title:e.target.value})} style={{ flex:'0 0 200px' }}/>
                          <input className="dash-input" value={editingService.description} onChange={e=>setEditingService({...editingService,description:e.target.value})}/>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontFamily:'DM Sans,sans-serif', fontWeight:600, color:'#fff', marginBottom:2 }}>{s.title}</div>
                          <div style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.5)', fontSize:'0.85rem' }}>{s.description}</div>
                        </>
                      )}
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      {editingService?.id===s.id ? (
                        <>
                          <button className="dash-btn" onClick={handleSaveEdit} style={{ background:'#10b981', color:'#fff', padding:'7px 14px' }}><Save size={14}/></button>
                          <button className="dash-btn" onClick={()=>setEditingService(null)} style={{ background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.6)', padding:'7px 14px' }}><X size={14}/></button>
                        </>
                      ) : (
                        <>
                          <button className="dash-btn" onClick={()=>setEditingService(s)} style={{ background:'rgba(59,130,246,0.2)', color:'#60a5fa', padding:'7px 14px' }}><Edit size={14}/></button>
                          <button className="dash-btn" onClick={()=>handleDeleteService(s.id)} style={{ background:'rgba(239,68,68,0.15)', color:'#f87171', padding:'7px 14px' }}><Trash2 size={14}/></button>
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
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
                <h2 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:800, fontSize:'1.6rem', margin:0 }}>Analytics</h2>
                <Link to="/admin/analytics" style={{ display:'flex', alignItems:'center', gap:8, padding:'9px 18px', background:'rgba(245,158,11,0.15)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:10, color:'#f59e0b', textDecoration:'none', fontFamily:'DM Sans,sans-serif', fontWeight:600, fontSize:'0.85rem' }}>
                  <TrendingUp size={14}/> Login Analytics
                </Link>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16, marginBottom:24 }}>
                <StatCard label="Total Leads" value={contactLeads.length} icon={<Mail size={22} color="#fff"/>} color="#3b82f6"/>
                <StatCard label="New Leads" value={statusCounts.new} icon={<Bell size={22} color="#fff"/>} color="#f59e0b" sub="Awaiting response"/>
                <StatCard label="Conversion Rate" value={`${contactLeads.length?Math.round((statusCounts.closed/contactLeads.length)*100):0}%`} icon={<CheckCircle size={22} color="#fff"/>} color="#10b981"/>
                <StatCard label="Response Rate" value={`${contactLeads.length?Math.round(((statusCounts.contacted+statusCounts.closed)/contactLeads.length)*100):0}%`} icon={<TrendingUp size={22} color="#fff"/>} color="#8b5cf6"/>
              </div>

              {/* Interest chart */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24, marginBottom:16 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 20px', color:'#fff' }}>Enquiries by Service Type</h3>
                {interestData.length===0 ? (
                  <p style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', textAlign:'center', padding:'20px 0' }}>No data yet</p>
                ) : interestData.map(([label,count],i) => {
                  const colors=['#f59e0b','#3b82f6','#10b981','#8b5cf6','#ef4444','#06b6d4'];
                  const c=colors[i%colors.length];
                  const max=interestData[0][1];
                  return (
                    <div key={label} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.7)', fontSize:'0.85rem' }}>{label}</span>
                        <span style={{ fontFamily:'DM Sans,sans-serif', color:c, fontWeight:700, fontSize:'0.85rem' }}>{count}</span>
                      </div>
                      <MiniBar value={count} max={max} color={c}/>
                    </div>
                  );
                })}
              </div>

              {/* Recent activity */}
              <div style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:24 }}>
                <h3 style={{ fontFamily:'DM Sans,sans-serif', fontWeight:700, fontSize:'1rem', margin:'0 0 16px', color:'#fff' }}>Recent Activity</h3>
                {contactLeads.slice(0,5).map(l => (
                  <div key={l.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:l.status==='new'?'#f59e0b':l.status==='contacted'?'#3b82f6':'#10b981', flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.8)', fontSize:'0.85rem', fontWeight:600 }}>{l.name}</span>
                      {l.interest && <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.4)', fontSize:'0.8rem' }}> — {l.interest}</span>}
                    </div>
                    <span style={{ fontFamily:'DM Sans,sans-serif', color:'rgba(255,255,255,0.3)', fontSize:'0.75rem' }}>{new Date(l.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
