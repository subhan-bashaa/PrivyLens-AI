import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getUserStats } from '../services/api';
import {
  ProfileHeader,
  UserStatsOverview,
  PrivacyPersonaCard,
  AccountDetailsForm,
} from '../components/profile';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getUserStats();
        if (res?.data?.stats) {
          setStats(res.data.stats);
        }
      } catch {
        setStats({
          totalPolicies: 0,
          monitoredPolicies: 0,
          unreadAlerts: 0,
          averageScore: 0.0,
        });
      }
    };
    fetchStats();
  }, []);

  const handleUpdatePersona = (personaData) => {
    updateUser({
      persona: personaData.persona,
      privacyFlags: personaData.privacyFlags,
    });
  };

  const handleUpdateProfile = (formData) => {
    updateUser(formData);
  };

  const handleChangeAvatar = () => {
    // Cycle between stylish demo avatars
    const sampleAvatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    ];
    const currentIndex = sampleAvatars.indexOf(user?.avatar);
    const nextAvatar = sampleAvatars[(currentIndex + 1) % sampleAvatars.length];
    updateUser({ avatar: nextAvatar });
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-5xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">User Profile</span>
      </nav>

      {/* 1. Identity Header */}
      <ProfileHeader user={user} onAvatarClick={handleChangeAvatar} />

      {/* 2. User Stats Overview */}
      <UserStatsOverview user={user} stats={stats} />

      {/* 3. Privacy Persona & Sensitivity Customizer */}
      <PrivacyPersonaCard
        initialPersona={user?.persona || 'balanced'}
        onSavePersona={handleUpdatePersona}
      />

      {/* 4. Account Details & Credentials Form */}
      <AccountDetailsForm user={user} onUpdateUser={handleUpdateProfile} />
    </div>
  );
};

export default Profile;
