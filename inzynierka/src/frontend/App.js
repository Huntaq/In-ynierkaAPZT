import React from 'react';
import Login from './Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import UserAcc from './UserAcc';
import '../css/index.css';
import PrivateRoute from './PrivateRoute';
import Activities from './Activites';
import Trophies from './Trophies';
import { UserProvider } from './Components/UserContext';


function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/UserAcc" element={<PrivateRoute element={<UserAcc />} />} />
          <Route path="/Activities" element={<PrivateRoute element={<Activities />} />} />
          <Route path="/Trophies" element={<PrivateRoute element={<Trophies />} />} />
        </Routes>
      </UserProvider>
    </Router>
  );
}

export default App;