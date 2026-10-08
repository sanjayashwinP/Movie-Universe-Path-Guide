import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { WatchProvider } from './contexts/WatchContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SearchModal from './components/common/SearchModal';
import AuthModal from './components/common/AuthModal';
import DailyTrackerBanner from './components/common/DailyTrackerBanner';
import ErrorBoundary from './components/common/ErrorBoundary';

import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import WatchOrdersPage from './pages/WatchOrdersPage';
import TimelinePage from './pages/TimelinePage';
import SagasPage from './pages/SagasPage';
import UpcomingPage from './pages/UpcomingPage';
import ContentDetailPage from './pages/ContentDetailPage';
import WatchlistPage from './pages/WatchlistPage';
import StatsPage from './pages/StatsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import MasterStoryFlowPage from './pages/MasterStoryFlowPage';
import RoadmapPage from './pages/RoadmapPage';
import BeginnerGuidePage from './pages/BeginnerGuidePage';

// Professional 404 Universe Not Found Component
function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '100px 24px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex',
        padding: '12px 24px',
        background: 'rgba(225, 29, 72, 0.1)',
        border: '1px solid rgba(225, 29, 72, 0.3)',
        borderRadius: 'var(--radius-full)',
        color: 'var(--accent-red)',
        fontWeight: 700,
        marginBottom: '20px'
      }}>
        TIMELINE INVASION 404
      </div>
      <h1 style={{ fontSize: '3rem', fontWeight: 800, margin: '12px 0 16px' }}>
        Universe Not Found
      </h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '540px', margin: '0 auto 32px' }}>
        This branch timeline has been pruned or does not exist in any known cinematic multiverse coordinate.
      </p>
      <Link to="/" className="btn btn-primary">
        Return to Sacred Timeline
      </Link>
    </div>
  );
}

export default function App() {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <WatchProvider>
          <BrowserRouter>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
              <Navbar 
                onOpenSearch={() => setSearchModalOpen(true)}
                onOpenAuth={() => setAuthModalOpen(true)}
              />

              <ErrorBoundary>
                <main style={{ flex: 1, paddingTop: '72px' }}>
                  <DailyTrackerBanner />
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/story-flow" element={<MasterStoryFlowPage />} />
                    <Route path="/roadmap" element={<RoadmapPage />} />
                    <Route path="/starter-guide" element={<BeginnerGuidePage />} />
                    <Route path="/release-order" element={<BeginnerGuidePage />} />
                    <Route path="/watch-orders" element={<WatchOrdersPage />} />
                    <Route path="/timelines" element={<TimelinePage />} />
                    <Route path="/sagas" element={<SagasPage />} />
                    <Route path="/upcoming" element={<UpcomingPage />} />
                    <Route path="/content/:id" element={<ContentDetailPage />} />
                    <Route path="/watchlist" element={<WatchlistPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/admin" element={<AdminDashboardPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </ErrorBoundary>

              <Footer />

              {/* Global Modals */}
              <SearchModal 
                isOpen={searchModalOpen} 
                onClose={() => setSearchModalOpen(false)} 
              />
              <AuthModal 
                isOpen={authModalOpen} 
                onClose={() => setAuthModalOpen(false)} 
              />
            </div>
          </BrowserRouter>
        </WatchProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
