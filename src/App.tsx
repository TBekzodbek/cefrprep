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
import { useState } from 'react';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [lang, setLang] = useState<'en' | 'uz'>('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'uz' : 'en'));
  };

  return (
    <Router>
      <SpeedInsights />
      <Analytics />
      <Routes>
        {/* Unified Home & Onboarding */}
        <Route path="/" element={<OnboardingSurvey lang={lang} toggleLang={toggleLang} />} />

        {/* Auth with Navigation */}
        <Route path="/login" element={
          <div className="app-container">
            <Navigation lang={lang} toggleLang={toggleLang} />
            <Login lang={lang} />
          </div>
        } />

        {/* Dashboard Routes with Sidebar Layout */}
        <Route path="/dashboard" element={<DashboardLayout lang={lang} toggleLang={toggleLang} />}>
          <Route index element={<Dashboard lang={lang} />} />
          <Route path="reading" element={<Reading lang={lang} />} />
          <Route path="listening" element={<Listening lang={lang} />} />
          <Route path="writing" element={<Writing lang={lang} />} />
          <Route path="speaking" element={<Speaking lang={lang} />} />
          <Route path="profile" element={<Profile lang={lang} />} />
          <Route path="plan" element={<Plan lang={lang} />} />
          <Route path="pricing" element={<Pricing lang={lang} />} />
        </Route>

        {/* Legacy redirect for old bookmarkers */}
        <Route path="/onboarding" element={<OnboardingSurvey lang={lang} toggleLang={toggleLang} />} />
      </Routes>
    </Router>
  );
}

export default App;
