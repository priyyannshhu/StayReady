import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from './pages/Explore';
import HostDashboard from './pages/HostDashboard';
import PropertyDetail from './pages/PropertyDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import Prediction from './pages/Prediction';
import PropertyManagement from './pages/PropertyManagement';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Support from './pages/Support';
import NotFound from './pages/NotFound';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-surface">
          {/* Navbar for all pages except auth */}
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/*" element={<Navbar />} />
          </Routes>
          
          <Routes>
            {/* Public routes */}
            <Route path="/" element={
              <>
                <PropertyManagement />
                <Footer />
              </>
            } />
            <Route path="/auth" element={<Auth />} />
            <Route path="/support" element={
              <>
                <Support />
                <Footer />
              </>
            } />
            
            {/* Protected routes */}
            <Route path="/prediction" element={
              <ProtectedRoute>
                <Prediction />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/management" element={
              <ProtectedRoute>
                <PropertyManagement />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Explore />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/host" element={
              <ProtectedRoute>
                <HostDashboard />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/property/:id" element={
              <ProtectedRoute>
                <PropertyDetail />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/booking-confirmed" element={
              <ProtectedRoute>
                <BookingConfirmation />
                <Footer />
              </ProtectedRoute>
            } />
            
            {/* 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
