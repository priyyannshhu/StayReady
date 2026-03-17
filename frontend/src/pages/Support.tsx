import { Link } from 'react-router-dom';
import { HelpCircle, MessageCircle, Phone, Mail, Shield } from 'lucide-react';
import Footer from '../components/Footer';

const Support = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <HelpCircle className="w-10 h-10" />
              <h1 className="font-display font-700 text-4xl md:text-5xl">
                Support Center
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              We're here to help. Find answers, get support, and connect with our team.
            </p>
          </div>
        </div>
      </div>

      {/* Support Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-600 text-xl mb-4">Help Center</h3>
            <p className="text-gray mb-6">Browse FAQs and help articles</p>
            <Link to="/support" className="text-primary font-medium text-sm hover:underline">
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mx-auto mb-6">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-600 text-xl mb-4">Safety Info</h3>
            <p className="text-gray mb-6">Safety guidelines and tips</p>
            <Link to="/support" className="text-primary font-medium text-sm hover:underline">
              Learn More →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mx-auto mb-6">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-600 text-xl mb-4">Contact Us</h3>
            <p className="text-gray mb-6">Get in touch with our team</p>
            <Link to="/support" className="text-primary font-medium text-sm hover:underline">
              Contact →
            </Link>
          </div>

          <div className="bg-white rounded-2xl p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
            <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mx-auto mb-6">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-display font-600 text-xl mb-4">Report Issue</h3>
            <p className="text-gray mb-6">Report concerns or problems</p>
            <Link to="/support" className="text-primary font-medium text-sm hover:underline">
              Report →
            </Link>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="font-display font-600 text-3xl mb-4">Need immediate help?</h2>
          <p className="text-gray mb-8 max-w-2xl mx-auto">
            Our support team is available 24/7 to help you with any questions or concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn-primary px-8 py-3 rounded-full text-lg font-medium shadow-btn"
            >
              Contact Support
            </Link>
            <Link
              to="/explore"
              className="btn-secondary px-8 py-3 rounded-full text-lg font-medium"
            >
              Browse Help
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Support;
