import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import styles from './Analytics.styles';
import useIsMobile from '../../hooks/useIsMobile';

// Skeleton loading component
const SkeletonLoading = () => (
  <div style={styles.container}>
    <div style={styles.statsGrid} className="stagger-children">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={styles.skeletonCard}>
          <div className="skeleton-cell" style={{ width: '80px', height: '12px' }}></div>
          <div className="skeleton-cell" style={{ width: '60px', height: '28px', marginTop: '4px' }}></div>
        </div>
      ))}
    </div>
    <div style={styles.chartsGrid}>
      {[1, 2].map(i => (
        <div key={i} style={{ ...styles.chartCard, alignItems: 'center', justifyContent: 'center' }}>
          <div className="skeleton" style={{ width: '80%', height: '80%', borderRadius: '12px' }}></div>
        </div>
      ))}
    </div>
  </div>
);

export default function Analytics() {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [studentsRes, usersRes] = await Promise.all([
          fetch('/api/students/?all=true', {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch('/api/users/?limit=500', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);
        
        const studentsData = await studentsRes.json();
        const usersData = await usersRes.json();
        
        if (studentsData.success) setStudents(studentsData.data);
        if (usersData.success) setUsers(usersData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <SkeletonLoading />;

  // Process data for charts
  const levelCounts = {};
  const genderCounts = { Male: 0, Female: 0, Other: 0 };
  
  students.forEach(s => {
    levelCounts[s.level] = (levelCounts[s.level] || 0) + 1;
    if (s.gender === 'Male' || s.gender === 'Female') {
      genderCounts[s.gender]++;
    } else {
      genderCounts['Other']++;
    }
  });

  const levelData = Object.keys(levelCounts).sort().map(level => ({
    name: level,
    students: levelCounts[level]
  }));

  const genderData = [
    { name: 'Male', value: genderCounts.Male },
    { name: 'Female', value: genderCounts.Female },
    { name: 'Other', value: genderCounts.Other }
  ].filter(item => item.value > 0);

  // Users breakdown
  const teacherCount = users.filter(u => u.role === 'teacher').length;
  const mentorCount = users.filter(u => u.role === 'mentor').length;

  const COLORS = ['#6366f1', '#a78bfa', '#06d6a0'];

  return (
    <div style={{...styles.container, ...(isMobile ? {gap: '14px'} : {})}}>
      {/* Top Stats Cards */}
      <div style={{...styles.statsGrid, ...(isMobile ? {gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px'} : {})}} className="stagger-children">
        <div style={{...styles.statCard, ...(isMobile ? {padding: '12px', borderRadius: '12px'} : {})}} className="card-hover">
          <h3 style={{...styles.statTitle, ...(isMobile ? {fontSize: '10px', margin: '0 0 4px 0'} : {})}}>Total Students</h3>
          <p style={{...styles.statValue, ...(isMobile ? {fontSize: '22px'} : {})}}>{students.length}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}></div>
        </div>
        <div style={{...styles.statCard, ...(isMobile ? {padding: '12px', borderRadius: '12px'} : {})}} className="card-hover">
          <h3 style={{...styles.statTitle, ...(isMobile ? {fontSize: '10px', margin: '0 0 4px 0'} : {})}}>Levels Active</h3>
          <p style={{...styles.statValue, ...(isMobile ? {fontSize: '22px'} : {})}}>{levelData.length}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #06d6a0, #34d399)' }}></div>
        </div>
        <div style={{...styles.statCard, ...(isMobile ? {padding: '12px', borderRadius: '12px'} : {})}} className="card-hover">
          <h3 style={{...styles.statTitle, ...(isMobile ? {fontSize: '10px', margin: '0 0 4px 0'} : {})}}>Avg Points</h3>
          <p style={{...styles.statValue, ...(isMobile ? {fontSize: '22px'} : {})}}>
            {students.length > 0 
              ? Math.round(students.reduce((acc, curr) => acc + curr.points, 0) / students.length) 
              : 0}
          </p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
        </div>
        <div style={{...styles.statCard, ...(isMobile ? {padding: '12px', borderRadius: '12px'} : {})}} className="card-hover">
          <h3 style={{...styles.statTitle, ...(isMobile ? {fontSize: '10px', margin: '0 0 4px 0'} : {})}}>Teachers</h3>
          <p style={{...styles.statValue, ...(isMobile ? {fontSize: '22px'} : {})}}>{teacherCount}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #818cf8, #6366f1)' }}></div>
        </div>
        <div style={{...styles.statCard, ...(isMobile ? {padding: '12px', borderRadius: '12px', gridColumn: 'span 2'} : {})}} className="card-hover">
          <h3 style={{...styles.statTitle, ...(isMobile ? {fontSize: '10px', margin: '0 0 4px 0'} : {})}}>Mentors</h3>
          <p style={{...styles.statValue, ...(isMobile ? {fontSize: '22px'} : {})}}>{mentorCount}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #c084fc, #a78bfa)' }}></div>
        </div>
      </div>

      <div style={{...styles.chartsGrid, ...(isMobile ? {gridTemplateColumns: '1fr', gap: '12px'} : {})}}>
        {/* Level Distribution Chart */}
        <div style={{...styles.chartCard, ...(isMobile ? {padding: '14px', borderRadius: '12px', height: '280px'} : {})}} className="card-hover fade-in-up">
          <h3 style={{...styles.chartTitle, ...(isMobile ? {fontSize: '14px', margin: '0 0 12px 0'} : {})}}>Students by Level</h3>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Bar dataKey="students" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Chart */}
        <div style={{...styles.chartCard, ...(isMobile ? {padding: '14px', borderRadius: '12px', height: '280px'} : {})}} className="card-hover fade-in-up">
          <h3 style={{...styles.chartTitle, ...(isMobile ? {fontSize: '14px', margin: '0 0 12px 0'} : {})}}>Gender Distribution</h3>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div style={styles.chartCenterText}>
              <div style={styles.chartCenterLabel}>Total</div>
              <div style={styles.chartCenterValue}>{students.length}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
