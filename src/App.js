import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import EditProfile from './pages/EditProfile';
import MatchedProfile from './pages/MatchedProfile';
import Messages from './pages/Messages';
import ChatBox from './pages/ChatBox';
import Swaps from './pages/Swaps';
import SwapDetail from './pages/SwapDetail';
import ProposeSwap from './pages/ProposeSwap';
import { ProtectedRoute } from './components/ui';
import './styles/theme.css';

const guard = (el) => <ProtectedRoute>{el}</ProtectedRoute>;

const App = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={guard(<Profile />)} />
        <Route path="/edit-profile" element={guard(<EditProfile />)} />
        <Route path="/dashboard" element={guard(<Dashboard />)} />
        <Route path="/matched-profile/:id" element={guard(<MatchedProfile />)} />
        <Route path="/messages" element={guard(<Messages />)} />
        <Route path="/messages/chat/:id" element={guard(<ChatBox />)} />
        <Route path="/swaps" element={guard(<Swaps />)} />
        <Route path="/swaps/new/:partnerId" element={guard(<ProposeSwap />)} />
        <Route path="/swaps/:id" element={guard(<SwapDetail />)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <footer className="footer-app">
      © {new Date().getFullYear()} SkillSwap · Trade what you know for what you want to learn
    </footer>
  </div>
);

export default App;
