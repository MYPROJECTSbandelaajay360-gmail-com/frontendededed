"use client";

import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { API_BASE_URL } from "@/lib/api";
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';

/**
 * Menu Items Content Component containing the main logic
 */
const ArticlesContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userRole, setUserRole] = useState(null);
  const [stats, setStats] = useState(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [activeTab, setActiveTab] = useState('available');
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    imageUrl: '',
    imageFile: null,
    imagePreview: '',
    available: true,
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please upload JPG, PNG, WEBP or GIF.');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size too large. Max 5MB allowed.');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          imagePreview: reader.result,
          imageUrl: reader.result // Set base64 string as imageUrl for backend compatibility
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const menuCategories = [
    'Bread',
    'Cake',
    'Croissant',
    'Pastry',
    'Cookie',
    'Donut',
    'Beverage',
    'Special',
  ];

  useEffect(() => {
    // Get user role from localStorage
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('User role from localStorage:', userData.role);
        setUserRole(userData.role);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    } else {
      console.log('No user data in localStorage');
    }
    
    fetchDashboardData();
    
    // Set active tab from URL parameter
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const [statsRes, availableRes, allRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/menu-items/available`, { headers }),
        fetch(`${API_BASE_URL}/api/menu-items/all`, { headers }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats:', statsData);
        setStats(statsData);
      }
      if (availableRes.ok) {
        const availableData = await availableRes.json();
        console.log('Available menu items:', availableData);
        console.log('Available items count:', availableData.length);
        setPendingItems(availableData);
      } else {
        console.error('Failed to fetch available menu items:', availableRes.status);
      }
      if (allRes.ok) {
        const allData = await allRes.json();
        console.log('All menu items:', allData);
        console.log('All items count:', allData.length);
        setAllItems(allData);
      } else {
        console.error('Failed to fetch all menu items:', allRes.status);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/menu-items/${itemId}/availability`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ available: !currentStatus }),
      });

      if (response.ok) {
        toast.success(`Menu item ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
        fetchDashboardData();
      } else {
        toast.error('Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      toast.error('Error updating availability');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingItem 
        ? `${API_BASE_URL}/api/menu-items/${editingItem._id}`
        : `${API_BASE_URL}/api/menu-items`;
      
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingItem ? 'Menu item updated successfully!' : 'Menu item created successfully!');
        resetForm();
        setActiveTab('all'); // Switch to All Items tab
        await fetchDashboardData();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to save menu item');
      }
    } catch (error) {
      console.error('Error saving menu item:', error);
      toast.error('Error saving menu item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      category: item.category,
      price: item.price,
      imageUrl: item.imageUrl || '',
      imageFile: null,
      imagePreview: item.imageUrl || '',
      available: item.available,
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/menu-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success('Menu item deleted successfully!');
        fetchDashboardData();
      } else {
        toast.error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      toast.error('Error deleting menu item');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      imageUrl: '',
      imageFile: null,
      imagePreview: '',
      available: true,
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const filteredItems = (activeTab === 'available' ? pendingItems : allItems).filter(item => {
    const matchesSearch = searchTerm ? (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) : true;
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto "></div>
          <p className="mt-4 text-gray-600">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-3 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
            <p className="text-gray-500 mt-1">Manage bakery menu items and availability</p>
          </div>
          {!showForm && (
             <div className="flex gap-3">
                <button
                onClick={() => {
                  setShowForm(true);
                  setActiveTab('create');
                }}
                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-5 py-2.5 rounded-lg transition-colors font-semibold shadow-sm flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Menu Item</span>
              </button>
             </div>
          )}
        </div>

        {/* Filters Section */}
        {!showForm && (
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 mb-3">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-5">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Search Menu Items</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          placeholder="Filter by name..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all placeholder:text-gray-300"
                        />
                        <svg className="w-4 h-4 text-gray-300 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                  </div>
                  <div className="md:col-span-5">
                      <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Category</label>
                       <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none transition-all appearance-none"
                      >
                        <option value="">All Categories</option>
                        {menuCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                  </div>
                   <div className="md:col-span-2">
                      <button 
                         onClick={() => { setSearchTerm(''); setCategoryFilter(''); }}
                         className="w-full px-3 py-2 bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium rounded-lg text-xs transition-colors"
                      >
                        Clear Filters
                      </button>
                   </div>
              </div>
           </div>
        )}

        {/* Menu Item Form */}
        {showForm ? (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-4">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
              <div>
                 <h2 className="text-2xl font-bold text-gray-900">
                  {editingItem ? 'Edit Menu Item' : 'Create New Menu Item'}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Fill in the details below to {editingItem ? 'update' : 'create'} a menu item.</p>
              </div>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Item Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Item Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
                    placeholder="e.g., Chocolate Croissant"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all bg-white text-sm"
                    required
                  >
                    <option value="">Select a category</option>
                    {menuCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
                    placeholder="99.00"
                    required
                  />
                </div>

                 {/* Description */}
                 <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] outline-none transition-all text-sm"
                    placeholder="Brief description of the item"
                    required
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  Item Image <span className="text-red-500">*</span>
                </label>
                
                <div 
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl hover:bg-orange-50/10 transition-colors group cursor-pointer ${formData.imagePreview ? 'border-[var(--color-primary)] bg-orange-50/10' : 'border-gray-300 bg-gray-50'}`}
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  <div className="space-y-1 text-center">
                      {formData.imagePreview ? (
                          <div className="relative inline-block group-hover:opacity-90 transition-opacity">
                              <img src={formData.imagePreview} alt="Preview" className="h-40 object-contain rounded-lg shadow-sm" />
                              <button type="button" 
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      setFormData(prev => ({ ...prev, imageFile: null, imagePreview: '', imageUrl: '' }));
                                  }}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transform hover:scale-110 transition-all"
                              >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                              <p className="text-xs text-gray-500 mt-2 font-medium">{formData.imageFile?.name || 'Selected Image'}</p>
                          </div>
                      ) : (
                          <>
                            <div className="mx-auto h-10 w-10 text-gray-400 group-hover:text-[var(--color-primary)] transition-colors mb-2">
                               <svg stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                               </svg>
                            </div>
                            <div className="flex text-sm text-gray-600 justify-center">
                              <label htmlFor="image-upload" className="relative cursor-pointer bg-transparent rounded-md font-bold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] focus-within:outline-none">
                                <span>Upload a file</span>
                                <input id="image-upload" name="image" type="file" className="sr-only" accept=".jpg,.jpeg,.png,.webp,.gif" 
                                  onChange={handleImageChange}
                                  onClick={(e) => e.stopPropagation()} 
                                />
                              </label>
                              <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              PNG, JPG, WEBP up to 5MB
                            </p>
                             <div className="mt-2 pt-2 border-t border-gray-200/50">
                                <input 
                                    type="text" 
                                    className="text-xs border-b border-gray-300 focus:border-[var(--color-primary)] outline-none bg-transparent w-full text-center placeholder-gray-400"
                                    placeholder="Or paste image URL here"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value, imagePreview: e.target.value }))}
                                    onClick={(e) => e.stopPropagation()}
                                />
                             </div>
                          </>
                      )}
                  </div>
                </div>
              </div>

              {/* Available Toggle */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleInputChange}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <div>
                  <label className="block text-sm font-bold text-gray-700">
                    Available for Order
                  </label>
                  <p className="text-xs text-gray-500">Enable this item to appear in customer menu</p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white px-8 py-3 rounded-lg transition-all duration-300 font-semibold shadow-sm hover:shadow"
                >
                  {editingItem ? 'Update Menu Item' : 'Create Menu Item'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
        /* Main List Container */
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
             {/* Header / Tabs */}
             <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'all' ? 'All Menu Items' : 'Available Items'}
                </h2>
                
                <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
                    <button
                      onClick={() => setActiveTab('available')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                        activeTab === 'available'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Available ({pendingItems.length})
                    </button>
                    <button
                      onClick={() => setActiveTab('all')}
                      className={`px-4 py-1.5 text-sm font-bold rounded-md transition-all ${
                        activeTab === 'all'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      All Items ({allItems.length})
                    </button>
                  </div>
             </div>
              
              {/* Toolbar */}
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                   <div className="flex items-center gap-1">
                       <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                       <span className="text-sm font-bold text-gray-700">Select All</span>
                   </div>
                   {/* Optional Sort/View Toggle could go here */}
              </div>

               {/* Menu Items List */}
               <div className="p-4 bg-gray-50/50 min-h-[500px]">
                  <div className="space-y-3">
                     {filteredItems.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
                          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No menu items found matching your criteria.</p>
                        </div>
                     ) : (
                        filteredItems.map((item) => (
                           <div key={item._id} className="bg-white rounded-lg border border-gray-200 p-3 hover:border-[var(--color-primary)]/50 hover:shadow-sm transition-all duration-200 group relative">
                              <div className="flex items-start gap-3">
                                  <div className="pt-1">
                                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      {/* Top Row: Name, Badges, Main Action */}
                                      <div className="flex items-center justify-between gap-3 mb-2">
                                          <div className="flex items-center gap-2.5 flex-wrap">
                                            <h3 className="text-base font-semibold text-gray-900 tracking-tight">{item.name}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.available ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
                                              {item.available ? 'Available' : 'Unavailable'}
                                            </span>
                                          </div>
                                          
                                          <div className="flex items-center gap-2 shrink-0">
                                              <button 
                                                onClick={() => setSelectedItem(item)}
                                                className="bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-xs font-medium py-2 px-4 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
                                              >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                View
                                              </button>
                                          </div>
                                      </div>

                                      {/* Details Grid */}
                                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-1 gap-x-8 pt-2 mt-1 border-t border-gray-50/50">
                                          <div>
                                             <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price</span>
                                             <span className="text-xs font-medium text-gray-700 truncate block">₹{item.price}</span>
                                          </div>
                                          <div>
                                             <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Category</span>
                                             <span className="text-xs font-medium text-gray-700 truncate block">{item.category}</span>
                                          </div>
                                          <div>
                                             <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Last Updated</span>
                                             <span className="text-xs font-medium text-gray-700">{new Date(item.updated_at || item.createdAt).toLocaleDateString()}</span>
                                          </div>
                                          <div>
                                             <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Status</span>
                                             <span className="text-xs font-medium text-gray-700">{item.available ? '✓ In Stock' : '✗ Out of Stock'}</span>
                                          </div>
                                      </div>

                                      {/* Secondary Actions Bar */}
                                      <div className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={() => handleToggleAvailability(item._id, item.available)} 
                                            className={`text-xs font-semibold px-3 py-1 rounded transition-all ${
                                              item.available 
                                                ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50' 
                                                : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                                            }`}
                                          >
                                            {item.available ? 'Mark Unavailable' : 'Mark Available'}
                                          </button>
                                          <button onClick={() => handleEdit(item)} className="text-xs text-blue-600 hover:text-blue-800 font-semibold px-2 py-0.5 hover:bg-blue-50 rounded">Edit</button>
                                          <button onClick={() => handleDelete(item._id)} className="text-xs text-gray-400 hover:text-red-600 font-semibold px-2 py-0.5 hover:bg-red-50 rounded flex items-center gap-1">
                                            Delete
                                          </button>
                                      </div>
                                  </div>
                              </div>
                           </div>
                        ))
                     )}
                  </div>
               </div>
          </div>
        )}

        {/* Menu Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedItem.name}</h2>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg transition-colors"
                  >
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="space-y-6">
                  <div className="flex flex-wrap gap-3 items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-bold border ${selectedItem.available ? 'bg-green-50 text-green-600 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {selectedItem.available ? 'Available' : 'Unavailable'}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                       {selectedItem.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-lg font-bold bg-[var(--color-secondary)] text-[var(--color-primary)] border border-[var(--color-primary)]">
                       ₹{selectedItem.price}
                    </span>
                  </div>

                  {selectedItem.imageUrl && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <img src={selectedItem.imageUrl} alt={selectedItem.name} className="w-full h-64 object-cover rounded-lg" />
                    </div>
                  )}

                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-2">Description</h3>
                    <p className="text-gray-800 text-lg">{selectedItem.description}</p>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-6 border-t border-gray-100 text-sm text-gray-500">
                      <span>Category: <span className="font-semibold text-gray-900">{selectedItem.category}</span></span>
                      <span>•</span>
                      <span>Item ID: <span className="font-mono">{selectedItem._id}</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

/**
 * Main Page Component wrapped in Suspense
 */
const MenuManagement = () => {
  return (
    <AdminLayout>
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]"></div>
        </div>
      }>
        <ArticlesContent />
      </React.Suspense>
    </AdminLayout>
  );
};

export default MenuManagement;
