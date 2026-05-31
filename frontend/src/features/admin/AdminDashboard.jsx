import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateUserModal from './CreateUserModal';
import StudentsTable from '../shared/StudentsTable';
import MentorsTable from './MentorsTable';
import Analytics from './Analytics';
import ActivityLogs from './ActivityLogs';
import AttendanceReport from '../shared/AttendanceReport';
import useIsMobile from '../../hooks/useIsMobile';
import styles from './AdminDashboard.styles';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('analytics');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Mobile Nav Scroll State
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = (e) => {
    const currentScrollY = e.target.scrollTop;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setIsNavVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
    }
    setLastScrollY(currentScrollY);
  };

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

  const navTabs = [
    { key: 'analytics', icon: '📊', label: 'Analytics' },
    { key: 'students', icon: '🎓', label: 'Students' },
    { key: 'mentors', icon: '👨‍🏫', label: 'Mentors' },
    { key: 'logs', icon: '🕒', label: 'Logs' },
    { key: 'report', icon: '📜', label: 'Report' }
  ];

  const pageTitles = {
    analytics: 'Dashboard Overview',
    students: 'Students Directory',
    mentors: 'Teachers & Mentors',
    logs: 'System Activity Logs',
    report: 'Attendance Report & History'
  };

  const renderContent = () => (
    <>
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'students' && <StudentsTable />}
      {activeTab === 'mentors' && <MentorsTable />}
      {activeTab === 'logs' && <ActivityLogs />}
      {activeTab === 'report' && <AttendanceReport />}
    </>
  );

  if (isMobile) {
    return (
      <div style={styles.page}>
        <div style={styles.orb1}></div>
        <div style={styles.orb2}></div>

        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative', zIndex: 10 }}>
          {/* Mobile Top Bar */}
          <div style={styles.mobileTopBar} className="glass-bar">
            <div style={styles.mobileTopBarLeft}>
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                <defs>
                  <linearGradient id="navLogoGradM" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <rect width="28" height="28" rx="8" fill="url(#navLogoGradM)" />
                <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">S</text>
              </svg>
              <h2 style={styles.mobileTopBarTitle}>Shivir 2026</h2>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#818cf8', textTransform: 'uppercase', background: 'rgba(99,102,241,0.12)', padding: '3px 8px', borderRadius: '8px' }}>Admin</span>
            </div>
            <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
              Logout
            </button>
          </div>

          {/* Mobile Content */}
          <div style={styles.mobileContentArea} className="mobile-scroll" onScroll={handleScroll}>
            <header style={styles.mobileMainHeader}>
              <h1 style={styles.mobilePageTitle}>{pageTitles[activeTab]}</h1>
            </header>
            <div key={activeTab} className="tab-content-fade">
              {renderContent()}
            </div>
          </div>

          {/* Bottom Nav */}
          <nav style={{
            ...styles.bottomNav,
            transform: isNavVisible ? 'translateY(0)' : 'translateY(150%)',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            {navTabs.map(tab => (
              <button
                key={tab.key}
                className={`bottom-nav-item${activeTab === tab.key ? ' active' : ''}`}
                style={activeTab === tab.key ? styles.bottomNavItemActive : styles.bottomNavItem}
                onClick={() => setActiveTab(tab.key)}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {toast.message && (
          <div className="toast-animate" style={{
            ...(toast.type === 'error' ? styles.toastError : styles.toastSuccess),
            ...(isMobile ? { bottom: '72px', right: '16px', left: '16px', padding: '10px 16px', fontSize: '13px', borderRadius: '12px', gap: '8px' } : {})
          }}>
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
            {navTabs.map(tab => (
              <button
                key={tab.key}
                className={activeTab !== tab.key ? 'nav-item-hover' : ''}
                style={activeTab === tab.key ? styles.navItemActive : styles.navItem}
                onClick={() => setActiveTab(tab.key)}
              >
                <span style={{ fontSize: '18px' }}>{tab.icon}</span> {tab.label}
              </button>
            ))}
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
            <h1 style={styles.pageTitle}>{pageTitles[activeTab]}</h1>
          </header>

          <div style={styles.contentArea}>
            {renderContent()}
          </div>
        </main>
      </div>

      {toast.message && (
        <div className="toast-animate" style={toast.type === 'error' ? styles.toastError : styles.toastSuccess}>
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
