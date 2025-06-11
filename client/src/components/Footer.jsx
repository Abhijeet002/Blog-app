import React from 'react';
import { Heart, Mail, Phone, MapPin, Github, Twitter, Instagram, Linkedin, ArrowUp, Send } from 'lucide-react';

const Footer = () => {
  

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/abhijeet-sachan/', label: 'LinkedIn', color: 'hover:text-blue-600' },
    { icon: Github, href: 'https://github.com/Abhijeet002', label: 'GitHub', color: 'hover:text-gray-400' }
  ];

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Explore', href: '/explore' },
    { name: 'Write', href: '/write' },
    { name: 'About', href: '/about' }
  ];

  const categories = [
    { name: 'Entertainment', href: '/category/entertainment' },
    { name: 'Technology', href: '/category/technology' },
    { name: 'Travel', href: '/category/travel' },
    { name: 'Food', href: '/category/food' },
    { name: 'Lifestyle', href: '/category/lifestyle' },
    { name: 'Health', href: '/category/health' }
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
    { name: 'DMCA', href: '/dmca' }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#3fcd9d] rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main footer content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] bg-clip-text text-transparent">
                My Blog
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Discover amazing stories, ideas, and insights from our community of passionate writers and thinkers.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-200">Follow Us</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-3 bg-white/10 backdrop-blur-sm rounded-xl ${social.color} transition-all duration-300 hover:scale-110 hover:bg-white/20 group`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="font-semibold text-xl text-gray-200">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-[#3fcd9d] transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#3fcd9d] transition-all duration-200 mr-0 group-hover:mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="font-semibold text-xl text-gray-200">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <a
                    href={category.href}
                    className="text-gray-300 hover:text-[#3fcd9d] transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#3fcd9d] transition-all duration-200 mr-0 group-hover:mr-3"></span>
                    {category.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h4 className="font-semibold text-xl text-gray-200">Stay Updated</h4>
            
            {/* Newsletter Signup */}
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Subscribe to get the latest posts delivered right to your inbox.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-xl text-white placeholder-gray-400 focus:outline-none focus:border-[#3fcd9d] transition-colors"
                />
                <button className="px-4 py-3 bg-gradient-to-r from-[#3fcd9d] to-[#2bbd8e] rounded-r-xl hover:from-[#2bbd8e] hover:to-[#239d73] transition-all duration-200 group">
                  <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h5 className="font-medium text-gray-200">Contact</h5>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-[#3fcd9d]" />
                  <span>hello@myblog.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-[#3fcd9d]" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-[#3fcd9d]" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12">
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-300">
            <span>© {currentYear} My Blog. Made with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>by our team</span>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-gray-400 hover:text-[#3fcd9d] transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      

      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 pointer-events-none"></div>
    </footer>
  );
};

export default Footer;