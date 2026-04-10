import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Upload, 
  CheckCircle, 
  Calendar,
  FileText,
  MessageSquare,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', assignedTo: [], section: 'Frontend', deadline: ''
  });
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetchTasks();
    if (user?.role === 'Admin') fetchTeam();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchTeam = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTeamMembers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowCreate(false);
      fetchTasks();
    } catch (err) { alert('Error creating task'); }
  };

  const handleComplete = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}/complete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTasks();
    } catch (err) { alert('Error completing task'); }
  };

  const handleFileUpload = async (taskId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      await axios.post(`http://localhost:5000/api/tasks/${taskId}/upload`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('File uploaded successfully!');
      fetchTasks();
    } catch (err) { alert('Upload failed'); }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchTasks();
      } catch (err) { alert('Error deleting task'); }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Project Tasks</h1>
          <p style={{ opacity: 0.6 }}>Manage assignments and track module progress.</p>
        </div>
        {user?.role === 'Admin' && (
          <button onClick={() => setShowCreate(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> New Task
          </button>
        )}
      </div>

      <AnimatePresence>
        {showCreate && (
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             exit={{ opacity: 0, scale: 0.9 }}
             className="card" 
             style={{ marginBottom: '2rem', border: '2px dashed var(--primary)' }}
           >
             <h3 style={{ marginBottom: '1.5rem' }}>Create New Task</h3>
             <form onSubmit={handleCreate} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <input required className="card" style={{ padding: '0.8rem' }} placeholder="Task Title" onChange={e => setNewTask({...newTask, title: e.target.value})} />
                <div className="card" style={{ padding: '0.8rem', gridColumn: 'span 2' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Assign To:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {teamMembers.map(m => (
                      <label key={m._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: newTask.assignedTo.includes(m._id) ? 'rgba(139, 92, 246, 0.1)' : 'transparent', padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>
                        <input 
                          type="checkbox" 
                          checked={newTask.assignedTo.includes(m._id)}
                          onChange={(e) => {
                            const ids = e.target.checked 
                              ? [...newTask.assignedTo, m._id]
                              : newTask.assignedTo.filter(id => id !== m._id);
                            setNewTask({...newTask, assignedTo: ids});
                          }}
                        />
                        <span style={{ fontSize: '0.8rem' }}>{m.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <textarea required className="card" style={{ padding: '0.8rem', gridColumn: 'span 2' }} placeholder="Description" onChange={e => setNewTask({...newTask, description: e.target.value})} />
                <select className="card" style={{ padding: '0.8rem' }} onChange={e => setNewTask({...newTask, section: e.target.value})}>
                  {['Frontend', 'Backend', 'Database', 'UI', 'Testing'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input required type="date" className="card" style={{ padding: '0.8rem' }} onChange={e => setNewTask({...newTask, deadline: e.target.value})} />
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                   <button type="button" onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                   <button type="submit" className="btn-primary">Create Task</button>
                </div>
             </form>
           </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {tasks.map((task) => (
          <motion.div layout key={task._id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)' }}>{task.section}</span>
              <span className={`badge badge-${task.status.toLowerCase()}`}>{task.status}</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{task.title}</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '1.5rem', minHeight: '3em' }}>{task.description}</p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '1.5rem', padding: '0.75rem', background: 'var(--bg)', borderRadius: '8px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                  <Calendar size={16} color="var(--primary)" />
                  <p style={{ fontSize: '0.75rem', fontWeight: '500' }}>{new Date(task.deadline).toLocaleDateString()}</p>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: '600', opacity: 0.8 }}>Assigned to:</p>
                  <div style={{ display: 'flex', gap: '-5px' }}>
                    {Array.isArray(task.assignedTo) && task.assignedTo.map((u, i) => (
                      <img 
                        key={i} 
                        src={u.picture || 'https://via.placeholder.com/150'} 
                        alt={u.name} 
                        title={u.name}
                        style={{ 
                          width: '24px', 
                          height: '24px', 
                          borderRadius: '50%', 
                          border: '2px solid var(--white)',
                          marginLeft: i > 0 ? '-8px' : '0' 
                        }} 
                      />
                    ))}
                  </div>
               </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
               {user.role !== 'Admin' && task.status === 'Pending' && (
                 <button onClick={() => handleComplete(task._id)} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: `1px solid var(--success)`, color: 'var(--success)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600' }}>
                   <CheckCircle size={14} /> Mark Done
                 </button>
               )}
               
               <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {user.role === 'Admin' && (
                    <button onClick={() => handleDeleteTask(task._id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.8 }}>
                      <Trash2 size={18} />
                    </button>
                  )}
                  <label style={{ cursor: 'pointer', opacity: 0.6 }}>
                    <input type="file" style={{ display: 'none' }} onChange={e => handleFileUpload(task._id, e.target.files[0])} />
                    <Upload size={18} />
                  </label>
               </div>
            </div>

            {task.files?.length > 0 && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                 <p style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem' }}>Submissions:</p>
                 {task.files.map((f, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', opacity: 0.8, marginBottom: '4px' }}>
                     <FileText size={12} />
                     <a href={`http://localhost:5000/${f.url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none' }}>{f.name}</a>
                   </div>
                 ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Tasks;
