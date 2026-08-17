import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  ShieldAlert, Users, BookOpen, FolderGit2, HelpCircle, 
  Plus, Trash2, Edit3, BarChart2, CheckCircle2 
} from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('metrics');
  const [metrics, setMetrics] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal forms state
  const [newSkill, setNewSkill] = useState({ name: '', description: '', category: 'Frontend', estimatedHours: 10, prerequisites: [] });
  const [newProject, setNewProject] = useState({ title: '', description: '', difficulty: 'intermediate', estimatedHours: 15, checklist: '' });
  const [newQuiz, setNewQuiz] = useState({ skillId: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'easy' });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [mRes, sRes, pRes, qRes] = await Promise.all([
        API.get('/admin/metrics'),
        API.get('/roadmap'), // roadmap returns skills
        API.get('/projects/recommendations'),
        API.get('/assessments/questions')
      ]);

      if (mRes.data.success) setMetrics(mRes.data.metrics);
      if (sRes.data.roadmap) setSkills(sRes.data.roadmap.map(item => item.skill));
      if (pRes.data.projects) setProjects(pRes.data.projects.map(p => p.project));
      if (qRes.data.data) {
        const flatQ = [];
        qRes.data.data.forEach(group => {
          group.questions.forEach(q => {
            flatQ.push({ ...q, skillName: group.skillName, skillId: group.skillId });
          });
        });
        setQuizQuestions(flatQ);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/admin/skills', newSkill);
      if (res.data.success) {
        alert('New skill created successfully!');
        setNewSkill({ name: '', description: '', category: 'Frontend', estimatedHours: 10, prerequisites: [] });
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm('Delete this skill?')) return;
    try {
      await API.delete(`/admin/skills/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete skill');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newProject,
        checklist: newProject.checklist.split('\n').filter(Boolean),
        requiredSkills: skills.slice(0, 2).map(s => s._id) // default attach skills
      };
      const res = await API.post('/admin/projects', payload);
      if (res.data.success) {
        alert('New project created!');
        setNewProject({ title: '', description: '', difficulty: 'intermediate', estimatedHours: 15, checklist: '' });
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Delete project?')) return;
    try {
      await API.delete(`/admin/projects/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuiz.skillId) {
      alert('Please select a skill for the quiz question.');
      return;
    }
    try {
      const res = await API.post('/admin/quiz', newQuiz);
      if (res.data.success) {
        alert('Quiz question added successfully!');
        setNewQuiz({ skillId: '', question: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '', difficulty: 'easy' });
        fetchAdminData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create quiz question');
    }
  };

  const handleDeleteQuiz = async (id) => {
    if (!window.confirm('Delete quiz question?')) return;
    try {
      await API.delete(`/admin/quiz/${id}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete quiz question');
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Loading Administrative Console...</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldAlert size={32} style={{ color: '#a78bfa' }} />
              <h2>EngiPath Administrative Console</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Manage skills graph, prerequisites, projects ladder, quiz questions, and platform analytics
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`btn btn-sm ${activeTab === 'metrics' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BarChart2 size={16} /> Platform Metrics
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`btn btn-sm ${activeTab === 'skills' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <BookOpen size={16} /> Manage Skills & Prerequisites
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`btn btn-sm ${activeTab === 'projects' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <FolderGit2 size={16} /> Manage Projects
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`btn btn-sm ${activeTab === 'quiz' ? 'btn-primary' : 'btn-secondary'}`}
          >
            <HelpCircle size={16} /> Manage Quiz Questions
          </button>
        </div>

        {/* TAB 1: METRICS */}
        {activeTab === 'metrics' && metrics && (
          <div>
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <div className="glass-card">
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>TOTAL STUDENTS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#60a5fa' }}>{metrics.totalStudents}</div>
              </div>
              <div className="glass-card">
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>ACTIVE SKILLS IN GRAPH</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#34d399' }}>{metrics.totalSkills}</div>
              </div>
              <div className="glass-card">
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>RECOMMENDED PROJECTS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#a78bfa' }}>{metrics.totalProjects}</div>
              </div>
              <div className="glass-card">
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>QUIZ QUESTIONS</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fbbf24' }}>{metrics.totalQuizQuestions}</div>
              </div>
            </div>

            {/* Common Skill Gaps Table */}
            <div className="glass-card">
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Most Common Student Skill Gaps</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-light)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '0.75rem' }}>Skill Name</th>
                    <th style={{ padding: '0.75rem' }}>Students Pending / Missing</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.commonSkillGaps.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem', fontWeight: '600' }}>{item.skill}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span className="badge badge-developing">{item.count} Students</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE SKILLS */}
        {activeTab === 'skills' && (
          <div className="grid-2">
            {/* Create Skill Form */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Add New Skill to Graph</h3>
              <form onSubmit={handleCreateSkill}>
                <div className="form-group">
                  <label>Skill Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. TypeScript Fundamentals"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Describe skill concepts..."
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Category</label>
                    <select
                      className="form-control"
                      value={newSkill.category}
                      onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    >
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="DevOps">DevOps</option>
                      <option value="Core Engineering">Core Engineering</option>
                      <option value="Security">Security</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Hours</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newSkill.estimatedHours}
                      onChange={(e) => setNewSkill({ ...newSkill, estimatedHours: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={16} /> Create Skill Node
                </button>
              </form>
            </div>

            {/* List Skills */}
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Existing Skills in Graph</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {skills.map(s => (
                  <div key={s._id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{s.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {s.category} &bull; {s.estimatedHours} hrs
                      </div>
                    </div>
                    <button onClick={() => handleDeleteSkill(s._id)} className="btn btn-secondary btn-sm" style={{ color: '#fb7185' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE PROJECTS */}
        {activeTab === 'projects' && (
          <div className="grid-2">
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Add New Recommended Project</h3>
              <form onSubmit={handleCreateProject}>
                <div className="form-group">
                  <label>Project Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. E-Commerce Microservices API"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Project specs..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      className="form-control"
                      value={newProject.difficulty}
                      onChange={(e) => setNewProject({ ...newProject, difficulty: e.target.value })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Estimated Hours</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newProject.estimatedHours}
                      onChange={(e) => setNewProject({ ...newProject, estimatedHours: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Checklist Milestones (one per line)</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Setup Express Server&#10;Implement JWT Protection"
                    value={newProject.checklist}
                    onChange={(e) => setNewProject({ ...newProject, checklist: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={16} /> Create Project
                </button>
              </form>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Existing Projects</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {projects.map(p => (
                  <div key={p._id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{p.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Difficulty: {p.difficulty} &bull; {p.estimatedHours} hrs
                      </div>
                    </div>
                    <button onClick={() => handleDeleteProject(p._id)} className="btn btn-secondary btn-sm" style={{ color: '#fb7185' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE QUIZ */}
        {activeTab === 'quiz' && (
          <div className="grid-2">
            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Add Quiz MCQ Question</h3>
              <form onSubmit={handleCreateQuiz}>
                <div className="form-group">
                  <label>Target Skill</label>
                  <select
                    className="form-control"
                    value={newQuiz.skillId}
                    onChange={(e) => setNewQuiz({ ...newQuiz, skillId: e.target.value })}
                    required
                  >
                    <option value="">-- Select Skill --</option>
                    {skills.map(s => (
                      <option key={s._id} value={s._id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Question Text</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. What is the default port for Express?"
                    value={newQuiz.question}
                    onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                    required
                  />
                </div>

                {newQuiz.options.map((opt, idx) => (
                  <div className="form-group" key={idx}>
                    <label>Option {idx + 1} {idx === Number(newQuiz.correctAnswer) && '(Correct Choice)'}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newQuiz.options];
                        copy[idx] = e.target.value;
                        setNewQuiz({ ...newQuiz, options: copy });
                      }}
                      required
                    />
                  </div>
                ))}

                <div className="grid-2">
                  <div className="form-group">
                    <label>Correct Choice Index</label>
                    <select
                      className="form-control"
                      value={newQuiz.correctAnswer}
                      onChange={(e) => setNewQuiz({ ...newQuiz, correctAnswer: Number(e.target.value) })}
                    >
                      <option value={0}>Option 1</option>
                      <option value={1}>Option 2</option>
                      <option value={2}>Option 3</option>
                      <option value={3}>Option 4</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Difficulty</label>
                    <select
                      className="form-control"
                      value={newQuiz.difficulty}
                      onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Explanation Text</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Explain why this answer is correct..."
                    value={newQuiz.explanation}
                    onChange={(e) => setNewQuiz({ ...newQuiz, explanation: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  <Plus size={16} /> Add Quiz Question
                </button>
              </form>
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: '1.25rem' }}>Existing Quiz Questions ({quizQuestions.length})</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {quizQuestions.map(q => (
                  <div key={q._id} style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15,23,42,0.6)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{q.question}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Skill: {q.skillName} &bull; Correct: Option {q.correctAnswer + 1}
                      </div>
                    </div>
                    <button onClick={() => handleDeleteQuiz(q._id)} className="btn btn-secondary btn-sm" style={{ color: '#fb7185' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
