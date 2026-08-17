import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { 
  HelpCircle, CheckCircle2, XCircle, Award, ArrowRight, 
  RefreshCw, BookOpen, Layers, CheckSquare, Sparkles 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Assessment = () => {
  const { user } = useAuth();
  const [skillGroups, setSkillGroups] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('all'); // 'all' or specific skillId
  const [answersMap, setAnswersMap] = useState({});
  const [submissionResult, setSubmissionResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    setSubmissionResult(null);
    setAnswersMap({});
    try {
      const res = await API.get('/assessments/questions');
      if (res.data.success && res.data.data) {
        setSkillGroups(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load quiz questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    if (submissionResult) return;
    setAnswersMap(prev => ({
      ...prev,
      [questionId]: Number(optionIndex)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(answersMap).length === 0) {
      alert('Please select an answer for at least one question before submitting.');
      return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = Object.entries(answersMap).map(([qId, optIdx]) => ({
        questionId: qId,
        selectedOption: Number(optIdx)
      }));

      const res = await API.post('/assessments/submit', { answers: formattedAnswers });
      if (res.data.success) {
        setSubmissionResult(res.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Assessment submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h3 style={{ color: 'var(--text-muted)' }}>Loading Topic Skill Quizzes...</h3>
      </div>
    );
  }

  // Filter skill groups by selected topic
  const activeGroups = selectedTopicId === 'all'
    ? skillGroups
    : skillGroups.filter(g => g.skillId === selectedTopicId);

  const totalQuestionsCount = activeGroups.reduce((sum, g) => sum + g.questions.length, 0);
  const answeredCount = Object.keys(answersMap).length;

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '950px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <HelpCircle size={32} style={{ color: 'var(--gossamer-orange)' }} />
              <h2>Full-Stack Topic Skill Assessments</h2>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              10 Technical Questions per Topic &bull; Target Career: <strong style={{ color: 'var(--text-main)' }}>{user?.targetCareer?.name || 'Full-Stack Web Developer'}</strong>
            </p>
          </div>

          {submissionResult && (
            <button onClick={fetchQuestions} className="btn btn-secondary btn-sm">
              <RefreshCw size={16} /> Retake Quiz
            </button>
          )}
        </div>

        {/* TOPIC QUIZ SELECTOR BAR */}
        <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--gossamer-orange)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', fontSize: '0.95rem' }}>
              <Layers size={18} style={{ color: 'var(--gossamer-orange)' }} /> Select Quiz Topic (10 Questions Each):
            </div>

            <select
              className="form-control"
              style={{ width: 'auto', minWidth: '260px', padding: '0.5rem 0.85rem', fontWeight: '600' }}
              value={selectedTopicId}
              onChange={(e) => {
                setSelectedTopicId(e.target.value);
                setSubmissionResult(null);
                setAnswersMap({});
              }}
            >
              <option value="all">🌟 All Topics Diagnostic Quiz ({skillGroups.reduce((sum, g) => sum + g.questions.length, 0)} Questions)</option>
              {skillGroups.map(group => (
                <option key={group.skillId} value={group.skillId}>
                  🎯 {group.skillName} Quiz ({group.questions.length} Questions)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Post-Submission Summary Banner */}
        {submissionResult && (
          <div className="glass-card" style={{
            marginBottom: '2.5rem',
            background: 'linear-gradient(135deg, rgba(43, 207, 206, 0.15) 0%, rgba(236, 77, 37, 0.15) 100%)',
            borderColor: 'rgba(43, 207, 206, 0.4)',
            textAlign: 'center',
            padding: '2rem'
          }}>
            <Award size={48} style={{ color: '#0F9F9E', marginBottom: '1rem' }} />
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
              Topic Quiz Score: {submissionResult.summary.overallScorePercentage}%
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              You correctly answered {submissionResult.summary.overallCorrect} out of {submissionResult.summary.totalSubmitted} questions! Skill scores, placement-readiness score, and activity feed updated.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/dashboard" className="btn btn-emerald">
                View Monitored Score on Dashboard <ArrowRight size={18} />
              </Link>
              <Link to="/roadmap" className="btn btn-secondary">
                View Ordered Roadmap
              </Link>
            </div>
          </div>
        )}

        {/* Quiz Form */}
        <form onSubmit={handleSubmit}>
          {!submissionResult && (
            <div style={{
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              fontSize: '0.88rem',
              color: 'var(--text-muted)',
              fontWeight: '600'
            }}>
              <span>Answered {answeredCount} of {totalQuestionsCount} Questions</span>
              <span className="badge badge-recommended">
                {Math.round((answeredCount / Math.max(1, totalQuestionsCount)) * 100)}% Answered
              </span>
            </div>
          )}

          {activeGroups.map((group) => (
            <div key={group.skillId} className="glass-card" style={{ marginBottom: '2rem' }}>
              <div style={{
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                paddingBottom: '1rem',
                borderBottom: '1px solid var(--border-light)',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: 'var(--gossamer-orange)' }} />
                  <h3 style={{ fontSize: '1.3rem' }}>{group.skillName} Quiz</h3>
                </div>
                <span className="badge badge-recommended">{group.questions.length} Questions</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
                {group.questions.map((q, qIndex) => {
                  const selectedOpt = answersMap[q._id];
                  const resultItem = submissionResult?.results?.find(r => r.questionId === q._id);

                  return (
                    <div
                      key={q._id}
                      style={{
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--bg-card-subtle)',
                        border: '1px solid var(--border-light)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '600' }}>
                          Q{qIndex + 1}. {q.question}
                        </h4>
                        <span className="badge badge-recommended" style={{ fontSize: '0.72rem', textTransform: 'capitalize' }}>
                          {q.difficulty}
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {q.options.map((optionText, optIdx) => {
                          const isSelected = Number(selectedOpt) === optIdx;
                          let optionStyle = {
                            padding: '0.75rem 1rem',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-light)',
                            background: '#FFFFFF',
                            cursor: submissionResult ? 'default' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.95rem',
                            transition: 'all 0.2s ease'
                          };

                          if (isSelected) {
                            optionStyle.borderColor = 'var(--gossamer-orange)';
                            optionStyle.background = 'rgba(236, 77, 37, 0.08)';
                          }

                          if (resultItem) {
                            if (optIdx === resultItem.correctAnswer) {
                              optionStyle.borderColor = '#2BCFCE';
                              optionStyle.background = 'rgba(43, 207, 206, 0.15)';
                              optionStyle.color = '#0F9F9E';
                              optionStyle.fontWeight = '600';
                            } else if (isSelected && !resultItem.isCorrect) {
                              optionStyle.borderColor = '#EC4D25';
                              optionStyle.background = 'rgba(236, 77, 37, 0.15)';
                              optionStyle.color = '#D63E17';
                            }
                          }

                          return (
                            <div
                              key={optIdx}
                              style={optionStyle}
                              onClick={() => handleOptionSelect(q._id, optIdx)}
                            >
                              <input
                                type="radio"
                                name={`question_${q._id}`}
                                checked={isSelected}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  handleOptionSelect(q._id, optIdx);
                                }}
                                disabled={!!submissionResult}
                                style={{ accentColor: 'var(--gossamer-orange)' }}
                              />
                              <span style={{ flex: 1 }}>{optionText}</span>

                              {resultItem && optIdx === resultItem.correctAnswer && (
                                <CheckCircle2 size={18} style={{ color: '#0F9F9E' }} />
                              )}
                              {resultItem && isSelected && !resultItem.isCorrect && (
                                <XCircle size={18} style={{ color: '#EC4D25' }} />
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Instant Explanation Display after submit */}
                      {resultItem && (
                        <div style={{
                          marginTop: '1rem',
                          padding: '0.85rem 1rem',
                          borderRadius: 'var(--radius-sm)',
                          background: resultItem.isCorrect ? 'rgba(43, 207, 206, 0.1)' : 'rgba(236, 77, 37, 0.1)',
                          borderLeft: `4px solid ${resultItem.isCorrect ? '#2BCFCE' : '#EC4D25'}`,
                          fontSize: '0.88rem'
                        }}>
                          <strong style={{ color: resultItem.isCorrect ? '#0F9F9E' : '#EC4D25' }}>
                            {resultItem.isCorrect ? 'Correct!' : 'Incorrect.'} Explanation:
                          </strong>
                          <p style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>
                            {resultItem.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {!submissionResult && activeGroups.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '0.9rem 2.5rem', fontSize: '1.1rem' }}
                disabled={submitting}
              >
                {submitting ? 'Evaluating Quiz Answers...' : 'Submit Quiz Answers & Update Score'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Assessment;
