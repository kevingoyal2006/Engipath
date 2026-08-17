import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    branch: 'Computer Science',
    year: '3rd Year',
    weeklyStudyHours: 10,
    learningPreference: 'hands-on'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/assessment'); // Prompt new students to take assessment
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try a different email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="glass-card">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Create EngiPath Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Set up your engineering profile & generate your placement roadmap
            </p>
          </div>

          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              color: '#fb7185',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                className="form-control"
                placeholder="e.g. Alex Rivera"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="alex@university.edu"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password (min 6 characters)</label>
              <input
                type="password"
                name="password"
                className="form-control"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Engineering Branch</label>
                <select name="branch" className="form-control" value={formData.branch} onChange={handleChange}>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Comm</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical / Civil">Mechanical / Civil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current Academic Year</label>
                <select name="year" className="form-control" value={formData.year} onChange={handleChange}>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final">4th Year / Final</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Weekly Study Hours</label>
                <input
                  type="number"
                  name="weeklyStudyHours"
                  className="form-control"
                  min="2"
                  max="60"
                  value={formData.weeklyStudyHours}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Learning Style</label>
                <select name="learningPreference" className="form-control" value={formData.learningPreference} onChange={handleChange}>
                  <option value="hands-on">Hands-On Projects</option>
                  <option value="visual">Visual & Video Tutorials</option>
                  <option value="reading">Docs & Books Reading</option>
                  <option value="balanced">Balanced Mixture</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register & Take Assessment</>}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already registered? <Link to="/login" style={{ fontWeight: '600' }}>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
