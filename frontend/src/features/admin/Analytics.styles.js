const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  statCard: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
  statTitle: { color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: '0 0 10px 0', fontWeight: '600' },
  statValue: { color: 'white', fontSize: '32px', margin: 0, fontWeight: '800' },
  statAccent: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '4px', opacity: 0.8 },
  chartsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: '20px' },
  chartCard: { background: 'rgba(255, 255, 255, 0.03)', backdropFilter: 'blur(10px)', padding: '24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', height: '400px', display: 'flex', flexDirection: 'column' },
  chartTitle: { color: 'white', fontSize: '18px', margin: '0 0 20px 0', fontWeight: '600' },
  chartWrapper: { flex: 1, minHeight: 0 }
};

export default styles;
