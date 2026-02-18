'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';
import AdminLayout from '@/components/AdminLayout';

function StaffPortalContent() {
  const router = useRouter();
  const [stats, setStats] = useState({
    todayOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    todayRevenue: 0,
  });
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchStaffData();
    const interval = setInterval(fetchStaffData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStaffData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch orders
      const ordersResponse = await fetch(`${API_BASE_URL}/api/orders/`, { headers });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const ordersList = ordersData.results || ordersData || [];
        setOrders(ordersList);

        // Calculate stats
        const today = new Date().toISOString().split('T')[0];
        const todayOrders = ordersList.filter(o => 
          o.created_at?.startsWith(today)
        );
        
        setStats({
          todayOrders: todayOrders.length,
          pendingOrders: ordersList.filter(o => 
            ['pending', 'confirmed', 'preparing'].includes(o.status)
          ).length,
          completedOrders: todayOrders.filter(o => o.status === 'completed').length,
          todayRevenue: todayOrders.reduce((sum, o) => sum + parseFloat(o.total_amount || 0), 0),
        });
      }

      // Fetch tables
      const tablesResponse = await fetch(`${API_BASE_URL}/api/tables/`, { headers });
      if (tablesResponse.ok) {
        const tablesData = await tablesResponse.json();
        setTables(tablesData.results || tablesData || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching staff data:', error);
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/update-status/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchStaffData();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: '#fef3c7', color: '#92400e', text: 'Pending' },
      confirmed: { bg: '#dbeafe', color: '#1e40af', text: 'Confirmed' },
      preparing: { bg: '#e0e7ff', color: '#3730a3', text: 'Preparing' },
      ready: { bg: '#d1fae5', color: '#065f46', text: 'Ready' },
      completed: { bg: '#d1fae5', color: '#065f46', text: 'Completed' },
      cancelled: { bg: '#fee2e2', color: '#991b1b', text: 'Cancelled' },
    };
    const badge = badges[status] || badges.pending;
    return (
      <span style={{
        background: badge.bg,
        color: badge.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
      }}>
        {badge.text}
      </span>
    );
  };

  const getTableStatus = (table) => {
    const hasActiveOrder = orders.some(o => 
      o.table?.id === table.id && 
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    );
    return hasActiveOrder ? 'occupied' : 'available';
  };

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>
      <style jsx>{`
        .staff-header {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          padding: 24px;
          border-radius: 12px;
          color: white;
          margin-bottom: 24px;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          border-left: 4px solid;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin-bottom: 12px;
        }

        .stat-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
          font-weight: 500;
        }

        .tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 24px;
          border-bottom: 2px solid #e5e7eb;
        }

        .tab {
          padding: 12px 24px;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 600;
          font-size: 15px;
          color: #6b7280;
          transition: all 0.3s;
          margin-bottom: -2px;
        }

        .tab:hover {
          color: #3b82f6;
        }

        .tab.active {
          color: #3b82f6;
          border-bottom-color: #3b82f6;
        }

        .orders-table {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .table-header {
          background: #f9fafb;
          padding: 16px;
          font-weight: 600;
          color: #374151;
          border-bottom: 2px solid #e5e7eb;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th {
          text-align: left;
          padding: 16px;
          font-weight: 600;
          color: #374151;
          font-size: 14px;
          background: #f9fafb;
        }

        td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
          font-size: 14px;
        }

        tr:hover {
          background: #f9fafb;
        }

        .tables-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 16px;
        }

        .table-card {
          background: white;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
          border: 2px solid transparent;
        }

        .table-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
        }

        .table-card.occupied {
          border-color: #ef4444;
          background: #fef2f2;
        }

        .table-card.available {
          border-color: #10b981;
          background: #f0fdf4;
        }

        .table-number {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .table-status {
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .action-btn {
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          transition: all 0.3s;
        }

        .action-btn:hover {
          background: #2563eb;
        }

        .action-btn.danger {
          background: #ef4444;
        }

        .action-btn.danger:hover {
          background: #dc2626;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tables-grid {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          }

          table {
            font-size: 12px;
          }

          th, td {
            padding: 12px 8px;
          }
        }
      `}</style>

      <div className="staff-header">
        <h1>👥 Staff Portal</h1>
        <p style={{ fontSize: '16px', opacity: 0.9 }}>
          Manage orders, tables, and customer service
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#1e40af' }}>
            📋
          </div>
          <div className="stat-value" style={{ color: '#3b82f6' }}>
            {stats.todayOrders}
          </div>
          <div className="stat-label">Today's Orders</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#92400e' }}>
            ⏳
          </div>
          <div className="stat-value" style={{ color: '#f59e0b' }}>
            {stats.pendingOrders}
          </div>
          <div className="stat-label">Pending Orders</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
          <div className="stat-icon" style={{ background: '#d1fae5', color: '#065f46' }}>
            ✓
          </div>
          <div className="stat-value" style={{ color: '#10b981' }}>
            {stats.completedOrders}
          </div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
          <div className="stat-icon" style={{ background: '#ede9fe', color: '#5b21b6' }}>
            ₹
          </div>
          <div className="stat-value" style={{ color: '#8b5cf6' }}>
            {stats.todayRevenue.toFixed(0)}
          </div>
          <div className="stat-label">Today's Revenue</div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Active Orders
        </button>
        <button 
          className={`tab ${activeTab === 'tables' ? 'active' : ''}`}
          onClick={() => setActiveTab('tables')}
        >
          Tables
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          Loading...
        </div>
      ) : activeTab === 'orders' ? (
        <div className="orders-table">
          <div className="table-header">
            Active Orders
          </div>
          {orders.filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)).length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
              No active orders
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(o => ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status))
                  .map(order => (
                    <tr key={order.id}>
                      <td style={{ fontWeight: '600' }}>#{order.order_id}</td>
                      <td>{order.customer_name || 'Guest'}</td>
                      <td>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: order.order_type === 'dine-in' ? '#dbeafe' : '#fef3c7',
                          color: order.order_type === 'dine-in' ? '#1e40af' : '#92400e',
                        }}>
                          {order.order_type}
                        </span>
                      </td>
                      <td>{order.items?.length || 0}</td>
                      <td style={{ fontWeight: '600' }}>₹{order.total_amount}</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td style={{ color: '#6b7280', fontSize: '13px' }}>
                        {new Date(order.created_at).toLocaleTimeString()}
                      </td>
                      <td>
                        {order.status === 'ready' && (
                          <button 
                            className="action-btn"
                            onClick={() => updateOrderStatus(order.id, 'completed')}
                          >
                            Complete
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <button 
                            className="action-btn danger"
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="tables-grid">
          {tables.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              No tables configured
            </div>
          ) : (
            tables.map(table => {
              const status = getTableStatus(table);
              return (
                <div 
                  key={table.id} 
                  className={`table-card ${status}`}
                >
                  <div className="table-number" style={{ 
                    color: status === 'occupied' ? '#ef4444' : '#10b981' 
                  }}>
                    {table.table_number}
                  </div>
                  <div className="table-status" style={{ 
                    color: status === 'occupied' ? '#ef4444' : '#10b981' 
                  }}>
                    {status}
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '13px', color: '#6b7280' }}>
                    Capacity: {table.capacity || 4}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default function StaffPortal() {
  return (
    <AdminLayout>
      <StaffPortalContent />
    </AdminLayout>
  );
}
