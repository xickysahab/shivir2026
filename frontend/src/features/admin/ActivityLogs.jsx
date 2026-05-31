import { useState, useEffect } from 'react';
import styles from './ActivityLogs.styles';
import useIsMobile from '../../hooks/useIsMobile';

// Skeleton loading
const SkeletonRows = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <tr key={`skeleton-${i}`} className="skeleton-row">
        {Array.from({ length: 4 }).map((_, j) => (
          <td key={j} style={styles.td}>
            <div className="skeleton-cell" style={{ width: j === 3 ? '180px' : j === 0 ? '100px' : '80px', height: '14px' }}></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

const MobileSkeletonCards = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={`mskel-${i}`} style={styles.mobileCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div className="skeleton-cell" style={{ width: '80px', height: '14px' }}></div>
          <div className="skeleton-cell" style={{ width: '60px', height: '10px' }}></div>
        </div>
        <div className="skeleton-cell" style={{ width: '100%', height: '12px', marginTop: '8px' }}></div>
      </div>
    ))}
  </>
);

export default function ActivityLogs() {
  const isMobile = useIsMobile();
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('All');

  // Client-side pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterAction]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchTerm, filterAction, limit]);

  async function fetchLogs() {
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
        setAllLogs(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) { console.error(err);
      setError('Failed to fetch activity logs.');
    } finally {
      setLoading(false);
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

  // Client-side pagination
  const totalLogs = allLogs.length;
  const totalPages = Math.ceil(totalLogs / limit) || 1;
  const paginatedLogs = allLogs.slice((currentPage - 1) * limit, currentPage * limit);

  // Mobile card renderer
  const renderMobileCards = () => {
    if (paginatedLogs.length === 0) {
      return <div style={styles.empty}>No activity recorded yet</div>;
    }
    return paginatedLogs.map(log => (
      <div key={log.id} className="mobile-card" style={styles.mobileCard}>
        <div style={styles.mobileCardHeader}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={styles.userName}>{log.user_name}</span>
            <span style={styles.userRole}>{log.role}</span>
          </div>
          <span style={styles.mobileCardTime}>{formatDate(log.timestamp)}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            ...styles.badge, 
            color: getActionColor(log.action_type),
            background: `${getActionColor(log.action_type)}20`
          }}>
            {log.action_type.split('_').join(' ')}
          </span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', lineHeight: '1.4' }}>
          {log.details}
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>System Activity Logs</h2>
        </div>
        {isMobile ? (
          <MobileSkeletonCards count={6} />
        ) : (
          <div style={styles.tableWrapper}>
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
                <SkeletonRows count={8} />
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{...styles.container, ...(isMobile ? {padding: '14px', borderRadius: '12px', marginTop: '12px'} : {})}}>
      <div style={{...styles.header, ...(isMobile ? {marginBottom: '12px', gap: '8px'} : {})}}>
        <h2 style={{...styles.title, ...(isMobile ? {fontSize: '16px'} : {})}}>Activity Logs</h2>
        <div style={{display: 'flex', gap: isMobile ? '6px' : '10px', flexWrap: 'wrap'}}>
          <button className="btn-action" style={{...styles.btnRefresh, ...(isMobile ? {padding: '6px 10px', fontSize: '11px', borderRadius: '8px'} : {})}} onClick={fetchLogs}>
            ↻ {isMobile ? '' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ ...styles.filterBar, ...(isMobile ? { flexDirection: 'column', gap: '8px', padding: '10px', borderRadius: '10px', marginBottom: '12px' } : {}) }}>
        <div style={{ ...styles.filterGroup, ...(isMobile ? { flex: 'unset', width: '100%', borderRadius: '8px' } : {}) }}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder={isMobile ? 'Search...' : 'Search by User Name or Action Details...'}
            style={{...styles.searchInput, ...(isMobile ? {padding: '8px 8px', fontSize: '13px'} : {})}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{...styles.filterSelects, ...(isMobile ? {width: '100%'} : {})}}>
          <select 
            style={{...styles.filterSelect, ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})}}
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

      {/* Mobile: Card layout | Desktop: Table layout */}
      {isMobile ? (
        <div style={styles.mobileCardList}>
          {renderMobileCards()}
        </div>
      ) : (
        <div style={styles.tableWrapper}>
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
              {paginatedLogs.length === 0 ? (
                <tr><td colSpan="4" style={styles.empty}>No activity recorded yet</td></tr>
              ) : (
                paginatedLogs.map(log => (
                  <tr key={log.id} style={styles.tr} className="table-row-hover">
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
                        {log.action_type.split('_').join(' ')}
                      </span>
                    </td>
                    <td style={styles.tdDesc}>{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {totalLogs > 0 && (
        <div style={{ ...styles.paginationBar, ...(isMobile ? { flexDirection: 'column', gap: '8px', alignItems: 'stretch', padding: '10px' } : {}) }}>
          <div style={{...styles.paginationInfo, ...(isMobile ? {fontSize: '12px'} : {})}}>
            {((currentPage - 1) * limit) + 1}–{Math.min(currentPage * limit, totalLogs)} of {totalLogs}
          </div>
          <div style={{ ...styles.paginationControls, ...(isMobile ? { justifyContent: 'space-between' } : {}) }}>
            <div style={{...styles.rowsPerPage, ...(isMobile ? {fontSize: '12px', gap: '4px'} : {})}}>
              Per page:
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setTimeout(() => setCurrentPage(1), 0); }}
                style={{...styles.limitSelect, ...(isMobile ? {padding: '3px 6px', fontSize: '12px'} : {})}}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div style={{...styles.pageButtons, ...(isMobile ? {gap: '8px'} : {})}}>
              <button 
                style={{...(currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn), ...(isMobile ? {width: '28px', height: '28px', fontSize: '12px', borderRadius: '7px'} : {})}}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &lt;
              </button>
              <span style={{...styles.pageInfo, ...(isMobile ? {fontSize: '12px'} : {})}}>{currentPage}/{totalPages}</span>
              <button 
                style={{...(currentPage === totalPages ? styles.pageBtnDisabled : styles.pageBtn), ...(isMobile ? {width: '28px', height: '28px', fontSize: '12px', borderRadius: '7px'} : {})}}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
