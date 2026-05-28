import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './MentorOverview.styles';

export default function MentorOverview() {
  const token = localStorage.getItem('token');
  const [attendanceData, setAttendanceData] = useState([]);
  const [studentsData, setStudentsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [leaderboardFilter, setLeaderboardFilter] = useState('All');

  // Date logic
  const today = new Date();
  const offset = today.getTimezoneOffset();
  const localToday = new Date(today.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(localToday);

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [attRes, stdRes] = await Promise.all([
        fetch(`/api/attendance/?date=${selectedDate}`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`/api/students/?all=true`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      
      const attResult = await attRes.json();
      const stdResult = await stdRes.json();

      if (attResult.success) setAttendanceData(attResult.data);
      else setError(attResult.message || 'Error fetching attendance');

      if (stdResult.success) setStudentsData(stdResult.data);
      else if (!error) setError(stdResult.message || 'Error fetching students');
      
    } catch (err) {
      setError('Network error while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  // Process Attendance Data
  const levelStats = {};
  attendanceData.forEach(student => {
    const lvl = student.level || 'Unassigned';
    if (!levelStats[lvl]) {
      levelStats[lvl] = { present: 0, absent: 0, pending: 0, total: 0 };
    }
    levelStats[lvl].total += 1;
    if (student.status === 'Present') levelStats[lvl].present += 1;
    else if (student.status === 'Absent') levelStats[lvl].absent += 1;
    else levelStats[lvl].pending += 1;
  });

  const chartData = Object.keys(levelStats).map(level => {
    return {
      level,
      stats: levelStats[level],
      data: [
        { name: 'Present', value: levelStats[level].present, color: '#10b981' },
        { name: 'Absent', value: levelStats[level].absent, color: '#f43f5e' },
        { name: 'Pending', value: levelStats[level].pending, color: '#eab308' },
      ].filter(item => item.value > 0)
    };
  });

  // Global stats
  const totalStudents = attendanceData.length;
  const globalPresent = attendanceData.filter(s => s.status === 'Present').length;
  const globalPending = attendanceData.filter(s => s.status === null || s.status === undefined).length;
  const globalRate = totalStudents > 0 ? Math.round((globalPresent / totalStudents) * 100) : 0;

  // Process Leaderboard Data
  const filteredStudents = leaderboardFilter === 'All' 
    ? studentsData 
    : studentsData.filter(s => s.level === leaderboardFilter);
    
  // Sort descending by points and take top 5
  const topStudents = [...filteredStudents]
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  return (
    <div style={styles.container}>
      {/* Top Controls & Global Stats */}
      <div style={styles.topPanel}>
        <div style={styles.datePickerWrapper}>
          <label style={styles.controlLabel}>Select Date</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{totalStudents}</div>
            <div style={styles.statLabel}>Total Students</div>
          </div>
          <div style={{...styles.statCard, borderColor: 'rgba(16, 185, 129, 0.2)'}}>
            <div style={{...styles.statValue, color: '#10b981'}}>{globalPresent}</div>
            <div style={styles.statLabel}>Total Present</div>
          </div>
          <div style={{...styles.statCard, borderColor: 'rgba(234, 179, 8, 0.2)'}}>
            <div style={{...styles.statValue, color: '#eab308'}}>{globalPending}</div>
            <div style={styles.statLabel}>Total Pending</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>{globalRate}%</div>
            <div style={styles.statLabel}>Avg Attendance</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={styles.loading}>Loading dashboard data...</div>
      ) : error ? (
        <div style={styles.error}>{error}</div>
      ) : (
        <div style={styles.mainGrid}>
          {/* Charts Area */}
          <div style={styles.chartsSection}>
            <h2 style={styles.sectionHeader}>Level-wise Attendance</h2>
            {chartData.length === 0 ? (
              <div style={styles.empty}>No attendance data found for this date.</div>
            ) : (
              <div style={styles.chartsGrid}>
                {chartData.map((item, idx) => (
                  <div key={idx} style={styles.chartCard}>
                    <h3 style={styles.chartTitle}>{item.level}</h3>
                    <div style={styles.chartMeta}>
                      Total: {item.stats.total} | 
                      <span style={{color: '#10b981', marginLeft: '6px'}}>P: {item.stats.present}</span> | 
                      <span style={{color: '#f43f5e', marginLeft: '6px'}}>A: {item.stats.absent}</span> | 
                      <span style={{color: '#eab308', marginLeft: '6px'}}>Pend: {item.stats.pending}</span>
                    </div>
                    <div style={{ width: '100%', height: 220 }}>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={item.data}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {item.data.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ background: 'rgba(20, 20, 30, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }} 
                            itemStyle={{ color: 'white' }}
                          />
                          <Legend verticalAlign="bottom" height={24} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard Area */}
          <div style={styles.leaderboardSection}>
            <div style={styles.leaderboardHeader}>
              <h2 style={styles.sectionHeader}>🏆 Top 5 Scorers</h2>
              <select 
                value={leaderboardFilter} 
                onChange={(e) => setLeaderboardFilter(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="All">All Levels</option>
                {Object.keys(levelStats).map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>
            
            <div style={styles.leaderboardList}>
              {topStudents.length === 0 ? (
                <div style={styles.empty}>No students found.</div>
              ) : (
                topStudents.map((s, idx) => (
                  <div key={s.id} style={styles.leaderboardItem}>
                    <div style={{...styles.rankBadge, background: idx === 0 ? 'rgba(234, 179, 8, 0.2)' : idx === 1 ? 'rgba(156, 163, 175, 0.2)' : idx === 2 ? 'rgba(180, 83, 9, 0.2)' : 'rgba(255,255,255,0.05)', color: idx === 0 ? '#facc15' : idx === 1 ? '#e5e7eb' : idx === 2 ? '#d97706' : 'white'}}>
                      #{idx + 1}
                    </div>
                    <div style={styles.lbStudentInfo}>
                      <div style={styles.lbName}>{s.name}</div>
                      <div style={styles.lbLevel}>{s.level}</div>
                    </div>
                    <div style={styles.lbPoints}>{s.points || 0} <span style={{fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 500}}>pts</span></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
