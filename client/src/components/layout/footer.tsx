import { Link } from 'wouter';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-blue-900">🏏</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Tuskers CC</h3>
                <p className="text-blue-300 text-sm">Cricket Club</p>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              Champions of the field, united by passion for cricket. Join our legacy of excellence and sportsmanship.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-blue-300 hover:text-white transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-blue-300 hover:text-white transition-colors text-sm">
                  Our Team
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-blue-300 hover:text-white transition-colors text-sm">
                  News & Updates
                </Link>
              </li>
              <li>
                <Link href="/stats" className="text-blue-300 hover:text-white transition-colors text-sm">
                  Statistics
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-blue-300 hover:text-white transition-colors text-sm">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-blue-300 hover:text-white transition-colors text-sm">
                  Player Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-yellow-500" />
                <span className="text-blue-300 text-sm">info@tuskerscc.com</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-yellow-500" />
                <span className="text-blue-300 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-yellow-500 mt-0.5" />
                <span className="text-blue-300 text-sm">
                  Cricket Ground Complex<br />
                  Sports City, SC 12345
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-3 mb-6">
              <a href="#" className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            
            <div>
              <p className="text-sm text-blue-300 mb-2">Stay updated with our latest news</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-blue-800 border border-blue-700 rounded-l text-sm text-white placeholder-blue-400 focus:outline-none focus:border-yellow-500"
                />
                <button className="px-4 py-2 bg-yellow-500 text-blue-900 rounded-r hover:bg-yellow-600 transition-colors text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-blue-400 text-sm">
            © 2025 Tuskers Cricket Club. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-blue-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-blue-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </a>
            <a href="#" className="text-blue-400 hover:text-white transition-colors text-sm">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}