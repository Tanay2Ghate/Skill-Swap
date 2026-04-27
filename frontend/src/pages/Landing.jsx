import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { ArrowRight, BookOpen, Users, Zap, Shield, MessageCircle, Star, User } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 -z-10" />
          
          {/* Decorative blur blobs */}
          <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-primary-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />
          <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-accent-200/40 rounded-full blur-3xl -z-10 mix-blend-multiply" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-8 border border-primary-100">
              <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
              Join the peer-to-peer learning revolution
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8">
              Exchange Skills, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-500">Not Money.</span>
            </h1>
            
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with passionate individuals. Teach what you know, learn what you want. 
              The ultimate platform where knowledge is the only currency you need.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/login" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 rounded-xl font-semibold text-lg hover:bg-slate-50 transition-all border border-slate-200 hover:border-slate-300"
              >
                Log In
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">How SkillSwap Works</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Four simple steps to start your skill exchange journey.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-primary-100 via-accent-100 to-primary-100 -z-10" />

              {[
                { step: '1', title: 'Register', desc: 'Create your free account in seconds.', icon: <User className="w-6 h-6 text-primary-600" /> },
                { step: '2', title: 'List Skills', desc: 'Add skills you have and skills you want.', icon: <BookOpen className="w-6 h-6 text-accent-600" /> },
                { step: '3', title: 'Get Matched', desc: 'Our algorithm finds perfect exchange partners.', icon: <Users className="w-6 h-6 text-primary-600" /> },
                { step: '4', title: 'Swap & Learn', desc: 'Chat, schedule sessions, and trade knowledge.', icon: <Zap className="w-6 h-6 text-accent-600" /> },
              ].map((item, i) => (
                <div key={i} className="relative flex flex-col items-center text-center group">
                  <div className="w-24 h-24 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-200/50 flex items-center justify-center mb-6 group-hover:-translate-y-2 transition-transform duration-300 relative z-10">
                    {item.icon}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm border-4 border-white">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Learn</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">SkillSwap provides all the tools to facilitate seamless knowledge exchange.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Smart Matching', desc: 'Our algorithm connects you with users who have what you want and want what you have.', icon: <Users className="w-6 h-6 text-blue-500" /> },
                { title: 'Real-time Chat', desc: 'Communicate instantly with your matches to plan your learning sessions.', icon: <MessageCircle className="w-6 h-6 text-green-500" /> },
                { title: 'Session Scheduling', desc: 'Built-in tools to propose dates, times, and meeting links for your swaps.', icon: <Zap className="w-6 h-6 text-amber-500" /> },
                { title: 'Trust & Safety', desc: 'Verified profiles and a transparent rating system keep the community safe.', icon: <Shield className="w-6 h-6 text-purple-500" /> },
                { title: 'Review System', desc: 'Rate your partners after sessions to build your reputation on the platform.', icon: <Star className="w-6 h-6 text-yellow-500" /> },
                { title: '100% Free', desc: 'No hidden fees or subscriptions. Knowledge is the only currency here.', icon: <BookOpen className="w-6 h-6 text-rose-500" /> },
              ].map((feature, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-primary-800/50">
              {[
                { label: 'Active Users', value: '10,000+' },
                { label: 'Skills Listed', value: '50+' },
                { label: 'Successful Swaps', value: '25,000+' },
                { label: 'Avg User Rating', value: '4.8/5' },
              ].map((stat, i) => (
                <div key={i} className="px-4">
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
                  <div className="text-primary-200 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to trade your knowledge?</h2>
            <p className="text-xl text-slate-600 mb-10">Join thousands of users who are learning new skills every day without spending a dime.</p>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1"
            >
              Create Your Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
