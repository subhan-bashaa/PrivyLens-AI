import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  PlusCircle,
  Activity,
  AlertTriangle,
  FileCheck,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MOCK_POLICIES, getFeaturedPolicy } from '../data/mockPolicies';
import {
  PolicyHeroCard,
  KeyInsightsGrid,
  RedFlagsCard,
  PositiveFindingsCard,
  ScoreBreakdownChart,
  RecentPoliciesTable,
} from '../components/dashboard';

const Dashboard = () => {
  const { user } = useAuth();
  const currentPolicy = getFeaturedPolicy();

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const userName = user?.name ? user.name.split(' ')[0] : 'there';

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Header & Greeting */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
            {getGreeting()}, {userName} 👋
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-1">
            Here is your privacy intelligence overview and latest policy analysis.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-lg hover:shadow-primary/25 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Analyze New Policy
        </Link>
      </div>

      {/* Quick Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Monitored Policies</p>
            <p className="text-2xl font-bold text-text-primary mt-1">12</p>
            <p className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              All active & watching
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Average Trust Score</p>
            <p className="text-2xl font-bold text-text-primary mt-1">7.4</p>
            <p className="text-[11px] text-success font-medium mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +0.3 from last month
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-success-light text-success flex items-center justify-center">
            <FileCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Critical Red Flags</p>
            <p className="text-2xl font-bold text-danger mt-1">3</p>
            <p className="text-[11px] text-danger font-medium mt-1">
              Requires user review
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-danger-light text-danger flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs font-medium text-text-tertiary">Detection Extension</p>
            <p className="text-2xl font-bold text-text-primary mt-1">Ready</p>
            <p className="text-[11px] text-primary font-medium mt-1">
              Auto-detects policies
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-accent-light text-accent-dark flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 1. Spotlight Hero Card: Last/Current Analyzed Policy */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-text-tertiary uppercase tracking-wider">
            Current Focus Policy
          </span>
          <Link
            to="/monitoring"
            className="text-xs font-semibold text-primary hover:text-primary-dark flex items-center gap-1"
          >
            View all monitoring <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <PolicyHeroCard policy={currentPolicy} />
      </div>

      {/* 2. Key Insights Grid (6 Pillars) */}
      <KeyInsightsGrid
        insights={currentPolicy.keyInsights}
        scores={currentPolicy.scores}
      />

      {/* 3. Red Flags & Positive Findings (Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RedFlagsCard redFlags={currentPolicy.redFlags} />
        <PositiveFindingsCard positiveFindings={currentPolicy.positiveFindings} />
      </div>

      {/* 4. Score Breakdown Benchmark Chart */}
      <ScoreBreakdownChart scores={currentPolicy.scores} />

      {/* 5. Recently Analyzed & Monitored Policies */}
      <RecentPoliciesTable policies={MOCK_POLICIES} />
    </div>
  );
};

export default Dashboard;
