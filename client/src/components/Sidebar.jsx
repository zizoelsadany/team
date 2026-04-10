import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  Layout
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout, toggleTheme, theme } = useAuth();

  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <CheckSquare size={20} />, label: 'Tasks', path: '/tasks' },
  ];

  if (user?.role === 'Admin') {
    navItems.push({ icon: <Users size={20} />, label: 'Team', path: '/team' });
  }

  return (
    <div className="sidebar">
      <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ background: 'var(--primary)', padding: '8px', borderRadius: '8px' }}>
          <Layout color="white" size={24} />
        </div>
        <h2 className="brand" style={{ fontSize: '1.25rem', fontWeight: '700' }}>CollabHub</h2>
      </div>

      <nav style={{ flex: 1, padding: '0 1rem' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '0.8rem 1rem',
              borderRadius: '8px',
              color: isActive ? 'var(--primary)' : 'var(--text)',
              textDecoration: 'none',
              background: isActive ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
              fontWeight: isActive ? '600' : '400',
              marginBottom: '0.5rem',
              transition: 'all 0.2s'
            })}
          >
            {item.icon} {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
        <button 
          onClick={toggleTheme}
          style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            background: 'none', 
            border: 'none', 
            color: 'var(--text)', 
            cursor: 'pointer',
            padding: '0.5rem'
          }}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src={user?.picture || 'https://via.placeholder.com/40'} 
            alt="profile" 
            style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '600', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden' }}>
              {user?.name}
            </p>
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{user?.role}</p>
          </div>
          <button onClick={logout} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
