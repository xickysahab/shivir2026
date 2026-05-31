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
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('userRole') || 'admin';

  // Mobile Nav Scroll State
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Attendance State
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('All');
  
  // Date logic
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - (offset*60*1000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localToday);

  // Search & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('roll_no');
  const [sortOrder, setSortOrder] = useState('asc');

  // Stats
  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(s => s.status === 'Present').length;
  const absentCount = attendanceData.filter(s => s.status === 'Absent').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

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

  useEffect(() => {
    if (activeTab === 'attendance') {
      const delayDebounceFn = setTimeout(() => {
        fetchAttendance();
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [activeTab, selectedDate, selectedLevel, searchQuery, sortBy, sortOrder]);

  async function fetchAttendance() {
    setLoadingAttendance(true);
    try {
      const res = await fetch(`/api/attendance/?date=${selectedDate}&level=${encodeURIComponent(selectedLevel)}&search=${encodeURIComponent(searchQuery)}&sort_by=${sortBy}&sort_order=${sortOrder}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceData(data.data);
      } else {
        showToast(data.message || 'Error fetching attendance', 'error');
      }
    } catch (err) { console.error(err);
      showToast('Network error', 'error');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleToggleKit = async (studentId, currentStatus) => {
    try {
      const res = await fetch(`/api/students/${studentId}/kit`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ kit_received: !currentStatus })
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceData(prev => prev.map(s => s.id === studentId ? { ...s, kit_received: !currentStatus } : s));
        showToast(data.message || 'Kit status updated!', 'success');
      } else {
        showToast(data.message || 'Failed to update kit', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Network error', 'error');
    }
  };

  async function saveAttendance() {
    setSavingAttendance(true);
    try {
      const payload = {
        date: selectedDate,
        attendance: attendanceData.map(s => ({ student_id: s.id, status: s.status }))
      };
      
      const res = await fetch('/api/attendance/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message || 'Attendance Saved Successfully! 🎉', 'success');
        fetchAttendance();
      } else {
        showToast(data.message || 'Error saving attendance', 'error');
      }
    } catch (err) { console.error(err);
      showToast('Network error', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

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
    { key: 'attendance', icon: '📅', label: 'Attendance' },
    { key: 'logs', icon: '🕒', label: 'Logs' },
    { key: 'report', icon: '📜', label: 'Report' }
  ];

  const pageTitles = {
    analytics: 'Dashboard Overview',
    students: 'Students Directory',
    mentors: 'Teachers & Mentors',
    attendance: 'Mark Attendance',
    logs: 'System Activity Logs',
    report: 'Attendance Report & History'
  };

  const renderAttendanceContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={isMobile ? styles.mobileControlPanel : styles.controlPanel}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%', alignItems: 'flex-start' }}>
          <div style={{ flex: '1 1 200px' }}>
            <input 
              type="text" 
              placeholder="🔍 Search students by name or roll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.modernInput}
            />
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} style={styles.modernInput}>
              <option value="All">All Levels</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
              <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
            </select>
          </div>
          <div style={{ flex: '1 1 120px' }}>
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={styles.modernInput} max={role !== 'admin' ? localToday : undefined} disabled={role !== 'admin'} />
            {role !== 'admin' && <div style={{fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '6px', textAlign: 'center'}}>Locked to today</div>}
          </div>
          <div style={{ flex: '1 1 140px' }}>
            <select 
              value={`${sortBy}-${sortOrder}`} 
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              style={styles.modernInput}
            >
              <option value="roll_no-asc">Sort: Roll No (Asc)</option>
              <option value="roll_no-desc">Sort: Roll No (Desc)</option>
              <option value="name-asc">Sort: Name (A-Z)</option>
              <option value="name-desc">Sort: Name (Z-A)</option>
              <option value="status-asc">Sort: Status First</option>
            </select>
          </div>
        </div>

        <div style={isMobile ? styles.mobileStatsRow : styles.statsRow}>
          <div style={{...styles.statCard, ...(isMobile ? {padding: '8px 4px', minWidth: 0, borderRadius: '8px'} : {})}}><div style={{...styles.statValue, ...(isMobile ? {fontSize: '16px'} : {})}}>{totalStudents}</div><div style={{...styles.statLabel, ...(isMobile ? {fontSize: '10px', letterSpacing: 0} : {})}}>Total</div></div>
          <div style={{...styles.statCard, borderColor: 'rgba(16, 185, 129, 0.2)', ...(isMobile ? {padding: '8px 4px', minWidth: 0, borderRadius: '8px'} : {})}}><div style={{...styles.statValue, color: '#10b981', ...(isMobile ? {fontSize: '16px'} : {})}}>{presentCount}</div><div style={{...styles.statLabel, ...(isMobile ? {fontSize: '10px', letterSpacing: 0} : {})}}>Present</div></div>
          <div style={{...styles.statCard, borderColor: 'rgba(244, 63, 94, 0.2)', ...(isMobile ? {padding: '8px 4px', minWidth: 0, borderRadius: '8px'} : {})}}><div style={{...styles.statValue, color: '#f43f5e', ...(isMobile ? {fontSize: '16px'} : {})}}>{absentCount}</div><div style={{...styles.statLabel, ...(isMobile ? {fontSize: '10px', letterSpacing: 0} : {})}}>Absent</div></div>
          <div style={{...styles.statCard, ...(isMobile ? {padding: '8px 4px', minWidth: 0, borderRadius: '8px'} : {})}}><div style={{...styles.statValue, ...(isMobile ? {fontSize: '16px'} : {})}}>{attendanceRate}%</div><div style={{...styles.statLabel, ...(isMobile ? {fontSize: '10px', letterSpacing: 0} : {})}}>Rate</div></div>
        </div>
      </div>

      <div style={styles.studentGrid}>
        {loadingAttendance ? (
          <div style={{color: 'white', padding: '20px'}}>Loading...</div>
        ) : attendanceData.length === 0 ? (
          <div style={{color: 'white', padding: '20px'}}>No students found for this level.</div>
        ) : (
          attendanceData.map(student => (
            <div key={student.id} style={isMobile ? styles.mobileStudentRow : styles.studentRow}>
              <div style={{...styles.studentInfo, ...(isMobile ? {gap: '10px'} : {})}}>
                <div style={{...styles.studentAvatar, ...(isMobile ? {width: '32px', height: '32px', fontSize: '13px'} : {})}}>{student.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div style={{...styles.studentName, ...(isMobile ? {fontSize: '13px', marginBottom: '2px'} : {})}}>{student.name} <span style={{fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal'}}> (S/o {student.father_name})</span></div>
                  <div style={{...styles.studentMeta, ...(isMobile ? {fontSize: '11px'} : {}), display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px'}}>
                    Roll: {student.roll_no} | {student.gender} | Age: {student.age} |
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleToggleKit(student.id, student.kit_received); }}
                      style={{
                        background: student.kit_received ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                        color: student.kit_received ? '#10b981' : '#f43f5e',
                        border: `1px solid ${student.kit_received ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        marginLeft: '4px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {student.kit_received ? '🎒 Kit Given' : '❌ No Kit'}
                    </button>
                  </div>
                </div>
              </div>
              <div style={{...styles.toggleGroup, ...(isMobile ? {gap: '4px', padding: '3px', borderRadius: '10px'} : {})}}>
                <button style={{...(student.status === 'Present' ? styles.toggleBtnPresentActive : styles.toggleBtnPresent), ...(isMobile ? {padding: '6px 10px', fontSize: '12px', borderRadius: '7px'} : {})}} onClick={() => handleStatusChange(student.id, 'Present')}>{isMobile ? 'P' : 'Present'}</button>
                <button style={{...(student.status === 'Absent' ? styles.toggleBtnAbsentActive : styles.toggleBtnAbsent), ...(isMobile ? {padding: '6px 10px', fontSize: '12px', borderRadius: '7px'} : {})}} onClick={() => handleStatusChange(student.id, 'Absent')}>{isMobile ? 'A' : 'Absent'}</button>
                <button style={{...(student.status === null ? styles.toggleBtnClearActive : styles.toggleBtnClear), ...(isMobile ? {padding: '6px 8px', borderRadius: '7px'} : {})}} onClick={() => handleStatusChange(student.id, null)} title="Clear"><span style={{ fontSize: isMobile ? '12px' : '14px' }}>↺</span></button>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ 
        ...styles.floatingSaveBar, 
        ...(isMobile ? { 
          bottom: '72px',
          right: '16px',
          left: 'auto',
          background: 'none', 
          border: 'none', 
          padding: 0,
          zIndex: 100,
        } : {}) 
      }}>
        <button onClick={saveAttendance} disabled={savingAttendance} style={{
          ...styles.saveBtn, 
          ...(isMobile ? {
            borderRadius: '50px', 
            padding: '10px 16px', 
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          } : {})
        }}>
          {savingAttendance ? 'Saving...' : '💾 Save'}
        </button>
      </div>
    </div>
  );

  const renderContent = () => (
    <>
      {activeTab === 'analytics' && <Analytics />}
      {activeTab === 'students' && <StudentsTable />}
      {activeTab === 'mentors' && <MentorsTable />}
      {activeTab === 'attendance' && renderAttendanceContent()}
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
