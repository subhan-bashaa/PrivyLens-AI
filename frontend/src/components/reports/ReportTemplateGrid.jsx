import {
  FileBarChart,
  Scale,
  GitCompare,
  FileCode,
  Zap,
} from 'lucide-react';
import { REPORT_TEMPLATES } from '../../data/mockReports';

const ICON_MAP = {
  FileBarChart,
  Scale,
  GitCompare,
  FileCode,
};

const FORMAT_COLORS = {
  PDF: 'bg-danger/10 text-danger border-danger/20',
  CSV: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
  JSON: 'bg-primary/10 text-primary border-primary/20',
};

const ReportTemplateGrid = ({ onSelectTemplate }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-warning" />
          <h2 className="text-sm font-bold text-text-primary">
            Instant 1-Click Report Templates
          </h2>
        </div>
        <span className="text-xs text-text-tertiary">
          Pre-configured legal & compliance formats
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {REPORT_TEMPLATES.map((tmpl) => {
          const Icon = ICON_MAP[tmpl.icon] || FileBarChart;
          const formatColor = FORMAT_COLORS[tmpl.format] || FORMAT_COLORS.PDF;

          return (
            <div
              key={tmpl.templateId}
              className="bg-card border border-border rounded-2xl p-4.5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header: Icon + Format Badge + Tag */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border font-mono ${formatColor}`}
                    >
                      {tmpl.format}
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-background-subtle border border-border text-text-tertiary">
                      {tmpl.badge}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-xs sm:text-sm font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
                  {tmpl.name}
                </h3>
                <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed mb-4">
                  {tmpl.description}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onSelectTemplate(tmpl)}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-background hover:bg-primary text-text-primary hover:text-white border border-border hover:border-primary transition-all cursor-pointer"
              >
                <span>Use Template</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportTemplateGrid;
