import React, { useState } from 'react';
import styles from './CreateUserModal.styles';

export default function CreateUserModal({ onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('teacher');
  const [level, setLevel] = useState('Level 1');
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phone', phone);
      formData.append('login_id', loginId);
      formData.append('password', password);
      formData.append('role', role);
      if (role === 'teacher') {
        formData.append('level', level);
      }
      if (photo) {
        formData.append('photo', photo);
      }

      const res = await fetch('/api/users/create-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        onSuccess(data.message || 'User Created Successfully!');
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Unable to connect to server. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const inputFocus = (e) => {
    e.target.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
  };

  const inputBlur = (e) => {
    e.target.style.borderColor = 'rgba(255, 255, 255, 0.08)';
    e.target.style.boxShadow = 'none';
  };

  return (
    <div style={styles.overlay}>
      {/* Backdrop */}
      <div style={styles.backdrop} onClick={onClose}></div>

      {/* Modal */}
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Create New User</h2>
            <p style={styles.subtitle}>Fill in the details to create a teacher or mentor account.</p>
          </div>
          <button
            onClick={onClose}
            style={styles.closeBtn}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={styles.divider}></div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Full Name <span style={{ color: '#f87171' }}>*</span></label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
              onFocus={inputFocus}
              onBlur={inputBlur}
              required
            />
          </div>

          {/* Phone */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Phone Number <span style={{ color: '#f87171' }}>*</span></label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={styles.input}
              onFocus={inputFocus}
              onBlur={inputBlur}
              required
            />
          </div>

          {/* Login ID and Password — side by side */}
          <div style={styles.row}>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Login ID <span style={{ color: '#f87171' }}>*</span></label>
              <input
                type="text"
                placeholder="e.g. rahul_123"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                style={styles.input}
                onFocus={inputFocus}
                onBlur={inputBlur}
                required
              />
            </div>
            <div style={{ ...styles.fieldGroup, flex: 1 }}>
              <label style={styles.label}>Password <span style={{ color: '#f87171' }}>*</span></label>
              <input
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                onFocus={inputFocus}
                onBlur={inputBlur}
                required
              />
            </div>
          </div>

          {/* Role */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Role <span style={{ color: '#f87171' }}>*</span></label>
            <div style={styles.roleToggle}>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                style={{
                  ...styles.roleBtn,
                  ...(role === 'teacher' ? styles.roleBtnActive : {}),
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
                Teacher
              </button>
              <button
                type="button"
                onClick={() => setRole('mentor')}
                style={{
                  ...styles.roleBtn,
                  ...(role === 'mentor' ? styles.roleBtnActivePurple : {}),
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                Mentor
              </button>
            </div>
          </div>

          {/* Assigned Level (Only for Teacher) */}
          {role === 'teacher' && (
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Assigned Level <span style={{ color: '#f87171' }}>*</span></label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={styles.select}
                onFocus={inputFocus}
                onBlur={inputBlur}
              >
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <option value="Level 4">Level 4</option>
                <option value="Level 5">Level 5</option>
                <option value="प्रौढ़ कक्षा">प्रौढ़ कक्षा</option>
              </select>
            </div>
          )}

          {/* Photo Upload */}
          <div style={styles.fieldGroup}>
            <label style={styles.label}>
              Photo <span style={{ color: 'rgba(255,255,255,0.25)', fontWeight: 400 }}>(Optional)</span>
            </label>
            <div style={styles.fileWrapper}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0] || null)}
                style={styles.fileInput}
                id="photo-upload"
              />
              <label htmlFor="photo-upload" style={styles.fileLabel}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>{photo ? photo.name : 'Click to upload a photo'}</span>
              </label>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={styles.errorBox}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelBtn}
              onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { e.target.style.background = 'rgba(255,255,255,0.04)'; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(99, 102, 241, 0.25)';
              }}
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
