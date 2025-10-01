import React from 'react';
import { Routes, Route, NavLink, Link, useLocation } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage';
import AttemptDetailPage from './pages/AttemptDetailPage';
import { AdminQuestionsPage } from './pages/AdminQuestionsPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminUsersPage from './pages/AdminUsersPage';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  const location = useLocation();

  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Barber Study App</h1>
        <nav className="app__nav">
          {!isAdmin && (
            <>
              <NavLink to="/" className={({ isActive }) => `app__nav-link${isActive ? ' app__nav-link--active' : ''}`}>Quiz</NavLink>
              {user && (
                <NavLink to="/history" className={({ isActive }) => `app__nav-link${isActive ? ' app__nav-link--active' : ''}`}>History</NavLink>
              )}
            </>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin/questions" className={({ isActive }) => `app__nav-link${isActive ? ' app__nav-link--active' : ''}`}>Admin</NavLink>
              {(() => {
                const active = location.pathname === '/' || location.pathname.startsWith('/admin/analytics');
                const cls = `app__nav-link${active ? ' app__nav-link--active' : ''}`;
                return <Link to="/admin/analytics" className={cls}>Analytics</Link>;
              })()}
              <NavLink to="/admin/users" className={({ isActive }) => `app__nav-link${isActive ? ' app__nav-link--active' : ''}`}>Users</NavLink>
            </>
          )}
          {user ? (
            <button className="app__nav-link" onClick={logout}>Logout ({user.name})</button>
          ) : (
            <Link to="/login" className="app__nav-link">Login</Link>
          )}
        </nav>
      </header>
      <main className="app__main">
        <Routes>
          {/* Login accessible to both */}
          <Route path="/login" element={<LoginPage />} />

          {/* Student routes */}
          {!isAdmin && (
            <>
              <Route path="/" element={<QuizPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:attemptId" element={<AttemptDetailPage />} />
            </>
          )}

          {/* Admin routes */}
          {isAdmin && (
            <>
              <Route path="/" element={<AdminAnalyticsPage />} />
              <Route path="/admin/questions" element={<AdminQuestionsPage />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </>
          )}
        </Routes>
      </main>
    </div>
  );
};

export default App;
