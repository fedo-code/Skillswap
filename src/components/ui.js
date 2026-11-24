import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Avatar = ({ name = '?', size = '' }) => (
  <div className={`avatar ${size}`}>{(name.trim()[0] || '?').toUpperCase()}</div>
);

export const Chips = ({ items = [], teal = false, empty = 'Nothing added yet' }) =>
  items.length ? (
    <div className="chips">
      {items.map((s) => (
        <span key={s} className={`chip ${teal ? 'chip-teal' : ''}`}>{s}</span>
      ))}
    </div>
  ) : (
    <span className="empty-line">{empty}</span>
  );

// Type a skill and press Enter (or comma) to add it
export const TagInput = ({ value, onChange, placeholder, teal }) => {
  const [text, setText] = useState('');

  const add = (raw) => {
    const s = raw.trim();
    if (!s) return;
    if (!value.some((v) => v.toLowerCase() === s.toLowerCase())) onChange([...value, s]);
    setText('');
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(text);
    } else if (e.key === 'Backspace' && !text && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="taginput">
      {value.map((s) => (
        <span key={s} className={`chip ${teal ? 'chip-teal' : ''}`}>
          {s}
          <button type="button" aria-label={`Remove ${s}`} onClick={() => onChange(value.filter((v) => v !== s))}>
            ×
          </button>
        </span>
      ))}
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => add(text)}
        placeholder={value.length ? '' : placeholder}
      />
    </div>
  );
};

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

export const timeLabel = (d) =>
  d
    ? new Date(d).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '';
