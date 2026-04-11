import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  Layers 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    completionRate: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const tasks = Array.isArray(res.data) ? res.data : [];
        const completed = tasks.filter(t => t.status === 'Completed').length;
        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: tasks.length - completed,
          completionRate: tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, [token]);

  const statCards = [
    { label: 'Total Tasks', value: stats.totalTasks, icon: <Layers size={24} color="#8b5cf6" />, color: 'rgba(139, 92, 246, 0.1)' },
    { label: 'Completed', value: stats.completedTasks, icon: <CheckCircle2 size={24} color="#10b981" />, color: 'rgba(16, 185, 129, 0.1)' },
    { label: 'Pending', value: stats.pendingTasks, icon: <Clock size={24} color="#f59e0b" />, color: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Progess', value: `${stats.completionRate}%`, icon: <BarChart3 size={24} color="#ec4899" />, color: 'rgba(236, 72, 153, 0.1)' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="responsive-title" style={{ fontWeight: '700' }}>Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Here's what's happening with your project today.</p>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem' }}>
            <div style={{ background: stat.color, padding: '10px', borderRadius: '10px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.25rem' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="card" style={{ border: '1px solid var(--primary)', padding: '1.5rem', background: 'rgba(139, 92, 246, 0.02)' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.4rem' }}>
            <Layers size={24} /> Project Standards
          </h2>
          
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1rem' }}>
                  👨‍🎓 Student Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border)', lineHeight: '1.5', overflowX: 'auto' }}>
{`int studentId;
String studentName;
String studentMajor;
ArrayList<Subject> subjects;`}
                </pre>
              </div>
              
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1rem' }}>
                  📚 Subject Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border)', lineHeight: '1.5', overflowX: 'auto' }}>
{`String subjectName;
int creditHours;
double grade;`}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1rem' }}>
                  🧠 ManagementSystem Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', border: '1px solid var(--border)', lineHeight: '1.5', overflowX: 'auto' }}>
{`ArrayList<Student> students;`}
                </pre>
              </div>

              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '0.8rem', fontSize: '1rem' }}>
                  🔥 Function Names
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(139, 92, 246, 0.08)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.8, color: 'var(--primary)' }}>📌 Student:</p>
                    <code style={{ fontSize: '0.85rem', fontWeight: '600' }}>addSubject(), calculateGPA()...</code>
                  </div>
                  <div style={{ paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 'bold', opacity: 0.8, color: 'var(--primary)' }}>📌 System:</p>
                    <code style={{ fontSize: '0.85rem', fontWeight: '600' }}>addStudent(), searchStudent()...</code>
                  </div>
                </div>
              </div>

              <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <p style={{ fontWeight: '700', color: '#ef4444', fontSize: '0.9rem', marginBottom: '5px' }}>
                  ⚠️ مهم جداً:
                </p>
                <ul style={{ fontSize: '0.8rem', listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '4px', opacity: 0.9 }}>
                  <li>• استخدم camelCase</li>
                  <li>• نوع grade هو double</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
