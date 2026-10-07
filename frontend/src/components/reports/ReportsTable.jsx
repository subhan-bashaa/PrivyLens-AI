import { useState } from 'react';
import {
  FileText,
  FileSpreadsheet,
  FileCode,
  Download,
  Eye,
  Share2,
  Trash2,
  Check,
  Calendar,
  ShieldAlert,
} from 'lucide-react';
import { generateReportFileContent } from '../../utils/reportTemplates';

const FORMAT_ICONS = {
  PDF: { icon: FileText, color: 'text-danger', bg: 'bg-danger/10', border: 'border-danger/20' },
  CSV: { icon: FileSpreadsheet, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  JSON: { icon: FileCode, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
};

const ReportsTable = ({
  reports = [],
  onPreviewReport,
  onDeleteReport,
}) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleDownload = (report) => {
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

  const handleShare = (reportId) => {
    navigator.clipboard?.writeText(`${window.location.origin}/reports#${reportId}`);
    setCopiedId(reportId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (reports.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-sm font-bold text-text-primary">
          Archived Audit & Compliance Reports
        </h3>
        <span className="text-xs text-text-tertiary">
          {reports.length} reports in storage
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-background-subtle/70 border-b border-border text-[11px] font-bold text-text-tertiary uppercase tracking-wider">
              <th className="py-3 px-4">Report Details</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Format</th>
              <th className="py-3 px-4">Compliance Status</th>
              <th className="py-3 px-4">Generated</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {reports.map((rep) => {
              const formatMeta =
                FORMAT_ICONS[rep.format] || FORMAT_ICONS.PDF;
              const FormatIcon = formatMeta.icon;

              const formattedDate = new Date(rep.generatedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <tr
                  key={rep.reportId}
                  className="hover:bg-background-hover/50 transition-colors group"
                >
                  {/* Title & Type */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${formatMeta.bg} ${formatMeta.color} ${formatMeta.border}`}
                      >
                        <FormatIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <button
                          type="button"
                          onClick={() => onPreviewReport(rep)}
                          className="font-bold text-text-primary hover:text-primary transition-colors text-left text-xs line-clamp-1 cursor-pointer"
                        >
                          {rep.title}
                        </button>
                        <p className="text-[11px] text-text-secondary line-clamp-1 mt-0.5">
                          {rep.summary}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Target Service */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-background border border-border">
                      <span className="text-sm">{rep.serviceIcon}</span>
                      <span className="font-semibold text-text-primary text-xs">
                        {rep.serviceName}
                      </span>
                    </div>
                  </td>

                  {/* Format & Size */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span
                        className={`inline-block font-mono text-[10px] font-extrabold px-1.5 py-0.5 rounded border ${formatMeta.bg} ${formatMeta.color} ${formatMeta.border}`}
                      >
                        {rep.format}
                      </span>
                      <div className="text-[10px] text-text-tertiary">
                        {rep.fileSize}
                      </div>
                    </div>
                  </td>

                  {/* Compliance Badges */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[220px]">
                      {rep.complianceBadges?.map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-background border border-border text-text-secondary whitespace-nowrap"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-text-tertiary">
                    <div className="flex items-center gap-1 text-[11px]">
                      <Calendar className="w-3 h-3" />
                      {formattedDate}
                    </div>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Preview Modal */}
                      <button
                        type="button"
                        onClick={() => onPreviewReport(rep)}
                        title="Preview report"
                        className="p-1.5 rounded-lg bg-background hover:bg-background-subtle text-text-secondary hover:text-text-primary border border-border transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {/* Download Real File */}
                      <button
                        type="button"
                        onClick={() => handleDownload(rep)}
                        title="Download file"
                        className="p-1.5 rounded-lg bg-background hover:bg-background-subtle text-primary border border-border hover:border-primary/40 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {/* Share Link */}
                      <button
                        type="button"
                        onClick={() => handleShare(rep.reportId)}
                        title="Copy share link"
                        className="p-1.5 rounded-lg bg-background hover:bg-background-subtle text-text-secondary hover:text-text-primary border border-border transition-colors cursor-pointer"
                      >
                        {copiedId === rep.reportId ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => onDeleteReport(rep.reportId)}
                        title="Delete report"
                        className="p-1.5 rounded-lg bg-background hover:bg-danger/10 text-text-tertiary hover:text-danger border border-border transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
