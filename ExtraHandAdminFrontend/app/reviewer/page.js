'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const ReviewerDashboardContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [stats, setStats] = useState(null);
  const [pendingArticles, setPendingArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState({});
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
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

      const [statsRes, pendingRes, allRes, pendingCatRes, allCatRes, usersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/admin/dashboard/stats`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/articles/pending`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/articles/all`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/categories/pending`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/categories/all`, { headers }),
        fetch(`${API_BASE_URL}/api/admin/users`, { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (pendingRes.ok) setPendingArticles(await pendingRes.json());
      if (allRes.ok) setAllArticles(await allRes.json());
      if (pendingCatRes.ok) setPendingCategories(await pendingCatRes.json());
      if (allCatRes.ok) setAllCategories(await allCatRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());

      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleApprove = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: reviewNotes[articleId] || '' }),
      });

      if (response.ok) {
        alert('Article approved successfully');
        fetchDashboardData();
        setReviewNotes({});
      } else {
        alert('Failed to approve article');
      }
    } catch (error) {
      console.error('Error approving article:', error);
      alert('Error approving article');
    }
  };

  const handleReject = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      const notes = reviewNotes[articleId];
      
      if (!notes || notes.trim() === '') {
        alert('Please provide rejection notes');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: notes }),
      });

      if (response.ok) {
        alert('Article rejected');
        fetchDashboardData();
        setReviewNotes({});
      } else {
        alert('Failed to reject article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      alert('Error rejecting article');
    }
  };

  const handleRejectWithNotes = async (articleId, notes) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: notes }),
      });

      if (response.ok) {
        alert('Article rejected successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject article');
      }
    } catch (error) {
      console.error('Error rejecting article:', error);
      alert('Error rejecting article');
    }
  };

  const handlePublish = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Article published successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to publish article');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article');
    }
  };

  const handleUnpublish = async (articleId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/articles/${articleId}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Article unpublished');
        fetchDashboardData();
      } else {
        alert('Failed to unpublish article');
      }
    } catch (error) {
      console.error('Error unpublishing article:', error);
      alert('Error unpublishing article');
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to permanently delete this article?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Article deleted permanently');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete article');
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Error deleting article');
    }
  };

  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'writer' });

  // Category handlers
  const handleCategoryDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to permanently delete this category?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/task-categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Category deleted permanently');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('User deleted successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        alert('User created successfully');
        setShowUserForm(false);
        setNewUser({ name: '', email: '', password: '', role: 'writer' });
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user');
    }
  };

  const handleCategoryApprove = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: reviewNotes[categoryId] || '' }),
      });

      if (response.ok) {
        alert('Category approved successfully');
        fetchDashboardData();
        setReviewNotes({});
      } else {
        alert('Failed to approve category');
      }
    } catch (error) {
      console.error('Error approving category:', error);
      alert('Error approving category');
    }
  };

  const handleCategoryReject = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const notes = reviewNotes[categoryId];
      
      if (!notes || notes.trim() === '') {
        alert('Please provide rejection notes');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: notes }),
      });

      if (response.ok) {
        alert('Category rejected');
        fetchDashboardData();
        setReviewNotes({});
      } else {
        alert('Failed to reject category');
      }
    } catch (error) {
      console.error('Error rejecting category:', error);
      alert('Error rejecting category');
    }
  };

  const handleCategoryRejectWithNotes = async (categoryId, notes) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewNotes: notes }),
      });

      if (response.ok) {
        alert('Category rejected successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to reject category');
      }
    } catch (error) {
      console.error('Error rejecting category:', error);
      alert('Error rejecting category');
    }
  };

  const handleCategoryPublish = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}/publish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Category published successfully');
        fetchDashboardData();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to publish category');
      }
    } catch (error) {
      console.error('Error publishing category:', error);
      alert('Error publishing category');
    }
  };

  const handleCategoryUnpublish = async (categoryId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/categories/${categoryId}/unpublish`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert('Category unpublished');
        fetchDashboardData();
      } else {
        alert('Failed to unpublish category');
      }
    } catch (error) {
      console.error('Error unpublishing category:', error);
      alert('Error unpublishing category');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        alert('User role updated successfully! The user needs to log out and log back in for the changes to take effect.');
        fetchDashboardData();
      } else {
        const errorData = await response.json();
        alert(`Failed to update user role: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role');
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-700 border border-gray-200';
      case 'PENDING_APPROVAL': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'APPROVED': return 'bg-green-50 text-green-700 border border-green-200';
      case 'REJECTED': return 'bg-red-50 text-red-700 border border-red-200';
      case 'PUBLISHED': return 'bg-blue-50 text-blue-700 border border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'reviewer': return 'bg-purple-600 text-white';
      case 'writer': return 'bg-amber-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-3 font-sans">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-3 pb-4 border-b border-gray-200 bg-white rounded-lg px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm mt-0.5">Overview of your writers and content progress</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-6 py-2.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-medium border border-blue-200">
                {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Pending Articles */}
            <div className="bg-white rounded-lg border-2 border-amber-300 p-5 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Articles</span>
                {stats.articles.pending > 0 && (
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.articles.pending}</p>
            </div>

            {/* Pending Categories */}
            <div className="bg-white rounded-lg border-2 border-amber-300 p-5 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Categories</span>
                {stats.categories.pending > 0 && (
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.categories.pending}</p>
            </div>

            {/* Ready to Activate */}
            <div className="bg-white rounded-lg border-2 border-amber-300 p-5 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ready to Activate</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.articles.approved}</p>
            </div>

            {/* Total Published */}
            <div className="bg-white rounded-lg border-2 border-amber-300 p-5 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Published</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.articles.published}</p>
            </div>
          </div>
        )}

        {/* Tabs & Content Area */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {/* Tabs Header */}
          <div className="border-b border-gray-100 px-4 pt-4 bg-gray-50/50">
            <nav className="flex space-x-6 overflow-x-auto">
              {[
                { id: 'pending', label: 'Pending Articles', count: pendingArticles.length },
                { id: 'all', label: 'All Articles', count: allArticles.length },
                { id: 'pendingCategories', label: 'Pending Categories', count: pendingCategories.length },
                { id: 'allCategories', label: 'All Categories', count: allCategories.length },
                { id: 'users', label: 'Users', count: users.length },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-orange-600 border-orange-500'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      activeTab === tab.id ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-5 bg-gray-50/30">
            {/* Pending Approval Tab */}
            {activeTab === 'pending' && (
              <div className="space-y-3">
                {pendingArticles.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-400">No articles pending approval</p>
                  </div>
                ) : (
                  pendingArticles.map((article) => (
                    <div key={article._id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-lg transition-all duration-300 group">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="text-xs text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">{article.title}</h3>
                          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{article.description}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="font-medium text-gray-700">{article.createdBy?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span className="text-gray-600">{article.category}</span>
                          </div>
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 flex-shrink-0">
                          <button onClick={() => setSelectedArticle(article)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                            View
                          </button>
                          <button onClick={() => handleApprove(article._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium shadow-sm">
                            Approve
                          </button>
                          <button onClick={() => handleReject(article._id)} className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all">
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'all' && (
              <div className="space-y-3">
                {allArticles.map((article) => (
                  <div key={article._id} className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-amber-400 hover:shadow-md transition-all duration-300 group">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-amber-700 transition-colors">{article.title}</h3>
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeColor(article.status)}`}>
                            {article.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="font-medium text-gray-700">{article.category}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{article.views} views</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button onClick={() => setSelectedArticle(article)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                           View
                        </button>

                        {article.status === 'APPROVED' && (
                          <button onClick={() => handlePublish(article._id)} className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all text-sm font-medium shadow-sm">
                            Publish
                          </button>
                        )}
                        {(article.status === 'DRAFT' || article.status === 'PENDING_APPROVAL') && (
                          <button onClick={() => handleApprove(article._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium shadow-sm">
                            Approve
                          </button>
                        )}
                        {article.status === 'PUBLISHED' && (
                          <button onClick={() => handleUnpublish(article._id)} className="px-5 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all text-sm font-medium shadow-sm">
                            Unpublish
                          </button>
                        )}
                        
                        <button onClick={() => handleDelete(article._id)} className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all text-sm font-medium">
                           Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pending Categories Tab */}
            {activeTab === 'pendingCategories' && (
              <div className="space-y-4">
                {pendingCategories.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                    </div>
                    <p className="text-gray-500 font-medium">No task categories waiting for approval.</p>
                  </div>
                ) : (
                  pendingCategories.map((category) => (
                    <div key={category._id} className="group bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-lg hover:border-amber-500 transition-all duration-300">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-700 uppercase tracking-wide">
                               Pending Approval
                             </span>
                             {category.originalCategoryId && (
                                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                                  Update Request
                                </span>
                             )}
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-1">{category.name}</h3>
                          <p className="text-gray-500 text-xs mb-3 font-mono bg-gray-50 inline-block px-2 py-1 rounded border border-gray-100">/{category.slug}</p>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <span>Author: <span className="font-semibold text-gray-700">{category.createdBy?.name || 'Unknown'}</span></span>
                            <span>•</span>
                            <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                           <button onClick={() => setSelectedCategory(category)} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                            Preview
                          </button>
                          <button onClick={() => handleCategoryApprove(category._id)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 shadow-sm transition-all">
                            Approve
                          </button>
                           <button onClick={() => {
                                const notes = window.prompt('Enter rejection notes:');
                                if (notes && notes.trim()) {
                                  handleCategoryRejectWithNotes(category._id, notes.trim());
                                } else if (notes !== null) {
                                  alert('Rejection notes are required');
                                }
                              }}
                              className="px-4 py-2 bg-white border border-red-500 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-all"
                            >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'allCategories' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allCategories.map((category) => (
                  <div key={category._id} className="bg-white border-2 border-amber-400 rounded-xl p-4 shadow-lg hover:border-amber-500 hover:bg-amber-50 transition-all duration-300 flex flex-col h-full group">
                    <div className="flex justify-between items-start mb-3">
                       <span className={`px-2.5 py-1 rounded-lg text-[10px] text-blue-500  font-bold uppercase tracking-wider ${getStatusBadgeColor(category.status)}`}>
                        {category.status}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-black-300 mb-1  transition-colors">{category.name}</h3>
                    <p className="text-xs text-gray-600 font-mono mb-3   inline-block px-2 py-0.5 rounded transition-colors">/{category.slug}</p>
                    
                    <div className="mt-auto pt-3 border-t border-gray-100 flex flex-wrap gap-2 items-center justify-end">
                       {/* Unpublish Button */}
                       {category.status === 'PUBLISHED' && (
                           <button onClick={() => handleCategoryUnpublish(category._id)} className="bg-amber-500 text-white hover:bg-amber-600 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shadow-sm" title="Unpublish">
                            Unpublish
                           </button>
                       )}
                       
                       {/* Publish Button */}
                       {category.status === 'APPROVED' && (
                           <button onClick={() => handleCategoryPublish(category._id)} className="bg-amber-500 text-white hover:bg-amber-600 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shadow-sm" title="Publish">
                            Publish
                           </button>
                       )}
                       
                       {/* View Page Button */}
                       <button onClick={() => setSelectedCategory(category)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1">
                         View
                       </button>

                       {/* Delete Button */}
                       <button onClick={() => handleCategoryDelete(category._id)} className="bg-white border border-red-500 text-red-600 hover:bg-red-50 px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1" title="Delete">
                         Delete
                       </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Users Management Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">User Management</h3>
                    <p className="text-sm text-gray-500">Manage user roles and access</p>
                  </div>
                  <button 
                    onClick={() => setShowUserForm(!showUserForm)}
                    className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shadow-sm shadow-sm flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    Add User
                  </button>
                </div>

                {showUserForm && (
                  <form onSubmit={handleAddUser} className="bg-white border border-indigo-100 rounded-xl p-6 shadow-sm">
                    <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                      </span>
                      Add New User
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newUser.name}
                          onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={newUser.email}
                          onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                          type="password"
                          required
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        >
                          <option value="writer">Writer</option>
                          <option value="reviewer">Reviewer</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button 
                        type="button" 
                        onClick={() => setShowUserForm(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                )}

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-gradient-to-tr  bg-amber-500 flex items-center justify-center text-white font-bold shadow-sm">
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              className="text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-sm appearance-none cursor-pointer"
                              style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%23ffffff\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")', backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
                            >
                              <option value="writer" className="bg-white text-gray-900">Writer</option>
                              <option value="reviewer" className="bg-white text-gray-900">Reviewer</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button 
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-full transition-colors group"
                              title="Delete User"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedArticle.title}</h2>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">{selectedArticle.description}</p>
                <div dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Preview Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-xl font-bold text-gray-900">Category Preview: {selectedCategory.name}</h2>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-0">
              <iframe 
                src={`/tasks/${selectedCategory.slug}`}
                className="w-full h-[calc(90vh-80px)] border-0"
                title="Category Preview"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ReviewerDashboard = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 bg-amber-500"></div>
      </div>
    }>
      <ReviewerDashboardContent />
    </Suspense>
  );
};

export default ReviewerDashboard;
