// CEFR Academy - v1.0.3 - Premium Build
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import OnboardingSurvey from './pages/OnboardingSurvey';
import DashboardLayout from './pages/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Reading from './pages/Reading';
import Listening from './pages/Listening';
import Writing from './pages/Writing';
import Speaking from './pages/Speaking';
import Profile from './pages/Profile';
import Plan from './pages/Plan';
import Pricing from './pages/Pricing';
import AIChat from './pages/AIChat';
import Vocabulary from './pages/Vocabulary';
import { useState, useEffect } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [lang, setLang] = useState<'en' | 'uz'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'uz' : 'en'));
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Pass theme props recursively to main entry points
  const commonProps = { lang, toggleLang, theme, toggleTheme };

  return (
    <Router>
      <SpeedInsights />
      <Analytics />
      <Routes>
        {/* Unified Home & Onboarding */}
        <Route path="/" element={<OnboardingSurvey lang={lang} />} />

        {/* Auth with Navigation */}
        <Route path="/login" element={
          <div className="app-container">
            <Navigation {...commonProps} />
            <Login lang={lang} theme={theme} toggleLang={toggleLang} />
          </div>
        } />

        {/* Dashboard Routes with Sidebar Layout */}
        <Route path="/dashboard" element={<DashboardLayout {...commonProps} />}>
          <Route index element={<Dashboard lang={lang} />} />
          <Route path="reading" element={<Reading lang={lang} />} />
          <Route path="listening" element={<Listening lang={lang} />} />
          <Route path="writing" element={<Writing lang={lang} />} />
          <Route path="speaking" element={<Speaking lang={lang} />} />
          <Route path="profile" element={<Profile lang={lang} />} />
          <Route path="plan" element={<Plan lang={lang} />} />
          <Route path="pricing" element={<Pricing lang={lang} />} />
          <Route path="ai-chat" element={<AIChat lang={lang} />} />
          <Route path="vocabulary" element={<Vocabulary />} />
        </Route>

        {/* Legacy redirect for old bookmarkers */}
        <Route path="/onboarding" element={<OnboardingSurvey lang={lang} />} />
      </Routes>
    </Router>
  );
}

export default App;
