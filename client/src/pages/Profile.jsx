import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  User, Save, Sliders, BookOpen, GraduationCap, 
  Globe, Github, Linkedin, Briefcase, Compass
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    branch: user?.branch || 'Computer Science',
    year: user?.year || '3rd Year',
    collegeName: user?.collegeName || '',
    cgpa: user?.cgpa || 8.5,
    graduationYear: user?.graduationYear || 2027,
    targetCareer: user?.targetCareer?._id || user?.targetCareer || '',
    githubUrl: user?.githubUrl || '',
    linkedinUrl: user?.linkedinUrl || '',
    portfolioUrl: user?.portfolioUrl || '',
    targetCompanies: Array.isArray(user?.targetCompanies) ? user.targetCompanies.join(', ') : (user?.targetCompanies || ''),
    preferredRoles: Array.isArray(user?.preferredRoles) ? user.preferredRoles.join(', ') : (user?.preferredRoles || ''),
    bio: user?.bio || '',
    weeklyStudyHours: user?.weeklyStudyHours || 10,
    learningPreference: user?.learningPreference || 'hands-on'
  });

  const [careerPaths, setCareerPaths] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillsMap, setSelectedSkillsMap] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, [user]);

  const fetchProfileData = async () => {
    try {
      const [careersRes, roadmapRes] = await Promise.all([
        API.get('/careers'),
        API.get('/roadmap')
      ]);

      if (careersRes.data.success) {
        setCareerPaths(careersRes.data.careers);
      }

      if (roadmapRes.data.roadmap) {
        setAllSkills(roadmapRes.data.roadmap.map(item => item.skill));
      }

      // Prepopulate selected skills map
      const initialMap = {};
      if (user?.skills) {
        user.skills.forEach(s => {
          const id = s.skillId?._id ? s.skillId._id.toString() : s.skillId.toString();
          initialMap[id] = {
            level: s.level || 'intermediate',
            score: s.score || 50
          };
        });
      }
      setSelectedSkillsMap(initialMap);
    } catch (err) {
      console.error('Error loading profile options:', err);
    }
  };

  const handleToggleSkill = (skillIdStr) => {
    setSelectedSkillsMap(prev => {
      const copy = { ...prev };
      if (copy[skillIdStr]) {
        delete copy[skillIdStr];
      } else {
        copy[skillIdStr] = { level: 'intermediate', score: 60 };
      }
      return copy;
    });
  };

  const handleLevelChange = (skillIdStr, newLevel) => {
    setSelectedSkillsMap(prev => ({
      ...prev,
      [skillIdStr]: {
        ...prev[skillIdStr],
        level: newLevel,
        score: newLevel === 'advanced' ? 85 : (newLevel === 'intermediate' ? 60 : 35)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const skillsArray = Object.entries(selectedSkillsMap).map(([sId, val]) => ({
        skillId: sId,
        level: val.level,
        score: val.score
      }));

      const payload = {
        ...formData,
        skills: skillsArray
      };

      const res = await API.put('/profile', payload);
      if (res.data.success) {
        updateUser(res.data.user);
        setMessage({ type: 'success', text: 'Career criteria & profile updated! Roadmap, Projects, and Assessment re-differentiated.' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <User size={36} style={{ color: 'var(--gossamer-orange)' }} />
          <div>
            <h2>Engineering Student Profile & Career Criteria</h2>
            <p style={{ color: 'var(--text-muted)' }}>Configure academic metrics, career targets, study hours, and known skills</p>
          </div>
        </div>

        {message.text && (
          <div className="glass-card" style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: message.type === 'success' ? 'rgba(43, 207, 206, 0.12)' : 'rgba(236, 77, 37, 0.12)',
            borderColor: message.type === 'success' ? 'rgba(43, 207, 206, 0.4)' : 'rgba(236, 77, 37, 0.4)',
            color: message.type === 'success' ? '#0F9F9E' : '#EC4D25',
            fontWeight: '600'
          }}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* SECTION 1: Target Career Selection */}
          <div className="glass-card" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--gossamer-orange)' }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Compass size={22} style={{ color: 'var(--gossamer-orange)' }} /> Target Career Path Selection
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Selecting a career path customizes the topological roadmap order, project recommendations, and quiz focus.
            </p>

            <div className="form-group">
              <label style={{ fontWeight: '700' }}>Select Your Desired Engineering Path</label>
              <select
                className="form-control"
                style={{ fontSize: '1rem', padding: '0.85rem' }}
                value={formData.targetCareer}
                onChange={(e) => setFormData({ ...formData, targetCareer: e.target.value })}
              >
                <option value="">-- Choose Career Goal --</option>
                {careerPaths.map(cp => (
                  <option key={cp._id} value={cp._id}>
                    {cp.name} ({cp.description})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION 2: Academic Credentials */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GraduationCap size={22} style={{ color: 'var(--gossamer-orange)' }} /> Academic Credentials
            </h3>

            <div className="form-group">
              <label>College / University Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Indian Institute of Technology / BITS Pilani"
                value={formData.collegeName}
                onChange={(e) => setFormData({ ...formData, collegeName: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Engineering Branch</label>
                <select
                  className="form-control"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                >
                  <option value="Computer Science">Computer Science & Engineering</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Comm">Electronics & Communication</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical / Civil">Mechanical / Civil</option>
                </select>
              </div>

              <div className="form-group">
                <label>Current Academic Year</label>
                <select
                  className="form-control"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year / Final">4th Year / Final</option>
                </select>
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Cumulative CGPA (0.0 - 10.0)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-control"
                  placeholder="8.50"
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Expected Graduation Year</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="2027"
                  value={formData.graduationYear}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: Placement Targets & Statement */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Briefcase size={22} style={{ color: 'var(--gossamer-cyan)' }} /> Placement Target & Career Statement
            </h3>

            <div className="form-group">
              <label>Engineering Bio / Career Statement</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Brief summary of your technical interests and career aspirations..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Target Companies (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Google, Microsoft, Amazon, Stripe"
                  value={formData.targetCompanies}
                  onChange={(e) => setFormData({ ...formData, targetCompanies: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Preferred Roles (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Full-Stack Developer, Frontend Architect"
                  value={formData.preferredRoles}
                  onChange={(e) => setFormData({ ...formData, preferredRoles: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: Social & Portfolio Links */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Globe size={22} style={{ color: 'var(--gossamer-orange)' }} /> Social & Portfolio Links
            </h3>

            <div className="grid-3">
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Github size={16} /> GitHub Profile URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://github.com/username"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Linkedin size={16} /> LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Globe size={16} /> Personal Portfolio Website
                </label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://alexrivera.dev"
                  value={formData.portfolioUrl}
                  onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* SECTION 5: Study Time & Preferences */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sliders size={22} style={{ color: 'var(--gossamer-cyan)' }} /> Study Commitment & Preferences
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label>Weekly Dedicated Study Hours</label>
                <input
                  type="number"
                  className="form-control"
                  min="2"
                  max="60"
                  value={formData.weeklyStudyHours}
                  onChange={(e) => setFormData({ ...formData, weeklyStudyHours: Number(e.target.value) })}
                />
                <small style={{ color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>
                  Roadmap weekly tasks will strictly conform to this hour limit.
                </small>
              </div>

              <div className="form-group">
                <label>Learning Style</label>
                <select
                  className="form-control"
                  value={formData.learningPreference}
                  onChange={(e) => setFormData({ ...formData, learningPreference: e.target.value })}
                >
                  <option value="hands-on">Hands-On Building</option>
                  <option value="visual">Video Tutorials</option>
                  <option value="reading">Textbooks & Docs</option>
                  <option value="balanced">Balanced Mixture</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 6: Known Skills Multi-Select */}
          <div className="glass-card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BookOpen size={22} style={{ color: 'var(--gossamer-orange)' }} /> Self-Reported Known Skills (Multi-Select)
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Select skills you already possess or are developing to customize your starting roadmap.
            </p>

            <div className="grid-2">
              {allSkills.map(skill => {
                const sIdStr = skill._id.toString();
                const isSelected = !!selectedSkillsMap[sIdStr];
                const currentLevel = selectedSkillsMap[sIdStr]?.level || 'intermediate';

                return (
                  <div
                    key={sIdStr}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(43, 207, 206, 0.08)' : 'var(--bg-card-subtle)',
                      border: isSelected ? '1px solid rgba(43, 207, 206, 0.4)' : '1px solid var(--border-light)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontWeight: '600' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSkill(sIdStr)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--gossamer-orange)' }}
                        />
                        <span>{skill.name}</span>
                      </label>
                      <span className="badge badge-recommended" style={{ fontSize: '0.7rem' }}>{skill.category}</span>
                    </div>

                    {isSelected && (
                      <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                          Proficiency Level
                        </label>
                        <select
                          className="form-control"
                          style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                          value={currentLevel}
                          onChange={(e) => handleLevelChange(sIdStr, e.target.value)}
                        >
                          <option value="beginner">Beginner (Basic Knowledge)</option>
                          <option value="intermediate">Intermediate (Built Projects)</option>
                          <option value="advanced">Advanced (Mastered)</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }} disabled={loading}>
            <Save size={18} /> {loading ? 'Saving Profile...' : 'Save Profile & Differentiate All Modules'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
