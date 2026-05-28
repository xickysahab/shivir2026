import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TeacherOverview.styles';

export default function TeacherOverview() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  const token = localStorage.getItem('token');
  const level = localStorage.getItem('userLevel') || 'Your Class';

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students/?all=true', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setStudents(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [token]);

  if (loading) return <div style={{color: 'rgba(255,255,255,0.6)', padding: '20px', fontFamily: 'Inter'}}>Loading metrics...</div>;

  const total = students.length;
  const males = students.filter(s => s.gender === 'Male').length;
  const females = students.filter(s => s.gender === 'Female').length;
  const totalPoints = students.reduce((sum, s) => sum + s.points, 0);
  const avgPoints = total > 0 ? Math.round(totalPoints / total) : 0;
  
  const genderData = [
    { name: 'Male', value: males, color: '#60a5fa' },
    { name: 'Female', value: females, color: '#f472b6' }
  ];

  // Top performers
  const sorted = [...students].sort((a, b) => b.points - a.points);
  const topPerformers = sorted.slice(0, 5); // Top 5
  const maxPoints = topPerformers.length > 0 ? topPerformers[0].points : 1;

  const formattedDate = time.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div style={styles.headerBanner}>
        <div>
          <h2 style={styles.bannerTitle}>Class Performance Overview</h2>
          <p style={styles.bannerSubtitle}>Real-time metrics and analytics for your assigned level.</p>
        </div>
        <div style={styles.timeBadge}>
          <span style={styles.dateText}>{formattedDate}</span>
          <span style={styles.timeDivider}>•</span>
          <span style={styles.timeText}>{formattedTime}</span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Total Students</span>
            <div style={styles.kpiIconWrapper}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg></div>
          </div>
          <div style={styles.kpiValue}>{total}</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Average Points</span>
            <div style={styles.kpiIconWrapper}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg></div>
          </div>
          <div style={styles.kpiValue}>{avgPoints} <span style={styles.kpiSuffix}>pts/student</span></div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Male Ratio</span>
            <div style={styles.kpiIconWrapper}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
          </div>
          <div style={styles.kpiValue}>{total > 0 ? Math.round((males/total)*100) : 0}%</div>
        </div>
        <div style={styles.kpiCard}>
          <div style={styles.kpiHeader}>
            <span style={styles.kpiLabel}>Female Ratio</span>
            <div style={styles.kpiIconWrapper}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg></div>
          </div>
          <div style={styles.kpiValue}>{total > 0 ? Math.round((females/total)*100) : 0}%</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ ...styles.mainGrid, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Left: Demographics Donut */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Gender Demographics</h3>
          </div>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={genderData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={70} 
                  outerRadius={95} 
                  paddingAngle={5}
                  stroke="none"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ background: 'rgba(20,20,30,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white', backdropFilter: 'blur(10px)' }} 
                  itemStyle={{color: 'white', fontSize: '13px'}} 
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Absolute positioned center text */}
            <div style={styles.chartCenterText}>
              <div style={styles.chartCenterLabel}>Total</div>
              <div style={styles.chartCenterValue}>{total}</div>
            </div>
          </div>
          <div style={styles.legendContainer}>
            <div style={styles.legendPill}>
              <div style={{...styles.legendColor, background: '#60a5fa'}}></div>
              <span style={styles.legendLabel}>Male</span>
              <span style={styles.legendValue}>{males}</span>
            </div>
            <div style={styles.legendPill}>
              <div style={{...styles.legendColor, background: '#f472b6'}}></div>
              <span style={styles.legendLabel}>Female</span>
              <span style={styles.legendValue}>{females}</span>
            </div>
          </div>
        </div>

        {/* Right: Leaderboard Progress Bars */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <h3 style={styles.panelTitle}>Top Performers Leaderboard</h3>
            <span style={styles.panelSubtitle}>By Points</span>
          </div>
          <div style={styles.listContainer}>
            {topPerformers.map((student, index) => {
              const widthPercentage = maxPoints > 0 ? (student.points / maxPoints) * 100 : 0;
              return (
                <div key={student.id} style={styles.listItem}>
                  <div style={{
                    ...styles.listRank,
                    color: index === 0 ? '#fbbf24' : index === 1 ? '#94a3b8' : index === 2 ? '#d97706' : 'rgba(255,255,255,0.5)',
                    background: index === 0 ? 'rgba(251, 191, 36, 0.1)' : index === 1 ? 'rgba(148, 163, 184, 0.1)' : index === 2 ? 'rgba(205, 127, 50, 0.1)' : 'rgba(255,255,255,0.05)',
                  }}>
                    {index + 1}
                  </div>
                  <div style={styles.listContent}>
                    <div style={styles.listHeader}>
                      <span style={styles.listName}>{student.name}</span>
                      <span style={styles.listPoints}>{student.points} pts</span>
                    </div>
                    <div style={styles.progressBarBg}>
                      <div style={{
                        ...styles.progressBarFill, 
                        width: `${widthPercentage}%`,
                        background: index === 0 ? 'linear-gradient(90deg, #f59e0b, #fbbf24)' : 
                                    index === 1 ? 'linear-gradient(90deg, #94a3b8, #cbd5e1)' : 
                                    index === 2 ? 'linear-gradient(90deg, #d97706, #fcd34d)' : 
                                    'linear-gradient(90deg, #6366f1, #818cf8)'
                      }}></div>
                    </div>
                  </div>
                </div>
              )
            })}
            {topPerformers.length === 0 && <div style={styles.emptyState}>No students available.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
