import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';

const LoginSuccess = () => {
  const { login } = useAuth();
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userParam = params.get('user');
    
    if (token && userParam && userParam !== 'undefined') {
      try {
        const user = JSON.parse(userParam);
        login(token, user);
        window.location.href = '/';
      } catch (e) {
        console.error('Failed to parse user from URL', e);
        window.location.href = '/login';
      }
    } else if (token) {
        window.location.href = '/login';
    }
  }, []);
  return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Logging in...</div>;
};

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth();
  return (token && user?.role === 'Admin') ? children : <Navigate to="/" />;
};

function App() {
  const { token } = useAuth();

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        {token && <Sidebar />}
        <main className={token ? 'content' : ''} style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/login-success" element={<LoginSuccess />} />
            
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/tasks" element={<PrivateRoute><Tasks /></PrivateRoute>} />
            <Route path="/team" element={<AdminRoute><Team /></AdminRoute>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
