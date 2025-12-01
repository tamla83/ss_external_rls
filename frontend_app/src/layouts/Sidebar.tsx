import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div style={sidebarStyle}>
      <h3>Navigation</h3>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/" style={linkStyle}>Dashboard</Link></li>
          {/* Add more links here later */}
        </ul>
      </nav>
    </div>
  );
};

const sidebarStyle: React.CSSProperties = {
  width: '200px',
  backgroundColor: '#f4f4f4',
  padding: '20px',
  height: '100vh',
  position: 'fixed',
  top: 0,
  left: 0,
};

const linkStyle = {
  textDecoration: 'none',
  color: '#333',
  display: 'block',
  padding: '8px 0',
};

export default Sidebar;