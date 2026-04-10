import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Shield, UserPlus, MoreVertical, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Team = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const sections = ['Frontend', 'Backend', 'Database', 'UI', 'Testing', 'None'];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (userId, data) => {
    try {
      await axios.put(`/api/users/${userId}`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Error updating user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Team Management</h1>
          <p style={{ opacity: 0.6 }}>Manage roles and assign project modules to team members.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Member</th>
              <th style={{ padding: '1rem 1.5rem' }}>Role</th>
              <th style={{ padding: '1rem 1.5rem' }}>Assigned Section</th>
              <th style={{ padding: '1rem 1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={user.picture} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{user.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <select 
                    value={user.role} 
                    onChange={(e) => handleUpdate(user._id, { role: e.target.value })}
                    style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px' }}
                  >
                    <option value="Team Member">Team Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <select 
                    value={user.assignedSection} 
                    onChange={(e) => handleUpdate(user._id, { assignedSection: e.target.value })}
                    style={{ background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', padding: '4px 8px', borderRadius: '4px' }}
                  >
                    {sections.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8 }}
                      title="Remove Member"
                    >
                      <Trash2 size={18} />
                    </button>
                    <button style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', opacity: 0.5 }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Team;
