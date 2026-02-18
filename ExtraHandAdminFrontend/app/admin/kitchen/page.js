'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

function KitchenPortalContent() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchKitchenOrders();
    const interval = setInterval(fetchKitchenOrders, 10000); // Refresh every 10s
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const fetchKitchenOrders = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/kitchen/orders/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching kitchen orders:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/update-status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchKitchenOrders();
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = selectedTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedTab);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#fbbf24',
      confirmed: '#3b82f6',
      preparing: '#8b5cf6',
      ready: '#10b981',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusActions = (status, orderId) => {
    if (status === 'pending') {
      return (
        <button 
          onClick={() => updateOrderStatus(orderId, 'confirmed')}
          style={{
            padding: '8px 16px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          Accept Order
        </button>
      );
    } else if (status === 'confirmed') {
      return (
        <button 
          onClick={() => updateOrderStatus(orderId, 'preparing')}
          style={{
            padding: '8px 16px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          Start Preparing
        </button>
      );
    } else if (status === 'preparing') {
      return (
        <button 
          onClick={() => updateOrderStatus(orderId, 'ready')}
          style={{
            padding: '8px 16px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '13px',
          }}
        >
          Mark Ready
        </button>
      );
    }
    return <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Ready for Pickup</span>;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - date) / 60000);
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}h ${diffMinutes % 60}m ago`;
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style jsx>{`
        .kitchen-header {
          background: linear-gradient(135deg, #d2691e 0%, #a0522d 100%);
          padding: 24px;
          border-radius: 12px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(210, 105, 30, 0.2);
        }

        .kitchen-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .kitchen-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .filter-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 12px;
        }

        .filter-tab {
          padding: 10px 20px;
          background: none;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          color: #6b7280;
          transition: all 0.3s;
        }

        .filter-tab:hover {
          background: #f3f4f6;
        }

        .filter-tab.active {
          background: #d2691e;
          color: white;
        }

        .orders-grid {
          display: grid;
          gap: 16px;
        }

        .order-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
          transition: all 0.3s;
        }

        .order-card:hover {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          transform: translateY(-2px);
        }

        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: start;
          margin-bottom: 16px;
        }

        .order-id {
          font-size: 18px;
          font-weight: 700;
          color: #1f2937;
        }

        .order-time {
          font-size: 13px;
          color: #6b7280;
        }

        .order-type-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          display: inline-block;
        }

        .order-items {
          margin: 16px 0;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
        }

        .item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .item:last-child {
          border-bottom: none;
        }

        .item-name {
          font-weight: 600;
          color: #374151;
        }

        .item-quantity {
          color: #6b7280;
          font-size: 14px;
        }

        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #e5e7eb;
        }

        .customer-info {
          font-size: 14px;
          color: #6b7280;
        }

        .customer-name {
          font-weight: 600;
          color: #1f2937;
          margin-right: 8px;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 64px;
          margin-bottom: 16px;
          opacity: 0.3;
        }

        @media (max-width: 768px) {
          .kitchen-stats {
            grid-template-columns: 1fr;
          }

          .filter-tabs {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="kitchen-header">
        <h1>🔥 Kitchen Portal</h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          {currentTime.toLocaleTimeString()} | {currentTime.toLocaleDateString()}
        </p>
      </div>

      <div className="kitchen-stats">
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#fbbf24' }}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {orders.filter(o => o.status === 'preparing').length}
          </div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#10b981' }}>
            {orders.filter(o => o.status === 'ready').length}
          </div>
          <div className="stat-label">Ready</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {orders.length}
          </div>
          <div className="stat-label">Total Active</div>
        </div>
      </div>

      <div className="filter-tabs">
        <button 
          className={`filter-tab ${selectedTab === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedTab('all')}
        >
          All Orders ({orders.length})
        </button>
        <button 
          className={`filter-tab ${selectedTab === 'pending' ? 'active' : ''}`}
          onClick={() => setSelectedTab('pending')}
        >
          Pending ({orders.filter(o => o.status === 'pending').length})
        </button>
        <button 
          className={`filter-tab ${selectedTab === 'confirmed' ? 'active' : ''}`}
          onClick={() => setSelectedTab('confirmed')}
        >
          Confirmed ({orders.filter(o => o.status === 'confirmed').length})
        </button>
        <button 
          className={`filter-tab ${selectedTab === 'preparing' ? 'active' : ''}`}
          onClick={() => setSelectedTab('preparing')}
        >
          Preparing ({orders.filter(o => o.status === 'preparing').length})
        </button>
        <button 
          className={`filter-tab ${selectedTab === 'ready' ? 'active' : ''}`}
          onClick={() => setSelectedTab('ready')}
        >
          Ready ({orders.filter(o => o.status === 'ready').length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px', color: '#d2691e' }}>Loading orders...</div>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No Orders</h3>
          <p>There are no orders in this category</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div 
              key={order.id} 
              className="order-card"
              style={{ borderLeftColor: getStatusColor(order.status) }}
            >
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.order_id}</div>
                  <div className="order-time">{formatTime(order.created_at)}</div>
                  <span 
                    className="order-type-badge"
                    style={{
                      background: order.order_type === 'dine-in' ? '#dbeafe' : 
                                 order.order_type === 'takeaway' ? '#fef3c7' : '#e0e7ff',
                      color: order.order_type === 'dine-in' ? '#1e40af' : 
                             order.order_type === 'takeaway' ? '#92400e' : '#3730a3',
                      marginTop: '8px',
                    }}
                  >
                    {order.order_type?.toUpperCase()}
                    {order.table_number && ` - Table ${order.table_number}`}
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#1f2937',
                    marginBottom: '4px'
                  }}>
                    ₹{order.total_amount}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    fontWeight: '600',
                    color: getStatusColor(order.status),
                    textTransform: 'uppercase',
                  }}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="order-items">
                <div style={{ fontWeight: '600', marginBottom: '12px', color: '#374151' }}>
                  Items:
                </div>
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="item">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">×{item.quantity} | ₹{item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="customer-info">
                  <span className="customer-name">{order.customer_name}</span>
                  {order.customer_phone && <span>| {order.customer_phone}</span>}
                </div>
                {getStatusActions(order.status, order.id)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KitchenPortal() {
  return (
    <AdminLayout>
      <KitchenPortalContent />
    </AdminLayout>
  );
}
