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
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 dark:from-rose-950 dark:via-pink-950 dark:to-orange-950">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PropertyManagement />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected routes with Navbar */}
            <Route path="/prediction" element={
              <ProtectedRoute>
                <Navbar />
                <Prediction />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/management" element={
              <ProtectedRoute>
                <Navbar />
                <PropertyManagement />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Navbar />
                <Dashboard />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/explore" element={
              <ProtectedRoute>
                <Navbar />
                <Explore />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/host" element={
              <ProtectedRoute>
                <Navbar />
                <HostDashboard />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/property/:id" element={
              <ProtectedRoute>
                <Navbar />
                <PropertyDetail />
                <Footer />
              </ProtectedRoute>
            } />
            <Route path="/booking-confirmed" element={
              <ProtectedRoute>
                <Navbar />
                <BookingConfirmation />
                <Footer />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
