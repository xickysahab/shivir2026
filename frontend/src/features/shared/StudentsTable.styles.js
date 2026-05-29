const styles = {
  container: { padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', marginTop: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '12px' },
  title: { color: 'white', margin: 0, fontSize: '20px' },
  actions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  btnPrimary: { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)' },
  btnSecondary: { background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' },
  filterBar: { display: 'flex', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' },
  filterGroup: { flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0 10px', border: '1px solid rgba(255,255,255,0.1)' },
  filterIcon: { color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
  searchInput: { background: 'transparent', border: 'none', color: 'white', padding: '12px 10px', width: '100%', outline: 'none', fontSize: '14px' },
  filterSelects: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filterSelect: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 15px', borderRadius: '8px', outline: 'none', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: '#eee' },
  th: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, color: '#a78bfa', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' },
  td: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  tr: { transition: 'background 0.2s' },
  badge: { background: 'rgba(99,102,241,0.2)', color: '#818cf8', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' },
  actionBtns: { display: 'flex', gap: '4px' },
  btnIcon: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px', opacity: 0.8, borderRadius: '8px' },
  btnIconDelete: { background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '6px', opacity: 0.8, borderRadius: '8px' },
  btnIconKitActive: { background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', cursor: 'pointer', fontSize: '16px', padding: '6px', opacity: 1, borderRadius: '8px', filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.4))' },
  btnIconKitInactive: { background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', cursor: 'pointer', fontSize: '16px', padding: '6px', opacity: 0.8, filter: 'grayscale(100%)', borderRadius: '8px' },
  
  // Pagination UI Styles
  paginationBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderTop: '1px solid rgba(255,255,255,0.05)'
  },
  paginationInfo: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: '14px'
  },
  paginationControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  rowsPerPage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: 'rgba(255,255,255,0.7)',
    fontSize: '14px'
  },
  limitSelect: {
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    padding: '4px 8px',
    borderRadius: '6px',
    outline: 'none',
    cursor: 'pointer'
  },
  pageButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  pageBtn: {
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.2)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s',
    fontWeight: 'bold'
  },
  pageBtnDisabled: {
    background: 'transparent',
    color: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.05)',
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'not-allowed',
    fontWeight: 'bold'
  },
  pageInfo: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    fontWeight: 500
  },

  // Mobile card layout
  mobileCardList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  mobileCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '12px',
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '12px',
    transition: 'all 0.2s',
  },
  mobileCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mobileCardInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flex: 1,
  },
  mobileCardAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.2)',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
    flexShrink: 0,
  },
  mobileCardName: {
    color: 'white',
    fontSize: '13px',
    fontWeight: 600,
  },
  mobileCardMeta: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '12px',
    marginTop: '2px',
  },
  mobileCardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '8px',
    borderTop: '1px solid rgba(255,255,255,0.05)',
  },
  mobileCardStats: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  mobileCardStatItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  mobileCardStatLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  mobileCardStatValue: {
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
  },

  modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px' },
  modal: { background: '#1e1e2f', padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '600px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' },
  modalSmall: { background: '#1e1e2f', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' },
  modalTitle: { color: 'white', marginTop: 0, marginBottom: '20px' },
  formGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))', gap: '15px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { color: '#aaa', fontSize: '12px' },
  input: { background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px', borderRadius: '8px' },
  modalActions: { gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' },
  btnCancel: { background: 'transparent', color: '#aaa', border: 'none', padding: '10px 20px', cursor: 'pointer' },
  btnSave: { background: '#6366f1', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  error: { background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '15px' },
  empty: { textAlign: 'center', padding: '30px', color: '#aaa' }
};

export default styles;
