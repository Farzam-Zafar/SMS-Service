import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MessageSquare, 
  ChevronRight, 
  CheckCircle, 
  Code, 
  BarChart, 
  Zap, 
  Clock, 
  Shield, 
  CreditCard,
  Menu,
  X,
  ExternalLink,
  TrendingUp,
  Smartphone,
  User,
  ArrowRight,
  Globe
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const translateY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  
  // Pricing plans
  const pricingPlans = [
    {
      name: 'Basic',
      price: 5,
      description: 'For individuals and small projects',
      features: [
        '100 SMS credits',
        'Standard delivery',
        '24/7 support',
        '30-day validity'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Standard',
      price: 20,
      description: 'For growing businesses',
      features: [
        '500 SMS credits',
        'Priority delivery',
        'Delivery reports',
        'API access',
        '60-day validity'
      ],
      cta: 'Get Started',
      popular: true
    },
    {
      name: 'Premium',
      price: 65,
      description: 'For high-volume senders',
      features: [
        '2000 SMS credits',
        'Premium delivery',
        'Advanced analytics',
        'Dedicated support',
        'Custom sender ID',
        '90-day validity'
      ],
      cta: 'Get Started',
      popular: false
    }
  ];
  
  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <MessageSquare className="h-8 w-8 text-primary-500 mr-2" />
                <span className="text-xl font-bold text-gray-800">TextPulse</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#api" className="text-gray-600 hover:text-gray-900">API</a>
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">Sign In</Link>
              <Link 
                to="/register" 
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Get Started
              </Link>
            </nav>
            
            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-3">
                <a 
                  href="#features" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </a>
                <a 
                  href="#api" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  API
                </a>
                <a 
                  href="#faq" 
                  className="text-gray-600 hover:text-gray-900 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FAQ
                </a>
                <Link 
                  to="/login" 
                  className="text-primary-600 hover:text-primary-700 font-medium py-2"
                >
                  Sign In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md font-medium transition-colors inline-block text-center"
                >
                  Get Started
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </header>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="bg-gradient-to-br from-primary-500 to-primary-700 text-white pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden"
      >
        <motion.div 
          style={{ opacity, y: translateY }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              Powerful SMS Messaging for Your Business
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-white/90"
            >
              Send SMS messages globally with reliable delivery, simple pricing, and powerful tools for businesses of all sizes.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                to="/register" 
                className="bg-white text-primary-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium text-lg transition-colors flex items-center"
              >
                Start For Free <ChevronRight className="ml-1 h-5 w-5" />
              </Link>
              <a 
                href="#features" 
                className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Learn More
              </a>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-white"></div>
        </div>
      </section>
      
      {/* Trusted By Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-600 mb-10">Trusted by Businesses Worldwide</h2>
          
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {/* Company logos (using placeholder text for demo) */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-300"
            >
              ACME Inc.
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-300"
            >
              TechCorp
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-300"
            >
              GlobalSoft
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-300"
            >
              FutureData
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-2xl font-bold text-gray-300"
            >
              NexaHealth
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Everything You Need to Connect with Customers</h2>
            <p className="text-xl text-gray-600">Our platform offers all the tools and features you need for effective SMS communication.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Send messages that arrive instantly with our high-priority routing system and global coverage.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Global Reach</h3>
              <p className="text-gray-600">Reach customers in over 190 countries with localized phone number formatting and language support.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Detailed Analytics</h3>
              <p className="text-gray-600">Track delivery rates, engagement, and campaign performance with our comprehensive dashboard.</p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Developer API</h3>
              <p className="text-gray-600">Integrate SMS functionality directly into your applications with our simple, powerful API.</p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-secondary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Security & Compliance</h3>
              <p className="text-gray-600">End-to-end encryption and compliance with global SMS regulations keep your messages secure.</p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Scheduled Messaging</h3>
              <p className="text-gray-600">Plan your communications in advance with our easy-to-use message scheduling system.</p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How TextPulse Works</h2>
            <p className="text-xl text-gray-600">Get started in minutes with our simple and intuitive platform.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <User className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">1. Create Account</h3>
              <p className="text-gray-600">Sign up for free and verify your account in minutes.</p>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <CreditCard className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">2. Buy Credits</h3>
              <p className="text-gray-600">Purchase SMS credits with our simple pay-as-you-go pricing.</p>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <MessageSquare className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">3. Start Messaging</h3>
              <p className="text-gray-600">Send single messages or bulk campaigns to your audience.</p>
            </motion.div>
          </div>
          
          <div className="text-center mt-12">
            <Link 
              to="/register" 
              className="inline-flex items-center bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors"
            >
              Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
      
      {/* API Section */}
      <section id="api" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Powerful Developer API</h2>
                <p className="text-xl text-gray-600 mb-6">Integrate SMS capabilities directly into your applications with our easy-to-use API.</p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">RESTful API with comprehensive documentation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">SDKs for popular programming languages</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Webhooks for real-time event notifications</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-6 w-6 text-primary-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">Detailed delivery reports and analytics</span>
                  </li>
                </ul>
                
                <a 
                  href="#api-docs"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  View API Documentation <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                <div className="flex items-center mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <pre className="text-gray-300 overflow-x-auto p-2">
                  <code>
{`// Send an SMS message using the TextPulse API
fetch('https://api.textpulse.com/v1/send', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: '+1234567890',
    message: 'Hello from TextPulse!'
  })
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error(error));`}
                  </code>
                </pre>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it. Here's what businesses think about TextPulse.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-xl">JD</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">John Davis</h4>
                  <p className="text-gray-500 text-sm">Marketing Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">"TextPulse has transformed how we communicate with our customers. The delivery rates are exceptional, and the analytics help us optimize our campaigns."</p>
              <div className="flex text-primary-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-secondary-600 font-bold text-xl">SJ</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">CEO, Retail Solutions</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">"The API integration was seamless, and we've seen a 40% increase in customer engagement since using TextPulse. Their support team is also incredibly responsive."</p>
              <div className="flex text-primary-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-4">
                <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-accent-600 font-bold text-xl">MT</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Michael Torres</h4>
                  <p className="text-gray-500 text-sm">CTO, HealthTech</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">"As a healthcare provider, security and reliability are paramount. TextPulse delivers on both fronts, allowing us to safely communicate with patients while maintaining compliance."</p>
              <div className="flex text-primary-500">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">Pay only for what you use with no hidden fees or contracts.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`rounded-xl overflow-hidden ${
                  plan.popular 
                    ? 'border-2 border-primary-500 relative shadow-lg' 
                    : 'border border-gray-200 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs px-3 py-1 font-medium">
                    MOST POPULAR
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-baseline mb-6">
                    <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500 ml-2">one-time</span>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link
                    to="/register"
                    className={`block w-full py-2 text-center rounded-lg transition-colors ${
                      plan.popular
                        ? 'bg-primary-500 hover:bg-primary-600 text-white'
                        : 'border border-primary-500 text-primary-500 hover:bg-primary-50'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto text-center">
            {/* Stat 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <TrendingUp className="h-10 w-10 mb-4 mx-auto text-white/80" />
                <h4 className="text-4xl font-bold mb-2">99.9%</h4>
                <p className="text-white/80">Delivery Success Rate</p>
              </div>
            </motion.div>
            
            {/* Stat 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Clock className="h-10 w-10 mb-4 mx-auto text-white/80" />
                <h4 className="text-4xl font-bold mb-2">&lt;3s</h4>
                <p className="text-white/80">Average Delivery Time</p>
              </div>
            </motion.div>
            
            {/* Stat 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <Globe className="h-10 w-10 mb-4 mx-auto text-white/80" />
                <h4 className="text-4xl font-bold mb-2">190+</h4>
                <p className="text-white/80">Countries Covered</p>
              </div>
            </motion.div>
            
            {/* Stat 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <MessageSquare className="h-10 w-10 mb-4 mx-auto text-white/80" />
                <h4 className="text-4xl font-bold mb-2">100M+</h4>
                <p className="text-white/80">Messages Sent Monthly</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Find answers to common questions about our SMS platform.</p>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How does SMS credit pricing work?</h3>
              <p className="text-gray-600">
                SMS credits work on a simple pay-as-you-go model. One credit equals one standard SMS message (up to 160 characters). For longer messages, multiple credits will be used based on the character count.
              </p>
            </motion.div>
            
            {/* FAQ Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Are there any monthly fees or contracts?</h3>
              <p className="text-gray-600">
                No, we don't have any monthly fees or contracts. You only pay for the SMS credits you purchase, and they remain valid based on your chosen package (30, 60, or 90 days).
              </p>
            </motion.div>
            
            {/* FAQ Item 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I send SMS messages internationally?</h3>
              <p className="text-gray-600">
                Yes, our platform supports SMS delivery to over 190 countries worldwide. International messages may consume more credits depending on the destination country.
              </p>
            </motion.div>
            
            {/* FAQ Item 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">How can I integrate SMS into my application?</h3>
              <p className="text-gray-600">
                We provide a RESTful API with comprehensive documentation and SDKs for popular programming languages. Our API is designed to be developer-friendly and easy to integrate into your existing applications.
              </p>
            </motion.div>
            
            {/* FAQ Item 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Is the platform GDPR compliant?</h3>
              <p className="text-gray-600">
                Yes, our platform is fully GDPR compliant. We take data protection and privacy seriously and have implemented all necessary measures to ensure compliance with global data protection regulations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Sending SMS?</h2>
            <p className="text-xl mb-8">
              Join thousands of businesses that trust TextPulse for their SMS communication needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Create Free Account
              </Link>
              <Link 
                to="/login" 
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg transition-colors"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <MessageSquare className="h-8 w-8 text-primary-500 mr-2" />
                <span className="text-xl font-bold">TextPulse</span>
              </div>
              <p className="text-gray-400 mb-4">
                Powerful SMS messaging platform for businesses of all sizes.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#api" className="text-gray-400 hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Release Notes</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Developers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row md:justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} TextPulse. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;