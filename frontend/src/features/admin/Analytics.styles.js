const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', width: '100%', animation: 'slideUp 0.4s ease' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' },
  statCard: { 
    background: 'rgba(255, 255, 255, 0.03)', 
    backdropFilter: 'blur(10px)', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid rgba(255,255,255,0.05)', 
    position: 'relative', 
    overflow: 'hidden',
    transition: 'all 0.25s ease',
  },
  statTitle: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: '0 0 10px 0', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
  statValue: { color: 'white', fontSize: '32px', margin: 0, fontWeight: '800' },
  statAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', opacity: 0.8 },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' },
  chartCard: { 
    background: 'rgba(255, 255, 255, 0.03)', 
    backdropFilter: 'blur(10px)', 
    padding: '24px', 
    borderRadius: '16px', 
    border: '1px solid rgba(255,255,255,0.05)', 
    height: '400px', 
    display: 'flex', 
    flexDirection: 'column',
    transition: 'all 0.25s ease',
  },
  chartTitle: { color: 'white', fontSize: '18px', margin: '0 0 20px 0', fontWeight: '600' },
  chartWrapper: { flex: 1, minHeight: 0, position: 'relative' },
  chartCenterText: { 
    position: 'absolute', 
    top: '50%', 
    left: '50%', 
    transform: 'translate(-50%, -50%)',
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    pointerEvents: 'none' 
  },
  chartCenterLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' },
  chartCenterValue: { color: 'white', fontSize: '24px', fontWeight: 800, lineHeight: '1.2' },
  
  // Skeleton loading
  skeletonCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
};

export default styles;
