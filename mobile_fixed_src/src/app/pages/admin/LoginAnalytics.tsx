import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp, Users, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router';

interface LoginAttempt {
  id: string;
  method: 'email' | 'phone';
  type: 'otp' | 'magic_link';
  identifier: string;
  status: 'success' | 'failed' | 'pending';
  created_at: string;
}

export default function LoginAnalytics() {
  const navigate = useNavigate();
  const [loginAttempts, setLoginAttempts] = useState<LoginAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in');
    if (!isLoggedIn) { navigate('/admin'); return; }

    const token = localStorage.getItem('manikya_admin_token');
    fetch(`${(import.meta as any).env?.VITE_API_URL ?? 'http://localhost:4000/api'}/analytics/logins`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { if (data.attempts) setLoginAttempts(data.attempts); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats = {
    totalAttempts:    loginAttempts.length,
    successfulLogins: loginAttempts.filter(a => a.status === 'success').length,
    emailLogins:      loginAttempts.filter(a => a.method === 'email').length,
    phoneLogins:      loginAttempts.filter(a => a.method === 'phone').length,
  };

  const successRate = stats.totalAttempts
    ? ((stats.successfulLogins / stats.totalAttempts) * 100).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft size={20} className="mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Login Analytics</h1>
          <p className="text-gray-600">Track user authentication attempts and engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 text-sm">Total Attempts</div>
              <Users className="text-blue-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.totalAttempts}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 text-sm">Success Rate</div>
              <TrendingUp className="text-green-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-green-600">{successRate}%</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 text-sm">Email Logins</div>
              <Mail className="text-purple-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.emailLogins}</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 text-sm">Phone Logins</div>
              <Phone className="text-orange-600" size={20} />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.phoneLogins}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Login Attempts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Identifier</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loginAttempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {attempt.method === 'email' ? (
                          <Mail size={16} className="text-purple-600 mr-2" />
                        ) : (
                          <Phone size={16} className="text-orange-600 mr-2" />
                        )}
                        <span className="capitalize">{attempt.method}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {attempt.type === 'magic_link' ? 'Magic Link' : 'OTP'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{attempt.identifier}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          attempt.status === 'success'
                            ? 'bg-green-100 text-green-700'
                            : attempt.status === 'failed'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {attempt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(attempt.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">Loading analytics...</div>
        )}

        {!loading && loginAttempts.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-400">No login attempts recorded yet.</div>
        )}
      </div>
    </div>
  );
}
