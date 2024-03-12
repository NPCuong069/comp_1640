import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from './theme'; // For admin theme
import UnifiedRouter from './routes/unifiedRouter';

import './global.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <UnifiedRouter />
      </Router>
      </ThemeProvider>
  );
}

export default App;
