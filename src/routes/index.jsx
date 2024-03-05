import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
// Other imports...

export const AppRoutes = () => (
  <Routes>

    <Route path="/login" element={<LoginPage />} />
    // Define other routes...
  </Routes>
);