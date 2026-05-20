export default function Button({ 
  children, 
  loading = false, 
  variant = 'primary', 
  className = '', 
  disabled,
  onClick,
  type = 'button',
  ...props 
}) {
  const baseStyle = {
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'background 0.3s, transform 0.1s',
    ...props.style
  };

  const variants = {
    primary: {
      background: '#007bff',
      color: 'white',
    },
    secondary: {
      background: '#6c757d',
      color: 'white',
    },
    danger: {
      background: '#dc3545',
      color: 'white',
    }
  };

  const buttonStyle = {
    ...baseStyle,
    ...variants[variant],
    opacity: disabled || loading ? 0.6 : 1,
    cursor: disabled || loading ? 'not-allowed' : 'pointer'
  };

  return (
    <button 
      className={`btn ${className}`} 
      style={buttonStyle}
      disabled={loading || disabled}
      onClick={onClick}
      type={type}
      {...props}
    >
      {loading && <span style={{marginRight: '8px'}}>Loading...</span>}
      {children}
    </button>
  );
}
