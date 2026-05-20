export default function Navbar({ theme, onThemeToggle, onLogout }) {
  return (
    <div className="navbar" style={{marginBottom: '20px'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
        <div style={{
          width: '40px',
          height: '40px',
          background: 'linear-gradient(135deg, #007bff, #0056b3)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '20px'
        }}>
          ⚡
        </div>
        <div>
          <h1 style={{fontSize: '1.8rem', color: '#007bff', margin: 0}}>Pulmora AI</h1>
          <p style={{fontSize: '0.9rem', color: '#666', margin: 0}}>Pneumonia Detection</p>
        </div>
      </div>

      <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
        <button 
          onClick={onThemeToggle}
          style={{
            padding: '8px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            background: 'white',
            cursor: 'pointer',
            fontSize: '18px'
          }}
          title="Toggle theme"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <button 
          onClick={onLogout}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid #e9ecef',
            background: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          👤 Profile
        </button>
      </div>
    </div>
  );
}
