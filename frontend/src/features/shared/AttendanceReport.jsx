import React, { useState, useEffect } from 'react';
import styles from './AttendanceReport.styles';

export default function AttendanceReport() {
  const role = localStorage.getItem('userRole') || 'teacher';
  const assignedLevel = localStorage.getItem('userLevel') || '';
  const token = localStorage.getItem('token');
  
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

  const shivirDates = [
    { dateStr: '2026-05-31', display: '31 May' },
    { dateStr: '2026-06-01', display: '01 Jun' },
    { dateStr: '2026-06-02', display: '02 Jun' },
    { dateStr: '2026-06-03', display: '03 Jun' },
    { dateStr: '2026-06-04', display: '04 Jun' },
    { dateStr: '2026-06-05', display: '05 Jun' },
    { dateStr: '2026-06-06', display: '06 Jun' },
    { dateStr: '2026-06-07', display: '07 Jun' }
  ];
  
  useEffect(() => {
    fetchSummary();
  }, [selectedLevel]);
  
  useEffect(() => {
    if (selectedDay) {
      fetchDetail(selectedDay);
    }
  }, [selectedDay]);

  const fetchSummary = async () => {
    setLoadingSummary(true);
    try {
      const levelParam = selectedLevel === 'All' ? '' : selectedLevel;
      // Fetch both May and June to get all 8 dates
      const resMay = await fetch(`/api/attendance/summary?year=2026&month=05&level=${encodeURIComponent(levelParam)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resJun = await fetch(`/api/attendance/summary?year=2026&month=06&level=${encodeURIComponent(levelParam)}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataMay = await resMay.json();
      const dataJun = await resJun.json();
      
      if (dataMay.success && dataJun.success) {
        setSummaryData({ ...dataMay.data, ...dataJun.data });
        setTotalStudentsInLevel(dataMay.totalStudents || dataJun.totalStudents || 0);
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

  if (selectedDay) {
    return (
      <div style={styles.container}>
        <div style={styles.detailsHeader}>
          <button style={styles.backButton} onClick={() => setSelectedDay(null)}>
            ← Back to Grid
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <h2 style={styles.title}>Shivir 2026 Attendance</h2>
        </div>
        
        <div style={styles.controls}>
          <select 
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{ ...styles.select, opacity: role === 'teacher' ? 0.6 : 1 }}
            disabled={role === 'teacher'}
          >
            <option value="All">All Levels</option>
            <option value="Level 1">Level 1</option>
            <option value="Level 2">Level 2</option>
            <option value="Level 3">Level 3</option>
            <option value="Level 4">Level 4</option>
            <option value="Level 5">Level 5</option>
            <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
            {role === 'teacher' && assignedLevel && !['All', 'Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'प्रौढ़ कक्षा'].includes(assignedLevel) && (
              <option value={assignedLevel}>{assignedLevel}</option>
            )}
          </select>
        </div>
      </div>
      
      {loadingSummary ? (
        <div style={{color: '#fff', textAlign: 'center', padding: '40px'}}>Loading...</div>
      ) : (
        <div style={styles.calendarGrid}>
          {shivirDates.map(({ dateStr, display }) => {
            const stats = summaryData[dateStr] || { Present: 0, Absent: 0, Unmarked: totalStudentsInLevel };
            
            // Calculate Pie Chart percentages
            const total = stats.Present + stats.Absent + stats.Unmarked;
            const presentPct = total > 0 ? (stats.Present / total) * 100 : 0;
            const absentPct = total > 0 ? (stats.Absent / total) * 100 : 0;
            const conicGradient = `conic-gradient(
              #10b981 0% ${presentPct}%, 
              #f43f5e ${presentPct}% ${presentPct + absentPct}%, 
              rgba(255,255,255,0.2) ${presentPct + absentPct}% 100%
            )`;
            
            return (
              <div 
                key={dateStr} 
                style={styles.dayCell}
                onClick={() => setSelectedDay(dateStr)}
              >
                <div style={styles.dayNumber}>{display}</div>
                <div style={styles.pieChartContainer}>
                  <div style={{ ...styles.pieChart, background: conicGradient }}></div>
                </div>
                <div style={styles.statsLegend}>
                  <div style={styles.legendItem}>
                    <div style={styles.legendLabelBox}>
                      <div style={{ ...styles.legendColor, backgroundColor: '#10b981' }}></div>
                      <span style={styles.statPresent}>Present</span>
                    </div>
                    <span style={styles.statPresent}>{stats.Present}</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={styles.legendLabelBox}>
                      <div style={{ ...styles.legendColor, backgroundColor: '#f43f5e' }}></div>
                      <span style={styles.statAbsent}>Absent</span>
                    </div>
                    <span style={styles.statAbsent}>{stats.Absent}</span>
                  </div>
                  <div style={styles.legendItem}>
                    <div style={styles.legendLabelBox}>
                      <div style={{ ...styles.legendColor, backgroundColor: 'rgba(255,255,255,0.2)' }}></div>
                      <span style={styles.statUnmarked}>Unmarked</span>
                    </div>
                    <span style={styles.statUnmarked}>{stats.Unmarked}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
