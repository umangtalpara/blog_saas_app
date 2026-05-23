import React, { useEffect, useState } from 'react';
import { 
  MessageCircle, Heart, Share2, 
  ArrowUpRight, ArrowDownRight,
  Eye, ChevronRight
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../shared/services/analytics.service';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [topPosts, setTopPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [overview, trendData, posts] = await Promise.all([
        analyticsService.getOverview(),
        analyticsService.getTrends(30),
        analyticsService.getTopPosts(5)
      ]);
      setStats(overview);
      setTrends(trendData);
      setTopPosts(posts);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <div className="text-3xl font-black text-gray-900 mb-1">{value?.toLocaleString()}</div>
      <div className="text-sm font-medium text-gray-500">{title}</div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-gray-900 mb-2">Analytics Overview</h2>
          <p className="text-gray-500 font-medium">Track your blog's performance and engagement.</p>
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-sm font-bold text-blue-600">30 Days</button>
          <button className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-900">90 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Views" value={stats.totalViews} icon={Eye} color="bg-blue-600" />
        <StatCard title="Total Likes" value={stats.totalLikes} icon={Heart} color="bg-red-500" />
        <StatCard title="Comments" value={stats.totalComments} icon={MessageCircle} color="bg-amber-500" />
        <StatCard title="Total Shares" value={stats.totalShares} icon={Share2} color="bg-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900">Traffic Trend</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-xs font-medium text-gray-500">Views</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 12}}
                  dy={10}
                  tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                />
                <Area type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Posts */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Posts</h3>
          <div className="space-y-6">
            {topPosts.length > 0 ? topPosts.map((post: any) => (
              <div key={post._id} className="flex items-center justify-between group cursor-pointer" onClick={() => navigate(`/admin/blogs/edit/${post._id}`)}>
                <div className="flex-1 min-w-0 pr-4">
                  <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{post.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{post.totalViews?.toLocaleString() || 0} views</p>
                </div>
                <div className="w-16 h-1 rounded-full bg-gray-100 overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 transition-all duration-1000" 
                    style={{ width: `${topPosts[0]?.totalViews > 0 ? Math.max((post.totalViews / topPosts[0].totalViews) * 100, 2) : 2}%` }} 
                  />
                </div>
              </div>
            )) : (
              <div className="py-8 text-center text-gray-400 text-sm">No data available yet.</div>
            )}
          </div>
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="w-full mt-8 py-3 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            View All Content
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
