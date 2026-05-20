export default function Card({ children, className = '', style = {}, ...props }) {
  const cardStyle = {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    padding: '32px',
    marginBottom: '24px',
    ...style
  };

  return (
    <div className={`card ${className}`} style={cardStyle} {...props}>
      {children}
    </div>
  );
}
