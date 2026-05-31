import { useState, useEffect, useCallback } from 'react';
import styles from './MentorsTable.styles';
import useIsMobile from '../../hooks/useIsMobile';

// Skeleton loading row component
const SkeletonRows = ({ count = 5 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <tr key={`skeleton-${i}`} className="skeleton-row">
        {Array.from({ length: 6 }).map((_, j) => (
          <td key={j} style={styles.td}>
            <div className="skeleton-cell" style={{ width: j === 1 ? '140px' : '80px', height: '14px' }}></div>
          </td>
        ))}
      </tr>
    ))}
  </>
);

// Mobile skeleton card
const MobileSkeletonCards = ({ count = 4 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={`mskel-${i}`} style={styles.mobileCard}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="skeleton-cell" style={{ width: '60%', height: '14px' }}></div>
            <div className="skeleton-cell" style={{ width: '40%', height: '10px' }}></div>
          </div>
        </div>
      </div>
    ))}
  </>
);

export default function MentorsTable() {
  const isMobile = useIsMobile();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Modals state
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '', phone: '', role: 'teacher', new_password: ''
  });

  const token = localStorage.getItem('token') || '';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Close modals on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowEditModal(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchTerm, filterRole]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterRole, currentPage, limit]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        role: filterRole,
        page: currentPage,
        limit: limit
      }).toString();
      const res = await fetch(`/api/users/?${query}`, { headers });
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setTotalUsers(data.pagination.total);
        }
      } else {
        setError(data.message);
      }
    } catch (err) { console.error(err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openEditModal = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      role: user.role,
      level: user.level ? user.level.split(',') : [],
      new_password: ''
    });
    setShowEditModal(true);
  };

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        level: Array.isArray(formData.level) ? formData.level.join(',') : formData.level
      };
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error updating user');
    }
  };

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (data.success) {
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error deleting user');
    }
  };

  // Mobile card renderer
  const renderMobileCards = () => {
    if (loading) return <MobileSkeletonCards count={4} />;
    if (users.length === 0) return <div style={styles.empty}>No users found</div>;

    return users.map(u => (
      <div key={u.id} className="mobile-card" style={styles.mobileCard}>
        <div style={styles.mobileCardTop}>
          <div style={styles.mobileCardInfo}>
            <div style={styles.mobileCardAvatar}>{u.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={styles.mobileCardName}>{u.name}</div>
              <div style={styles.mobileCardMeta}>{u.login_id} • {u.phone}</div>
            </div>
          </div>
          <div style={styles.actionBtns}>
            <button className="btn-action" style={styles.btnIcon} onClick={() => openEditModal(u)}>✏️</button>
            <button className="btn-action-delete" style={styles.btnIconDelete} onClick={() => handleDelete(u.id)}>🗑️</button>
          </div>
        </div>
        <div style={styles.mobileCardBottom}>
          <span style={u.role === 'teacher' ? styles.badgeTeacher : styles.badgeMentor}>
            {u.role.toUpperCase()}
          </span>
          {u.role === 'teacher' && u.level && u.level.split(',').map((lvl, i) => (
            <span key={i} style={styles.badgeLevel}>{lvl.trim()}</span>
          ))}
        </div>
      </div>
    ));
  };

  return (
    <div style={{...styles.container, ...(isMobile ? {padding: '14px', borderRadius: '12px', marginTop: '12px'} : {})}}>
      <div style={styles.header}>
        <h2 style={{...styles.title, ...(isMobile ? {fontSize: '16px'} : {})}}>Teachers & Mentors</h2>
        <div style={styles.actions}>
          <button style={{...styles.btnPrimary, ...(isMobile ? {padding: '7px 12px', fontSize: '12px', borderRadius: '8px'} : {})}} onClick={() => {
            document.dispatchEvent(new CustomEvent('openCreateUserModal'));
          }}>+ Add</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ ...styles.filterBar, ...(isMobile ? { flexDirection: 'column', gap: '8px', padding: '10px', borderRadius: '10px', marginBottom: '12px' } : {}) }}>
        <div style={{ ...styles.filterGroup, ...(isMobile ? { flex: 'unset', width: '100%', borderRadius: '8px' } : {}) }}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search..." 
            style={{...styles.searchInput, ...(isMobile ? {padding: '8px 8px', fontSize: '13px'} : {})}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{...styles.filterSelects, ...(isMobile ? {width: '100%'} : {})}}>
          <select 
            style={{...styles.filterSelect, ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})}} 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Teacher">Teacher</option>
            <option value="Mentor">Mentor</option>
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
                <th style={styles.th}>Login ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Level</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows count={limit > 10 ? 10 : limit} />
              ) : users.length === 0 ? (
                <tr><td colSpan="6" style={styles.empty}>No users found</td></tr>
              ) : (
                users.map(u => (
                  <tr key={u.id} style={styles.tr} className="table-row-hover">
                    <td style={styles.td}>{u.login_id}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>
                      <span style={u.role === 'teacher' ? styles.badgeTeacher : styles.badgeMentor}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={styles.td}>
                      {u.role === 'teacher' && u.level ? (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {u.level.split(',').map((lvl, i) => (
                            <span key={i} style={styles.badgeLevel}>{lvl.trim()}</span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>
                      )}
                    </td>
                    <td style={styles.td}>{u.phone}</td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button className="btn-action" style={styles.btnIcon} onClick={() => openEditModal(u)}>✏️</button>
                        <button className="btn-action-delete" style={styles.btnIconDelete} onClick={() => handleDelete(u.id)}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div style={{ ...styles.paginationBar, ...(isMobile ? { flexDirection: 'column', gap: '8px', alignItems: 'stretch', padding: '10px' } : {}) }}>
        <div style={{...styles.paginationInfo, ...(isMobile ? {fontSize: '12px'} : {})}}>
          {users.length > 0 ? ((currentPage - 1) * limit) + 1 : 0}–{Math.min(currentPage * limit, totalUsers)} of {totalUsers}
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
            <span style={{...styles.pageInfo, ...(isMobile ? {fontSize: '12px'} : {})}}>{currentPage}/{totalPages || 1}</span>
            <button 
              style={{...(currentPage === totalPages || totalPages === 0 ? styles.pageBtnDisabled : styles.pageBtn), ...(isMobile ? {width: '28px', height: '28px', fontSize: '12px', borderRadius: '7px'} : {})}} 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay} className="modal-overlay-enter">
          <div style={styles.modal} className="modal-enter">
            <h3 style={styles.modalTitle}>Edit User</h3>
            <form onSubmit={handleEditSubmit} style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input required style={styles.input} name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <input required style={styles.input} name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>New Password <span style={{fontSize: '10px'}}>(Leave empty to keep current)</span></label>
                <input type="password" style={styles.input} name="new_password" value={formData.new_password} onChange={handleInputChange} placeholder="Enter new password to reset" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Role</label>
                <select style={styles.input} name="role" value={formData.role} onChange={handleInputChange}>
                  <option value="teacher">Teacher</option>
                  <option value="mentor">Mentor</option>
                </select>
              </div>
              
              {formData.role === 'teacher' && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Assigned Levels</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5', 'प्रौढ़ कक्षा'].map((lvl) => {
                      const isChecked = Array.isArray(formData.level) && formData.level.includes(lvl);
                      return (
                        <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '6px', cursor: 'pointer', border: '1px solid', borderColor: isChecked ? 'rgba(99, 102, 241, 0.5)' : 'transparent', transition: 'all 0.2s' }}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              const currentLevels = Array.isArray(formData.level) ? formData.level : [];
                              if (e.target.checked) {
                                setFormData({ ...formData, level: [...currentLevels, lvl] });
                              } else {
                                setFormData({ ...formData, level: currentLevels.filter(l => l !== lvl) });
                              }
                            }}
                            style={{ accentColor: '#6366f1' }}
                          />
                          <span style={{ color: 'white', fontSize: '13px' }}>{lvl}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
              
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnCancel} onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" style={styles.btnSave}>Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
