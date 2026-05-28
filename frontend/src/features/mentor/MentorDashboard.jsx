import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentsTable from '../shared/StudentsTable';
import MentorOverview from './MentorOverview';
import styles from './MentorDashboard.styles';

export default function MentorDashboard() {
  const navigate = useNavigate();
  const name = localStorage.getItem('userName') || 'Mentor';
  const role = localStorage.getItem('userRole') || 'mentor';
  const token = localStorage.getItem('token');
  
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState({ message: '', type: '' });

  // Attendance State
  const [attendanceData, setAttendanceData] = useState([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('Level 1');
  
  // Date logic
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - (offset*60*1000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localToday);

  // Stats
  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(s => s.status === 'Present').length;
  const absentCount = attendanceData.filter(s => s.status === 'Absent').length;
  const attendanceRate = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;

  useEffect(() => {
    if (activeTab === 'attendance') {
      fetchAttendance();
    }
  }, [activeTab, selectedDate, selectedLevel]);

  const fetchAttendance = async () => {
    setLoadingAttendance(true);
    try {
      const res = await fetch(`/api/attendance/?date=${selectedDate}&level=${encodeURIComponent(selectedLevel)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setAttendanceData(data.data);
      } else {
        showToast(data.message || 'Error fetching attendance', 'error');
      }
    } catch (err) {
      showToast('Network error', 'error');
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };

  const handleMarkAll = (status) => {
    setAttendanceData(prev => prev.map(s => ({ ...s, status })));
  };

  const saveAttendance = async () => {
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
    } catch(err) {
      showToast('Network error', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
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
                  <linearGradient id="navLogoGradM" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a78bfa" />
                  </linearGradient>
                </defs>
                <rect width="28" height="28" rx="8" fill="url(#navLogoGradM)" />
                <text x="14" y="19" textAnchor="middle" fill="white" fontSize="14" fontWeight="800" fontFamily="Inter, sans-serif">S</text>
              </svg>
            </div>
            <div>
              <h2 style={styles.sidebarTitle}>Shivir 2026</h2>
              <span style={styles.roleBadge}>Mentor</span>
            </div>
          </div>

          <div style={styles.navMenu}>
            <button 
              style={activeTab === 'overview' ? styles.navItemActive : styles.navItem} 
              onClick={() => setActiveTab('overview')}
            >
              <span style={{ fontSize: '18px' }}>📊</span> Dashboard
            </button>
            <button 
              style={activeTab === 'students' ? styles.navItemActive : styles.navItem} 
              onClick={() => setActiveTab('students')}
            >
              <span style={{ fontSize: '18px' }}>🎓</span> Students
            </button>
            <button 
              style={activeTab === 'attendance' ? styles.navItemActive : styles.navItem} 
              onClick={() => setActiveTab('attendance')}
            >
              <span style={{ fontSize: '18px' }}>📅</span> Attendance
            </button>
          </div>

          <div style={styles.sidebarFooter}>
            <div style={styles.userInfo}>
              <div style={styles.userAvatar}>{name.charAt(0).toUpperCase()}</div>
              <div style={styles.userName}>{name}</div>
            </div>
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
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'students' && 'Students Directory'}
              {activeTab === 'attendance' && 'Level-wise Attendance'}
            </h1>
          </header>

          <div style={styles.contentArea}>
            {activeTab === 'overview' && (
              <MentorOverview />
            )}

            {activeTab === 'students' && (
              <div style={{ animation: 'slideUp 0.5s ease' }}>
                <StudentsTable />
              </div>
            )}

            {activeTab === 'attendance' && (
              <div style={{ animation: 'slideUp 0.5s ease', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={styles.controlPanel}>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div style={styles.datePickerWrapper}>
                      <label style={styles.controlLabel}>Select Date</label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        style={styles.dateInput}
                        max={role !== 'admin' ? localToday : undefined}
                        disabled={role !== 'admin'}
                      />
                      {role !== 'admin' && (
                        <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginTop: '4px'}}>Locked to today</span>
                      )}
                    </div>
                    
                    <div style={styles.datePickerWrapper}>
                      <label style={styles.controlLabel}>Select Level</label>
                      <select 
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        style={styles.dateInput}
                      >
                        <option value="Level 1">Level 1</option>
                        <option value="Level 2">Level 2</option>
                        <option value="Level 3">Level 3</option>
                        <option value="Level 4">Level 4</option>
                        <option value="Level 5">Level 5</option>
                        <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.statsRow}>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{totalStudents}</div>
                      <div style={styles.statLabel}>Total</div>
                    </div>
                    <div style={{...styles.statCard, borderColor: 'rgba(16, 185, 129, 0.2)'}}>
                      <div style={{...styles.statValue, color: '#10b981'}}>{presentCount}</div>
                      <div style={styles.statLabel}>Present</div>
                    </div>
                    <div style={{...styles.statCard, borderColor: 'rgba(244, 63, 94, 0.2)'}}>
                      <div style={{...styles.statValue, color: '#f43f5e'}}>{absentCount}</div>
                      <div style={styles.statLabel}>Absent</div>
                    </div>
                    <div style={styles.statCard}>
                      <div style={styles.statValue}>{attendanceRate}%</div>
                      <div style={styles.statLabel}>Rate</div>
                    </div>
                  </div>
                </div>

                <div style={styles.bulkActions}>
                  <button onClick={() => handleMarkAll('Present')} style={styles.btnBulkPresent}>
                    ✅ Mark All Present
                  </button>
                  <button onClick={() => handleMarkAll('Absent')} style={styles.btnBulkAbsent}>
                    ❌ Mark All Absent
                  </button>
                  <button onClick={() => handleMarkAll(null)} style={styles.btnBulkClear}>
                    ↺ Clear All
                  </button>
                </div>

                <div style={styles.studentGrid}>
                  {loadingAttendance ? (
                    <div style={{color: 'white', padding: '20px'}}>Loading...</div>
                  ) : attendanceData.length === 0 ? (
                    <div style={{color: 'white', padding: '20px'}}>No students found for this level.</div>
                  ) : (
                    attendanceData.map(student => (
                      <div key={student.id} style={styles.studentRow}>
                        <div style={styles.studentInfo}>
                          <div style={styles.studentAvatar}>{student.name.charAt(0).toUpperCase()}</div>
                          <div>
                            <div style={styles.studentName}>{student.name}</div>
                            <div style={styles.studentMeta}>Roll: {student.roll_no} | {student.gender}</div>
                          </div>
                        </div>
                        <div style={styles.toggleGroup}>
                          <button 
                            style={student.status === 'Present' ? styles.toggleBtnPresentActive : styles.toggleBtnPresent}
                            onClick={() => handleStatusChange(student.id, 'Present')}
                          >
                            Present
                          </button>
                          <button 
                            style={student.status === 'Absent' ? styles.toggleBtnAbsentActive : styles.toggleBtnAbsent}
                            onClick={() => handleStatusChange(student.id, 'Absent')}
                          >
                            Absent
                          </button>
                          <button 
                            style={student.status === null ? styles.toggleBtnClearActive : styles.toggleBtnClear}
                            onClick={() => handleStatusChange(student.id, null)}
                            title="Clear"
                          >
                            <span style={{ fontSize: '14px' }}>↺</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div style={styles.floatingSaveBar}>
                  <button onClick={saveAttendance} disabled={savingAttendance} style={styles.saveBtn}>
                    {savingAttendance ? 'Saving...' : '💾 Save Attendance'}
                  </button>
                </div>

              </div>
            )}
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
    </div>
  );
}
