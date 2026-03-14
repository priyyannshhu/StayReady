import { Link } from 'react-router-dom';

const BookingConfirmation = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your reservation has been successfully completed.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="text-lg font-semibold mb-4">Booking Details</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Confirmation Number:</span>
              <span className="font-medium">#STAY2024{Math.floor(Math.random() * 10000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Property:</span>
              <span className="font-medium">Luxury Beach Villa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-in:</span>
              <span className="font-medium">March 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Check-out:</span>
              <span className="font-medium">March 18, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests:</span>
              <span className="font-medium">2</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">$1,050</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">Important Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• A confirmation email has been sent to your registered email address</li>
            <li>• Check-in time is 3:00 PM, check-out time is 11:00 AM</li>
            <li>• Free cancellation up to 24 hours before check-in</li>
            <li>• For any questions, contact our support team</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
          >
            Explore More Properties
          </Link>
          <Link
            to="/host"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            List Your Property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
