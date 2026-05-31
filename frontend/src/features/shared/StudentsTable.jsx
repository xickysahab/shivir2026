import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './StudentsTable.styles';
import StudentDetailsModal from './StudentDetailsModal';
import useIsMobile from '../../hooks/useIsMobile';

// Skeleton loading row component
const SkeletonRows = ({ count = 5, columns = 6 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <tr key={`skeleton-${i}`} className="skeleton-row">
        {Array.from({ length: columns }).map((_, j) => (
          <td key={j} style={styles.td}>
            <div className="skeleton-cell" style={{ width: j === 1 ? '140px' : j === 5 ? '100px' : '80px', height: '14px' }}></div>
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
        <div style={{ display: 'flex', gap: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="skeleton-cell" style={{ width: '50px', height: '12px' }}></div>
          <div className="skeleton-cell" style={{ width: '50px', height: '12px' }}></div>
          <div className="skeleton-cell" style={{ width: '50px', height: '12px' }}></div>
        </div>
      </div>
    ))}
  </>
);

export default function StudentsTable() {
  const isMobile = useIsMobile();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('All');
  const [filterGender, setFilterGender] = useState('All');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalStudents, setTotalStudents] = useState(0);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  // Duplication warning state
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [duplicateList, setDuplicateList] = useState([]);
  const [pendingUploadFile, setPendingUploadFile] = useState(null);
  const [pendingAddFormData, setPendingAddFormData] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    roll_no: '', name: '', mobile: '', father_name: '',
    gender: 'Male', age: '', address: '', pin_code: '', level: 'प्रौढ़ कक्षा', points: 0
  });

  const fileInputRef = useRef(null);

  const role = localStorage.getItem('userRole') || '';
  const token = localStorage.getItem('token') || '';
  const userLevel = localStorage.getItem('userLevel') || '';

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Close modals on Escape key
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setShowAddModal(false);
      setShowEditModal(false);
      setShowPointsModal(false);
      setShowDetailsModal(false);
      setShowDuplicateWarning(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setTimeout(() => setCurrentPage(1), 0);
  }, [searchTerm, filterLevel, filterGender]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300); // 300ms debounce for typing
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterLevel, filterGender, currentPage, limit]);

  async function fetchStudents() {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        level: filterLevel,
        gender: filterGender,
        page: currentPage,
        limit: limit
      }).toString();

      const res = await fetch(`/api/students/?${query}`, { headers });
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.total_pages);
          setTotalStudents(data.pagination.total);
        }
      } else {
        setError(data.message);
      }
    } catch (err) { console.error(err);
      setError('Failed to fetch students.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    const teacherLevels = userLevel ? userLevel.split(',').map(l => l.trim()) : [];
    setFormData({
      roll_no: '', name: '', mobile: '', father_name: '',
      gender: 'Male', age: '', address: '', pin_code: '', 
      level: role === 'teacher' ? (teacherLevels[0] || 'Level 1') : 'प्रौढ़ कक्षा', 
      points: 0
    });
    setShowAddModal(true);
  };

  const openEditModal = (student) => {
    setCurrentStudent(student);
    setFormData({ ...student });
    setShowEditModal(true);
  };

  const openPointsModal = (student) => {
    setCurrentStudent(student);
    setFormData({ points: student.points });
    setShowPointsModal(true);
  };

  const openDetailsModal = (student) => {
    setCurrentStudent(student);
    setShowDetailsModal(true);
  };

  async function handleAddSubmit(e, force = false) {
    if (e) e.preventDefault();
    try {
      const payload = { ...formData, force };
      const res = await fetch('/api/students/', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.requires_confirmation) {
        setDuplicateList(data.duplicates);
        setPendingAddFormData(formData);
        setPendingUploadFile(null);
        setShowDuplicateWarning(true);
      } else if (data.success) {
        setShowAddModal(false);
        setShowDuplicateWarning(false);
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error adding student');
    }
  };

  async function handleEditSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${currentStudent.id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error updating student');
    }
  };

  async function handlePointsSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`/api/students/${currentStudent.id}/points`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ points: parseInt(formData.points) })
      });
      const data = await res.json();
      if (data.success) {
        setShowPointsModal(false);
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error updating points');
    }
  };

  async function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (data.success) {
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error deleting student');
    }
  };

  async function handleKitToggle(student) {
    try {
      const newStatus = !student.kit_received;
      const res = await fetch(`/api/students/${student.id}/kit`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ kit_received: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, kit_received: newStatus } : s));
      } else {
        alert(data.message);
      }
    } catch (err) { console.error(err);
      alert('Error updating kit status');
    }
  };

  async function handleFileUpload(e, force = false, fileToUpload = null) {
    const file = fileToUpload || e?.target?.files?.[0];
    if (!file) return;
    
    const uploadData = new FormData();
    uploadData.append('file', file);
    if (force) uploadData.append('force', 'true');
    
    try {
      const res = await fetch('/api/students/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      });
      const data = await res.json();
      
      if (data.requires_confirmation) {
        setDuplicateList(data.duplicates);
        setPendingUploadFile(file);
        setPendingAddFormData(null);
        setShowDuplicateWarning(true);
      } else if (data.success) {
        alert(data.message || 'File uploaded successfully');
        setShowDuplicateWarning(false);
        setPendingUploadFile(null);
        fetchStudents();
      } else {
        alert(data.message || data.msg || 'Failed to upload CSV. Please make sure you are logged in properly.');
      }
    } catch (err) { console.error(err);
      alert('Error uploading file');
    }
    if (e?.target) e.target.value = '';
  };

  const confirmDuplicateAction = () => {
    if (pendingUploadFile) {
      handleFileUpload(null, true, pendingUploadFile);
    } else if (pendingAddFormData) {
      handleAddSubmit(null, true);
    }
  };
  
  const cancelDuplicateAction = () => {
    setShowDuplicateWarning(false);
    setPendingUploadFile(null);
    setPendingAddFormData(null);
  };

  async function handleExportCSV() {
    try {
      const query = new URLSearchParams({
        search: searchTerm,
        level: filterLevel,
        gender: filterGender,
        all: true // fetch all matching filtered results instead of just paginated page
      }).toString();

      const res = await fetch(`/api/students/?${query}`, { headers });
      const data = await res.json();
      
      if (data.success) {
        const studentList = data.data;
        if (studentList.length === 0) {
          alert('No students found to export.');
          return;
        }

        // Generate CSV content
        const csvHeaders = ['Roll No', 'Name', 'Mobile', 'Father Name', 'Gender', 'Age', 'Address', 'Pin Code', 'Level', 'Points', 'Kit Received'];
        
        const csvRows = studentList.map(s => {
          return [
            `"${s.roll_no || ''}"`,
            `"${s.name || ''}"`,
            `"${s.mobile || ''}"`,
            `"${s.father_name || ''}"`,
            `"${s.gender || ''}"`,
            `"${s.age || ''}"`,
            `"${s.address || ''}"`,
            `"${s.pin_code || ''}"`,
            `"${s.level || ''}"`,
            `"${s.points || 0}"`,
            `"${s.kit_received ? 'Yes' : 'No'}"`
          ].join(',');
        });

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
        
        // Create Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `shivir_students_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.message || 'Error fetching data for export.');
      }
    } catch (err) { console.error(err);
      alert('Error exporting CSV.');
      console.error(err);
    }
  };

  // Mobile card renderer
  const renderMobileCards = () => {
    if (loading) return <MobileSkeletonCards count={4} />;
    if (students.length === 0) return <div style={styles.empty}>No students found</div>;
    
    return students.map(s => (
      <div key={s.id} className="mobile-card" style={styles.mobileCard}>
        <div style={styles.mobileCardTop}>
          <div style={styles.mobileCardInfo}>
            <div style={styles.mobileCardAvatar}>{s.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={styles.mobileCardName}>{s.name}</div>
              <div style={styles.mobileCardMeta}>Roll: {s.roll_no} • {s.mobile}</div>
            </div>
          </div>
          <div style={styles.actionBtns}>
            <button className={`btn-action ${s.kit_received ? 'kit-active' : ''}`} style={s.kit_received ? styles.btnIconKitActive : styles.btnIconKitInactive} onClick={() => handleKitToggle(s)} title="Toggle Kit Status">🎒</button>
            <button className="btn-action" style={styles.btnIcon} onClick={() => openDetailsModal(s)} title="View Details">ℹ️</button>
            <button className="btn-action" style={styles.btnIcon} onClick={() => openPointsModal(s)} title="Update Points">🏆</button>
            <button className="btn-action" style={styles.btnIcon} onClick={() => openEditModal(s)} title="Edit">✏️</button>
            {role === 'admin' && (
              <button className="btn-action-delete" style={styles.btnIconDelete} onClick={() => handleDelete(s.id)}>🗑️</button>
            )}
          </div>
        </div>
        <div style={styles.mobileCardBottom}>
          <div style={styles.mobileCardStats}>
            <div style={styles.mobileCardStatItem}>
              <span style={styles.mobileCardStatLabel}>Level</span>
              <span style={styles.badge}>{s.level}</span>
            </div>
            <div style={styles.mobileCardStatItem}>
              <span style={styles.mobileCardStatLabel}>Points</span>
              <span style={{...styles.mobileCardStatValue, color: '#8b5cf6'}}>{s.points}</span>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div style={{...styles.container, ...(isMobile ? {padding: '14px', borderRadius: '12px', marginTop: '12px'} : {})}}>
      <div style={styles.header}>
        <h2 style={{...styles.title, ...(isMobile ? {fontSize: '16px'} : {})}}>Students Management</h2>
        <div style={{...styles.actions, ...(isMobile ? {gap: '6px'} : {})}}>
          <button style={{...styles.btnPrimary, ...(isMobile ? {padding: '7px 12px', fontSize: '12px', borderRadius: '8px'} : {})}} onClick={openAddModal}>+ Add</button>
          <button style={{...styles.btnSecondary, ...(isMobile ? {padding: '7px 12px', fontSize: '12px', borderRadius: '8px'} : {})}} onClick={handleExportCSV}>
            📥 Export
          </button>
          <button style={{...styles.btnSecondary, ...(isMobile ? {padding: '7px 12px', fontSize: '12px', borderRadius: '8px'} : {})}} onClick={() => fileInputRef.current.click()}>
            📤 Import
          </button>
          <input 
            type="file" 
            accept=".csv" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileUpload} 
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{ ...styles.filterBar, ...(isMobile ? { flexDirection: 'column', gap: '8px', padding: '10px', borderRadius: '10px', marginBottom: '12px' } : {}) }}>
        <div style={{ ...styles.filterGroup, ...(isMobile ? { flex: 'unset', width: '100%', borderRadius: '8px' } : {}) }}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by Name, Mobile..." 
            style={{...styles.searchInput, ...(isMobile ? {padding: '8px 8px', fontSize: '13px'} : {})}}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={{...styles.filterSelects, ...(isMobile ? {gap: '6px', width: '100%'} : {})}}>
          {role !== 'teacher' ? (
            <select 
              style={{...styles.filterSelect, ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})}} 
              value={filterLevel} 
              onChange={(e) => setFilterLevel(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
              <option value="Level 1">Level 1</option>
              <option value="Level 2">Level 2</option>
              <option value="Level 3">Level 3</option>
              <option value="Level 4">Level 4</option>
              <option value="Level 5">Level 5</option>
            </select>
          ) : (() => {
            const assignedLevels = userLevel ? userLevel.split(',').map(l => l.trim()) : [];
            return assignedLevels.length > 1 ? (
              <select 
                style={{...styles.filterSelect, ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})}}
                value={filterLevel} 
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="All">All My Levels</option>
                {assignedLevels.map(lvl => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            ) : (
              <select 
                style={{
                  ...styles.filterSelect,
                  backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', borderColor: 'transparent', appearance: 'none', WebkitAppearance: 'none',
                  ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})
                }}
                value={userLevel} 
                disabled
              >
                <option value={userLevel}>{userLevel || 'Assigned Level'}</option>
              </select>
            );
          })()}
          <select 
            style={{...styles.filterSelect, ...(isMobile ? {padding: '8px 10px', fontSize: '12px', borderRadius: '8px', flex: 1} : {})}} 
            value={filterGender} 
            onChange={(e) => setFilterGender(e.target.value)}
          >
            <option value="All">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
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
                <th style={styles.th}>Roll No</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Level</th>
                <th style={styles.th}>Points</th>
                <th style={styles.th}>Mobile</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows count={limit > 10 ? 10 : limit} columns={6} />
              ) : students.length === 0 ? (
                <tr><td colSpan="6" style={styles.empty}>No students found</td></tr>
              ) : (
                students.map(s => (
                  <tr key={s.id} style={styles.tr} className="table-row-hover">
                    <td style={styles.td}>{s.roll_no}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{s.level}</span>
                    </td>
                    <td style={styles.td}>
                      <strong style={{color: '#8b5cf6'}}>{s.points}</strong>
                    </td>
                    <td style={styles.td}>{s.mobile}</td>
                    <td style={styles.td}>
                      <div style={styles.actionBtns}>
                        <button className={`btn-action ${s.kit_received ? 'kit-active' : ''}`} style={s.kit_received ? styles.btnIconKitActive : styles.btnIconKitInactive} onClick={() => handleKitToggle(s)} title="Toggle Kit Status">🎒</button>
                        <button className="btn-action" style={styles.btnIcon} onClick={() => openDetailsModal(s)} title="View Details">ℹ️</button>
                        <button className="btn-action" style={styles.btnIcon} onClick={() => openPointsModal(s)} title="Update Points">🏆</button>
                        <button className="btn-action" style={styles.btnIcon} onClick={() => openEditModal(s)} title="Edit">✏️</button>
                        {role === 'admin' && (
                          <button className="btn-action-delete" style={styles.btnIconDelete} onClick={() => handleDelete(s.id)}>🗑️</button>
                        )}
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
      <div style={{ ...styles.paginationBar, ...(isMobile ? { flexDirection: 'column', gap: '12px', alignItems: 'stretch' } : {}) }}>
        <div style={styles.paginationInfo}>
          Showing {students.length > 0 ? ((currentPage - 1) * limit) + 1 : 0}-{Math.min(currentPage * limit, totalStudents)} of {totalStudents}
        </div>
        <div style={{ ...styles.paginationControls, ...(isMobile ? { justifyContent: 'space-between' } : {}) }}>
          <div style={styles.rowsPerPage}>
            Rows per page:
            <select 
              value={limit} 
              onChange={(e) => { setLimit(Number(e.target.value)); setTimeout(() => setCurrentPage(1), 0); }}
              style={styles.limitSelect}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={500}>All</option>
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

      {/* --- MODALS --- */}
      
      {/* Add / Edit Student Modal */}
      {(showAddModal || showEditModal) && (
        <div style={styles.modalOverlay} className="modal-overlay-enter">
          <div style={styles.modal} className="modal-enter">
            <h3 style={styles.modalTitle}>{showAddModal ? 'Add New Student' : 'Edit Student'}</h3>
            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} style={styles.formGrid}>
              {showEditModal && (
                <div style={styles.formGroup}>
                  <label style={styles.label}>Roll No</label>
                  <input style={styles.input} name="roll_no" value={formData.roll_no} disabled />
                </div>
              )}
              <div style={styles.formGroup}>
                <label style={styles.label}>Name</label>
                <input required style={styles.input} name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Mobile</label>
                <input required style={styles.input} name="mobile" value={formData.mobile} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Father's Name</label>
                <input required style={styles.input} name="father_name" value={formData.father_name} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Gender</label>
                <select style={styles.input} name="gender" value={formData.gender} onChange={handleInputChange}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Age</label>
                <input required type="number" style={styles.input} name="age" value={formData.age} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Address</label>
                <input required style={styles.input} name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Pin Code</label>
                <input required style={styles.input} name="pin_code" value={formData.pin_code} onChange={handleInputChange} />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Level</label>
                {(() => {
                  const teacherLevels = userLevel ? userLevel.split(',').map(l => l.trim()) : [];
                  const isMultiLevel = role === 'teacher' && teacherLevels.length > 1;
                  const isSingleLevel = role === 'teacher' && teacherLevels.length <= 1;
                  return (
                    <select 
                      style={{
                        ...styles.input,
                        ...(isSingleLevel ? { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', borderColor: 'transparent', appearance: 'none', WebkitAppearance: 'none' } : {})
                      }}
                      name="level" 
                      value={formData.level} 
                      onChange={handleInputChange}
                      disabled={isSingleLevel}
                    >
                      {isMultiLevel ? (
                        teacherLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)
                      ) : (
                        <><option>प्रौढ़ कक्षा</option><option>Level 1</option><option>Level 2</option><option>Level 3</option><option>Level 4</option><option>Level 5</option></>
                      )}
                    </select>
                  );
                })()}
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnCancel} onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</button>
                <button type="submit" style={styles.btnSave}>Save Student</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Points Modal */}
      {showPointsModal && (
        <div style={styles.modalOverlay} className="modal-overlay-enter">
          <div style={styles.modalSmall} className="modal-enter">
            <h3 style={styles.modalTitle}>Update Points for {currentStudent?.name}</h3>
            <form onSubmit={handlePointsSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Points</label>
                <input required type="number" style={styles.input} name="points" value={formData.points} onChange={handleInputChange} />
              </div>
              <div style={styles.modalActions}>
                <button type="button" style={styles.btnCancel} onClick={() => setShowPointsModal(false)}>Cancel</button>
                <button type="submit" style={styles.btnSave}>Update Points</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showDetailsModal && currentStudent && (
        <StudentDetailsModal 
          student={currentStudent} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}

      {/* Duplicate Warning Modal */}
      {showDuplicateWarning && (
        <div style={{...styles.modalOverlay, zIndex: 1100}} className="modal-overlay-enter">
          <div style={{...styles.modal, maxWidth: '500px'}} className="modal-enter">
            <h3 style={{...styles.modalTitle, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <span>⚠️</span> Duplicate Students Found
            </h3>
            <p style={{color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5'}}>
              The following students already exist in the database (matching both Name and Mobile Number). Do you want to add them anyway?
            </p>
            
            <div style={{
              background: 'rgba(0,0,0,0.2)', 
              borderRadius: '8px', 
              padding: '12px', 
              maxHeight: '200px', 
              overflowY: 'auto',
              marginBottom: '20px',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              {duplicateList.map((dup, idx) => (
                <div key={idx} style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  padding: '8px 0',
                  borderBottom: idx < duplicateList.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                }}>
                  <strong style={{color: '#fff'}}>{dup.name}</strong>
                  <span style={{color: 'rgba(255,255,255,0.5)'}}>{dup.mobile}</span>
                </div>
              ))}
            </div>

            <div style={styles.modalActions}>
              <button type="button" style={{...styles.btnCancel, flex: 1}} onClick={cancelDuplicateAction}>
                Cancel
              </button>
              <button type="button" style={{...styles.btnSave, background: '#f59e0b', color: '#000', flex: 1}} onClick={confirmDuplicateAction}>
                Yes, Save Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
