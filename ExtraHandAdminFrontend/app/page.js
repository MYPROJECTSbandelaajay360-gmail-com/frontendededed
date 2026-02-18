'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaDollarSign, FaShoppingCart, FaCheckCircle, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import AdminLayout from '@/components/AdminLayout';

const StatCard = ({ icon, title, value, change, iconBgColor }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
    <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${iconBgColor}`}>
      {icon}
    </div>
    <div className="ml-4">
      <p className="text-sm text-gray-500 uppercase font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
      <p className="text-xs text-green-600 mt-1">{change}</p>
    </div>
  </div>
);

const OrderRow = ({ order }) => (
  <tr className="border-b hover:bg-gray-50 transition-colors">
    <td className="py-4 px-4 text-sm font-semibold text-gray-800">{order.order_id}</td>
    <td className="py-4 px-4 text-sm">
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
        order.order_type === 'dine-in' ? 'bg-blue-100 text-blue-700' : 
        order.order_type === 'takeaway' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
      }`}>
        {order.order_type}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-gray-600">{order.customer_name}</td>
    <td className="py-4 px-4 text-sm text-gray-600">{order.items_count} item(s)</td>
    <td className="py-4 px-4 text-sm font-semibold text-gray-800">₹{parseFloat(order.total_amount).toFixed(2)}</td>
    <td className="py-4 px-4 text-sm">
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${
        order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
        order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
        order.status === 'PREPARING' ? 'bg-purple-100 text-purple-700' :
        'bg-gray-100 text-gray-700'
      }`}>
        {order.status}
      </span>
    </td>
    <td className="py-4 px-4 text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
    <td className="py-4 px-4 text-sm">
      <button className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-4 rounded-md text-xs transition-colors">
        View
      </button>
    </td>
  </tr>
);

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    todays_revenue: 0,
    active_orders: 0,
    completed_today: 0,
    avg_prep_time: 'N/A',
    live_orders: [],
  });
  const [filter, setFilter] = useState('All');
  const router = useRouter();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch('http://127.0.0.1:8000/api/admin/dashboard/stats/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else if (response.status === 401) {
        toast.error("Authentication failed. Please log in again.");
        router.push('/login');
      } else {
        toast.error("Failed to fetch dashboard data.");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("An error occurred while fetching data.");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.replace('/login');
    } else {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        if (parsedUser.role === 'admin' || parsedUser.role === 'content-admin') {
          setLoading(false);
          fetchStats();
          const interval = setInterval(fetchStats, 30000);
          return () => clearInterval(interval);
        } else if (parsedUser.role === 'reviewer') {
          router.replace('/reviewer');
        } else {
          router.replace('/login');
        }
      } catch (error) {
        console.error("Failed to parse user data, redirecting to login.", error);
        router.replace('/login');
      }
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const filteredOrders = stats.live_orders.filter(order => {
    if (filter === 'All') return true;
    return order.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="flex items-center text-green-600 font-medium">
                <span className="h-2 w-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
                Live
              </span>
              <button 
                onClick={fetchStats} 
                className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors flex items-center"
              >
                <FaClock className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FaDollarSign className="text-white text-3xl" />}
              title="Today's Revenue"
              value={`₹${parseFloat(stats.todays_revenue).toFixed(2)}`}
              change="↑ +0.0% from yesterday"
              iconBgColor="bg-green-500"
            />
            <StatCard
              icon={<FaShoppingCart className="text-white text-3xl" />}
              title="Active Orders"
              value={stats.active_orders}
              change="↑ All systems ready"
              iconBgColor="bg-blue-500"
            />
            <StatCard
              icon={<FaCheckCircle className="text-white text-3xl" />}
              title="Completed Today"
              value={stats.completed_today}
              change="↑ Great start!"
              iconBgColor="bg-purple-500"
            />
            <StatCard
              icon={<FaClock className="text-white text-3xl" />}
              title="Avg. Prep Time"
              value={stats.avg_prep_time}
              change="No orders yet"
              iconBgColor="bg-orange-500"
            />
          </div>

          {/* Live Orders Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Live Orders</h2>
                <div className="flex space-x-2">
                  {['All', 'Pending', 'Preparing', 'Ready'].map(f => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        filter === f 
                          ? 'bg-amber-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Table/Customer</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Items</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Time</th>
                    <th className="py-4 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map(order => <OrderRow key={order.order_id} order={order} />)
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <p className="text-gray-500 text-lg font-medium">No Active Orders</p>
                          <p className="text-gray-400 text-sm mt-1">Orders will appear here when customers place them.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}

