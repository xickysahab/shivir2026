const styles = {
  overlay: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    padding: '20px',
    animation: 'fadeIn 0.3s ease'
  },
  modal: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '500px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    overflow: 'hidden',
    animation: 'slideUp 0.3s ease'
  },
  header: {
    padding: '24px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    margin: 0,
    fontSize: '20px',
    fontWeight: '600',
    color: '#fff'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'color 0.2s'
  },
  content: {
    padding: '24px'
  },
  profileSection: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
    marginBottom: '32px'
  },
  avatar: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    color: '#a78bfa',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: '700',
    border: '2px solid rgba(99, 102, 241, 0.4)'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: '16px',
    flex: 1
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  infoLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  infoValue: {
    fontSize: '15px',
    color: '#fff',
    fontWeight: '500'
  },
  trackerSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  trackerTitle: {
    margin: '0 0 16px 0',
    fontSize: '15px',
    fontWeight: '600',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  trackerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px'
  },
  dateCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 8px',
    borderRadius: '12px',
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  dateLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500'
  },
  statusDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 10px currentColor'
  }
};

export default styles;
