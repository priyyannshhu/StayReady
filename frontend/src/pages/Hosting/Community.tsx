import { Link } from 'react-router-dom';
import { Users, MessageCircle, Award, Calendar, MapPin, Heart } from 'lucide-react';
import Footer from '../../components/Footer';

const Community = () => {
  const communityFeatures = [
    {
      icon: Users,
      title: 'Connect with Hosts',
      description: 'Join a global network of experienced hosts sharing tips, stories, and support.'
    },
    {
      icon: MessageCircle,
      title: 'Forums & Discussions',
      description: 'Participate in discussions about hosting best practices, local regulations, and industry trends.'
    },
    {
      icon: Award,
      title: 'Recognition Program',
      description: 'Earn badges and recognition for your hosting achievements and contributions to the community.'
    },
    {
      icon: Calendar,
      title: 'Local Events',
      description: 'Attend meetups, workshops, and networking events with hosts in your area.'
    },
    {
      icon: MapPin,
      title: 'Local Groups',
      description: 'Join local host groups to connect with neighbors and share regional insights.'
    },
    {
      icon: Heart,
      title: 'Share Your Story',
      description: 'Inspire others by sharing your hosting journey and success stories.'
    }
  ];

  const stats = [
    { number: '4M+', label: 'Active Hosts' },
    { number: '190+', label: 'Countries' },
    { number: '10K+', label: 'Daily Discussions' },
    { number: '98%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Users className="w-10 h-10" />
              <h1 className="font-display font-700 text-4xl md:text-5xl">
                Host Community
              </h1>
            </div>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Connect, learn, and grow with millions of hosts worldwide. Your hosting journey starts here.
            </p>
            <div className="mt-8">
              <Link
                to="/auth"
                className="btn-white px-8 py-3 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Community Features */}
        <div className="mt-20">
          <h2 className="font-display font-600 text-3xl mb-8 text-center">What Our Community Offers</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {communityFeatures.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-600 text-xl mb-4">{feature.title}</h3>
                <p className="text-gray leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="font-display font-600 text-3xl mb-4">Ready to join our community?</h2>
          <p className="text-gray mb-8 max-w-2xl mx-auto">
            Connect with hosts worldwide, share experiences, and grow your hosting business together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn-primary px-8 py-3 rounded-full text-lg font-medium shadow-btn"
            >
              Join Community
            </Link>
            <Link
              to="/host/resources"
              className="btn-secondary px-8 py-3 rounded-full text-lg font-medium"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Community;
