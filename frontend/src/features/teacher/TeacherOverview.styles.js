const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '24px', animation: 'fadeIn 0.4s ease' },
  
  headerBanner: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.04)', 
    borderRadius: '16px', padding: '20px 24px' 
  },
  bannerTitle: { color: 'white', fontSize: '18px', fontWeight: 600, margin: '0 0 4px 0' },
  bannerSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: 0 },
  timeBadge: { 
    display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.3)', 
    padding: '8px 16px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' 
  },
  dateText: { color: 'rgba(255,255,255,0.7)', fontSize: '13px', fontWeight: 500 },
  timeDivider: { color: 'rgba(255,255,255,0.2)', fontSize: '12px' },
  timeText: { color: '#818cf8', fontSize: '14px', fontWeight: 700, fontFamily: 'monospace' },
  
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' },
  kpiCard: { 
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', 
    borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  kpiHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  kpiLabel: { color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
  kpiIconWrapper: { background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '8px' },
  kpiValue: { color: 'white', fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'baseline', gap: '4px' },
  kpiSuffix: { color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: 500 },

  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px' },
  panelCard: { 
    background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', 
    borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column',
    boxShadow: '0 4px 24px rgba(0,0,0,0.15)'
  },
  panelHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  panelTitle: { color: 'white', fontSize: '16px', fontWeight: 600, margin: 0 },
  panelSubtitle: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 500 },
  
  chartContainer: { position: 'relative', width: '100%', height: '240px', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  chartCenterText: { position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' },
  chartCenterLabel: { color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' },
  chartCenterValue: { color: 'white', fontSize: '32px', fontWeight: 800, lineHeight: '1.1' },
  
  legendContainer: { display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' },
  legendPill: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' },
  legendColor: { width: '8px', height: '8px', borderRadius: '50%' },
  legendLabel: { color: 'rgba(255,255,255,0.6)', fontSize: '12px', fontWeight: 500 },
  legendValue: { color: 'white', fontSize: '13px', fontWeight: 700 },

  listContainer: { display: 'flex', flexDirection: 'column', gap: '16px' },
  listItem: { display: 'flex', alignItems: 'center', gap: '16px' },
  listRank: { 
    width: '28px', height: '28px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    fontSize: '13px', fontWeight: 700 
  },
  listContent: { flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' },
  listHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  listName: { color: 'rgba(255,255,255,0.9)', fontSize: '14px', fontWeight: 500 },
  listPoints: { color: '#818cf8', fontSize: '13px', fontWeight: 600, fontFamily: 'monospace' },
  progressBarBg: { width: '100%', height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '100px', overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: '100px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' },
  emptyState: { color: 'rgba(255,255,255,0.4)', fontSize: '13px', textAlign: 'center', padding: '40px 0' }
};

export default styles;
