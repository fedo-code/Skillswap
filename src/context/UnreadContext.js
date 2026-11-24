import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import axios from '../utils/axiosInstance';
import { useAuth } from './AuthContext';

const UnreadContext = createContext({ unread: 0, refreshUnread: () => {} });

const POLL_MS = 10000;
const BASE_TITLE = 'SkillSwap – trade what you know';

export const UnreadProvider = ({ children }) => {
  const { user } = useAuth();
  const [unread, setUnread] = useState(0);
  const prev = useRef(0);

  const refreshUnread = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const res = await axios.get('/messages/unread/count');
      setUnread(res.data.count || 0);
    } catch {
      /* ignore transient errors */
    }
  }, []);

  // poll while logged in, and refresh when the tab regains focus or a chat is read
  useEffect(() => {
    if (!user) {
      setUnread(0);
      return undefined;
    }
    refreshUnread();
    const timer = setInterval(refreshUnread, POLL_MS);
    window.addEventListener('focus', refreshUnread);
    window.addEventListener('refreshConversationsFully', refreshUnread);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', refreshUnread);
      window.removeEventListener('refreshConversationsFully', refreshUnread);
    };
  }, [user, refreshUnread]);

  // show the count in the browser tab, e.g. "(3) SkillSwap"
  useEffect(() => {
    document.title = unread > 0 ? `(${unread}) ${BASE_TITLE}` : BASE_TITLE;
    prev.current = unread;
  }, [unread]);

  return (
    <UnreadContext.Provider value={{ unread, refreshUnread }}>{children}</UnreadContext.Provider>
  );
};

export const useUnread = () => useContext(UnreadContext);
