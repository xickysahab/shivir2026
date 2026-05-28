const styles = {
  container: { padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', marginTop: '20px', animation: 'slideUp 0.4s ease' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { color: 'white', margin: 0, fontSize: '20px' },
  btnRefresh: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' },
  btnDanger: { display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' },
  filterBar: { display: 'flex', flexWrap: 'wrap', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', marginBottom: '20px', alignItems: 'center' },
  filterGroup: { flex: '1 1 300px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '0 10px', border: '1px solid rgba(255,255,255,0.1)' },
  filterIcon: { color: 'rgba(255,255,255,0.4)', fontSize: '14px' },
  searchInput: { background: 'transparent', border: 'none', color: 'white', padding: '12px 10px', width: '100%', outline: 'none' },
  filterSelects: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  filterSelect: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '10px 15px', borderRadius: '8px', outline: 'none', cursor: 'pointer' },
  tableWrapper: { overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', maxHeight: '550px', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  th: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)', fontWeight: 600, color: '#a78bfa', position: 'sticky', top: 0, background: 'rgba(30,30,47,0.9)', backdropFilter: 'blur(10px)' },
  td: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', verticalAlign: 'top' },
  tdTime: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', verticalAlign: 'top', whiteSpace: 'nowrap' },
  tdDesc: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', fontSize: '14px', verticalAlign: 'top', lineHeight: '1.5' },
  tr: { transition: 'background 0.2s', ':hover': { background: 'rgba(255,255,255,0.05)' } },
  userName: { color: 'white', fontWeight: 600, fontSize: '14px' },
  userRole: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', textTransform: 'uppercase' },
  badge: { padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' },
  loading: { color: 'white', textAlign: 'center', padding: '40px' },
  error: { background: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '15px' },
  empty: { textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.4)' }
};

export default styles;
