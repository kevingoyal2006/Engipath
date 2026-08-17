import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  FolderGit2, Lock, CheckCircle2, Clock, 
  CheckSquare, Filter
} from 'lucide-react';

const Projects = () => {
  const [projectsData, setProjectsData] = useState([]);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/recommendations');
      if (res.data.success && res.data.projects) {
        setProjectsData(res.data.projects);
      }
    } catch (err) {
      console.error('Failed to load project recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleCompletion = async (projectId) => {
    setTogglingId(projectId);
    try {
      const res = await API.patch(`/projects/${projectId}/complete`);
      if (res.data.success) {
        await fetchProjects(); // Refresh status & readiness
      }
    } catch (err) {
      alert('Failed to update project status');
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Evaluating Project Prerequisites...</h3>
      </div>
    );
  }

  const filteredProjects = projectsData.filter(item => {
    if (filterDifficulty !== 'all' && item.project.difficulty !== filterDifficulty) return false;
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1050px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <FolderGit2 size={32} style={{ color: 'var(--gossamer-orange)' }} />
              <h2>Recommended Projects Ladder</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Build real-world portfolio projects to boost your Placement Readiness Score
            </p>
          </div>

          {/* Filters Bar */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              <Filter size={16} /> Filters:
            </div>
            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              className="form-control"
              style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="recommended">Recommended</option>
              <option value="completed">Completed</option>
              <option value="locked">Locked</option>
            </select>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
            <p style={{ color: 'var(--text-muted)' }}>No projects matching the selected filter criteria.</p>
          </div>
        ) : (
          /* Project Cards Grid */
          <div className="grid-2">
            {filteredProjects.map(({ project, status, completedSkillsCount, totalRequiredSkills, matchPercentage }) => {
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';

              return (
                <div
                  key={project._id}
                  className="glass-card"
                  style={{
                    position: 'relative',
                    opacity: isLocked ? 0.75 : 1,
                    borderLeft: `4px solid ${
                      isCompleted ? '#2BCFCE' : (isLocked ? '#939599' : '#EC4D25')
                    }`
                  }}
                >
                  {/* Header Badge */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span className={`badge badge-${status}`}>
                        {isLocked && <Lock size={12} />}
                        {isCompleted && <CheckCircle2 size={12} />}
                        {status}
                      </span>
                      <span className="badge badge-recommended" style={{ textTransform: 'capitalize' }}>
                        {project.difficulty}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.85rem', color: isLocked ? 'var(--text-dim)' : '#0F9F9E', fontWeight: '700' }}>
                      {matchPercentage}% Skill Match
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{project.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    {project.description}
                  </p>

                  {/* Required Skills & Status */}
                  <div style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-light)',
                    marginBottom: '1.25rem',
                    fontSize: '0.85rem'
                  }}>
                    <div style={{ color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      Prerequisite Skills: ({completedSkillsCount} / {totalRequiredSkills} completed)
                    </div>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {project.requiredSkills.map(s => (
                        <span key={s._id} style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: '#FFFFFF',
                          border: '1px solid var(--border-light)',
                          fontSize: '0.78rem'
                        }}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Checklist */}
                  {project.checklist && project.checklist.length > 0 && (
                    <div style={{ marginBottom: '1.25rem' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.4rem' }}>
                        Project Milestone Checklist:
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {project.checklist.map((item, idx) => (
                          <li key={idx} style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <CheckSquare size={14} style={{ color: 'var(--gossamer-orange)' }} /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action button */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Clock size={15} /> Est. {project.estimatedHours} hrs
                    </div>

                    <button
                      onClick={() => handleToggleCompletion(project._id)}
                      className={`btn btn-sm ${isCompleted ? 'btn-secondary' : (isLocked ? 'btn-secondary' : 'btn-emerald')}`}
                      disabled={togglingId === project._id}
                    >
                      {isCompleted ? 'Mark Incomplete' : 'Mark Completed (+10% Score)'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
