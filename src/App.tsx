import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
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

function App() {
  const [lang, setLang] = useState<'en' | 'uz'>('en');

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'uz' : 'en'));
  };

  return (
    <Router>
      <Routes>
        {/* Public Landing Routes with Main Navigation */}
        <Route path="/" element={
          <div className="app-container">
            <Navigation lang={lang} toggleLang={toggleLang} />
            <main className="main-content">
              <Outlet />
            </main>
          </div>
        }>
          <Route index element={<Home lang={lang} />} />
          <Route path="login" element={<Login lang={lang} />} />
        </Route>

        {/* Dedicated Onboarding (Minimal/Wizard Style) */}
        <Route path="/onboarding" element={<OnboardingSurvey lang={lang} />} />

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
      </Routes>
    </Router>
  );
}

export default App;
