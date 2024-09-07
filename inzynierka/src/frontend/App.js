import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import UserAcc from './UserAcc';
import '../css/index.css';
import PrivateRoute from './PrivateRoute';
import Trophies from './Trophies';
import Calendar1 from './Calendar';
import Profile from './Profile';
import Settings from './Settings';
import Rankings from './Rankings';
import Statistics from './Statistics'
import AdminPanel from './AdminPanel';

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UserAcc" element={<PrivateRoute element={<UserAcc />} />} />
          <Route path="/Trophies" element={<PrivateRoute element={<Trophies />} />} />
          <Route path="/Calendar" element={<PrivateRoute element={<Calendar1 />} />} />
          <Route path="/Profile" element={<PrivateRoute element={<Profile />} />} />
          <Route path="/Settings" element={<PrivateRoute element={<Settings />} />} />
          <Route path="/Rankings" element={<PrivateRoute element={<Rankings />} />} />
          <Route path="/Statistics" element={<PrivateRoute element={<Statistics />} />} />
          <Route path="/AdminPanel" element={<PrivateRoute element={<AdminPanel />} />} />
        </Routes>
    </Router>
  );
}

export default App;