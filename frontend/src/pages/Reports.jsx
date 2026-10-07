import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, FileX, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { getReports, generateReport } from '../services/api';
import { generateReportFileContent } from '../utils/reportTemplates';
import {
  ReportsHeader,
  ReportsStatsBar,
  ReportTemplateGrid,
  ReportsFilterBar,
  ReportsTable,
  ReportPreviewModal,
  GenerateReportModal,
} from '../components/reports';

const Reports = () => {
  // Master reports archive state
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await getReports();
        const raw = res?.data?.reports || [];
        if (raw.length > 0) {
          const formatted = raw.map((r) => ({
            id: r.id,
            reportId: r.id,
            title: r.title,
            serviceName: r.policy_title || 'Audited Entity',
            serviceId: r.policy_id || 'entity',
            serviceIcon: '📄',
            format: (r.format || 'pdf').toUpperCase(),
            type: r.report_type || 'comprehensive',
            reportType: r.report_type || 'comprehensive',
            generatedAt: r.created_at || new Date().toISOString(),
            generatedDate: r.created_at ? new Date(r.created_at).toLocaleDateString() : 'Recent',
            fileSize: r.file_size || '120 KB',
            summary: r.summary || 'Statutory privacy audit report.',
            keyFindings: r.key_findings || ['DPDP Act compliance status', 'Tracking & telemetry audit'],
            trustScore: r.trust_score || 7.0,
            riskLevel: (r.trust_score || 7.0) >= 7.5 ? 'Low' : (r.trust_score || 7.0) >= 5.0 ? 'Medium' : 'High',
            downloadUrl: r.file_url || '#',
          }));
          setReports(formatted);
        } else {
          setReports([]);
        }
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedService, setSelectedService] = useState('all');

  // Modal states
  const [previewReport, setPreviewReport] = useState(null);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState(null);

  // Available services for the filter dropdown
  const availableServices = useMemo(() => {
    const map = new Map();
    reports.forEach((r) => {
      if (r.serviceId && r.serviceId !== 'all') {
        map.set(r.serviceId, { id: r.serviceId, name: r.serviceName });
      }
    });
    return Array.from(map.values());
  }, [reports]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((rep) => {
      // 1. Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = rep.title.toLowerCase().includes(q);
        const matchesService = rep.serviceName.toLowerCase().includes(q);
        const matchesSummary = rep.summary.toLowerCase().includes(q);
        const matchesFindings = rep.keyFindings?.some((f) =>
          f.toLowerCase().includes(q)
        );
        if (!matchesTitle && !matchesService && !matchesSummary && !matchesFindings) {
          return false;
        }
      }

      // 2. Format filter
      if (selectedFormat !== 'all' && rep.format !== selectedFormat) {
        return false;
      }

      // 3. Type filter
      if (selectedType !== 'all' && rep.type !== selectedType) {
        return false;
      }

      // 4. Service filter
      if (selectedService !== 'all' && rep.serviceId !== selectedService) {
        return false;
      }

      return true;
    });
  }, [reports, searchQuery, selectedFormat, selectedType, selectedService]);

  // Actions
  const handleOpenGenerateWithTemplate = useCallback((template) => {
    setActiveTemplate(template);
    setIsGenerateModalOpen(true);
  }, []);

  const handleOpenCustomGenerate = useCallback(() => {
    setActiveTemplate(null);
    setIsGenerateModalOpen(true);
  }, []);

  // Calculate live report stats
  const reportStats = useMemo(() => {
    const total = reports.length;
    const passCount = reports.filter((r) => (r.trustScore || 0) >= 7.0).length;
    const passRate = total > 0 ? `${Math.round((passCount / total) * 100)}%` : '0%';
    const redFlags = reports.reduce((acc, r) => acc + (r.keyFindings?.length || 0), 0);
    return {
      totalReports: total,
      compliancePassRate: passRate,
      redFlagsDocumented: redFlags,
      activeSchedules: total > 0 ? 1 : 0,
      storageUsed: total > 0 ? `${(total * 0.15).toFixed(1)} MB` : '0 MB',
    };
  }, [reports]);

  const handleCreateReport = useCallback((newReport) => {
    setReports((prev) => [{ ...newReport, id: newReport.reportId }, ...prev]);
  }, []);

  const handleDeleteReport = useCallback((reportId) => {
    setReports((prev) => prev.filter((r) => r.id !== reportId && r.reportId !== reportId));
  }, []);

  const handleExportAll = useCallback(() => {
    // Generate combined bundle
    const combinedContent = reports
      .map((r) => generateReportFileContent(r))
      .join('\n\n' + '='.repeat(80) + '\n\n');

    const blob = new Blob([combinedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `privylens-all-audit-reports-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [reports]);

  const handleResetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedFormat('all');
    setSelectedType('all');
    setSelectedService('all');
  }, []);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-text-tertiary">
        <Link to="/dashboard" className="hover:text-primary transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-text-primary font-bold">Reports</span>
      </nav>

      {/* 1. Header */}
      <ReportsHeader
        totalReports={reports.length}
        onOpenGenerateModal={handleOpenCustomGenerate}
        onExportAll={handleExportAll}
      />

      {/* 2. Stats Bar */}
      <ReportsStatsBar stats={reportStats} />

      {/* 3. 1-Click Templates */}
      <ReportTemplateGrid onSelectTemplate={handleOpenGenerateWithTemplate} />

      {/* 4. Filter Bar */}
      <ReportsFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFormat={selectedFormat}
        onFormatChange={setSelectedFormat}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        availableServices={availableServices}
        filteredCount={filteredReports.length}
        totalCount={reports.length}
      />

      {/* 5. Reports Table / Empty State */}
      {filteredReports.length > 0 ? (
        <ReportsTable
          reports={filteredReports}
          onPreviewReport={setPreviewReport}
          onDeleteReport={handleDeleteReport}
        />
      ) : (
        /* Empty State */
        <div className="bg-card border border-border rounded-2xl p-12 text-center shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-background-subtle border border-border flex items-center justify-center mx-auto mb-3 text-text-tertiary">
            <FileX className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-text-primary mb-1">
            {reports.length === 0
              ? 'No audit reports generated yet'
              : 'No reports match your filters'}
          </h3>
          <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
            {reports.length === 0
              ? 'Use one of the instant 1-click templates above or generate a custom audit report to get started.'
              : 'Try clearing your search query, switching format tabs, or resetting filters.'}
          </p>
          {reports.length > 0 ? (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-background hover:bg-background-hover border border-border text-text-primary transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-primary" />
              Reset All Filters
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenCustomGenerate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-dark transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate First Report
            </button>
          )}
        </div>
      )}

      {/* 6. Modals */}
      <ReportPreviewModal
        report={previewReport}
        isOpen={Boolean(previewReport)}
        onClose={() => setPreviewReport(null)}
      />

      <GenerateReportModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onCreateReport={handleCreateReport}
        initialTemplate={activeTemplate}
      />
    </div>
  );
};

export default Reports;
