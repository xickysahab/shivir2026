import React, { useState, useEffect } from 'react';
import styles from './ActivityLogs.styles';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterAction]);

  const fetchLogs = async () => {
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        action: filterAction
      }).toString();
      
      const res = await fetch(`/api/logs/?${query}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch activity logs.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!window.confirm('Are you sure you want to delete ALL activity logs? This cannot be undone.')) return;
    try {
      const res = await fetch('/api/logs/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        fetchLogs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error clearing logs');
    }
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  };

  const getActionColor = (actionType) => {
    if (actionType.includes('ADD') || actionType.includes('CREATE')) return '#34d399';
    if (actionType.includes('DELETE')) return '#f87171';
    if (actionType.includes('UPDATE')) return '#60a5fa';
    return '#a78bfa';
  };

  if (loading) return <div style={styles.loading}>Loading activity logs...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>System Activity Logs</h2>
        <div style={{display: 'flex', gap: '10px'}}>
          <button style={styles.btnDanger} onClick={handleClearLogs}>
            <span style={{ fontSize: '14px' }}>🗑️</span> Clear Logs
          </button>
          <button style={styles.btnRefresh} onClick={fetchLogs}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="23 4 23 10 17 10"></polyline>
              <polyline points="1 20 1 14 7 14"></polyline>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by User Name or Action Details..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterSelects}>
          <select 
            style={styles.filterSelect} 
            value={filterAction} 
            onChange={(e) => setFilterAction(e.target.value)}
          >
            <option value="All">All Actions</option>
            <option value="ADD_STUDENT">Add Student</option>
            <option value="UPDATE_STUDENT">Update Student</option>
            <option value="DELETE_STUDENT">Delete Student</option>
            <option value="UPDATE_POINTS">Update Points</option>
            <option value="BULK_UPLOAD">Bulk Upload</option>
            <option value="CREATE_USER">Create User</option>
            <option value="UPDATE_USER">Update User</option>
            <option value="DELETE_USER">Delete User</option>
          </select>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.tableWrapper} className="overflow-x-auto w-full">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Description</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="4" style={styles.empty}>No activity recorded yet</td></tr>
            ) : (
              logs.map(log => (
                <tr key={log.id} style={styles.tr}>
                  <td style={styles.tdTime}>{formatDate(log.timestamp)}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={styles.userName}>{log.user_name}</span>
                      <span style={styles.userRole}>{log.role}</span>
                    </div>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge, 
                      color: getActionColor(log.action_type),
                      background: `${getActionColor(log.action_type)}20`
                    }}>
                      {log.action_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={styles.tdDesc}>{log.details}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
