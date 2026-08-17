import React from 'react';
import { Compass } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      marginTop: '4rem',
      padding: '2.5rem 0',
      borderTop: '1px solid var(--border-light)',
      background: '#FFFFFF',
      color: 'var(--text-muted)',
      fontSize: '0.9rem'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} style={{ color: 'var(--gossamer-orange)' }} />
          <span style={{ fontWeight: '700', color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>EngiPath</span>
          <span>&copy; {new Date().getFullYear()} EngiPath - Gossamer Edition Roadmap Engine.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Documentation</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>API Status</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
