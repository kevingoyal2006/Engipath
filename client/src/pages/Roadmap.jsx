import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  Route, CheckCircle2, Clock, BookOpen, CheckSquare, 
  ExternalLink, AlertTriangle, RefreshCw, Compass, Video, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Roadmap = () => {
  const { user, updateUser } = useAuth();
  const [data, setData] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingSkillId, setUpdatingSkillId] = useState(null);

  useEffect(() => {
    fetchRoadmapAndCareers();
  }, []);

  const fetchRoadmapAndCareers = async () => {
    setLoading(true);
    try {
      const [rRes, cRes] = await Promise.all([
        API.get('/roadmap'),
        API.get('/careers')
      ]);

      if (rRes.data.success) {
        setData(rRes.data);
      }

      if (cRes.data.success) {
        setCareerPaths(cRes.data.careers);
      }
    } catch (err) {
      console.error('Failed to load roadmap or careers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCareerSwitch = async (careerId) => {
    try {
      const res = await API.put('/profile', { targetCareer: careerId });
      if (res.data.success) {
        updateUser(res.data.user);
        await fetchRoadmapAndCareers();
      }
    } catch (err) {
      alert('Failed to switch career path');
    }
  };

  const handleStatusChange = async (skillId, newStatus) => {
    setUpdatingSkillId(skillId);
    try {
      const res = await API.patch(`/progress/${skillId}`, { status: newStatus });
      if (res.data.success) {
        await fetchRoadmapAndCareers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update progress');
    } finally {
      setUpdatingSkillId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Generating Prerequisite Topological Roadmap...</h3>
      </div>
    );
  }

  if (!data) return null;

  const { roadmap, targetCareer, weeklyPlan, weeklyStudyHours } = data;
  const learningPref = user?.learningPreference || 'hands-on';

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header with Career Switcher */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Route size={32} style={{ color: 'var(--gossamer-orange)' }} />
              <h2>Topological Career Roadmap</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Prerequisite DAG Order customized for <strong style={{ color: 'var(--text-main)' }}>{targetCareer ? targetCareer.name : 'Full-Stack Web Developer'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Career Selector Criteria Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Compass size={16} style={{ color: 'var(--gossamer-orange)' }} />
              <select
                className="form-control"
                style={{ width: 'auto', padding: '0.45rem 0.85rem', fontSize: '0.88rem', fontWeight: '600' }}
                value={targetCareer?.id || targetCareer?._id || ''}
                onChange={(e) => handleCareerSwitch(e.target.value)}
              >
                {careerPaths.map(cp => (
                  <option key={cp._id} value={cp._id}>
                    Path: {cp.name}
                  </option>
                ))}
              </select>
            </div>

            <button onClick={fetchRoadmapAndCareers} className="btn btn-secondary btn-sm">
              <RefreshCw size={16} /> Refresh Graph
            </button>
          </div>
        </div>

        {/* User-Selected Criteria Summary Card */}
        <div className="glass-card" style={{
          marginBottom: '2rem',
          padding: '1.25rem 1.5rem',
          background: 'linear-gradient(135deg, rgba(236, 77, 37, 0.06) 0%, rgba(43, 207, 206, 0.08) 100%)',
          borderColor: 'rgba(43, 207, 206, 0.4)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              🎯 SELECTED CAREER PATH
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {targetCareer ? targetCareer.name : 'Full-Stack Web Developer'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              ⏱️ WEEKLY COMMITMENT
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>
              {weeklyStudyHours} hrs/week ({weeklyPlan?.estimatedWeeksRemaining || 0} wks remaining)
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              📖 LEARNING STYLE PREFERENCE
            </div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)', marginTop: '0.2rem', textTransform: 'capitalize' }}>
              {learningPref} Focus
            </div>
          </div>
        </div>

        {/* Timeline representation */}
        <div className="timeline">
          {roadmap.map((item, index) => {
            const { skill, order, prerequisites, prerequisitesMet, estimatedHours, resources, miniTask, status, isRequiredForTarget } = item;

            let dotClass = '';
            if (status === 'completed') dotClass = 'completed';
            else if (status === 'in-progress') dotClass = 'in-progress';

            return (
              <div key={skill._id} className="timeline-item">
                <div className={`timeline-dot ${dotClass}`} />

                <div className="glass-card" style={{
                  borderLeft: `4px solid ${
                    status === 'completed' ? '#2BCFCE' : (status === 'in-progress' ? '#EC4D25' : 'var(--border-light)')
                  }`,
                  opacity: isRequiredForTarget ? 1 : 0.8
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--gossamer-orange)' }}>
                          MODULE {order}
                        </span>
                        <h3 style={{ fontSize: '1.35rem' }}>{skill.name}</h3>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{skill.description}</p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={`badge badge-${status.replace('-', '_')}`}>
                        {status.replace('-', ' ')}
                      </span>
                      {isRequiredForTarget ? (
                        <span className="badge badge-recommended">
                          Target Core
                        </span>
                      ) : (
                        <span className="badge badge-locked">
                          Optional Skill
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites Indicator */}
                  {prerequisites.length > 0 && (
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      background: prerequisitesMet ? 'rgba(43, 207, 206, 0.08)' : 'rgba(236, 77, 37, 0.08)',
                      border: `1px solid ${prerequisitesMet ? 'rgba(43, 207, 206, 0.3)' : 'rgba(236, 77, 37, 0.3)'}`,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1rem'
                    }}>
                      {prerequisitesMet ? (
                        <CheckCircle2 size={16} style={{ color: '#0F9F9E' }} />
                      ) : (
                        <AlertTriangle size={16} style={{ color: '#EC4D25' }} />
                      )}
                      <span>
                        <strong>Prerequisites:</strong>{' '}
                        {prerequisites.map(p => `${p.name} (${p.completed ? 'Completed' : 'Pending'})`).join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Hours & Action Controls */}
                  <div style={{
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid var(--border-light)',
                    marginBottom: '1.25rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} /> Estimated: {estimatedHours} study hours
                    </div>

                    {/* Status Controls */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleStatusChange(skill._id, 'not-started')}
                        className={`btn btn-sm ${status === 'not-started' ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={updatingSkillId === skill._id}
                      >
                        Not Started
                      </button>
                      <button
                        onClick={() => handleStatusChange(skill._id, 'in-progress')}
                        className={`btn btn-sm ${status === 'in-progress' ? 'btn-primary' : 'btn-secondary'}`}
                        disabled={updatingSkillId === skill._id}
                      >
                        In Progress
                      </button>
                      <button
                        onClick={() => handleStatusChange(skill._id, 'completed')}
                        className={`btn btn-sm ${status === 'completed' ? 'btn-emerald' : 'btn-secondary'}`}
                        disabled={updatingSkillId === skill._id}
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>

                  {/* Resources & Mini-Task Grid */}
                  <div className="grid-2">
                    {/* Learning Resources tailored to Learning Preference */}
                    <div style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-light)'
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <BookOpen size={16} style={{ color: 'var(--gossamer-orange)' }} /> Curated Resources ({learningPref} focus)
                      </div>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {resources.map((res, rIdx) => {
                          const matchesPref = (learningPref === 'visual' && res.type === 'video') ||
                                              (learningPref === 'reading' && res.type === 'docs');
                          return (
                            <li key={rIdx}>
                              <a href={res.url} target="_blank" rel="noreferrer" style={{
                                fontSize: '0.85rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                color: matchesPref ? 'var(--gossamer-orange)' : 'var(--text-main)',
                                fontWeight: matchesPref ? '700' : '500'
                              }}>
                                <ExternalLink size={12} /> {res.title}
                                <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>({res.type})</span>
                                {matchesPref && <span className="badge badge-recommended" style={{ fontSize: '0.65rem' }}>Top Pick</span>}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* Mini Task */}
                    {miniTask && (
                      <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-light)'
                      }}>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <CheckSquare size={16} style={{ color: '#0F9F9E' }} /> Mini Task: {miniTask.title}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          {miniTask.description}
                        </p>
                        {miniTask.instructions && miniTask.instructions.length > 0 && (
                          <ul style={{ fontSize: '0.78rem', color: 'var(--text-dim)', paddingLeft: '1.2rem' }}>
                            {miniTask.instructions.map((inst, iIdx) => (
                              <li key={iIdx}>{inst}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
