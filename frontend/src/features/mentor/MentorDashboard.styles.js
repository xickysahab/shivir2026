const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 40%, #16213e 100%)',
    fontFamily: "'Inter', system-ui, sans-serif",
    position: 'relative',
    overflowX: 'clip',
  },
  orb1: { position: 'absolute', top: '5%', right: '10%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167, 139, 250, 0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' },
  orb2: { position: 'absolute', bottom: '10%', left: '5%', width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(192, 132, 252, 0.06) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' },
  
  layout: {
    display: 'flex',
    height: '100vh',
    position: 'relative',
    zIndex: 10,
  },
  
  sidebar: {
    width: '280px',
    background: 'rgba(20, 20, 30, 0.6)',
    backdropFilter: 'blur(20px)',
    borderRight: '1px solid rgba(255, 255, 255, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 0',
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 24px 32px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  logoMark: { display: 'flex', alignItems: 'center' },
  sidebarTitle: { margin: 0, fontSize: '18px', fontWeight: 800, color: 'rgba(255, 255, 255, 0.95)' },
  roleBadge: { fontSize: '11px', fontWeight: 700, color: '#c084fc', textTransform: 'uppercase', letterSpacing: '0.05em', background: 'rgba(167, 139, 250, 0.12)', padding: '4px 10px', borderRadius: '12px' },
  
  navMenu: {
    flex: 1,
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'transparent',
    color: 'rgba(255,255,255,0.6)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  },
  navItemActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 16px',
    borderRadius: '12px',
    background: 'rgba(167, 139, 250, 0.15)',
    color: '#c084fc',
    border: '1px solid rgba(167, 139, 250, 0.3)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    boxShadow: '0 4px 20px rgba(167, 139, 250, 0.1)',
    textAlign: 'left',
  },
  
  sidebarFooter: {
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  userAvatar: {
    width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(167,139,250,0.2)', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
  },
  userName: {
    color: 'white', fontSize: '14px', fontWeight: 600
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: '8px',
    padding: '12px',
    borderRadius: '10px',
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#f87171',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
  },
  
  mainContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    scrollBehavior: 'smooth',
  },
  mainHeader: {
    padding: '32px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {
    margin: 0,
    fontSize: '28px',
    fontWeight: 800,
    color: 'white',
  },
  contentArea: {
    flex: 1,
    padding: '0 40px 40px 40px',
  },

  controlPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: '16px',
    gap: '20px'
  },
  datePickerWrapper: {
    display: 'flex', flexDirection: 'column', gap: '8px'
  },
  controlLabel: {
    color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600
  },
  dateInput: {
    background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: 'inherit',
    cursor: 'pointer'
  },
  modernInput: {
    background: 'rgba(255, 255, 255, 0.04)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '8px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'inherit',
    transition: 'all 0.2s ease',
    width: '100%',
    boxSizing: 'border-box'
  },
  statsRow: {
    display: 'flex', gap: '16px'
  },
  statCard: {
    background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '12px 24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '100px'
  },
  statValue: {
    color: 'white', fontSize: '24px', fontWeight: 800, marginBottom: '4px'
  },
  statLabel: {
    color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase'
  },
  bulkActions: {
    display: 'flex', gap: '12px', marginBottom: '10px'
  },
  btnBulkPresent: {
    background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
  },
  btnBulkAbsent: {
    background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
  },
  btnBulkClear: {
    background: 'rgba(255, 255, 255, 0.05)', color: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '10px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px'
  },
  studentGrid: {
    display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '100px'
  },
  studentRow: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 20px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'transform 0.2s'
  },
  studentInfo: {
    display: 'flex', alignItems: 'center', gap: '16px'
  },
  studentAvatar: {
    width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
  },
  studentName: {
    color: 'white', fontSize: '15px', fontWeight: 600, marginBottom: '4px'
  },
  studentMeta: {
    color: 'rgba(255,255,255,0.4)', fontSize: '13px'
  },
  toggleGroup: {
    display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '12px'
  },
  toggleBtnPresent: {
    padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
  },
  toggleBtnPresentActive: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)', transition: 'all 0.2s'
  },
  toggleBtnAbsent: {
    padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
  },
  toggleBtnAbsentActive: {
    padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.5)', background: 'rgba(244, 63, 94, 0.15)', color: '#f43f5e', fontWeight: 600, cursor: 'pointer', boxShadow: '0 0 15px rgba(244, 63, 94, 0.1)', transition: 'all 0.2s'
  },
  toggleBtnClear: {
    padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  toggleBtnClearActive: {
    padding: '8px 12px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
  },
  floatingSaveBar: {
    position: 'fixed', bottom: '20px', right: '16px', zIndex: 100
  },
  saveBtn: {
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', padding: '14px 24px', borderRadius: '100px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)', display: 'flex', alignItems: 'center', gap: '10px', transition: 'transform 0.2s', whiteSpace: 'nowrap',
  },
  toastSuccess: {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 150,
    display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px',
    background: 'linear-gradient(135deg, #059669, #06d6a0)', color: '#ffffff',
    borderRadius: '14px', fontSize: '14px', fontWeight: 600,
    boxShadow: '0 8px 30px rgba(6, 214, 160, 0.3)', animation: 'slideUp 0.3s ease',
  },
  toastError: {
    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 150,
    display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px',
    background: 'linear-gradient(135deg, #e11d48, #fb7185)', color: '#ffffff',
    borderRadius: '14px', fontSize: '14px', fontWeight: 600,
    boxShadow: '0 8px 30px rgba(225, 29, 72, 0.3)', animation: 'slideUp 0.3s ease',
  },

  /* ── Mobile Styles ── */
  mobileTopBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'rgba(15, 15, 25, 0.75)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 50,
  },
  mobileTopBarLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  mobileTopBarTitle: { margin: 0, fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.95)', letterSpacing: '-0.02em' },
  mobileLogoutBtn: {
    background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px', padding: '6px 10px', color: '#f87171',
    fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
    transition: 'all 0.2s ease',
  },
  bottomNav: {
    position: 'fixed', bottom: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'space-around', alignItems: 'center',
    background: 'rgba(12, 12, 22, 0.92)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
    padding: '8px 0 env(safe-area-inset-bottom, 8px) 0', zIndex: 100,
  },
  bottomNavItem: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)',
    fontSize: '10px', fontWeight: 600, cursor: 'pointer', padding: '8px 14px', borderRadius: '12px',
    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative', letterSpacing: '0.02em', minWidth: '56px',
  },
  bottomNavItemActive: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    background: 'rgba(167, 139, 250, 0.12)', border: 'none', color: '#c084fc',
    fontSize: '10px', fontWeight: 700, cursor: 'pointer', padding: '8px 14px', borderRadius: '12px',
    position: 'relative', letterSpacing: '0.02em', minWidth: '56px',
  },
  mobileContentArea: {
    flex: 1, padding: '16px 16px', paddingBottom: '90px', overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    overscrollBehaviorY: 'contain',
    scrollBehavior: 'smooth',
  },
  mobileMainHeader: { padding: '8px 0 10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  mobilePageTitle: { margin: 0, fontSize: '20px', fontWeight: 800, color: 'white', letterSpacing: '-0.03em' },
  mobileControlPanel: {
    display: 'flex', flexDirection: 'column', gap: '12px',
    background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '12px', borderRadius: '12px',
  },
  mobileStatsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' },
  mobileStudentRow: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
    padding: '10px 12px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '8px',
    transition: 'all 0.2s ease',
  }
};

export default styles;
