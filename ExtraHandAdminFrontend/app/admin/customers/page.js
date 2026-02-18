// app/admin/customers/page.js
"use client";
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSpinner, faUserCircle, faEnvelope, faPhone, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const CustomerManagementPage = () => {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://127.0.0.1:8000/api';

    const fetchUserProfiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`${API_URL}/profiles/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user profiles');
            const data = await response.json();
            setProfiles(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserProfiles();
    }, []);

    const filteredProfiles = profiles.filter(profile =>
        (profile.user.username && profile.user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.user.email && profile.user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (profile.phone && profile.phone.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Customer Management</h1>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-500" />
                        <p className="mt-4 text-lg text-gray-600">Loading Customers...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-lg text-red-600">Error: {error}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProfiles.map(profile => (
                            <div key={profile.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center mb-4">
                                    <FontAwesomeIcon icon={faUserCircle} className="text-gray-400 text-4xl mr-4" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{profile.user.first_name} {profile.user.last_name}</h3>
                                        <p className="text-sm text-gray-500">@{profile.user.username}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 w-4 mr-3" />
                                        <a href={`mailto:${profile.user.email}`} className="text-blue-600 hover:underline">{profile.user.email}</a>
                                    </div>
                                    {profile.phone && (
                                        <div className="flex items-center">
                                            <FontAwesomeIcon icon={faPhone} className="text-gray-400 w-4 mr-3" />
                                            <span className="text-gray-700">{profile.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 w-4 mr-3" />
                                        <span className="text-gray-700">Joined: {new Date(profile.user.date_joined).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                {profile.address && (
                                     <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Address</h4>
                                        <p className="text-sm text-gray-600">{profile.address}, {profile.city}, {profile.state} - {profile.pincode}</p>
                                     </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                 {filteredProfiles.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-600">No customers found.</p>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default CustomerManagementPage;

