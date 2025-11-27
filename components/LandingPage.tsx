import React, { useState } from 'react';
import { SignInButton } from '@clerk/clerk-react';
import { 
  Sparkles, ArrowRight, CheckCircle, Zap, Brain, Rocket, 
  Users, TrendingUp, Code, Layers, Lock, BarChart3,
  ChevronDown, Menu, X as XIcon
} from 'lucide-react';

// Add custom animations via style tag
const animationStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes float-delay {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
  
  @keyframes glow {
    0%, 100% { box-shadow: 0 0 20px rgba(94, 23, 235, 0.3); }
    50% { box-shadow: 0 0 40px rgba(203, 108, 230, 0.5); }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(30px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes shimmer {
    0%, 100% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes pulse-scale {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .animate-float { animation: float 3s ease-in-out infinite; }
  .animate-float-delay { animation: float-delay 3s ease-in-out infinite 0.5s; }
  .animate-glow { animation: glow 2s ease-in-out infinite; }
  .animate-slide-up { animation: slideInUp 0.6s ease-out forwards; }
  .animate-slide-left { animation: slideInLeft 0.6s ease-out forwards; }
  .animate-slide-right { animation: slideInRight 0.6s ease-out forwards; }
  .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }
  
  .delay-1 { animation-delay: 0.1s; }
  .delay-2 { animation-delay: 0.2s; }
  .delay-3 { animation-delay: 0.3s; }
  .delay-4 { animation-delay: 0.4s; }
  .delay-5 { animation-delay: 0.5s; }
  .delay-6 { animation-delay: 0.6s; }
`;

const XommunityLogo = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 fill-none">
    {/* Left C */}
    <path
      d="M 20 20 Q 30 30 30 50 Q 30 70 20 80"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
    />
    {/* Right C (mirrored) */}
    <path
      d="M 80 20 Q 70 30 70 50 Q 70 70 80 80"
      stroke="currentColor"
      strokeWidth="8"
      strokeLinecap="round"
    />
  </svg>
);

const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (section: string) => {
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#060312] via-[#160428] to-black text-white overflow-hidden">
      <style>{animationStyles}</style>
      {/* Hidden Sign-In Trigger */}
      <SignInButton mode="modal">
        <button data-signup-trigger className="hidden" />
      </SignInButton>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md border-b border-purple-900/20 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-[#5E17EB]">
              <XommunityLogo />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] bg-clip-text text-transparent">
              Xommunity
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('features')} className="text-gray-300 hover:text-white transition text-sm lg:text-base">
              Features
            </button>
            <button onClick={() => scrollTo('how-works')} className="text-gray-300 hover:text-white transition text-sm lg:text-base">
              How It Works
            </button>
            <SignInButton mode="modal">
              <button className="px-5 sm:px-6 py-2 bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm">
                Sign In
              </button>
            </SignInButton>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#5E17EB]"
          >
            {mobileMenuOpen ? <XIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur border-t border-purple-900/20 p-4 space-y-3">
            <button onClick={() => scrollTo('features')} className="block w-full text-left text-gray-300 hover:text-white py-2 text-sm">
              Features
            </button>
            <button onClick={() => scrollTo('how-works')} className="block w-full text-left text-gray-300 hover:text-white py-2 text-sm">
              How It Works
            </button>
            <SignInButton mode="modal">
              <button className="w-full px-6 py-2 bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm">
                Sign In
              </button>
            </SignInButton>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0614] via-[#1a0a2e] to-black"></div>
        
        {/* Animated Background Orbs */}
        <div className="absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#5E17EB]/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse opacity-30"></div>
        <div className="absolute bottom-20 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-[#CB6CE6]/20 rounded-full mix-blend-screen filter blur-3xl animate-pulse opacity-30" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-6xl mx-auto text-center space-y-6 sm:space-y-8 px-4">
          {/* Headline */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="inline-block animate-slide-up text-white">Create</span>
              <span className="block bg-gradient-to-r from-[#5E17EB] via-[#CB6CE6] to-[#5E17EB] bg-clip-text text-transparent animate-slide-up delay-1">
                Professional Content
              </span>
              <span className="inline-block animate-slide-up delay-2 text-white">In Seconds</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed animate-slide-up delay-3">
              Powered by advanced AI, Xommunity transforms your ideas into compelling, polished content. 
              Say goodbye to writer's block and hello to unlimited creativity.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4">
            <SignInButton mode="modal">
              <button className="group px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-900/70 transform hover:-translate-y-1 transition flex items-center justify-center gap-2 cursor-pointer animate-slide-up delay-4">
                Get Started Free
                <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
              </button>
            </SignInButton>
            <button
              onClick={() => scrollTo('features')}
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-purple-900 text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl hover:bg-purple-900/10 transition cursor-pointer animate-slide-up delay-5"
            >
              Learn More
            </button>
          </div>

          {/* Social Proof */}
          <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400 animate-slide-up delay-6">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-[#5E17EB]" />
              <span>The best and trusted AI content generator</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-purple-900"></div>
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-[#CB6CE6]" />
              <span>10 free prompts daily</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={28} className="text-[#5E17EB]" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-24 px-4 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16 space-y-2 sm:space-y-4 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              Why Choose <span className="text-[#5E17EB]">Xommunity</span>?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to craft stunning content, powered by state-of-the-art AI
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                icon: Brain,
                title: 'AI-Powered',
                description: 'Leverages Google Gemini 2.5 for cutting-edge content generation'
              },
              {
                icon: Layers,
                title: 'Multiple Formats',
                description: 'Generate blogs, social media posts, emails, scripts, and more'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Get professional content in seconds, not hours'
              },
              {
                icon: Lock,
                title: 'Privacy First',
                description: 'Your content is encrypted and never shared with third parties'
              },
              {
                icon: Users,
                title: 'Collaborate',
                description: 'Share and save your best content with your team'
              },
              {
                icon: TrendingUp,
                title: 'Analytics Ready',
                description: 'Optimized content with built-in SEO suggestions'
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group p-5 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-900/10 to-transparent border border-purple-900/20 rounded-lg sm:rounded-2xl hover:border-purple-900/50 hover:bg-purple-900/20 transition cursor-pointer animate-slide-up"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="inline-block p-2 sm:p-3 bg-gradient-to-br from-[#5E17EB] to-[#CB6CE6] rounded-lg mb-3 sm:mb-4 group-hover:scale-110 transition">
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-works" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-black to-purple-900/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 sm:mb-16 animate-slide-up">
            How It <span className="text-[#5E17EB]">Works</span>
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { step: 1, title: 'Sign Up', desc: 'Create your free account in seconds' },
              { step: 2, title: 'Choose Type', desc: 'Select your content format' },
              { step: 3, title: 'Add Details', desc: 'Provide your topic and preferences' },
              { step: 4, title: 'Generate', desc: 'AI creates professional content instantly' }
            ].map((item, idx) => (
              <div key={idx} className="relative animate-slide-up" style={{ animationDelay: `${idx * 0.15}s` }}>
                <div className="flex flex-col items-center">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-br from-[#5E17EB] to-[#CB6CE6] rounded-full flex items-center justify-center text-lg sm:text-2xl font-bold mb-3 sm:mb-4 shadow-lg shadow-purple-900/50 hover:animate-pulse-scale transition">
                    {item.step}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-center mb-1 sm:mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-center text-xs sm:text-sm">{item.desc}</p>
                </div>
                {idx < 3 && (
                  <div className="hidden md:block absolute top-8 -right-4 w-8 h-1 bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6]"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#5E17EB]/10 to-[#CB6CE6]/10"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold animate-slide-up leading-tight">
            Ready to Transform Your Content?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 animate-slide-up delay-1 max-w-2xl mx-auto">
            Join thousands of creators and marketers using Xommunity to scale their content production
          </p>
          <SignInButton mode="modal">
            <button className="group px-7 sm:px-10 py-3 sm:py-4 bg-gradient-to-r from-[#5E17EB] to-[#CB6CE6] text-white font-bold text-base sm:text-lg rounded-lg sm:rounded-xl shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-900/70 transform hover:-translate-y-1 transition inline-flex items-center gap-2 cursor-pointer animate-slide-up delay-2">
              Start Creating Now
              <Rocket className="group-hover:translate-x-1 transition" size={20} />
            </button>
          </SignInButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-purple-900/20 py-8 sm:py-12 px-4 animate-slide-up">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2 hover:text-white transition">
            <div className="text-[#5E17EB]">
              <XommunityLogo />
            </div>
            <span className="font-bold whitespace-nowrap">Xommunity AI © 2026</span>
          </div>
          <div className="flex gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition transform hover:translate-y-[-2px]">Privacy</a>
            <a href="#" className="hover:text-white transition transform hover:translate-y-[-2px]">Terms</a>
            <a href="#" className="hover:text-white transition transform hover:translate-y-[-2px]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
