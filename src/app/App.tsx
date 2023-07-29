import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Market from './market/page';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/market" element={<Market />} />
      </Routes>
    </Router>
  );
}
