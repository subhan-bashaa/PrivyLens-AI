import { FileBarChart, Plus, Download, ShieldCheck } from 'lucide-react';

const ReportsHeader = ({ totalReports, onOpenGenerateModal, onExportAll }) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Title & Description */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <FileBarChart className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-extrabold text-text-primary tracking-tight">
                Reports & Export Center
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                <ShieldCheck className="w-3 h-3" />
                {totalReports} Audits Ready
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              Generate executive briefs, statutory compliance audits (GDPR, CCPA, COPPA), and structured clause exports
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={onExportAll}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover text-text-primary border border-border hover:border-primary/30 transition-all cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-text-tertiary" />
            Batch Export (ZIP)
          </button>

          <button
            type="button"
            onClick={onOpenGenerateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Generate Custom Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsHeader;
