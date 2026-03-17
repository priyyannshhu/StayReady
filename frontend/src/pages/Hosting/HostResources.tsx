import { Link } from 'react-router-dom';
import { BookOpen, Video, FileText, Users, HelpCircle, Download } from 'lucide-react';
import Footer from '../../components/Footer';

const HostResources = () => {
  const resources = [
    {
      icon: BookOpen,
      title: 'Hosting Guides',
      description: 'Comprehensive guides covering everything from preparing your space to managing bookings.',
      topics: ['Getting Started', 'Property Preparation', 'Guest Communication', 'Review Management']
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video tutorials to help you master hosting best practices.',
      topics: ['Creating Your Listing', 'Setting Prices', 'Managing Calendar', 'Guest Interactions']
    },
    {
      icon: FileText,
      title: 'Templates & Checklists',
      description: 'Downloadable templates and checklists to streamline your hosting workflow.',
      topics: ['Welcome Messages', 'House Rules', 'Cleaning Checklists', 'Inventory Lists']
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with experienced hosts, share tips, and get advice from our community.',
      topics: ['Q&A Sessions', 'Success Stories', 'Local Meetups', 'Expert Advice']
    },
    {
      icon: HelpCircle,
      title: 'Help Center',
      description: 'Find answers to common questions and get support when you need it.',
      topics: ['FAQs', 'Troubleshooting', 'Contact Support', 'Policy Information']
    },
    {
      icon: Download,
      title: 'Free Resources',
      description: 'Download free resources to enhance your hosting experience.',
      topics: ['Photography Guide', 'Pricing Calculator', 'Marketing Templates', 'Legal Documents']
    }
  ];

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary-hover text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-display font-700 text-4xl md:text-5xl mb-6">
              Host Resources
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Everything you need to become a successful host. Guides, tutorials, templates, and community support.
            </p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="font-display font-600 text-3xl mb-4">Comprehensive Resources</h2>
          <p className="text-gray max-w-2xl mx-auto">
            Access our library of hosting resources designed to help you succeed
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((resource, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className="w-12 h-12 rounded-lg bg-[#fff0f3] flex items-center justify-center mb-6">
                <resource.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-600 text-xl mb-4">{resource.title}</h3>
              <p className="text-gray mb-6 leading-relaxed">{resource.description}</p>
              <ul className="space-y-2">
                {resource.topics.map((topic, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-600">
                    <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Popular Guides */}
        <div className="mt-20">
          <h3 className="font-display font-600 text-2xl mb-8">Popular Guides</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Complete Guide to Your First Booking',
                description: 'Step-by-step guide from creating your listing to welcoming your first guest.',
                readTime: '15 min read',
                category: 'Getting Started'
              },
              {
                title: 'Mastering Guest Communication',
                description: 'Learn how to communicate effectively with guests from inquiry to checkout.',
                readTime: '12 min read',
                category: 'Guest Management'
              },
              {
                title: 'Pricing Strategies for Maximum Revenue',
                description: 'Discover proven pricing strategies to optimize your rental income.',
                readTime: '18 min read',
                category: 'Pricing'
              },
              {
                title: 'Creating a 5-Star Guest Experience',
                description: 'Tips and tricks to earn those coveted 5-star reviews.',
                readTime: '20 min read',
                category: 'Reviews'
              }
            ].map((guide, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-display font-600 text-lg">{guide.title}</h4>
                  <span className="text-xs px-2 py-1 bg-[#f7f7f7] rounded-full">
                    {guide.category}
                  </span>
                </div>
                <p className="text-gray mb-4">{guide.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{guide.readTime}</span>
                  <button className="text-primary font-medium text-sm hover:underline">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-20 bg-white rounded-3xl p-12 shadow-card">
          <h3 className="font-display font-600 text-2xl mb-8 text-center">Quick Hosting Tips</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { tip: 'Professional photos increase bookings by 40%', icon: '📸' },
              { tip: 'Respond within 1 hour to boost your ranking', icon: '⚡' },
              { tip: 'Detailed descriptions reduce questions by 60%', icon: '📝' },
              { tip: 'Competitive pricing drives 80% more views', icon: '💰' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <p className="text-sm font-medium">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Community Stats */}
        <div className="mt-20">
          <h3 className="font-display font-600 text-2xl mb-8 text-center">Join Our Community</h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-gray">Active Hosts</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-gray">Guides & Articles</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">1000+</div>
              <div className="text-gray">Video Tutorials</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-card">
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-gray">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="font-display font-600 text-3xl mb-4">Ready to start hosting?</h2>
          <p className="text-gray mb-8 max-w-2xl mx-auto">
            Access all these resources and more when you become a host. Join our community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/auth"
              className="btn-primary px-8 py-3 rounded-full text-lg font-medium shadow-btn"
            >
              Become a Host
            </Link>
            <Link
              to="/explore"
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

export default HostResources;
