const styles = {
  container: {
    padding: '24px',
    animation: 'fadeIn 0.5s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '16px 24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)'
  },
  title: {
    margin: 0,
    fontSize: '24px',
    fontWeight: '700',
    background: 'linear-gradient(to right, #ffffff, #a78bfa)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  controls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  select: {
    padding: '10px 16px',
    borderRadius: '8px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    outline: 'none',
    fontSize: '14px',
    cursor: 'pointer'
  },
  calendarGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gap: '12px',
    marginTop: '16px'
  },
  dayHeader: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '600',
    paddingBottom: '8px',
    fontSize: '14px'
  },
  dayCell: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px',
    minHeight: '110px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  dayCellEmpty: {
    backgroundColor: 'transparent',
    border: 'none'
  },
  dayCellHover: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    transform: 'translateY(-2px)'
  },
  dayNumber: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#fff'
  },
  statsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '12px'
  },
  statPresent: {
    color: '#10b981',
    fontWeight: '600'
  },
  statAbsent: {
    color: '#f43f5e',
    fontWeight: '600'
  },
  statUnmarked: {
    color: 'rgba(255,255,255,0.4)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: '#a78bfa',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
  },
  
  // Drill-down Details View
  detailsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  detailsDate: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff',
    margin: 0
  },
  studentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '16px'
  },
  studentRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.1)'
  },
  studentInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  studentAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px'
  },
  studentName: {
    fontWeight: '600',
    color: '#fff',
    fontSize: '15px'
  },
  studentMeta: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    marginTop: '2px'
  },
  toggleGroup: {
    display: 'flex',
    gap: '6px'
  },
  toggleBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toggleBtnPresentActive: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(16, 185, 129, 0.4)',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    color: '#10b981',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toggleBtnAbsentActive: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(244, 63, 94, 0.4)',
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    color: '#f43f5e',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  toggleBtnClearActive: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  floatingSaveBar: {
    position: 'sticky',
    bottom: '24px',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(99, 102, 241, 0.3)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
    marginTop: '20px',
    zIndex: 100
  },
  saveBtn: {
    backgroundColor: '#6366f1',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
  }
};

export default styles;
