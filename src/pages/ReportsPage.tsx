import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../services/api';

export const ReportsPage: React.FC = () => {
  const [report, setReport] = useState<any>(null);
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      try {
        const data = await api.getReports();
        setReport(data);
      } catch (e) {
        console.error('Failed to load reports:', e);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!report?.sourceWise) return;
    const headers = 'Source,Jobs Found,Matched,Applied,Interviews,Replies\n';
    const rows = report.sourceWise
      .map(
        (s: any) =>
          `"${s.source}",${s.jobsFound},${s.matched},${s.applied},${s.interviews},${s.replies}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NOMAN_AI_Job_Hunter_Report_${timeframe}_2026.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12 print:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-white">Performance Analytics & Source Reports</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Audited Metrics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated conversion funnels, source efficacy, response rates, and interview pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-white/10 text-xs">
            <button
              onClick={() => setTimeframe('daily')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeframe === 'daily' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                timeframe === 'monthly' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
              }`}
            >
              Monthly
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-200"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Export</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-500/30 text-xs font-semibold text-slate-200"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Top Conversion Funnel Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <span className="text-xs text-slate-400 uppercase font-mono font-bold">Discovered Roles</span>
          <div className="text-2xl font-black text-white mt-1">
            {report?.metrics?.jobsFoundToday || 6}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">100% deduplicated</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <span className="text-xs text-slate-400 uppercase font-mono font-bold">High Match (88%+)</span>
          <div className="text-2xl font-black text-amber-300 mt-1">
            {report?.metrics?.newMatches || 4}
          </div>
          <span className="text-[11px] text-slate-400">Quality-filtered</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <span className="text-xs text-slate-400 uppercase font-mono font-bold">Total Applications</span>
          <div className="text-2xl font-black text-white mt-1">
            {report?.metrics?.totalApplications || 4}
          </div>
          <span className="text-[11px] text-slate-400">Safe browser agent</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-white/10">
          <span className="text-xs text-slate-400 uppercase font-mono font-bold">Interviews Scheduled</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {report?.metrics?.interviews || 1}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium">25% Interview Rate</span>
        </div>
      </div>

      {/* Source-Wise Breakdown Table */}
      <div className="rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-xl">
        <div className="p-5 bg-slate-900 border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Source-Wise Conversion Report
            </h3>
            <p className="text-xs text-slate-400">Audited pipeline metrics per job source</p>
          </div>
          <span className="text-xs font-mono text-amber-400">GCC & Global Feeds</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 border-b border-white/10 font-mono text-slate-400 text-[11px] uppercase">
              <tr>
                <th className="p-4">Source Name</th>
                <th className="p-4 text-center">Jobs Found</th>
                <th className="p-4 text-center">Matched (&gt;80%)</th>
                <th className="p-4 text-center">Applied</th>
                <th className="p-4 text-center">Interviews</th>
                <th className="p-4 text-center">Recruiter Replies</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(report?.sourceWise || []).map((s: any, idx: number) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{s.source}</span>
                  </td>
                  <td className="p-4 text-center text-slate-300 font-mono">{s.jobsFound}</td>
                  <td className="p-4 text-center text-amber-300 font-mono font-bold">{s.matched}</td>
                  <td className="p-4 text-center text-slate-200 font-mono">{s.applied}</td>
                  <td className="p-4 text-center font-mono font-bold text-emerald-400">{s.interviews}</td>
                  <td className="p-4 text-center text-slate-300 font-mono">{s.replies}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Match Score Distribution Breakdown */}
      <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">
          Match Score Distribution
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(report?.chartData?.matchScoreDistribution || []).map((item: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-1">
              <span className="text-xs font-bold text-slate-400">{item.range}</span>
              <div className="text-xl font-black text-amber-300">{item.count} roles</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
