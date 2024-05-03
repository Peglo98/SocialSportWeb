import React from 'react';
import { UserProvider } from './components/utils/UserContext';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SidebarMenu from './components/SidebarMenu'; // Make sure the path is correct
import { AuthProvider } from './components/AuthContext';
import Login from './components/Login'; // Make sure the path is correct
import Signup from './components/Signup'; // Make sure the path is correct
import Home from './components/Home'; // Make sure the path is correct
import UserProfile from './components/UserProfile'; // Make sure the path is correct
import EventManagement from './components/EventManagement'; // Make sure the path is correct

function App() {
  return (
    <AuthProvider>
    <Router>
    <UserProvider>
    <div>
      <SidebarMenu />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/event" element={<EventManagement />} />
        <Route exact path="/" component={Home} />
        </Routes>
      {/* Other components */}
    </div>
    </UserProvider>
    </Router>
    </AuthProvider>
  );
}

export default App;