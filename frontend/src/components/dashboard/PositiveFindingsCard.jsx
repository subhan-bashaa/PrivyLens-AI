import { CheckCircle2, ShieldCheck } from 'lucide-react';

const PositiveFindingsCard = ({ positiveFindings = [] }) => {
  if (!positiveFindings || positiveFindings.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-success-light text-success flex items-center justify-center">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">Positive Findings</h3>
            <p className="text-xs text-text-tertiary">Verified positive privacy safeguards in this policy</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-success-light text-success border border-success/20">
          {positiveFindings.length} Passed
        </span>
      </div>

      <div className="space-y-3">
        {positiveFindings.map((finding) => (
          <div
            key={finding.id}
            className="p-4 rounded-xl border border-border bg-page-bg/60 hover:bg-page-bg transition-colors"
          >
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-text-primary mb-1">
                  {finding.title}
                </h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {finding.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PositiveFindingsCard;
