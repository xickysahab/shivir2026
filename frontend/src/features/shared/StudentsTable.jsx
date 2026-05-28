import React, { useState, useEffect, useRef } from 'react';
import styles from './StudentsTable.styles';
import StudentDetailsModal from './StudentDetailsModal';

export default function StudentsTable() {
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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterLevel, filterGender]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchStudents();
    }, 300); // 300ms debounce for typing
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterLevel, filterGender, currentPage, limit]);

  const fetchStudents = async () => {
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
    } catch (err) {
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
    setFormData({
      roll_no: '', name: '', mobile: '', father_name: '',
      gender: 'Male', age: '', address: '', pin_code: '', 
      level: role === 'teacher' ? (userLevel || 'Level 1') : 'प्रौढ़ कक्षा', 
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/students/', {
        method: 'POST',
        headers,
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        fetchStudents();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Error adding student');
    }
  };

  const handleEditSubmit = async (e) => {
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
    } catch (err) {
      alert('Error updating student');
    }
  };

  const handlePointsSubmit = async (e) => {
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
    } catch (err) {
      alert('Error updating points');
    }
  };

  const handleDelete = async (id) => {
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
    } catch (err) {
      alert('Error deleting student');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/students/bulk-upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message || 'File uploaded successfully');
        fetchStudents();
      } else {
        alert(data.message || data.msg || 'Failed to upload CSV. Please make sure you are logged in properly.');
      }
    } catch (err) {
      alert('Error uploading file');
    }
    e.target.value = '';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Students Management</h2>
        <div style={styles.actions}>
          <button style={styles.btnPrimary} onClick={openAddModal}>+ Add Student</button>
          <button style={styles.btnSecondary} onClick={() => fileInputRef.current.click()}>
            Upload CSV
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
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <span style={styles.filterIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Search by Name, Mobile, Father's Name..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div style={styles.filterSelects}>
          {role !== 'teacher' ? (
            <select 
              style={styles.filterSelect} 
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
          ) : (
            <select 
              style={{
                ...styles.filterSelect,
                backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', borderColor: 'transparent', appearance: 'none', WebkitAppearance: 'none'
              }}
              value={userLevel} 
              disabled
            >
              <option value={userLevel}>{userLevel || 'Assigned Level'}</option>
            </select>
          )}
          <select 
            style={styles.filterSelect} 
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

      <div style={styles.tableWrapper} className="overflow-x-auto w-full">
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
              <tr><td colSpan="6" style={styles.empty}>Loading students...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="6" style={styles.empty}>No students found</td></tr>
            ) : (
              students.map(s => (
                <tr key={s.id} style={styles.tr}>
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
                      <button style={styles.btnIcon} onClick={() => openDetailsModal(s)} title="View Details">ℹ️</button>
                      <button style={styles.btnIcon} onClick={() => openPointsModal(s)} title="Update Points">🏆</button>
                      <button style={styles.btnIcon} onClick={() => openEditModal(s)} title="Edit">✏️</button>
                      {role === 'admin' && (
                        <button style={styles.btnIconDelete} onClick={() => handleDelete(s.id)}>🗑️</button>
                      )}
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
            Showing {students.length > 0 ? ((currentPage - 1) * limit) + 1 : 0} to {Math.min(currentPage * limit, totalStudents)} of {totalStudents} students
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
      </div>

      {/* --- MODALS --- */}
      
      {/* Add / Edit Student Modal */}
      {(showAddModal || showEditModal) && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
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
                <select 
                  style={{
                    ...styles.input,
                    ...(role === 'teacher' ? { backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', borderColor: 'transparent', appearance: 'none', WebkitAppearance: 'none' } : {})
                  }}
                  name="level" 
                  value={formData.level} 
                  onChange={handleInputChange}
                  disabled={role === 'teacher'}
                >
                  <option>प्रौढ़ कक्षा</option><option>Level 1</option><option>Level 2</option><option>Level 3</option><option>Level 4</option><option>Level 5</option>
                </select>
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
        <div style={styles.modalOverlay}>
          <div style={styles.modalSmall}>
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
    </div>
  );
}
