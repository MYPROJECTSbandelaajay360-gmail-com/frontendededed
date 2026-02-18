/* eslint-disable @next/next/no-img-element */
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FaTachometerAlt, 
  FaUtensils, 
  FaBars, 
  FaCog, 
  FaQrcode, 
  FaClipboardList, 
  FaSignOutAlt,
  FaCoffee
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.error("Failed to parse user data", e);
          setUser(null);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      toast.success('You have been logged out successfully');
      router.push('/login');
    }
  };

  const getLinkClass = (path) => {
    return pathname === path
      ? 'bg-gray-700 text-white shadow-md'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col min-h-screen shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center">
          <div className="bg-amber-600 p-2 rounded-lg mr-3">
            <FaCoffee className="text-white text-2xl" />
          </div>
          <h1 className="text-2xl font-bold">Café Admin</h1>
        </div>
      </div>
      
      {/* User Profile Section */}
      <div className="p-5 flex items-center border-b border-gray-700 bg-gray-800/50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xl font-bold mr-3 shadow-md">
          {user ? user.name.charAt(0).toUpperCase() : 'A'}
        </div>
        <div>
          <p className="font-semibold text-white">{user ? user.name : 'Admin User'}</p>
          <p className="text-xs text-gray-400">{user ? user.role : 'Administrator'}</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        <p className="px-4 pb-2 text-xs text-gray-400 uppercase font-semibold tracking-wider">Main Menu</p>
        <Link href="/" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${getLinkClass('/')}`}>
          <FaTachometerAlt className="mr-3 text-lg" />
          Dashboard
        </Link>
        <Link href="/admin/kitchen" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${getLinkClass('/admin/kitchen')}`}>
          <FaUtensils className="mr-3 text-lg" />
          Kitchen Portal
        </Link>
        <Link href="/admin/menu" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${getLinkClass('/admin/menu')}`}>
          <FaBars className="mr-3 text-lg" />
          Menu Management
        </Link>
        
        <div className="pt-4">
          <p className="px-4 pb-2 text-xs text-gray-400 uppercase font-semibold tracking-wider">Quick Actions</p>
        </div>
        <Link href="/admin/orders" className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all ${getLinkClass('/admin/orders')}`}>
          <FaClipboardList className="mr-3 text-lg" />
          All Orders
        </Link>
      </nav>
      
      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors shadow-md"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
