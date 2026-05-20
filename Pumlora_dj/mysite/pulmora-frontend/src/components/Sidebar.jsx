const navItems = [
  { icon: '👤', label: 'Patient Profile', path: 'patient' },
  { icon: '📁', label: 'Upload X-Ray', path: 'upload' },
{ icon: '🔬', label: 'AI Diagnosis', path: 'result' },
  { icon: '📊', label: 'Reports', path: 'report' },
  { icon: '📋', label: 'History Dashboard', path: 'history' },
  { icon: '⚙️', label: 'Settings', path: 'settings' },
];

export default function Sidebar({ activePage, onNavClick }) {
  return (
    <aside className="sidebar" style={{width: '250px'}}>
      <div style={{paddingBottom: '20px', borderBottom: '1px solid #e9ecef', marginBottom: '20px'}}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          background: '#f8f9fa',
          borderRadius: '12px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#007bff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '16px'
          }}>
            ⚡
          </div>
          <h2 style={{fontSize: '1.2rem', color: '#007bff'}}>Pulmora AI</h2>
        </div>
      </div>

      <nav style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavClick(item.path)}
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '10px',
              border: activePage === item.path ? 'none' : '1px solid #e9ecef',
              background: activePage === item.path ? '#007bff' : 'white',
              color: activePage === item.path ? 'white' : '#333',
              textAlign: 'left',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontWeight: activePage === item.path ? '600' : '500'
            }}
          >
            <span style={{fontSize: '20px'}}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
