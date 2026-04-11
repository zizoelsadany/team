import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Team from './pages/Team';

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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
        {token && (
          <>
            <button className="menu-toggle" onClick={toggleSidebar}>
              <span style={{ fontSize: '1.5rem' }}>☰</span>
            </button>
            <div 
              className={`overlay ${isSidebarOpen ? 'active' : ''}`} 
              onClick={() => setIsSidebarOpen(false)}
            ></div>
            <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
          </>
        )}
        <main className={token ? 'content' : ''} style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            
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
