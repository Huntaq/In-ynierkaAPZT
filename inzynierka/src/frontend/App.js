import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import '../css/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
