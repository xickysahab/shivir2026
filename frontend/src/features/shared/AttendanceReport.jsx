import React, { useState, useEffect } from 'react';
import styles from './AttendanceReport.styles';

export default function AttendanceReport() {
  const role = localStorage.getItem('userRole') || 'teacher';
  const assignedLevel = localStorage.getItem('userLevel') || '';
  const token = localStorage.getItem('token');
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLevel, setSelectedLevel] = useState(role === 'teacher' ? assignedLevel : 'All');
  
  // Data States
  const [summaryData, setSummaryData] = useState({});
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [totalStudentsInLevel, setTotalStudentsInLevel] = useState(0);
  
  // Detail State
  const [selectedDay, setSelectedDay] = useState(null); // format: YYYY-MM-DD
  const [detailData, setDetailData] = useState([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-11
  
  useEffect(() => {
    fetchSummary();
  }, [currentDate, selectedLevel]);
  
  useEffect(() => {
    if (selectedDay) {
      fetchDetail(selectedDay);
    }
  }, [selectedDay]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const yearStr = year;
      const monthStr = String(month + 1).padStart(2, '0');
      const levelParam = selectedLevel === 'All' ? '' : selectedLevel;
      const res = await fetch(`/api/attendance/summary?year=${yearStr}&month=${monthStr}&level=${encodeURIComponent(levelParam)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setSummaryData(data.data);
        setTotalStudentsInLevel(data.totalStudents);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchDetail = async (dateStr) => {
    setLoadingDetail(true);
    try {
      const levelParam = selectedLevel === 'All' ? '' : selectedLevel;
      const res = await fetch(`/api/attendance/?date=${dateStr}&level=${encodeURIComponent(levelParam)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setDetailData(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  const saveAttendance = async () => {
    setSavingAttendance(true);
    try {
      const payload = {
        date: selectedDay,
        attendance: detailData.map(s => ({ student_id: s.id, status: s.status }))
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
        // Refresh summary after saving detail
        fetchSummary();
      } else {
        showToast(data.message || 'Error saving attendance', 'error');
      }
    } catch(err) {
      showToast('Network error', 'error');
    } finally {
      setSavingAttendance(false);
    }
  };
  
  const handleStatusChange = (studentId, status) => {
    setDetailData(prev => prev.map(s => s.id === studentId ? { ...s, status } : s));
  };
  
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const generateCalendarDays = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    
    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // empty cells
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (selectedDay) {
    return (
      <div style={styles.container}>
        <div style={styles.detailsHeader}>
          <button style={styles.backButton} onClick={() => setSelectedDay(null)}>
            ← Back to Calendar
          </button>
          <h2 style={styles.detailsDate}>Attendance for {selectedDay}</h2>
        </div>
        
        {loadingDetail ? (
          <div style={{color: '#fff'}}>Loading student details...</div>
        ) : detailData.length === 0 ? (
          <div style={{color: '#fff'}}>No students found.</div>
        ) : (
          <div style={{ position: 'relative' }}>
            <div style={styles.studentGrid}>
              {detailData.map(student => (
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
                      style={student.status === 'Present' ? styles.toggleBtnPresentActive : styles.toggleBtn}
                      onClick={() => handleStatusChange(student.id, 'Present')}
                    >Present</button>
                    <button 
                      style={student.status === 'Absent' ? styles.toggleBtnAbsentActive : styles.toggleBtn}
                      onClick={() => handleStatusChange(student.id, 'Absent')}
                    >Absent</button>
                    <button 
                      style={student.status === null ? styles.toggleBtnClearActive : styles.toggleBtn}
                      onClick={() => handleStatusChange(student.id, null)}
                      title="Clear"
                    >↺</button>
                  </div>
                </div>
              ))}
            </div>
            
            <div style={styles.floatingSaveBar}>
              <button onClick={saveAttendance} disabled={savingAttendance} style={styles.saveBtn}>
                {savingAttendance ? 'Saving...' : '💾 Save Updates'}
              </button>
            </div>
          </div>
        )}
        
        {toast.message && (
          <div style={{
            position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
            padding: '12px 24px', borderRadius: '8px', zIndex: 1000, fontWeight: 'bold',
            backgroundColor: toast.type === 'error' ? '#f43f5e' : '#10b981', color: '#fff'
          }}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>
          {monthNames[month]} {year}
        </h2>
        
        <div style={styles.controls}>
          {role !== 'teacher' && (
            <select 
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Levels</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
              <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
            </select>
          )}
          
          <button style={styles.select} onClick={handlePrevMonth}>&lt; Prev</button>
          <button style={styles.select} onClick={handleNextMonth}>Next &gt;</button>
        </div>
      </div>
      
      {loadingSummary ? (
        <div style={{color: '#fff', textAlign: 'center', padding: '40px'}}>Loading calendar...</div>
      ) : (
        <div style={styles.calendarGrid}>
          {dayNames.map(day => (
            <div key={day} style={styles.dayHeader}>{day}</div>
          ))}
          
          {generateCalendarDays().map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} style={styles.dayCellEmpty} />;
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const stats = summaryData[dateStr] || { Present: 0, Absent: 0, Unmarked: totalStudentsInLevel };
            
            // Check if day is in future
            const isFuture = new Date(dateStr) > new Date();
            
            return (
              <div 
                key={dateStr} 
                style={{
                  ...styles.dayCell, 
                  opacity: isFuture ? 0.5 : 1,
                  cursor: isFuture ? 'not-allowed' : 'pointer'
                }}
                onClick={() => {
                  if (!isFuture) setSelectedDay(dateStr);
                }}
              >
                <div style={styles.dayNumber}>{day}</div>
                {!isFuture && (
                  <div style={styles.statsBox}>
                    <div style={styles.statPresent}>✅ {stats.Present} Present</div>
                    <div style={styles.statAbsent}>❌ {stats.Absent} Absent</div>
                    <div style={styles.statUnmarked}>➖ {stats.Unmarked} Unmarked</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
