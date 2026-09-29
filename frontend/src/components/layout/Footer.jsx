import { Link } from 'react-router-dom';
import { Shield, ExternalLink, MessageCircle, Mail, Heart } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Chrome Extension', href: '#extension' },
    { label: 'Privacy Monitoring', href: '#monitoring' },
    { label: 'AI Assistant', href: '#ai-assistant' },
  ],
  Resources: [
    { label: 'Documentation', href: '#' },
    { label: 'API Reference', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Changelog', href: '#' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Contact', href: '#' },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-text-primary text-text-inverse">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-bold text-white">PrivyLens</span>
                <span className="text-sm font-semibold text-primary-light ml-0.5">AI</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed mb-6">
              AI-powered privacy policy analysis that turns complex legal language
              into simple, actionable privacy insights. Understand before you accept.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-colors"
                aria-label="GitHub"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-colors"
                aria-label="Social"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-primary/20 hover:text-primary-light transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} PrivyLens AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-danger fill-danger" /> for a safer internet
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
