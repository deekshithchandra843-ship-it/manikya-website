import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  LayoutDashboard,
  Briefcase,
  Sparkles,
  Image,
  Mail,
  ShoppingBag,
  Leaf,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  TrendingUp,
} from 'lucide-react';

type Tab = 'overview' | 'services' | 'pearl-farms' | 'gallery' | 'contacts' | 'products';

interface Service {
  id: number;
  title: string;
  description: string;
}

interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [services, setServices] = useState<Service[]>([
    { id: 1, title: 'NewsJunction', description: 'Digital Media Network' },
    { id: 2, title: 'Manikya Pearl Farms', description: 'Sustainable pearl farming' },
    { id: 3, title: 'Manikya Market', description: 'Rapid Desi Online Bazar' },
    { id: 4, title: 'Manikya Roots', description: 'FMCG & Wellness' },
    { id: 5, title: 'Manikya Heritage', description: 'Mega Heritage Village' },
  ]);
  const [contactLeads, setContactLeads] = useState<ContactLead[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 1234567890',
      message: 'Interested in pearl farming investment',
      date: '2026-05-01',
    },
  ]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState({ title: '', description: '' });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    navigate('/admin');
  };

  const handleAddService = () => {
    if (newService.title && newService.description) {
      const id = Math.max(...services.map(s => s.id), 0) + 1;
      setServices([...services, { id, ...newService }]);
      setNewService({ title: '', description: '' });
    }
  };

  const handleDeleteService = (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? editingService : s));
      setEditingService(null);
    }
  };

  const stats = [
    { label: 'Total Services', value: services.length, icon: Briefcase, color: 'bg-blue-500' },
    { label: 'Contact Leads', value: contactLeads.length, icon: Mail, color: 'bg-green-500' },
    { label: 'Gallery Images', value: 9, icon: Image, color: 'bg-purple-500' },
    { label: 'Products', value: 12, icon: ShoppingBag, color: 'bg-orange-500' },
  ];

  const tabs = [
    { id: 'overview' as Tab, label: 'Overview', icon: LayoutDashboard },
    { id: 'services' as Tab, label: 'Services', icon: Briefcase },
    { id: 'pearl-farms' as Tab, label: 'Pearl Farms', icon: Sparkles },
    { id: 'gallery' as Tab, label: 'Gallery', icon: Image },
    { id: 'contacts' as Tab, label: 'Contact Leads', icon: Mail },
    { id: 'products' as Tab, label: 'Products', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manikya Services</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Icon size={20} className="mr-3" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <main className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">{stat.label}</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                          </div>
                          <div className={`w-14 h-14 ${stat.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="text-white" size={28} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">Login Analytics</h3>
                      <p className="text-blue-100 text-sm">
                        Track user authentication attempts and engagement metrics
                      </p>
                    </div>
                    <TrendingUp size={40} className="opacity-50" />
                  </div>
                  <Link
                    to="/admin/analytics"
                    className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    View Analytics
                    <TrendingUp size={18} className="ml-2" />
                  </Link>
                </div>

                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Production Note</h3>
                  <p className="text-blue-700 text-sm">
                    This is a demo dashboard. For production use, connect Supabase to enable real database operations, authentication, and file storage.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Services</h2>

                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Add New Service</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Service Title"
                      value={newService.title}
                      onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                    <input
                      type="text"
                      placeholder="Service Description"
                      value={newService.description}
                      onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <button
                    onClick={handleAddService}
                    className="mt-4 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Plus size={18} className="mr-2" />
                    Add Service
                  </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {services.map((service) => (
                          <tr key={service.id}>
                            <td className="px-6 py-4">
                              {editingService?.id === service.id ? (
                                <input
                                  type="text"
                                  value={editingService.title}
                                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded"
                                />
                              ) : (
                                <span className="font-medium">{service.title}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {editingService?.id === service.id ? (
                                <input
                                  type="text"
                                  value={editingService.description}
                                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                                  className="px-2 py-1 border border-gray-300 rounded w-full"
                                />
                              ) : (
                                <span className="text-gray-600">{service.description}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {editingService?.id === service.id ? (
                                  <>
                                    <button
                                      onClick={handleSaveEdit}
                                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                      <Save size={16} />
                                    </button>
                                    <button
                                      onClick={() => setEditingService(null)}
                                      className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                      <X size={16} />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => setEditingService(service)}
                                      className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteService(service.id)}
                                      className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Leads</h2>
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Message</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {contactLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td className="px-6 py-4 font-medium">{lead.name}</td>
                            <td className="px-6 py-4 text-gray-600">{lead.email}</td>
                            <td className="px-6 py-4 text-gray-600">{lead.phone}</td>
                            <td className="px-6 py-4 text-gray-600">{lead.message}</td>
                            <td className="px-6 py-4 text-gray-600">{lead.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'pearl-farms' || activeTab === 'gallery' || activeTab === 'products') && (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {activeTab === 'pearl-farms' && 'Pearl Farms Management'}
                  {activeTab === 'gallery' && 'Gallery Management'}
                  {activeTab === 'products' && 'Products Management'}
                </h3>
                <p className="text-gray-600">
                  This section will allow you to manage content. Connect Supabase to enable full functionality.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
