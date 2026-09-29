import { CheckCircle2, ShieldCheck, Award, ExternalLink } from 'lucide-react';

const DetailedPositivesSection = ({ positiveFindings = [] }) => {
  if (!positiveFindings || positiveFindings.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-success-light text-success flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-text-primary tracking-tight">
              Verified Positive Safeguards
            </h3>
            <p className="text-xs text-text-secondary">
              Privacy-positive features and protections confirmed by AI analysis
            </p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-light text-success border border-success/20 shrink-0">
          {positiveFindings.length} Verified
        </span>
      </div>

      {/* Positive Finding Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {positiveFindings.map((finding, idx) => (
          <div
            key={finding.id}
            className="p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/8 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${idx * 60}ms` }}
          >
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-success-light flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-text-primary mb-1.5">
                  {finding.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed mb-2">
                  {finding.description}
                </p>

                {/* Verification Badge */}
                <div className="flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-primary" />
                  <span className="text-[10px] font-semibold text-primary">
                    AI Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedPositivesSection;
