import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Explore from './pages/Explore';
import HostDashboard from './pages/HostDashboard';
import PropertyDetail from './pages/PropertyDetail';
import BookingConfirmation from './pages/BookingConfirmation';
import Prediction from './pages/Prediction';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/host" element={<HostDashboard />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
            <Route path="/booking-confirmed" element={<BookingConfirmation />} />
            <Route path="/prediction" element={<Prediction />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
