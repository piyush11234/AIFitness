import React from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Brain, Heart, Users, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent">
                  FitFusion
                </h2>
                <p className="text-sm text-gray-400">Train Smarter, Live Better</p>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Revolutionizing fitness with AI-powered coaching, personalized workouts, 
              and real-time feedback for your wellness journey.
            </p>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="h-4 w-4" />, label: "Facebook" },
                { icon: <Twitter className="h-4 w-4" />, label: "Twitter" },
                { icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
                { icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
                { icon: <Youtube className="h-4 w-4" />, label: "YouTube" }
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gradient-to-r hover:from-green-600 hover:to-emerald-500 text-gray-400 hover:text-white transition-all duration-300"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links & Company Combined */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-green-400" />
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/exercises", label: "AI Exercises" },
                  { to: "/plans", label: "Personalized Plans" },
                  { to: "/yoga", label: "Yoga Sessions" },
                  { to: "/meditation", label: "Mindfulness" },
                  { to: "/progress", label: "Progress Tracking" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-green-400 transition-colors flex items-center gap-2 group py-1"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-green-400" />
                Company
              </h3>
              <ul className="space-y-3">
                {[
                  { to: "/about", label: "About Us" },
                  { to: "/privacy", label: "Privacy Policy" },
                  { to: "/terms", label: "Terms of Service" },
                  { to: "/contact", label: "Contact Us" },
                  { to: "/faq", label: "FAQ" },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="hover:text-green-400 transition-colors flex items-center gap-2 group py-1"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-400" />
                Contact Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Address</p>
                    <p className="text-white text-sm">123 Fitness Street, Health City, HC 56789</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white text-sm">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-400 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white text-sm">support@fitfusion.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex col md:row justify-between items-center gap-6">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} <span className="text-green-400 font-medium">FitFusion</span>. All rights reserved.
          </p>
          
          {/* <div className="flex wrap justify-center gap-4 text-sm">
            <Link to="/privacy" className="hover:text-green-400 transition-colors px-2 py-1">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-green-400 transition-colors px-2 py-1">
              Terms of Service
            </Link>
            <Link to="/cookies" className="hover:text-green-400 transition-colors px-2 py-1">
              Cookie Policy
            </Link>
            <Link to="/sitemap" className="hover:text-green-400 transition-colors px-2 py-1">
              Sitemap
            </Link>
          </div> */}
          
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Heart className="h-4 w-4 text-red-400 animate-pulse" />
            <span>Made with passion for fitness enthusiasts</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;