import React from 'react';
import { Routes, Route, Navigate } from 'react-router';
import LandingPage from "./Pages/LandingPage.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Create from "./Pages/CreatePage.jsx";
import JobDetails from "./Pages/JobDetails.jsx";
import UnderConstruction from './Pages/UnderConstruction.jsx';
import AnalyticsPage from './Pages/AnalyticsPage.jsx';
import ExploreJobs from './Pages/ExploreJobs.jsx';
import Breweries from "./Pages/Breweries.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import SignupPage from "./Pages/SignupPage.jsx";
import SettingsPage from "./Pages/SettingsPage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import NeetCodePractice from './Pages/NeetCodePractice.jsx';

const App = () => {
  const { authUser, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div>
      <Routes>
        {/* Public Landing Page for guests; Dashboard for logged-in users */}
        <Route path="/" element={authUser ? <Dashboard /> : <LandingPage />} />

        {/* Protected App Routes */}
        <Route path="/create" element={authUser ? <Create /> : <Navigate to="/login" replace />} />
        <Route path="/job/:id" element={authUser ? <JobDetails /> : <Navigate to="/login" replace />} />
        <Route path="/analytics" element={authUser ? <AnalyticsPage /> : <Navigate to="/login" replace />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to="/login" replace />} />
        <Route path="/explore" element={authUser ? <ExploreJobs /> : <Navigate to="/login" replace />} />
        <Route path="/breweries" element={authUser ? <Breweries /> : <Navigate to="/login" replace />} />

        {/* Auth Routes */}
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to="/" replace />} />

        {/* Prep Routes */}
        <Route path="/prep" element={authUser ? <NeetCodePractice /> : <Navigate to="/prep" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;