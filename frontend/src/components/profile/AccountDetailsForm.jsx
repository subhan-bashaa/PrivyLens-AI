import { useState } from 'react';
import { User, Mail, Building, MapPin, KeyRound, Check, Save } from 'lucide-react';

const AccountDetailsForm = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    organization: user?.organization || '',
    location: user?.location || '',
    bio: user?.bio || '',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser?.(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handlePasswordReset = () => {
    setResetSent(true);
    setTimeout(() => setResetSent(false), 3000);
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-7 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-text-primary">
            Account Profile Information
          </h2>
          <p className="text-xs text-text-secondary">
            Update your public profile and identity credentials
          </p>
        </div>

        {isSaved && (
          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            Profile Updated!
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-text-tertiary" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
              required
            />
          </div>

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-text-tertiary" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
              required
            />
          </div>

          {/* Organization */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-text-tertiary" />
              Organization / Team
            </label>
            <input
              type="text"
              name="organization"
              value={formData.organization}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-text-tertiary" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-text-secondary">
            Personal Bio & Privacy Notes
          </label>
          <textarea
            name="bio"
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-3.5 py-2 text-xs bg-background border border-border rounded-xl text-text-primary focus:outline-hidden focus:border-primary/50"
          />
        </div>

        {/* Security & Password Action */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border/80">
          <button
            type="button"
            onClick={handlePasswordReset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-primary transition-colors cursor-pointer self-start"
          >
            <KeyRound className="w-3.5 h-3.5" />
            {resetSent ? 'Password reset link sent to your email!' : 'Request Password Reset Link'}
          </button>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetailsForm;
