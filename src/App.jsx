import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppState } from './store.jsx';

import Onboarding from './pages/Onboarding.jsx';
import CropRecommendation from './pages/CropRecommendation.jsx';
import Dashboard from './pages/Dashboard.jsx';
import FertilizerRecommendation from './pages/FertilizerRecommendation.jsx';
import MarketComparison from './pages/MarketComparison.jsx';
import AppShell from './components/AppShell.jsx';
import {
  WeatherStub,
  ValueAddedStub,
  StorageStub,
  SchemesStub,
  OfficerStub,
  DoctorStub
} from './pages/Stubs.jsx';

// Guard for routes that require onboarding (district and name)
function OnboardingGuard({ children }) {
  const { userName, selectedDistrict } = useAppState();
  if (!userName || !selectedDistrict) {
    return <Navigate to="/onboarding" replace />;
  }
  return children;
}

// Guard for routes that require a selected crop (dashboard and modules)
function CropGuard({ children }) {
  const { userName, selectedDistrict, selectedCrop } = useAppState();
  if (!userName || !selectedDistrict) {
    return <Navigate to="/onboarding" replace />;
  }
  if (!selectedCrop) {
    return <Navigate to="/crop-recommendation" replace />;
  }
  return children;
}

// Determines starting route based on application state
function RootRedirect() {
  const { userName, selectedDistrict, selectedCrop } = useAppState();
  if (!userName || !selectedDistrict) {
    return <Navigate to="/onboarding" replace />;
  }
  if (!selectedCrop) {
    return <Navigate to="/crop-recommendation" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding Flow */}
        <Route path="/onboarding" element={<Onboarding />} />
        
        <Route 
          path="/crop-recommendation" 
          element={
            <OnboardingGuard>
              <CropRecommendation />
            </OnboardingGuard>
          } 
        />

        {/* Locked Modules under AppShell */}
        <Route 
          path="/" 
          element={
            <CropGuard>
              <AppShell />
            </CropGuard>
          }
        >
          <Route index element={<RootRedirect />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fertilizer" element={<FertilizerRecommendation />} />
          <Route path="market" element={<MarketComparison />} />
          <Route path="weather" element={<WeatherStub />} />
          <Route path="value-added" element={<ValueAddedStub />} />
          <Route path="storage" element={<StorageStub />} />
          <Route path="schemes" element={<SchemesStub />} />
          <Route path="officer" element={<OfficerStub />} />
          <Route path="doctor" element={<DoctorStub />} />
        </Route>

        {/* Fallback to root logic */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}
