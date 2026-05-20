import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Patient from './pages/Patient';
import UploadXray from './pages/UploadXray';
import Result from './pages/Result';
import Report from './pages/Report';
import History from './pages/History';
import { cn } from './utils';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('patient');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    document.body.style.backgroundColor = theme === 'dark' ? '#0f0f23' : '#f8f9fa';
  }, [theme]);

  const handleLogin = () => setIsLoggedIn(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setActivePage('patient');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const renderPage = () => {
  const pages = {
      patient: <Patient />,
      upload: <UploadXray />,
      result: <Result />,
      report: <Report />,
      history: <History />,
      
      settings: <div style={{textAlign: 'center', padding: '80px 20px'}}><h2 style={{fontSize: '2rem', color: '#007bff', marginBottom: '16px'}}>Settings</h2><p>Coming soon</p></div>,
    };
    return pages[activePage] || pages.patient;
  };

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh', 
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <Login onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <Sidebar 
        activePage={activePage} 
        onNavClick={setActivePage}
        style={{ position: 'fixed', height: '100vh', zIndex: 40 }}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
        <Navbar theme={theme} onThemeToggle={toggleTheme} onLogout={handleLogout} />
        <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
