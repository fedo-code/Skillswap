

//import './App.css';
//import Card from './Component/Card.js'//
//import Counter from './Component/Toggle.js'//
//import Toggle1 from './Component/Toggle.js'
//import Mapp from './webpack/Mapp.js' ;

//import React, { lazy, Suspense } from "react";
//import './App.css';
//import Nav from   "./components/Nav";
//import Promo from "./components/Promo";
//import Intro1 from "./components/Intro1";
//import Intro2 from "./components/Intro2";
///import Intro3 from "./components/Intro3";
//import Footer from "./components/Footer"; 
//import Toggle1 from "./Component/Toggle1"
//import Error from "./Component/trycatch";
//import Maincard from "./Component/multiplesprops";
//import Form from "./Component/form";

//import Parent from "./Component/Parent";

//import { Routes, Route, Link } from 'react-router-dom';
//import Home from "./Component/Home";

import React from 'react';
//import { AuthProvider } from './context/AuthContext';
//import './App.css'; // ✅ CSS file link
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import EditProfile from './pages/EditProfile';
import MatchedProfile from "./pages/MatchedProfile"; 
import Messages from './pages/Messages'; // 👈 import this
import ChatBox from './pages/ChatBox';
import ResponsiveContainer  from './components/ResponsiveContainer';

//import { AuthProvider } from './context/AuthContext';


const App = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",            // flexbox use kiya
        flexDirection: "column",    // column me arrange
        backgroundImage: "url('/assets/bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />

      {/* Content part */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/matches/:id" element={<Matches />} />
            <Route path="/matched-profile/:id" element={<MatchedProfile />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/messages/chat/:id" element={<ChatBox />} />
          </Routes>
        </ResponsiveContainer>
      </div>

      {/* Footer part */}
      <footer
        style={{
          textAlign: "center",
          padding: "15px",
          background: "rgba(0,0,0,0.6)",
          color: "#fff",
        }}
      >
        © {new Date().getFullYear()} My Website | All Rights Reserved
      </footer>
    </div>
  );
};

export default App;