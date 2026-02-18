'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role') || 'admin';
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    setUser({ username, role });
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const navigationItems = [
    {
      section: 'MAIN MENU',
      items: [
        { name: 'Dashboard', icon: 'fa-chart-line', path: '/', roles: ['admin'] },
        { name: 'Kitchen Portal', icon: 'fa-fire', path: '/admin/kitchen', roles: ['admin', 'kitchen'] },
        { name: 'Menu Management', icon: 'fa-book', path: '/admin/menu', roles: ['admin'] },
        { name: 'Settings', icon: 'fa-cog', path: '/admin/settings', roles: ['admin'] },
      ]
    },
    {
      section: 'QUICK ACTIONS',
      items: [
        { name: 'QR Codes', icon: 'fa-qrcode', path: '/admin/qr-codes', roles: ['admin'] },
        { name: 'All Orders', icon: 'fa-receipt', path: '/admin/orders', roles: ['admin', 'staff'] },
        { name: 'Tables', icon: 'fa-chair', path: '/admin/tables', roles: ['admin', 'staff'] },
        { name: 'Customers', icon: 'fa-users', path: '/admin/customers', roles: ['admin'] },
        { name: 'Payments', icon: 'fa-credit-card', path: '/admin/payments', roles: ['admin'] },
        { name: 'Reports', icon: 'fa-chart-bar', path: '/admin/reports', roles: ['admin'] },
      ]
    }
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <style jsx>{`
        /* General */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .dashboard-container {
          display: flex;
          min-height: 100vh;
          background: #f7fafc;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        /* Sidebar */
        .sidebar {
          width: 260px;
          background: #1a202c;
          color: #e2e8f0;
          position: fixed;
          height: 100%;
          overflow-y: auto;
          z-index: 1000;
          transition: transform 0.3s ease-in-out;
          display: flex;
          flex-direction: column;
        }

        .sidebar.closed {
          transform: translateX(-260px);
        }
        
        .sidebar-content {
          flex-grow: 1;
        }

        /* Scrollbar */
        .sidebar::-webkit-scrollbar {
          width: 4px;
        }
        .sidebar::-webkit-scrollbar-track {
          background: #2d3748;
        }
        .sidebar::-webkit-scrollbar-thumb {
          background: #4a5568;
          border-radius: 2px;
        }

        /* Sidebar Header */
        .sidebar-header {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #2d3748;
        }

        .logo-icon {
          width: 36px;
          height: 36px;
          background: #d69e2e;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
          font-weight: bold;
        }
        
        .logo-text .logo-title {
          font-size: 18px;
          font-weight: 600;
          color: #ffffff;
        }

        .logo-text .logo-subtitle {
          font-size: 12px;
          color: #a0aec0;
        }

        /* User Info */
        .user-info {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid #2d3748;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #d69e2e;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          color: #1a202c;
        }

        .user-details h4 {
          font-size: 14px;
          font-weight: 600;
          color: #f7fafc;
          text-transform: capitalize;
        }

        .user-details p {
          font-size: 12px;
          color: #a0aec0;
          text-transform: capitalize;
        }

        /* Navigation */
        .nav-section {
          padding: 16px;
        }

        .nav-label {
          padding: 8px 8px 12px;
          font-size: 11px;
          font-weight: 600;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          margin-bottom: 4px;
          color: #a0aec0;
          text-decoration: none;
          transition: background 0.2s, color 0.2s;
          font-size: 14px;
          font-weight: 500;
          border-radius: 8px;
        }

        .nav-item:hover {
          background: #2d3748;
          color: #ffffff;
        }

        .nav-item.active {
          background: #d69e2e;
          color: #1a202c;
          font-weight: 600;
        }
        
        .nav-item.active .nav-icon {
          color: #1a202c;
        }

        .nav-icon {
          width: 20px;
          margin-right: 16px;
          text-align: center;
          font-size: 16px;
          transition: color 0.2s;
        }

        /* Logout Button */
        .logout-section {
          padding: 24px;
          margin-top: auto;
        }
        
        .logout-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 12px;
          background: #2d3748;
          color: #a0aec0;
          border: 1px solid #4a5568;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
          font-size: 14px;
          font-weight: 600;
        }

        .logout-button:hover {
          background: #d69e2e;
          color: #1a202c;
          border-color: #d69e2e;
        }
        
        .logout-icon {
          margin-right: 8px;
        }

        /* Main Content */
        .main-content {
          flex-grow: 1;
          padding: 0;
          margin-left: 260px;
          transition: margin-left 0.3s ease-in-out;
        }
        
        .main-content.closed {
          margin-left: 0;
        }

        .top-bar {
          background: #ffffff;
          padding: 16px 32px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          z-index: 999;
        }

        .sidebar-toggle {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #4a5568;
        }
        
        .top-bar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #48bb78;
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          background: #48bb78;
          border-radius: 50%;
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(72, 187, 120, 0); }
          100% { box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
        }

        .content-area {
          padding: 32px;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-260px);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .main-content {
            margin-left: 0;
          }
        }
      `}</style>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo-icon">B</div>
          <div className="logo-text">
            <h3 className="logo-title">Café Admin</h3>
            <p className="logo-subtitle">TheBakeStory</p>
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar">{user?.username?.charAt(0)}</div>
          <div className="user-details">
            <h4>{user?.username}</h4>
            <p>{user?.role}</p>
          </div>
        </div>
        
        <div className="sidebar-content">
          {navigationItems.map((section) => (
            <div key={section.section} className="nav-section">
              <h5 className="nav-label">{section.section}</h5>
              {section.items.map((item) => (
                <Link key={item.name} href={item.path} className={`nav-item ${pathname === item.path ? 'active' : ''}`}>
                  <i className={`fas ${item.icon} nav-icon`}></i>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="logout-section">
          <button onClick={handleLogout} className="logout-button">
            <i className="fas fa-sign-out-alt logout-icon"></i>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className={`main-content ${sidebarOpen ? '' : 'closed'}`}>
        <header className="top-bar">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            <i className="fas fa-bars"></i>
          </button>
          <div className="top-bar-right">
            <div className="live-indicator">
              <span className="live-dot"></span>
              <span>Live</span>
            </div>
          </div>
        </header>
        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
}
