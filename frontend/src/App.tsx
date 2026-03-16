import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Explore from './pages/Explore';
import HostDashboard from './pages/HostDashboard';
import PropertyDetail from './pages/PropertyDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import Prediction from './pages/Prediction';
import PropertyManagement from './pages/PropertyManagement';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background dark:bg-slate-900">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PropertyManagement />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes */}
            <Route path="/prediction" element={
              <ProtectedRoute>
                <Prediction />
              </ProtectedRoute>
            } />
            <Route path="/management" element={
              <ProtectedRoute>
                <PropertyManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Explore />
              </ProtectedRoute>
            } />
            <Route path="/host" element={
              <ProtectedRoute>
                <HostDashboard />
              </ProtectedRoute>
            } />
            <Route path="/property/:id" element={
              <ProtectedRoute>
                <PropertyDetail />
              </ProtectedRoute>
            } />
            <Route path="/booking-confirmed" element={
              <ProtectedRoute>
                <BookingConfirmation />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
