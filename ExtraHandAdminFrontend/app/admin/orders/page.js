'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

function AllOrdersContent() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/orders/`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data.results || data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/update_status/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchOrders(); // Refresh orders after status update
        if(selectedOrder && selectedOrder.id === orderId) {
          // Also update the status in the currently selected order for the modal
          const updatedOrder = await response.json();
          setSelectedOrder(updatedOrder);
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to update order status:', errorData);
        alert(`Failed to update status: ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('An error occurred while updating the status.');
    }
  };

  const filteredOrders = orders
    .filter(order => filterStatus === 'all' || order.status === filterStatus)
    .filter(order => 
      searchTerm === '' || 
      order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_phone?.includes(searchTerm)
    );

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      confirmed: { bg: 'bg-blue-100', text: 'text-blue-800' },
      preparing: { bg: 'bg-indigo-100', text: 'text-indigo-800' },
      ready: { bg: 'bg-green-100', text: 'text-green-800' },
      served: { bg: 'bg-cyan-100', text: 'text-cyan-800' },
      completed: { bg: 'bg-gray-200', text: 'text-gray-800' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
  
  const OrderModal = ({ order, onClose }) => {
    if (!order) return null;
    
    const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Order #{order.order_id}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-800 text-3xl leading-none">&times;</button>
          </div>
          
          <div className="p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm tracking-wider">Customer Details</h3>
                <p><strong>Name:</strong> {order.customer_name || 'N/A'}</p>
                <p><strong>Phone:</strong> {order.customer_phone || 'N/A'}</p>
                <p><strong>Email:</strong> {order.customer_email || 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm tracking-wider">Order Info</h3>
                <p><strong>Type:</strong> <span className="capitalize">{order.order_type}</span></p>
                <p><strong>Table:</strong> {order.table || 'N/A'}</p>
                <p><strong>Created:</strong> {new Date(order.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm tracking-wider">Items</h3>
              <div className="border rounded-lg">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 border-b last:border-b-0 bg-gray-50/50">
                    <div>
                      <p className="font-semibold">{item.menu_item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">₹{item.price}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-right mb-6">
              <p className="text-gray-600">Subtotal: ₹{order.total_amount}</p>
              <p className="text-gray-600">Delivery Fee: ₹{order.delivery_fee}</p>
              <p className="font-bold text-xl text-gray-800">Grand Total: ₹{order.grand_total}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm tracking-wider">Update Status</h3>
              <div className="flex items-center gap-4">
                {getStatusBadge(order.status)}
                <select 
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className="p-2 border rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-orange-500"
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div></div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">All Orders</h1>
        <p className="text-gray-500 mt-1">Manage and track all customer orders.</p>
      </div>

      <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by Order ID, Name, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="preparing">Preparing</option>
            <option value="ready">Ready</option>
            <option value="served">Served</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button onClick={fetchOrders} className="bg-orange-500 text-white p-3 rounded-lg font-semibold hover:bg-orange-600 transition flex items-center justify-center gap-2">
            <i className="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order ID</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="p-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">#{order.order_id}</td>
                <td className="p-4">
                  <p className="font-medium text-gray-800">{order.customer_name || 'Guest'}</p>
                  <p className="text-sm text-gray-500">{order.customer_phone}</p>
                </td>
                <td className="p-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="p-4 font-medium text-gray-800">₹{order.grand_total}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4">
                  <button onClick={() => setSelectedOrder(order)} className="text-orange-600 hover:underline font-semibold text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

export default function AllOrdersPage() {
  return (
    <AdminLayout>
      <AllOrdersContent />
    </AdminLayout>
  );
}
