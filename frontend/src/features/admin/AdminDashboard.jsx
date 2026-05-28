import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUserModal from './CreateUserModal';
import StudentsTable from '../shared/StudentsTable';
import MentorsTable from './MentorsTable';
import Analytics from './Analytics';
import ActivityLogs from './ActivityLogs';
import styles from './AdminDashboard.styles';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  useEffect(() => {
    const handleOpenCreateModal = () => setShowModal(true);
    document.addEventListener('openCreateUserModal', handleOpenCreateModal);
    return () => document.removeEventListener('openCreateUserModal', handleOpenCreateModal);
  }, []);

  const handleUserCreated = (message) => {
    setShowModal(false);
    setToast({ message, type: 'success' });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      <div style={styles.layout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.logoMark}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <rect width="28" height="28" rx="8" fill="url(#navLogoGrad)" />
                <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">S</text>
              </svg>
            </div>
            <div>
              <h2 style={styles.sidebarTitle}>Shivir 2026</h2>
              <span style={styles.roleBadge}>Admin</span>
            </div>
          </div>

          <div style={styles.navMenu}>
            <button style={activeTab === 'analytics' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('analytics')}>
              <span style={{ fontSize: '18px' }}>📊</span> Analytics
            </button>
            <button style={activeTab === 'students' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('students')}>
              <span style={{ fontSize: '18px' }}>🎓</span> Students
            </button>
            <button style={activeTab === 'mentors' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('mentors')}>
              <span style={{ fontSize: '18px' }}>👨‍🏫</span> Mentors / Teachers
            </button>
            <button style={activeTab === 'logs' ? styles.navItemActive : styles.navItem} onClick={() => setActiveTab('logs')}>
              <span style={{ fontSize: '18px' }}>🕒</span> Activity Logs
            </button>
          </div>

          <div style={styles.sidebarFooter}>
            <button onClick={handleLogout} style={styles.logoutBtn}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        </aside>

        <main style={styles.mainContent}>
          <header style={styles.mainHeader}>
            <h1 style={styles.pageTitle}>
              {activeTab === 'analytics' && 'Dashboard Overview'}
              {activeTab === 'students' && 'Students Directory'}
              {activeTab === 'mentors' && 'Teachers & Mentors'}
              {activeTab === 'logs' && 'System Activity Logs'}
            </h1>
          </header>

          <div style={styles.contentArea}>
            {activeTab === 'analytics' && <Analytics />}
            {activeTab === 'students' && <StudentsTable />}
            {activeTab === 'mentors' && <MentorsTable />}
            {activeTab === 'logs' && <ActivityLogs />}
          </div>
        </main>
      </div>

      {toast.message && (
        <div style={toast.type === 'error' ? styles.toastError : styles.toastSuccess}>
          {toast.type === 'error' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
          {toast.message}
        </div>
      )}

      {showModal && (
        <CreateUserModal
          onClose={() => setShowModal(false)}
          onSuccess={handleUserCreated}
        />
      )}
    </div>
  );
}
