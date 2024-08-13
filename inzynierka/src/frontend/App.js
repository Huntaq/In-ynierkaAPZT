import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import UserAcc from './UserAcc';
import '../css/index.css';
import PrivateRoute from './PrivateRoute';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/UserAcc" element={<PrivateRoute element={<UserAcc />} />} />
      </Routes>
    </Router>
  );
}

export default App;