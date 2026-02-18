'use client';

import AdminLayout from '@/components/AdminLayout';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div style={{ fontFamily: 'Inter, sans-serif', textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>⚙️</div>
        <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
          Settings
        </h1>
        <p style={{ fontSize: '16px', color: '#718096', marginBottom: '32px' }}>
          Configure system settings and preferences
        </p>
        <div style={{ 
          padding: '24px', 
          background: '#f9fafb', 
          borderRadius: '12px', 
          maxWidth: '500px', 
          margin: '0 auto',
          border: '2px dashed #d2691e'
        }}>
          <p style={{ color: '#6b7280' }}>This page is under development. Coming soon!</p>
        </div>
      </div>
    </AdminLayout>
  );
}
