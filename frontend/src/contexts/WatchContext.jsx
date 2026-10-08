import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const WatchContext = createContext(null);

export function WatchProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [watchedIds, setWatchedIds] = useState(new Set());
  const [watchlistMap, setWatchlistMap] = useState(new Map());
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(async () => {
    if (!isAuthenticated) {
      setWatchedIds(new Set());
      setWatchlistMap(new Map());
      setUserProgress(null);
      return;
    }
    setLoading(true);
    try {
      const [histRes, wlRes, progRes] = await Promise.all([
        api.get('/user/history?size=200'),
        api.get('/user/watchlist?size=200'),
        api.get('/user/progress')
      ]);

      if (histRes?.data?.data?.content) {
        const ids = new Set(histRes.data.data.content.map((c) => c.id));
        setWatchedIds(ids);
      }

      if (wlRes?.data?.data?.content) {
        const map = new Map();
        wlRes.data.data.content.forEach((item) => {
          map.set(item.contentId, item.status);
        });
        setWatchlistMap(map);
      }

      if (progRes?.data?.data) {
        setUserProgress(progRes.data.data);
      }
    } catch {
      // silently handle when guest or initial load
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const isWatched = useCallback((contentId) => {
    return watchedIds.has(Number(contentId));
  }, [watchedIds]);

  const toggleWatch = async (contentId, contentTitle = 'Item') => {
    if (!isAuthenticated) {
      showToast('Please sign in to track watched items', 'info');
      return false;
    }

    const numId = Number(contentId);
    // Optimistic update
    const isCurrentlyWatched = watchedIds.has(numId);
    setWatchedIds((prev) => {
      const next = new Set(prev);
      if (isCurrentlyWatched) next.delete(numId);
      else next.add(numId);
      return next;
    });

    try {
      const res = await api.post(`/user/watch/${numId}`);
      const watched = res.data?.data;
      showToast(watched ? `✓ Watched: ${contentTitle}` : `Removed from Watched: ${contentTitle}`, 'success');
      
      // Refresh statistics in background
      api.get('/user/progress').then((pRes) => {
        if (pRes?.data?.data) setUserProgress(pRes.data.data);
      });
      return watched;
    } catch (err) {
      // Revert optimistic update
      setWatchedIds((prev) => {
        const next = new Set(prev);
        if (isCurrentlyWatched) next.add(numId);
        else next.delete(numId);
        return next;
      });
      showToast(err.message || 'Failed to update watch status', 'error');
      return isCurrentlyWatched;
    }
  };

  const toggleWatched = toggleWatch;

  const updateWatchlist = async (contentId, status, rating = null, notes = '', contentTitle = 'Item') => {
    if (!isAuthenticated) {
      showToast('Please sign in to save to your watchlist', 'info');
      return false;
    }

    try {
      await api.post(`/user/watchlist/${contentId}`, { status, userRating: rating, notes });
      setWatchlistMap((prev) => {
        const next = new Map(prev);
        next.set(Number(contentId), status);
        return next;
      });
      showToast(`Saved to Watchlist: ${contentTitle} (${status.replace(/_/g, ' ')})`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update watchlist', 'error');
      return false;
    }
  };

  const removeFromWatchlist = async (contentId, contentTitle = 'Item') => {
    if (!isAuthenticated) return;
    try {
      await api.delete(`/user/watchlist/${contentId}`);
      setWatchlistMap((prev) => {
        const next = new Map(prev);
        next.delete(Number(contentId));
        return next;
      });
      showToast(`Removed from Watchlist: ${contentTitle}`, 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to remove from watchlist', 'error');
      return false;
    }
  };

  const isInWatchlist = useCallback((contentId) => {
    return watchlistMap.has(Number(contentId));
  }, [watchlistMap]);

  const toggleWatchlist = async (contentId, contentTitle = 'Item') => {
    const numId = Number(contentId);
    if (watchlistMap.has(numId)) {
      return await removeFromWatchlist(numId, contentTitle);
    } else {
      return await updateWatchlist(numId, 'PLAN_TO_WATCH', null, '', contentTitle);
    }
  };

  const toggleEpisode = async (episodeId) => {
    if (!isAuthenticated) {
      showToast('Please sign in to track episode progress', 'info');
      return false;
    }
    try {
      const res = await api.post(`/user/episodes/${episodeId}/toggle`);
      const watched = res.data?.data;
      showToast(watched ? 'Episode marked watched' : 'Episode marked unwatched', 'success');
      fetchUserData(); // refresh progress & parent content status
      return watched;
    } catch (err) {
      showToast(err.message || 'Failed to update episode', 'error');
      return false;
    }
  };

  return (
    <WatchContext.Provider
      value={{
        watchedIds,
        watchlistMap,
        userProgress,
        loading,
        isWatched,
        isInWatchlist,
        toggleWatch,
        toggleWatched,
        toggleWatchlist,
        updateWatchlist,
        removeFromWatchlist,
        toggleEpisode,
        refreshProgress: fetchUserData
      }}
    >
      {children}
    </WatchContext.Provider>
  );
}

export function useWatch() {
  const context = useContext(WatchContext);
  if (!context) throw new Error('useWatch must be used within WatchProvider');
  return context;
}
