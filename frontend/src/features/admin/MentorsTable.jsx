import React, { useState, useEffect } from 'react';
import styles from './MentorsTable.styles';

export default function MentorsTable() {
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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterRole, currentPage, limit]);

  const fetchUsers = async () => {
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
    } catch (err) {
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
      level: user.level || '',
      new_password: ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchUsers();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleDelete = async (id) => {
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
    } catch (err) {
      alert('Error deleting user');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Mentors & Teachers Management</h2>
        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={() => {
            document.dispatchEvent(new CustomEvent('openCreateUserModal'));
          }}>+ Create User</button>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by Name, Login ID, Phone..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterSelects}>
          <select 
            style={styles.filterSelect} 
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

      <div style={styles.tableWrapper} className="overflow-x-auto w-full">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Login ID</th>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Phone</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={styles.empty}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="5" style={styles.empty}>No users found</td></tr>
            ) : (
              users.map(u => (
                <tr key={u.id} style={styles.tr}>
                  <td style={styles.td}>{u.login_id}</td>
                  <td style={styles.td}>{u.name}</td>
                  <td style={styles.td}>
                    <span style={u.role === 'teacher' ? styles.badgeTeacher : styles.badgeMentor}>
                      {u.role.toUpperCase()} {u.role === 'teacher' && u.level ? `(${u.level})` : ''}
                    </span>
                  </td>
                  <td style={styles.td}>{u.phone}</td>
                  <td style={styles.td}>
                    <div style={styles.actionBtns}>
                      <button style={styles.btnIcon} onClick={() => openEditModal(u)}>✏️</button>
                      <button style={styles.btnIconDelete} onClick={() => handleDelete(u.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div style={styles.paginationBar}>
          <div style={styles.paginationInfo}>
            Showing {users.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
          </div>
          <div style={styles.paginationControls}>
            <div style={styles.rowsPerPage}>
              Rows per page:
              <select 
                value={limit} 
                onChange={(e) => { setLimit(Number(e.target.value)); setCurrentPage(1); }}
                style={styles.limitSelect}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            <div style={styles.pageButtons}>
              <button 
                style={currentPage === 1 ? styles.pageBtnDisabled : styles.pageBtn} 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &lt;
              </button>
              <span style={styles.pageInfo}>Page {currentPage} of {totalPages || 1}</span>
              <button 
                style={currentPage === totalPages || totalPages === 0 ? styles.pageBtnDisabled : styles.pageBtn} 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
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
                  <label style={styles.label}>Assigned Level</label>
                  <select style={styles.input} name="level" value={formData.level || ''} onChange={handleInputChange}>
                    <option value="">Select Level</option>
                    <option value="Level 1">Level 1</option>
                    <option value="Level 2">Level 2</option>
                    <option value="Level 3">Level 3</option>
                    <option value="Level 4">Level 4</option>
                    <option value="Level 5">Level 5</option>
                    <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
                  </select>
                </div>
              )}
              
              <div style={{...styles.formGroup, gridColumn: '1 / -1'}}>
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
