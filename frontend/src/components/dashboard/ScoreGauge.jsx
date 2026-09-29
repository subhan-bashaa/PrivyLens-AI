import { useMemo } from 'react';

const ScoreGauge = ({
  score = 7.2,
  maxScore = 10,
  size = 'md',
  showLabel = true,
  label = 'Trust Score',
}) => {
  // Normalize score between 0 and 10
  const normalized = Math.min(Math.max(score, 0), maxScore);
  const percentage = (normalized / maxScore) * 100;

  // Determine color scheme based on score
  const colorScheme = useMemo(() => {
    if (normalized >= 8.0) {
      return {
        stroke: '#22C55E',
        gradientStart: '#22C55E',
        gradientEnd: '#16A34A',
        bg: 'text-success',
        badgeBg: 'bg-success-light',
        badgeText: 'text-success-dark',
        rating: 'Strong Protection',
      };
    }
    if (normalized >= 5.0) {
      return {
        stroke: '#F59E0B',
        gradientStart: '#F59E0B',
        gradientEnd: '#D97706',
        bg: 'text-warning',
        badgeBg: 'bg-warning-light',
        badgeText: 'text-warning-dark',
        rating: 'Medium Risk',
      };
    }
    return {
      stroke: '#EF4444',
      gradientStart: '#EF4444',
      gradientEnd: '#DC2626',
      bg: 'text-danger',
      badgeBg: 'bg-danger-light',
      badgeText: 'text-danger-dark',
      rating: 'High Privacy Risk',
    };
  }, [normalized]);

  // Size configurations
  const dimensions = {
    sm: { width: 90, height: 90, strokeWidth: 8, fontSize: 'text-2xl', labelSize: 'text-[10px]' },
    md: { width: 140, height: 140, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-xs' },
    lg: { width: 180, height: 180, strokeWidth: 13, fontSize: 'text-5xl', labelSize: 'text-sm' },
  }[size] || { width: 140, height: 140, strokeWidth: 10, fontSize: 'text-4xl', labelSize: 'text-xs' };

  const radius = (dimensions.width - dimensions.strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const gradientId = `score-gauge-grad-${Math.floor(score * 10)}`;

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.width}
          height={dimensions.height}
          className="transform -rotate-90 drop-shadow-sm"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorScheme.gradientStart} />
              <stop offset="100%" stopColor={colorScheme.gradientEnd} />
            </linearGradient>
          </defs>

          {/* Background circle track */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            stroke="#E5E7EB"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
            className="opacity-70"
          />

          {/* Progress circle stroke */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.height / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`font-extrabold tracking-tight ${dimensions.fontSize} text-text-primary leading-none`}>
            {normalized.toFixed(1)}
          </span>
          <span className="text-[11px] font-medium text-text-tertiary mt-0.5">
            out of {maxScore}
          </span>
        </div>
      </div>

      {showLabel && (
        <div className="mt-2.5 flex flex-col items-center">
          <span className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
            {label}
          </span>
          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorScheme.badgeBg} ${colorScheme.badgeText}`}>
            {colorScheme.rating}
          </span>
        </div>
      )}
    </div>
  );
};

export default ScoreGauge;
