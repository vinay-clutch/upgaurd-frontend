export const WebsiteCardSkeleton = () => (
  <div style={{
    background: '#1e293b',
    borderRadius: '12px',
    padding: '20px',
    animation: 'pulse 2s infinite'
  }}>
    <div style={{
      height: '20px', width: '60%',
      background: '#334155',
      borderRadius: '4px',
      marginBottom: '12px'
    }}/>
    <div style={{
      height: '14px', width: '40%',
      background: '#334155',
      borderRadius: '4px'
    }}/>
    <style>{`
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `}</style>
  </div>
);

export const DashboardSkeleton = () => (
  <div style={{ padding: '24px', display: 'flex', 
    flexDirection: 'column', gap: '16px' }}>
    {[1,2,3].map(i => <WebsiteCardSkeleton key={i} />)}
  </div>
);
