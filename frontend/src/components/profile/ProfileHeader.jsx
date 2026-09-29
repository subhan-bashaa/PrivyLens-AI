import { Shield, Crown, Calendar, Mail, UserCheck, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProfileHeader = ({ user, onAvatarClick }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm relative overflow-hidden">
      {/* Subtle background accent glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 relative z-10">
        {/* Left: Avatar & Identity */}
        <div className="flex items-center gap-4.5">
          {/* Avatar with edit overlay */}
          <div className="relative group shrink-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary/30 shadow-md"
              />
            ) : (
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold border-2 border-primary/30 shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}

            <button
              type="button"
              onClick={onAvatarClick}
              title="Change Profile Photo"
              className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-card border border-border shadow-md flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary/40 transition-all cursor-pointer group-hover:scale-105"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* User Info */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary tracking-tight">
                {user?.name || 'Subha'}
              </h1>
              {user?.accountType === 'Pro' ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/25">
                  <Crown className="w-3 h-3 text-primary" />
                  Pro Member
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-background-subtle border border-border text-text-secondary">
                  Free Tier
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
              <span className="inline-flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-text-tertiary" />
                {user?.email || 'subha@example.com'}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-text-tertiary" />
                {user?.role || 'General Consumer'}
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-text-tertiary">
                <Calendar className="w-3.5 h-3.5" />
                Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2.5 self-stretch sm:self-center">
          <Link
            to="/settings"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-background hover:bg-background-hover text-text-primary border border-border hover:border-primary/30 text-xs font-bold transition-all shadow-2xs"
          >
            Manage Settings
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
