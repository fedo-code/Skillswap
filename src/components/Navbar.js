import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Avatar } from './ui';
import { useUnread } from '../context/UnreadContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { unread } = useUnread();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const link = ({ isActive }) => `nav-link ${isActive ? 'active' : ''}`;

  return (
    <nav className="navbar navbar-expand-lg nav-app">
      <div className="container-fluid px-3 px-lg-4">
        <Link className="navbar-brand brand" to="/">
          <span className="brand-mark">S</span>
          <span>skill<em>swap</em></span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
            <li className="nav-item"><NavLink end className={link} to="/">Home</NavLink></li>
            {user ? (
              <>
                <li className="nav-item"><NavLink className={link} to="/dashboard">Matches</NavLink></li>
                <li className="nav-item"><NavLink className={link} to="/swaps">Swaps</NavLink></li>
                <li className="nav-item"><NavLink className={link} to="/messages">
                    Messages
                    {unread > 0 && (
                      <span className="nav-badge" aria-label={`${unread} unread messages`}>
                        {unread > 99 ? '99+' : unread}
                      </span>
                    )}
                  </NavLink></li>
                <li className="nav-item"><NavLink className={link} to="/profile">Profile</NavLink></li>
                <li className="nav-item nav-user ms-lg-2 mt-2 mt-lg-0">
                  <Avatar name={user.name || 'U'} size="avatar-sm" />
                  <button className="btn-app btn-ghost" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item"><NavLink className={link} to="/login">Log in</NavLink></li>
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link className="btn-app btn-primary-app" to="/register">Get started</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
