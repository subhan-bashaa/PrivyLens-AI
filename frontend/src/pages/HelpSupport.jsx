import { useState } from 'react';
import {
  HelpCircle,
  Search,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Send,
  ChevronDown,
  ExternalLink,
  Sparkles,
  Zap,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How does PrivyLens calculate privacy trust scores?',
    a: 'PrivyLens AI uses a multi-dimensional weighted rubric covering 6 core pillars: Data Collection, Third-Party Sharing, Tracking & Cookies, Data Retention, User Deletion Rights, and Security & Encryption. Penalties are assigned for broad ambiguous language, perpetual data retention, and third-party advertising brokers.',
  },
  {
    q: 'How does the Chrome Extension companion work?',
    a: 'The PrivyLens Chrome Extension runs a lightweight in-page content script that scans web addresses and DOM headers for privacy policies and predatory cookie banners. It displays a non-intrusive floating card in an isolated Shadow DOM so host website styles are never broken.',
  },
  {
    q: 'What are Privacy Personas and how do they change results?',
    a: 'Personas adjust the severity weights of red flags. For example, the Student persona flags proctoring telemetry and EdTech data collection heavily, while the Parent persona prioritizes COPPA compliance and location tracking.',
  },
  {
    q: 'Are my uploaded PDF documents private and safe?',
    a: 'Yes. Documents uploaded for analysis are processed transiently in memory for clause segmentation and vectorization. They are not stored permanently or shared with public LLM corpora.',
  },
  {
    q: 'How does Policy Version Monitoring detect changes?',
    a: 'The monitoring engine performs automated weekly headless scrapes of watched privacy policies, runs diff hash algorithms, and classifies revisions into additions, removals, and severity modifications.',
  },
];

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [search, setSearch] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    setSubmitted(true);
    setTimeout(() => {
      setTicketSubject('');
      setTicketMessage('');
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
          Help & Support Center
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
          Everything you need to know about analyzing policies, using the Chrome extension, and managing privacy intelligence.
        </p>
      </div>

      {/* Quick Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Documentation</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Detailed guides on persona setups, API key generation, and export formats.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">Extension Setup</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            Learn how to load unpacked extension in Chrome, Edge, and Brave browsers.
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-text-primary">System Status</h3>
          <p className="text-xs text-text-secondary leading-relaxed">
            All AI audit engines, scrapers, and webhook services are currently operational.
          </p>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">Frequently Asked Questions</h2>
            <p className="text-xs text-text-secondary">Quick answers to common privacy analysis questions</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Filter questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-background border border-border text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-border rounded-xl overflow-hidden bg-background/50 transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-card-hover transition-colors"
                >
                  <span className="text-xs sm:text-sm font-bold text-text-primary">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-text-tertiary transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Support Ticket Form */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
        <div>
          <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Contact Privacy Support Team
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Have a question, encountered an unparsed legal policy, or want to suggest an AI rule? Send us a ticket.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Issue parsing Instagram 2026 update"
              value={ticketSubject}
              onChange={(e) => setTicketSubject(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-text-secondary">Message</label>
            <textarea
              required
              rows={4}
              placeholder="Describe your question or issue in detail..."
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-background border border-border text-text-primary placeholder:text-text-tertiary focus:outline-hidden focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            {submitted ? (
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                ✓ Ticket submitted! Our support team will reply via email within 24h.
              </span>
            ) : <div />}

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer ml-auto"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpSupport;
