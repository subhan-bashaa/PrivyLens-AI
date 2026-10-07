import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  X,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getAlerts } from '../../services/api';

// Map route paths to page titles
const pageTitles = {
  '/dashboard': 'Dashboard',
  '/analyze': 'Analyze Policy',
  '/policies': 'My Policies',
  '/alerts': 'Alerts',
  '/compare': 'Compare Changes',
  '/monitoring': 'Monitoring',
  '/bookmarks': 'Bookmarks',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/help': 'Help & Support',
  '/profile': 'Profile',
};

const Header = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotifications = async () => {
      try {
        const res = await getAlerts();
        const raw = res?.data?.alerts || [];
        if (isMounted) {
          setNotifications(
            raw.map((a) => ({
              id: a.id,
              title: a.title,
              message: a.message,
              time: a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recently',
              unread: !a.is_read,
            }))
          );
        }
      } catch {
        if (isMounted) setNotifications([]);
      }
    };

    if (user) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  // Get page title from current route
  const getPageTitle = () => {
    // Check for policy-specific routes
    if (location.pathname.startsWith('/policy/')) {
      if (location.pathname.includes('/summary')) return 'AI Summary';
      if (location.pathname.includes('/details')) return 'Policy Details';
      if (location.pathname.includes('/compare')) return 'Compare Versions';
      return 'Policy';
    }
    return pageTitles[location.pathname] || 'PrivyLens AI';
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header
      className={`
        fixed top-0 right-0 h-16 bg-card/80 backdrop-blur-md
        border-b border-border z-30
        flex items-center justify-between px-6
        transition-all duration-300 ease-in-out
        ${isCollapsed ? 'left-[72px]' : 'left-[260px]'}
      `}
    >
      {/* Left: Page Title */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-text-primary">
          {getPageTitle()}
        </h2>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                <input
                  type="text"
                  placeholder="Search policies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="
                    w-64 pl-9 pr-4 py-2 text-sm rounded-xl
                    bg-page-bg border border-border
                    text-text-primary placeholder:text-text-tertiary
                    focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200
                  "
                  autoFocus
                />
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-2 rounded-xl hover:bg-card-hover text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-xl hover:bg-card-hover text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Quick Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-card-hover text-text-tertiary hover:text-text-primary transition-all cursor-pointer"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to Clean Light mode' : 'Switch to Cyber Emerald Dark mode'}
        >
          {isDark ? (
            <Sun className="w-5 h-5 text-amber-400 hover:text-amber-300 transition-transform duration-300 hover:rotate-90" />
          ) : (
            <Moon className="w-5 h-5 text-primary hover:text-primary-dark transition-transform duration-300 hover:-rotate-12" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative p-2.5 rounded-xl hover:bg-card-hover text-text-tertiary hover:text-text-primary transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border-2 border-card" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-2xl border border-border shadow-xl animate-scale-in z-50">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-text-primary">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 px-4 text-center">
                    <Bell className="w-8 h-8 mx-auto mb-2 text-text-tertiary/40" />
                    <p className="text-sm font-medium text-text-secondary">No notifications</p>
                    <p className="text-xs text-text-tertiary mt-1">You are all caught up</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      className={`
                        w-full text-left px-4 py-3 hover:bg-card-hover transition-colors
                        border-b border-border last:border-b-0 cursor-pointer
                        ${notif.unread ? 'bg-primary/[0.03]' : ''}
                      `}
                      onClick={() => {
                        setNotifOpen(false);
                        navigate('/alerts');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {notif.unread && (
                          <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />
                        )}
                        <div className={notif.unread ? '' : 'ml-5'}>
                          <p className="text-sm font-medium text-text-primary">
                            {notif.title}
                          </p>
                          <p className="text-xs text-text-tertiary mt-0.5">
                            {notif.message}
                          </p>
                          <p className="text-xs text-text-tertiary mt-1">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-border">
                <button
                  onClick={() => {
                    setNotifOpen(false);
                    navigate('/alerts');
                  }}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition-colors w-full text-center cursor-pointer"
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Menu */}
        {user ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-card-hover transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden border border-primary/20">
                {user?.avatarUrl || user?.avatar_url || user?.avatar ? (
                  <img
                    src={user.avatarUrl || user.avatar_url || user.avatar}
                    alt={user.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-semibold text-text-inverse">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${
                  profileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-card rounded-2xl border border-border shadow-xl animate-scale-in z-50">
                <div className="px-4 py-3 border-b border-border">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-text-primary truncate">
                      {user.name}
                    </p>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 capitalize">
                      {user.role || 'Student'}
                    </span>
                  </div>
                  <p className="text-xs text-text-tertiary mt-0.5 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/profile');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                </div>
                <div className="border-t border-border py-1.5">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors cursor-pointer"
                  >
                    <span>🔄</span>
                    Switch User / Log In As Another User
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger-light transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer"
          >
            Sign In
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
