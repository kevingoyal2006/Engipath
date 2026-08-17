import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Link } from 'react-router-dom';
import { 
  Award, Zap, Clock, Route, FolderGit2, ArrowRight, 
  HelpCircle, CheckCircle2, Activity, Sparkles 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid 
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CDCDCF',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
        fontSize: '0.85rem'
      }}>
        <div style={{ fontWeight: '700', color: '#111827', marginBottom: '0.25rem' }}>{data.skill}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4B5563' }}>
          <span>Score: <strong style={{ color: '#EC4D25' }}>{data.score}%</strong></span>
          <span className={`badge badge-${(data.status || 'missing').replace('-', '_')}`} style={{ fontSize: '0.68rem' }}>
            {data.status}
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#939599', marginTop: '0.2rem' }}>
          Est. {data.estimatedHours} study hours
        </div>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get('/dashboard');
      if (res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Monitoring Activities & Calculating Readiness Score...</h3>
      </div>
    );
  }

  if (!data) return null;

  const { readiness, skillCounts, skillsBreakdown, weeklyPlan, nextAction, chartData, projectsSummary, user, hasCompletedAssessment, activities } = data;

  const getScoreColor = (score) => {
    if (score >= 70) return '#2BCFCE'; // Cyan
    if (score >= 40) return '#EC4D25'; // Orange
    return '#939599'; // Slate Gray
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Welcome Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem' }}>Welcome back, {user.name} 👋</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Target Career: <strong style={{ color: 'var(--text-main)' }}>{user.targetCareer}</strong> &bull; Year: {user.year} ({user.branch})
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/assessment" className="btn btn-secondary btn-sm">
              <HelpCircle size={16} /> Technical Assessment
            </Link>
            <Link to="/roadmap" className="btn btn-primary btn-sm">
              <Route size={16} /> View Roadmap
            </Link>
          </div>
        </div>

        {/* STEP 1: GUIDED ONBOARDING ASSESSMENT BANNER */}
        {!hasCompletedAssessment ? (
          <div className="glass-card" style={{
            marginBottom: '2rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, rgba(236, 77, 37, 0.12) 0%, rgba(43, 207, 206, 0.12) 100%)',
            borderColor: 'rgba(236, 77, 37, 0.4)',
            borderLeft: '6px solid var(--gossamer-orange)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem'
          }}>
            <div style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gossamer-orange)', fontWeight: '700', fontSize: '0.88rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                <Sparkles size={18} /> STEP 1: INITIAL ABILITY ASSESSMENT REQUIRED
              </div>
              <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>
                Take Your Assessment to Generate Roadmap & Projects
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                You have logged in! Next, complete your 5-minute technical assessment. EngiPath will analyze your abilities, compute your baseline Placement Readiness Score, generate your topological roadmap, and unlock matching project ladders.
              </p>
            </div>

            <Link to="/assessment" className="btn btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.05rem', whiteSpace: 'nowrap' }}>
              Take Assessment Now <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="glass-card" style={{
            marginBottom: '2rem',
            padding: '1.25rem 1.5rem',
            background: 'rgba(43, 207, 206, 0.08)',
            borderColor: 'rgba(43, 207, 206, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <CheckCircle2 size={24} style={{ color: '#0F9F9E' }} />
              <div>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Ability Analyzed & Roadmap Active</strong>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Your roadmap and project recommendations are active. Completing quizzes, skills, or projects monitors and updates your score live.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/roadmap" className="btn btn-emerald btn-sm">View Roadmap</Link>
              <Link to="/projects" className="btn btn-secondary btn-sm">View Projects</Link>
            </div>
          </div>
        )}

        {/* STEP 2: Top Metrics Grid */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          {/* 1. Placement Readiness Score Card */}
          <div className="glass-card" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Placement Readiness Score</h3>
            
            <div className="readiness-ring-container">
              <svg width="150" height="150" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--gossamer-light-gray)" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke={getScoreColor(readiness.totalScore)}
                  strokeWidth="10"
                  strokeDasharray="314.15"
                  strokeDashoffset={314.15 - (314.15 * readiness.totalScore) / 100}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
              </svg>
              <div className="readiness-value">
                <div className="score">{readiness.totalScore}%</div>
                <div className="label">READY</div>
              </div>
            </div>

            {/* Score Breakdown Monitored Components */}
            <div style={{
              marginTop: '1rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.4rem',
              fontSize: '0.75rem',
              textAlign: 'center'
            }}>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '0.4rem', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Skills</div>
                <strong style={{ color: 'var(--gossamer-orange)' }}>{readiness.breakdown.skillsComponent.score}/70</strong>
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '0.4rem', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Quiz</div>
                <strong style={{ color: 'var(--gossamer-cyan)' }}>{readiness.breakdown.assessmentComponent.score}/20</strong>
              </div>
              <div style={{ background: 'var(--bg-card-subtle)', padding: '0.4rem', borderRadius: '6px' }}>
                <div style={{ color: 'var(--text-muted)' }}>Projects</div>
                <strong style={{ color: '#0F9F9E' }}>{readiness.breakdown.projectsComponent.score}/10</strong>
              </div>
            </div>
          </div>

          {/* 2. Skill Gap Counts Card */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Skill Gap Classification</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-known">Known</span> ({skillCounts.known})
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {skillsBreakdown.known.slice(0, 3).join(', ') || 'None'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-developing">Developing</span> ({skillCounts.developing})
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {skillsBreakdown.developing.slice(0, 2).join(', ') || 'None'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-missing">Missing</span> ({skillCounts.missing})
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {skillsBreakdown.missing.slice(0, 2).join(', ') || 'None'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <Link to="/profile" style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--gossamer-orange)' }}>
                Update self-reported skills &rarr;
              </Link>
            </div>
          </div>

          {/* 3. Next Recommended Action Card */}
          <div className="glass-card" style={{
            background: 'linear-gradient(135deg, rgba(236, 77, 37, 0.08) 0%, rgba(43, 207, 206, 0.08) 100%)',
            borderColor: 'rgba(236, 77, 37, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            justify: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: 'var(--gossamer-orange)' }}>
                <Zap size={20} />
                <span style={{ fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  NEXT RECOMMENDED ACTION
                </span>
              </div>

              {nextAction && (
                <>
                  <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>{nextAction.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {nextAction.description}
                  </p>
                  {nextAction.estimatedHours && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Clock size={16} /> Est. {nextAction.estimatedHours} hours
                    </div>
                  )}
                </>
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link
                to={!hasCompletedAssessment ? "/assessment" : "/roadmap"}
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
              >
                Execute Action <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* STEP 2: Activity Log & Weekly Plan */}
        <div className="grid-2" style={{ marginBottom: '2rem' }}>
          {/* Monitored Activity Log */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={20} style={{ color: 'var(--gossamer-cyan)' }} /> Monitored Activity Feed & Score Impacts
              </h3>
              <span className="badge badge-recommended">Live Monitor</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
              {activities && activities.length > 0 ? (
                activities.map((act, aIdx) => (
                  <div key={aIdx} style={{
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-card-subtle)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    justify: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>{act.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} &bull; {act.type.toUpperCase()}
                      </div>
                    </div>
                    <span className="badge badge-known" style={{ fontSize: '0.75rem' }}>
                      {act.scoreImpact}
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '1rem 0' }}>
                  No activities recorded yet. Complete quizzes, update skill progress, or complete projects to log activity!
                </div>
              )}
            </div>
          </div>

          {/* Weekly Plan */}
          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Clock size={20} style={{ color: 'var(--gossamer-orange)' }} /> This Week's Study Plan
              </h3>
              <span className="badge badge-recommended">
                {weeklyPlan.plannedHoursThisWeek} / {weeklyPlan.weeklyStudyHours} hrs allocated
              </span>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Bounded by your declared limit of {weeklyPlan.weeklyStudyHours} hrs/week. Est. {weeklyPlan.estimatedWeeksRemaining} weeks remaining.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {weeklyPlan.tasksThisWeek.length > 0 ? (
                weeklyPlan.tasksThisWeek.map((task, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justify: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '0.95rem' }}>{task.skillName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Category: {task.category} &bull; Prereqs: {task.prerequisitesMet ? '✅ Met' : '⚠️ Incomplete'}
                      </div>
                    </div>
                    <span className="badge badge-recommended" style={{ fontSize: '0.75rem' }}>
                      {task.suggestedHoursThisWeek} hrs
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No pending tasks for this week! All required skills are completed.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ENHANCED CHART UI: Skill Mastery & Quiz Scores Monitor */}
        <div className="glass-card" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={20} style={{ color: 'var(--gossamer-cyan)' }} /> Skill Mastery & Quiz Scores Monitor
            </h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: '600' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2BCFCE' }} /> Mastery (&ge;70%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#EC4D25' }} /> Developing (1-69%)
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#939599' }} /> Missing (0%)
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: 340 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 20, left: -10, bottom: 85 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="skill"
                  stroke="#939599"
                  fontSize={11}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={80}
                  tick={{ fill: '#374151', fontWeight: 600 }}
                  tickFormatter={(val) => (val && val.length > 15 ? `${val.substring(0, 13)}..` : val)}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#939599"
                  fontSize={11}
                  tickLine={false}
                  tick={{ fill: '#374151', fontWeight: 600 }}
                  unit="%"
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="score" maxBarSize={36} radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScoreColor(entry.score)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Projects Widget */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FolderGit2 size={20} style={{ color: 'var(--gossamer-orange)' }} /> Recommended Projects Ladder
            </h3>
            <Link to="/projects" className="btn btn-secondary btn-sm">
              View All Projects &rarr;
            </Link>
          </div>

          <div className="grid-3">
            {projectsSummary.recommended.map((item) => (
              <div
                key={item.project._id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-subtle)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-recommended">{item.project.difficulty}</span>
                  <span style={{ fontSize: '0.8rem', color: '#0F9F9E', fontWeight: '700' }}>
                    {item.matchPercentage}% Skill Match
                  </span>
                </div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{item.project.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.project.description}
                </p>
                <Link to="/projects" className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  View Project Checklist
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
