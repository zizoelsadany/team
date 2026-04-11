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
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p style={{ opacity: 0.6 }}>Here's what's happening with your project today.</p>
      </div>

      <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        {statCards.map((stat, i) => (
          <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ background: stat.color, padding: '12px', borderRadius: '12px' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>{stat.label}</p>
              <h3 style={{ fontSize: '1.5rem' }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <div className="card" style={{ border: '2px solid var(--primary)', padding: '2.5rem', background: 'rgba(139, 92, 246, 0.02)' }}>
          <h2 style={{ color: 'var(--primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.75rem' }}>
            <Layers size={32} /> Project Standards: Student Management System
          </h2>
          
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  👨‍🎓 Student Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', fontSize: '1rem', border: '1px solid var(--border)', lineHeight: '1.6' }}>
{`int studentId;
String studentName;
String studentMajor;
ArrayList<Subject> subjects;`}
                </pre>
              </div>
              
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  📚 Subject Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', fontSize: '1rem', border: '1px solid var(--border)', lineHeight: '1.6' }}>
{`String subjectName;
int creditHours;
double grade;`}
                </pre>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  🧠 StudentManagementSystem Class
                </p>
                <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '12px', fontSize: '1rem', border: '1px solid var(--border)', lineHeight: '1.6' }}>
{`ArrayList<Student> students;`}
                </pre>
              </div>

              <div>
                <p style={{ fontWeight: '700', color: 'var(--primary)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  🔥 Function Names (لازم الكل يلتزم بيها)
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', background: 'rgba(139, 92, 246, 0.08)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold', opacity: 0.8, marginBottom: '0.4rem', color: 'var(--primary)' }}>📌 في كلاس Student:</p>
                    <code style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)' }}>addSubject(), calculateGPA(), displayStudentInfo()</code>
                  </div>
                  <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '0.85rem', fontWeight: 'bold', opacity: 0.8, marginBottom: '0.4rem', color: 'var(--primary)' }}>📌 في كلاس ManagementSystem:</p>
                    <code style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text)' }}>addStudent(), searchStudent(), addSubjectToStudent()</code>
                  </div>
                </div>
              </div>

              <div style={{ mt: 'auto', padding: '20px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                <p style={{ fontWeight: '800', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', marginBottom: '10px' }}>
                  ⚠️ مهم جدًا لجميع أعضاء الفريق:
                </p>
                <ul style={{ fontSize: '1rem', listStyleType: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></div> استخدم نفس الأسماء بالحرف (camelCase)</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></div> متغير grade يكون نوعه double</li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><div style={{ width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%' }}></div> أسماء الـ ArrayList تكون بالضبط: subjects & students</li>
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
