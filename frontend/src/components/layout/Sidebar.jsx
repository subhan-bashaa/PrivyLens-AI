import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Bell,
  GitCompare,
  Eye,
  Bookmark,
  FileBarChart,
  Settings,
  HelpCircle,
  LogOut,
  Shield,
  ChevronLeft,
  ChevronRight,
  ScanSearch,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  {
    label: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Analyze Policy',
    path: '/analyze',
    icon: ScanSearch,
  },
  {
    label: 'My Policies',
    path: '/policies',
    icon: FileText,
  },
  {
    label: 'Alerts',
    path: '/alerts',
    icon: Bell,
  },
  {
    label: 'Compare Changes',
    path: '/compare',
    icon: GitCompare,
  },
  {
    label: 'Monitoring',
    path: '/monitoring',
    icon: Eye,
  },
  {
    label: 'Bookmarks',
    path: '/bookmarks',
    icon: Bookmark,
  },
  {
    label: 'Reports',
    path: '/reports',
    icon: FileBarChart,
  },
];

const bottomNavItems = [
  {
    label: 'Settings',
    path: '/settings',
    icon: Settings,
  },
  {
    label: 'Help & Support',
    path: '/help',
    icon: HelpCircle,
  },
];

const Sidebar = ({ isCollapsed, onToggle }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen bg-card border-r border-border
        flex flex-col z-40 transition-all duration-300 ease-in-out
        ${isCollapsed ? 'w-[72px]' : 'w-[260px]'}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-text-inverse" />
        </div>
        {!isCollapsed && (
          <div className="animate-fade-in">
            <h1 className="text-base font-bold text-text-primary leading-tight">
              PrivyLens
            </h1>
            <span className="text-[11px] font-medium text-primary leading-none">
              AI
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200 relative
                ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-text-secondary'
                }`}
              />
              {!isCollapsed && (
                <span className="text-sm truncate animate-fade-in">{item.label}</span>
              )}
              {item.badge && !isCollapsed && (
                <span className="ml-auto bg-danger text-text-inverse text-xs font-semibold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
              {item.badge && isCollapsed && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-danger rounded-full border-2 border-card" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="border-t border-border px-3 py-3 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-text-secondary hover:bg-card-hover hover:text-text-primary'
                }
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-tertiary group-hover:text-text-secondary'
                }`}
              />
              {!isCollapsed && (
                <span className="text-sm truncate animate-fade-in">{item.label}</span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="border-t border-border px-3 py-3">
        <div
          className={`
            flex items-center gap-3 px-3 py-2.5 rounded-xl
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-text-inverse">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </span>
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <p className="text-sm font-medium text-text-primary truncate">
                {user?.name || 'User'}
              </p>
              {user?.email && (
                <p className="text-xs text-text-tertiary truncate">
                  {user.email}
                </p>
              )}
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-danger-light text-text-tertiary hover:text-danger transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        {isCollapsed && (
          <div className="flex justify-center mt-1">
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-danger-light text-text-tertiary hover:text-danger transition-colors cursor-pointer"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="
          absolute -right-3 top-20 w-6 h-6 rounded-full
          bg-card border border-border shadow-sm
          flex items-center justify-center cursor-pointer
          hover:bg-card-hover hover:border-primary/30
          transition-all duration-200 z-50
        "
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-text-tertiary" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-text-tertiary" />
        )}
      </button>
    </aside>
  );
};

export default Sidebar;
