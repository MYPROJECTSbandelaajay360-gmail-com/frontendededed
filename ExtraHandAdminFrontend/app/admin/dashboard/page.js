"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";
import AdminLayout from "@/components/AdminLayout";

const AdminDashboardContent = () => {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayRevenue: 0,
    revenueChange: 0,
    activeOrders: 0,
    completedToday: 0,
    avgTime: '--',
  });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }
        const response = await fetch(`${API_BASE_URL}/api/admin/stats/`, {
          headers: { 'Authorization': `Token ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setStats({
            todayRevenue: data.today_revenue || 0,
            revenueChange: data.revenue_change || 0,
            activeOrders: data.active_orders_count || 0,
            completedToday: data.completed_today || 0,
            avgTime: data.avg_time || '--',
          });
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [router]);

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === activeFilter);

  const StatCard = ({ icon, bgColor, title, value, change, changeText }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor}`}>
          <i className={`fas ${icon} text-white text-xl`}></i>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {changeText && (
          <div className={`flex items-center gap-1 text-sm font-semibold mt-2 ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <i className={`fas fa-arrow-${change >= 0 ? 'up' : 'down'} w-4 h-4`}></i>
            <span>{changeText}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold flex items-center gap-2 transition-all"
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon="fa-dollar-sign"
          bgColor="bg-green-500"
          title="Today's Revenue"
          value={`₹${stats.todayRevenue.toFixed(2)}`}
          change={stats.revenueChange}
          changeText={`${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange.toFixed(1)}% from yesterday`}
        />
        <StatCard 
          icon="fa-lock-open"
          bgColor="bg-blue-500"
          title="Active Orders"
          value={stats.activeOrders}
          change={1}
          changeText="All systems ready"
        />
        <StatCard 
          icon="fa-check-circle"
          bgColor="bg-purple-500"
          title="Completed Today"
          value={stats.completedToday}
          change={1}
          changeText="Great start!"
        />
        <StatCard 
          icon="fa-clock"
          bgColor="bg-orange-400"
          title="Avg. Prep Time"
          value={stats.avgTime}
          change={-1}
          changeText={stats.activeOrders > 0 ? null : "No orders yet"}
        />
      </div>

      {/* Live Orders */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Live Orders</h2>
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            {['all', 'pending', 'preparing', 'ready'].map(filter => (
              <button 
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeFilter === filter ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {filteredOrders.length > 0 ? (
          <div className="p-6">
            {/* This is where you would map through and display orders */}
            <p>Displaying {filteredOrders.length} orders...</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <i className="fas fa-receipt text-3xl text-gray-400"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No Active Orders</h3>
            <p className="text-gray-500 mt-1">Orders will appear here when customers place them.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminDashboardContent />
    </AdminLayout>
  );
}
