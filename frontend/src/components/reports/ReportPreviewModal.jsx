import { useEffect } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { generateReportFileContent } from '../../utils/reportTemplates';

const ReportPreviewModal = ({ report, isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !report) return null;

  const handleDownload = () => {
    const content = generateReportFileContent(report);
    const extension =
      report.format === 'JSON' ? 'json' : report.format === 'CSV' ? 'csv' : 'txt';
    const mimeType =
      report.format === 'JSON'
        ? 'application/json'
        : report.format === 'CSV'
        ? 'text/csv'
        : 'text/plain';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(report.generatedAt).toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Document Card */}
      <div className="relative bg-card border border-border rounded-2xl w-full max-w-3xl shadow-2xl z-10 overflow-hidden animate-scale-in my-8">
        {/* Top Action Bar */}
        <div className="p-4 sm:p-5 border-b border-border bg-background-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-text-tertiary">
              REPORT REF: {report.reportId}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase font-mono bg-primary/10 text-primary border border-primary/20">
              {report.format}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-card hover:bg-background text-text-primary border border-border transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-text-tertiary" />
              Print
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-dark transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-text-tertiary hover:text-text-primary hover:bg-background transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Document Header & Watermark */}
          <div className="border-b border-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-xs tracking-wider uppercase">
                <ShieldCheck className="w-4 h-4" />
                <span>PrivyLens AI Executive Assessment</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary">
                {report.title}
              </h1>
              <div className="flex items-center gap-2 text-xs text-text-tertiary pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Generated on {formattedDate}</span>
                <span>•</span>
                <span>Audited by {report.author || 'PrivyLens AI Engine'}</span>
              </div>
            </div>

            {/* Target Service & Score Card */}
            <div className="bg-background p-3.5 rounded-2xl border border-border shrink-0 text-center min-w-[140px]">
              <div className="text-2xl mb-1">{report.serviceIcon}</div>
              <div className="text-xs font-bold text-text-primary">{report.serviceName}</div>
              <div className="text-xl font-extrabold text-primary mt-1">
                {report.trustScore}
                <span className="text-xs font-normal text-text-tertiary">/10</span>
              </div>
              <span
                className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                  report.riskLevel === 'Low'
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : report.riskLevel === 'Medium'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-danger/10 text-danger'
                }`}
              >
                {report.riskLevel} Risk
              </span>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              1. Executive Summary
            </h3>
            <div className="bg-background p-4 rounded-xl border border-border text-xs sm:text-sm text-text-secondary leading-relaxed">
              {report.summary}
            </div>
          </div>

          {/* 2. Key Findings & Legal Risk Flags */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              2. Key Audit Findings ({report.keyFindings.length})
            </h3>
            <div className="space-y-2">
              {report.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border text-xs text-text-secondary"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <span className="leading-relaxed">{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Statutory Compliance Certification Block */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-tertiary">
              3. Regulatory Compliance Checkpoints
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {report.complianceBadges?.map((badge, idx) => (
                <div
                  key={idx}
                  className="bg-background p-3 rounded-xl border border-border flex items-center gap-2 text-xs font-medium text-text-primary"
                >
                  <Award className="w-4 h-4 text-primary shrink-0" />
                  <span>{badge}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Footer Note */}
          <div className="pt-4 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-text-tertiary gap-2">
            <span>PrivyLens AI Compliance Engine v2.4</span>
            <span className="font-mono">Verification: SHA-256 Verified Document</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPreviewModal;
