import React, { useState, useEffect } from 'react';
import styles from './StudentDetailsModal.styles';

export default function StudentDetailsModal({ student, onClose }) {
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

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
    if (!student) return;
    
    const fetchAttendance = async () => {
      try {
        const res = await fetch(`/api/attendance/student/${student.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setAttendanceData(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAttendance();
  }, [student, token]);

  if (!student) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h3 style={styles.title}>Student Details</h3>
          <button style={styles.closeBtn} onClick={onClose} onMouseEnter={e => e.target.style.color = 'white'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.5)'}>
            ✕
          </button>
        </div>
        
        <div style={styles.content}>
          <div style={styles.profileSection}>
            <div style={styles.avatar}>{student.name.charAt(0).toUpperCase()}</div>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Name</span>
                <span style={styles.infoValue}>{student.name}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Roll No</span>
                <span style={styles.infoValue}>{student.roll_no}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Level</span>
                <span style={styles.infoValue}>{student.level}</span>
              </div>
              <div style={styles.infoItem}>
                <span style={styles.infoLabel}>Contact</span>
                <span style={styles.infoValue}>{student.phone || 'N/A'}</span>
              </div>
            </div>
          </div>
          
          <div style={styles.trackerSection}>
            <h4 style={styles.trackerTitle}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
              Attendance Tracker
            </h4>
            
            {loading ? (
              <div style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center', padding: '20px' }}>Loading history...</div>
            ) : (
              <div style={styles.trackerGrid}>
                {shivirDates.map(d => {
                  const status = attendanceData[d.dateStr];
                  let dotColor = 'rgba(255,255,255,0.2)'; // Grey (Unmarked)
                  if (status === 'Present') dotColor = '#10b981'; // Green
                  else if (status === 'Absent') dotColor = '#f43f5e'; // Red
                  
                  return (
                    <div key={d.dateStr} style={styles.dateCard}>
                      <span style={styles.dateLabel}>{d.display}</span>
                      <div style={{ ...styles.statusDot, backgroundColor: dotColor, color: dotColor }}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
