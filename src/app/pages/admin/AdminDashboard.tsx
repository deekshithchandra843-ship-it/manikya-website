import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  LayoutDashboard, Briefcase, Sparkles, Image, Mail, ShoppingBag,
  LogOut, Plus, Edit, Trash2, Save, X, TrendingUp, Search,
  Download, MessageSquare, Phone, User, ChevronDown, ChevronUp,
  CheckCircle, Clock, XCircle, StickyNote, Send,
} from 'lucide-react';
import { servicesApi, contactApi, analyticsApi, tokenStore } from '../../../lib/api';
import type { Service, ContactLead, AnalyticsOverview } from '../../../lib/api';

type Tab = 'overview' | 'services' | 'pearl-farms' | 'gallery' | 'contacts' | 'products';
type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

// ── Client profile (grouped leads by phone/email) ─────────────
interface ClientProfile {
  key: string;
  name: string;
  email?: string;
  phone?: string;
  leads: ContactLead[];
  lastContact: string;
  totalEnquiries: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]           = useState<Tab>('overview');
  const [services, setServices]             = useState<Service[]>([]);
  const [contactLeads, setContactLeads]     = useState<ContactLead[]>([]);
  const [overview, setOverview]             = useState<AnalyticsOverview | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService]         = useState({ title: '', description: '' });
  const [loading, setLoading]               = useState(true);

  // ── Contact filters & search ──────────────────────────────
  const [searchQuery, setSearchQuery]       = useState('');
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all');
  const [expandedLead, setExpandedLead]     = useState<string | null>(null);
  const [notes, setNotes]                   = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('admin_notes') || '{}'); } catch { return {}; }
  });
  const [editingNote, setEditingNote]       = useState<string | null>(null);
  const [noteText, setNoteText]             = useState('');
  const [viewMode, setViewMode]             = useState<'table' | 'profiles'>('table');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) { navigate('/admin'); return; }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [svcs, leads, ov] = await Promise.all([
        servicesApi.getAll(),
        contactApi.getAll(),
        analyticsApi.overview(),
      ]);
      setServices(svcs);
      setContactLeads(leads);
      setOverview(ov);
    } catch {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { tokenStore.clearAdmin(); navigate('/admin'); };

  // ── Services handlers ─────────────────────────────────────
  const handleAddService = async () => {
    if (!newService.title || !newService.description) return;
    await servicesApi.create(newService);
    setNewService({ title: '', description: '' });
    setServices(await servicesApi.getAll());
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    await servicesApi.remove(id);
    setServices(services.filter(s => s.id !== id));
  };

  const handleSaveEdit = async () => {
    if (!editingService) return;
    await servicesApi.update(editingService.id, { title: editingService.title, description: editingService.description });
    setServices(services.map(s => s.id === editingService.id ? editingService : s));
    setEditingService(null);
  };

  // ── Contact handlers ──────────────────────────────────────
  const handleUpdateLeadStatus = async (id: string, status: string) => {
    await contactApi.updateStatus(id, status);
    setContactLeads(leads => leads.map(l => l.id === id ? { ...l, status } : l));
  };

  const handleDeleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    await contactApi.delete(id);
    setContactLeads(leads => leads.filter(l => l.id !== id));
  };

  const handleSaveNote = (id: string) => {
    const updated = { ...notes, [id]: noteText };
    setNotes(updated);
    localStorage.setItem('admin_notes', JSON.stringify(updated));
    setEditingNote(null);
  };

  // ── Export to CSV/Excel ───────────────────────────────────
  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Interest', 'Message', 'Status', 'Date', 'Notes'];
    const rows = filteredLeads.map(l => [
      l.name,
      l.email || '',
      l.phone || '',
      l.interest || '',
      `"${(l.message || '').replace(/"/g, '""')}"`,
      l.status,
      new Date(l.created_at).toLocaleDateString(),
      `"${(notes[l.id] || '').replace(/"/g, '""')}"`,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `manikya-leads-${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  // ── Filtered leads ────────────────────────────────────────
  const filteredLeads = useMemo(() => {
    return contactLeads.filter(l => {
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q ||
        l.name.toLowerCase().includes(q) ||
        (l.email || '').toLowerCase().includes(q) ||
        (l.phone || '').includes(q) ||
        (l.interest || '').toLowerCase().includes(q) ||
        (l.message || '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [contactLeads, statusFilter, searchQuery]);

  // ── Client profiles (group by email or phone) ─────────────
  const clientProfiles = useMemo((): ClientProfile[] => {
    const map: Record<string, ClientProfile> = {};
    contactLeads.forEach(lead => {
      const key = lead.email || lead.phone || lead.name;
      if (!map[key]) {
        map[key] = { key, name: lead.name, email: lead.email, phone: lead.phone, leads: [], lastContact: lead.created_at, totalEnquiries: 0 };
      }
      map[key].leads.push(lead);
      map[key].totalEnquiries++;
      if (new Date(lead.created_at) > new Date(map[key].lastContact)) map[key].lastContact = lead.created_at;
    });
    return Object.values(map).sort((a, b) => new Date(b.lastContact).getTime() - new Date(a.lastContact).getTime());
  }, [contactLeads]);

  const stats = [
    { label: 'Total Services',  value: overview?.services    ?? services.length,     icon: Briefcase,  color: 'bg-blue-500' },
    { label: 'Contact Leads',   value: overview?.contacts    ?? contactLeads.length, icon: Mail,       color: 'bg-green-500' },
    { label: 'Gallery Images',  value: overview?.gallery     ?? 0,                   icon: Image,      color: 'bg-purple-500' },
    { label: 'Verified Users',  value: overview?.verified_users ?? 0,                icon: User,       color: 'bg-orange-500' },
  ];

  const tabs = [
    { id: 'overview'    as Tab, label: 'Overview',      icon: LayoutDashboard },
    { id: 'contacts'    as Tab, label: 'Contact Leads', icon: Mail },
    { id: 'services'    as Tab, label: 'Services',      icon: Briefcase },
    { id: 'pearl-farms' as Tab, label: 'Pearl Farms',   icon: Sparkles },
    { id: 'gallery'     as Tab, label: 'Gallery',       icon: Image },
    { id: 'products'    as Tab, label: 'Products',      icon: ShoppingBag },
  ];

  const statusBadge = (status: string) => {
    if (status === 'new')       return 'bg-yellow-100 text-yellow-800';
    if (status === 'contacted') return 'bg-blue-100 text-blue-800';
    return 'bg-green-100 text-green-800';
  };

  const statusIcon = (status: string) => {
    if (status === 'new')       return <Clock size={12} className="inline mr-1"/>;
    if (status === 'contacted') return <MessageSquare size={12} className="inline mr-1"/>;
    return <CheckCircle size={12} className="inline mr-1"/>;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-500">Manikya Money Service Pvt. Ltd.</p>
              </div>
            </div>
            <button onClick={handleLogout} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <LogOut size={18} className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sidebar */}
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                      }`}>
                      <Icon size={20} className="mr-3" />
                      <span className="font-medium">{tab.label}</span>
                      {tab.id === 'contacts' && overview?.new_leads ? (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5">{overview.new_leads}</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main */}
          <main className="lg:col-span-3 space-y-6">

            {/* ── OVERVIEW ── */}
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-500 text-sm">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '—' : stat.value}</p>
                          </div>
                          <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="text-white" size={28} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* New leads alert */}
                {overview && overview.new_leads > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                    <p className="text-amber-800 font-medium">⚡ {overview.new_leads} new lead{overview.new_leads > 1 ? 's' : ''} waiting for your response</p>
                    <button onClick={() => setActiveTab('contacts')} className="text-amber-700 underline text-sm font-semibold">View Now</button>
                  </div>
                )}

                {/* Quick stats */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Lead Status Breakdown</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {(['new','contacted','closed'] as const).map(s => {
                      const count = contactLeads.filter(l => l.status === s).length;
                      const pct   = contactLeads.length ? Math.round(count / contactLeads.length * 100) : 0;
                      return (
                        <div key={s} className="text-center">
                          <div className={`text-2xl font-bold ${s==='new'?'text-yellow-600':s==='contacted'?'text-blue-600':'text-green-600'}`}>{count}</div>
                          <div className="text-xs text-gray-500 capitalize mt-1">{s}</div>
                          <div className="mt-2 bg-gray-200 rounded-full h-2">
                            <div className={`h-2 rounded-full ${s==='new'?'bg-yellow-400':s==='contacted'?'bg-blue-400':'bg-green-400'}`} style={{ width:`${pct}%` }}/>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">Login Analytics</h3>
                      <p className="text-blue-100 text-sm">Track user authentication attempts</p>
                    </div>
                    <TrendingUp size={40} className="opacity-50" />
                  </div>
                  <Link to="/admin/analytics" className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                    View Analytics <TrendingUp size={18} className="ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {/* ── CONTACTS ── */}
            {activeTab === 'contacts' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Contact Leads</h2>
                  <div className="flex gap-2">
                    <button onClick={() => setViewMode(viewMode === 'table' ? 'profiles' : 'table')}
                      className="flex items-center px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
                      <User size={16} className="mr-2" />
                      {viewMode === 'table' ? 'Client Profiles' : 'Table View'}
                    </button>
                    <button onClick={handleExport}
                      className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                      <Download size={16} className="mr-2" /> Export CSV
                    </button>
                  </div>
                </div>

                {/* Search & Filter */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="Search by name, email, phone, interest..."
                        value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    </div>
                    <div className="flex gap-2">
                      {(['all','new','contacted','closed'] as StatusFilter[]).map(s => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                            statusFilter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}>
                          {s}
                          {s !== 'all' && (
                            <span className="ml-1 text-xs opacity-75">({contactLeads.filter(l => l.status === s).length})</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{filteredLeads.length} of {contactLeads.length} leads</p>
                </div>

                {/* ── TABLE VIEW ── */}
                {viewMode === 'table' && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                      <div className="p-8 text-center text-gray-400">Loading leads...</div>
                    ) : filteredLeads.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">No leads found.</div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {filteredLeads.map(lead => (
                          <div key={lead.id}>
                            {/* Lead row */}
                            <div className="p-4 hover:bg-gray-50 transition-colors">
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                  {/* Avatar */}
                                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-blue-600 font-bold text-sm">{lead.name.charAt(0).toUpperCase()}</span>
                                  </div>
                                  {/* Info */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-gray-900">{lead.name}</span>
                                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(lead.status)}`}>
                                        {statusIcon(lead.status)}{lead.status}
                                      </span>
                                      {lead.interest && (
                                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">{lead.interest}</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 flex-wrap">
                                      {lead.email && <span className="flex items-center gap-1"><Mail size={12}/>{lead.email}</span>}
                                      {lead.phone && <span className="flex items-center gap-1"><Phone size={12}/>{lead.phone}</span>}
                                      <span>{new Date(lead.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                                    </div>
                                    <p className="mt-1 text-sm text-gray-600 line-clamp-1">{lead.message}</p>
                                    {notes[lead.id] && (
                                      <p className="mt-1 text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded flex items-center gap-1">
                                        <StickyNote size={10}/> {notes[lead.id]}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {/* Actions */}
                                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                                  <select value={lead.status} onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                                    className="text-xs border border-gray-300 rounded px-2 py-1 bg-white">
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="closed">Closed</option>
                                  </select>
                                  {lead.email && (
                                    <a href={`mailto:${lead.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.`}
                                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700" title="Email client">
                                      <Send size={14}/>
                                    </a>
                                  )}
                                  {lead.phone && (
                                    <a href={`tel:${lead.phone}`}
                                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700" title="Call client">
                                      <Phone size={14}/>
                                    </a>
                                  )}
                                  <button onClick={() => { setExpandedLead(expandedLead === lead.id ? null : lead.id); }}
                                    className="p-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200" title="Expand">
                                    {expandedLead === lead.id ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                  </button>
                                  <button onClick={() => handleDeleteLead(lead.id)}
                                    className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200" title="Delete">
                                    <Trash2 size={14}/>
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Expanded view */}
                            {expandedLead === lead.id && (
                              <div className="bg-blue-50 border-t border-blue-100 px-4 py-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Full Message</h4>
                                    <p className="text-sm text-gray-700 bg-white rounded p-3 border">{lead.message}</p>
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2 flex items-center gap-1">
                                      <StickyNote size={12}/> Internal Notes
                                    </h4>
                                    {editingNote === lead.id ? (
                                      <div>
                                        <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                                          rows={3} placeholder="Add internal note..."
                                          className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500"/>
                                        <div className="flex gap-2 mt-2">
                                          <button onClick={() => handleSaveNote(lead.id)}
                                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm">
                                            <Save size={12} className="mr-1"/> Save
                                          </button>
                                          <button onClick={() => setEditingNote(null)}
                                            className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm">
                                            <X size={12} className="mr-1"/> Cancel
                                          </button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bg-white rounded p-3 border min-h-[60px] cursor-pointer hover:bg-yellow-50 transition-colors"
                                        onClick={() => { setEditingNote(lead.id); setNoteText(notes[lead.id] || ''); }}>
                                        {notes[lead.id]
                                          ? <p className="text-sm text-gray-700">{notes[lead.id]}</p>
                                          : <p className="text-sm text-gray-400 italic">Click to add a note...</p>}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="mt-3 flex gap-2 flex-wrap">
                                  {lead.email && (
                                    <a href={`mailto:${lead.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.&body=Dear ${lead.name},%0A%0AThank you for contacting us.%0A%0ARegards,%0AManikya Money Service Pvt. Ltd.`}
                                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                      <Mail size={14} className="mr-2"/> Reply via Email
                                    </a>
                                  )}
                                  {lead.phone && (
                                    <a href={`https://wa.me/${lead.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600">
                                      <MessageSquare size={14} className="mr-2"/> WhatsApp
                                    </a>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── CLIENT PROFILES VIEW ── */}
                {viewMode === 'profiles' && (
                  <div className="space-y-4">
                    {clientProfiles.length === 0 ? (
                      <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-400">No clients yet.</div>
                    ) : clientProfiles.map(profile => (
                      <div key={profile.key} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{profile.name}</h3>
                              <div className="flex gap-3 text-sm text-gray-500">
                                {profile.email && <span className="flex items-center gap-1"><Mail size={12}/>{profile.email}</span>}
                                {profile.phone && <span className="flex items-center gap-1"><Phone size={12}/>{profile.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">{profile.totalEnquiries}</div>
                            <div className="text-xs text-gray-500">Enquir{profile.totalEnquiries > 1 ? 'ies' : 'y'}</div>
                          </div>
                        </div>
                        <div className="divide-y divide-gray-100">
                          {profile.leads.map(lead => (
                            <div key={lead.id} className="p-4 flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge(lead.status)}`}>
                                    {statusIcon(lead.status)}{lead.status}
                                  </span>
                                  {lead.interest && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{lead.interest}</span>}
                                  <span className="text-xs text-gray-400">{new Date(lead.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</span>
                                </div>
                                <p className="text-sm text-gray-700">{lead.message}</p>
                              </div>
                              <select value={lead.status} onChange={e => handleUpdateLeadStatus(lead.id, e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1 bg-white flex-shrink-0">
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-gray-50 border-t flex gap-2">
                          {profile.email && (
                            <a href={`mailto:${profile.email}?subject=Re: Your enquiry at Manikya Money Service Pvt. Ltd.`}
                              className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                              <Mail size={12} className="mr-1"/> Email
                            </a>
                          )}
                          {profile.phone && (
                            <a href={`https://wa.me/${profile.phone.replace(/\D/g,'')}`} target="_blank" rel="noreferrer"
                              className="flex items-center px-3 py-1.5 bg-green-500 text-white rounded text-xs hover:bg-green-600">
                              <MessageSquare size={12} className="mr-1"/> WhatsApp
                            </a>
                          )}
                          {profile.phone && (
                            <a href={`tel:${profile.phone}`}
                              className="flex items-center px-3 py-1.5 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                              <Phone size={12} className="mr-1"/> Call
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SERVICES ── */}
            {activeTab === 'services' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Services</h2>
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Service Title" value={newService.title}
                      onChange={e => setNewService({ ...newService, title: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"/>
                    <input type="text" placeholder="Service Description" value={newService.description}
                      onChange={e => setNewService({ ...newService, description: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"/>
                  </div>
                  <button onClick={handleAddService}
                    className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <Plus size={18} className="mr-2"/> Add Service
                  </button>
                </div>
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {services.map(service => (
                        <tr key={service.id}>
                          <td className="px-6 py-4">
                            {editingService?.id === service.id
                              ? <input type="text" value={editingService.title}
                                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded"/>
                              : <span className="font-medium">{service.title}</span>}
                          </td>
                          <td className="px-6 py-4">
                            {editingService?.id === service.id
                              ? <input type="text" value={editingService.description}
                                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded w-full"/>
                              : <span className="text-gray-600">{service.description}</span>}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {editingService?.id === service.id ? (
                                <>
                                  <button onClick={handleSaveEdit} className="p-2 bg-green-600 text-white rounded hover:bg-green-700"><Save size={16}/></button>
                                  <button onClick={() => setEditingService(null)} className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"><X size={16}/></button>
                                </>
                              ) : (
                                <>
                                  <button onClick={() => setEditingService(service)} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"><Edit size={16}/></button>
                                  <button onClick={() => handleDeleteService(service.id)} className="p-2 bg-red-600 text-white rounded hover:bg-red-700"><Trash2 size={16}/></button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                      {services.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400">No services yet.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── OTHER TABS ── */}
            {(activeTab === 'pearl-farms' || activeTab === 'gallery' || activeTab === 'products') && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'pearl-farms' && 'Pearl Farms Management'}
                  {activeTab === 'gallery'     && 'Gallery Management'}
                  {activeTab === 'products'    && 'Products Management'}
                </h3>
                <p className="text-gray-500">Coming soon.</p>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
