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

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Navbar />
        <Routes>
          <Route path="/" element={<PropertyManagement />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/management" element={<PropertyManagement />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/booking-confirmed" element={<BookingConfirmation />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
