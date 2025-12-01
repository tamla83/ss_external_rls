import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './layouts/Sidebar';
import DashboardPage from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            {/* Add more routes here later */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;