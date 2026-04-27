import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Users, Zap, Calendar, Star, ArrowRight, User } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);

  // Mock data for the UI since backend is stubbed
  const stats = [
    { label: 'Active Swaps', value: user?.swap_count || 0, icon: <Zap className="w-6 h-6 text-accent-500" /> },
    { label: 'Pending Requests', value: 2, icon: <Users className="w-6 h-6 text-primary-500" /> },
    { label: 'Sessions This Week', value: 1, icon: <Calendar className="w-6 h-6 text-purple-500" /> },
    { label: 'Avg Rating', value: user?.avg_rating || 'New', icon: <Star className="w-6 h-6 text-yellow-500" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl p-8 mb-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
              <p className="text-slate-600">
                {user?.userSkills?.length > 0 
                  ? "You're making great progress on your learning journey." 
                  : "Start by adding skills you want to teach and learn to find your first match!"}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {(!user?.userSkills || user.userSkills.length === 0) && (
              <Link 
                to="/profile/setup" 
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-all shadow-sm"
              >
                Set Up Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            <Link 
              to="/matches" 
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-sm"
            >
              Find Matches
              <Zap className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Swaps */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Swap Activity</h2>
              <Link to="/swaps" className="text-sm font-medium text-primary-600 hover:text-primary-700">View All</Link>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Users className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-slate-900 font-medium mb-1">No active swaps yet</h3>
                <p className="text-sm text-slate-500 mb-4">Start exchanging skills to see activity here.</p>
                <Link to="/matches" className="text-sm font-medium text-primary-600 hover:text-primary-700">Find Matches →</Link>
              </div>
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Upcoming Sessions</h2>
              <Link to="/sessions" className="text-sm font-medium text-primary-600 hover:text-primary-700">All</Link>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No upcoming sessions</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
