const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    animation: 'slideUp 0.5s ease'
  },
  topPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '24px',
    borderRadius: '16px',
    gap: '20px'
  },
  datePickerWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  controlLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600 },
  dateInput: {
    background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px', borderRadius: '10px', fontSize: '15px', outline: 'none', fontFamily: 'inherit', cursor: 'pointer'
  },
  statsRow: { display: 'flex', gap: '16px' },
  statCard: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px 24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' },
  statValue: { color: 'white', fontSize: '28px', fontWeight: 800, marginBottom: '4px' },
  statLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase' },
  loading: { color: 'white', padding: '20px', textAlign: 'center' },
  error: { color: '#f43f5e', padding: '20px', textAlign: 'center' },
  empty: { color: 'rgba(255,255,255,0.6)', padding: '20px', textAlign: 'center' },
  
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '24px',
    alignItems: 'start'
  },
  
  chartsSection: {
    display: 'flex', flexDirection: 'column', gap: '16px'
  },
  sectionHeader: {
    margin: 0, fontSize: '20px', fontWeight: 700, color: 'white'
  },
  chartsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '20px'
  },
  chartCard: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', transition: 'transform 0.2s',
  },
  chartTitle: { margin: '0 0 6px 0', color: 'white', fontSize: '16px', fontWeight: 700 },
  chartMeta: { fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontWeight: 600 },
  
  leaderboardSection: {
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px',
  },
  leaderboardHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  filterSelect: {
    background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '8px', fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit'
  },
  leaderboardList: {
    display: 'flex', flexDirection: 'column', gap: '12px'
  },
  leaderboardItem: {
    display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.2)', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.03)'
  },
  rankBadge: {
    width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 800
  },
  lbStudentInfo: { flex: 1, display: 'flex', flexDirection: 'column' },
  lbName: { color: 'white', fontSize: '15px', fontWeight: 600 },
  lbLevel: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginTop: '2px' },
  lbPoints: { color: '#818cf8', fontSize: '18px', fontWeight: 800 },
};

export default styles;
