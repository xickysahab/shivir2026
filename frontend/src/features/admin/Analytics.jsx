import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import styles from './Analytics.styles';

export default function Analytics() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch('/api/students/?all=true', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
  }, []);

  if (loading) return <div style={{ color: 'white' }}>Loading analytics...</div>;

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

  const COLORS = ['#6366f1', '#a78bfa', '#06d6a0'];

  return (
    <div style={styles.container}>
      {/* Top Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Students</h3>
          <p style={styles.statValue}>{students.length}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}></div>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Levels Active</h3>
          <p style={styles.statValue}>{levelData.length}</p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #06d6a0, #34d399)' }}></div>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Avg Points</h3>
          <p style={styles.statValue}>
            {students.length > 0 
              ? Math.round(students.reduce((acc, curr) => acc + curr.points, 0) / students.length) 
              : 0}
          </p>
          <div style={{ ...styles.statAccent, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
        </div>
      </div>

      <div style={styles.chartsGrid}>
        {/* Level Distribution Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Students by Level</h3>
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={levelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2f', border: 'none', borderRadius: '8px', color: 'white' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender Distribution Chart */}
        <div style={styles.chartCard}>
          <h3 style={styles.chartTitle}>Gender Distribution</h3>
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
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e2f', border: 'none', borderRadius: '8px', color: 'white' }}
                />
                <Legend wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
