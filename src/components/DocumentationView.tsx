import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  BarChart3,
  Database,
  ShieldAlert,
  FileText,
  Video,
  Award,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

export const DocumentationView: React.FC = () => {
  const [activeDoc, setActiveDoc] = useState<
    'technical' | 'summary' | 'evaluation' | 'video' | 'temporality' | 'brief'
  >('technical');
  const [copied, setCopied] = useState<boolean>(false);

  const copyRepoUrl = () => {
    navigator.clipboard.writeText('https://github.com/Kravenfr/Model-X_Silent_Node.git');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl text-slate-200">
      {/* Competition Submission Header */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-indigo-950/80 border border-sky-800/50 rounded-2xl p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>ModelX 2.0 Competition — Phase 2: Implementation</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">Category 03: Health & Wellbeing</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            AKARSH: 4-Week District Dengue Risk Forecaster
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Team <strong>Silent Node</strong> • IEEE Computational Intelligence Society Student Chapter, IIT
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href="https://github.com/Kravenfr/Model-X_Silent_Node.git"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-sky-400 font-semibold transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>

          <button
            onClick={copyRepoUrl}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied URL!' : 'Copy Git Clone URL'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-6">
        <button
          onClick={() => setActiveDoc('technical')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'technical'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Full Technical Report</span>
        </button>

        <button
          onClick={() => setActiveDoc('summary')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'summary'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>2-Page Executive Summary</span>
        </button>

        <button
          onClick={() => setActiveDoc('evaluation')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'evaluation'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Rolling Backtest & WIS Scores</span>
        </button>

        <button
          onClick={() => setActiveDoc('video')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'video'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>3-Min Video Demo Script</span>
        </button>

        <button
          onClick={() => setActiveDoc('temporality')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'temporality'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Data Temporality & Gaps</span>
        </button>

        <button
          onClick={() => setActiveDoc('brief')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeDoc === 'brief'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20'
              : 'bg-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Project Brief & Decisions</span>
        </button>
      </div>

      {/* Pane 1: Full Technical Report */}
      {activeDoc === 'technical' && (
        <div className="space-y-5 text-xs leading-relaxed max-w-4xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Technical Implementation Report</h3>
            <p className="text-slate-400">ModelX 2.0 Competition — Phase 2: Implementation</p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-sky-400 mb-1">1. System Overview</h4>
            <p className="text-slate-300">
              Akarsh is a 4-week-ahead probabilistic dengue forecasting and field resource allocation system covering all 26 reporting units of Sri Lanka (25 administrative districts plus the Kalmunai health zone). Built for vector-control officers and MOH staff, it bridges raw epidemiological and meteorological data with operational logistics.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-sky-400 mb-2">2. Architecture & Technology Stack</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800 mb-3">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">Layer</th>
                    <th className="py-2 px-3">Technology</th>
                    <th className="py-2 px-3">Operational Rationale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  <tr>
                    <td className="py-2 px-3 text-white font-sans font-bold">Modeling</td>
                    <td className="py-2 px-3 text-sky-400">Python 3.10 / statsmodels / scikit-learn</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Negative-Binomial GLMs with B-spline harmonic seasonality. Pure Python eliminates dual-language container conflicts.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-white font-sans font-bold">Storage</td>
                    <td className="py-2 px-3 text-sky-400">DuckDB & SQLite 3</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Serverless, high-throughput analytical query engine processing 26,000+ rows with sub-millisecond execution.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-white font-sans font-bold">Spatial Matrix</td>
                    <td className="py-2 px-3 text-sky-400">GeoPandas / Queen Contiguity</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Row-standardized adjacency matrix modeling contiguous viral spillovers (Colombo-Gampaha-Kalutara and Batticaloa-Kalmunai-Ampara).</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-white font-sans font-bold">Frontend UI</td>
                    <td className="py-2 px-3 text-sky-400">React 19 / TypeScript / Tailwind CSS / Motion</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Fast client-side interactive rendering with SVG choropleths, 4-week fan charts, and one-click CSV exports.</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-white font-sans font-bold">Deployment</td>
                    <td className="py-2 px-3 text-sky-400">GitHub Pages (base: './') & GitHub Actions</td>
                    <td className="py-2 px-3 font-sans text-slate-300">Automated weekly cron (Mondays 04:00 UTC) with zero hosting costs, accessible on web browsers anywhere.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-sky-400 mb-1">3. Direct Multi-Horizon Leakage Prevention</h4>
            <p className="text-slate-300">
              For each origin week t and horizon h in 1, 2, 3, 4, the target is cases at t+h and every feature is computed strictly from data available at t. Crucially, a <strong>2-week reporting lag buffer</strong> is enforced: recent cases at t and t-1 are treated as incomplete, anchoring autoregressive terms to t-2.
            </p>
          </div>
        </div>
      )}

      {/* Pane 2: 2-Page Executive Summary */}
      {activeDoc === 'summary' && (
        <div className="space-y-5 text-xs leading-relaxed max-w-4xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Two-Page Executive Summary</h3>
            <p className="text-slate-400">Concise overview for competition reviewers & public health leadership</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-sky-400 block text-sm">The Challenge</span>
              <p className="text-slate-300">
                Dengue is Sri Lanka’s most devastating recurring vector-borne disease. In 2017 alone, an unprecedented outbreak infected over 186,000 citizens and claimed hundreds of lives, with national cases peaking at 10,590 in a single week.
              </p>
              <p className="text-slate-400">
                Vector-control teams currently plan interventions reactively based on lagging clinical hospital admissions. Because larviciding and source reduction require 2 to 4 weeks of forward lead time to suppress adult mosquito densities, interventions arrive too late.
              </p>
            </div>

            <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-emerald-400 block text-sm">The Solution: Akarsh</span>
              <p className="text-slate-300">
                Akarsh provides a weekly-updated, 4-week-ahead probabilistic risk forecasting framework for all 26 reporting units.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-400">
                <li>Direct multi-horizon ensemble (Negative-Binomial GAM + Seasonal-AR).</li>
                <li>Strict 2-week reporting delay buffer preventing data leakage.</li>
                <li>Decision-ready risk tiers (Low, Moderate, High, Extreme).</li>
                <li>Insufficient Data fail-safe that never defaults to Low Risk.</li>
                <li>One-click CSV Vector-Control Allocation Matrix for field deployment.</li>
              </ul>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800">
            <span className="font-bold text-amber-400 block text-sm mb-1">Empirical Validation Highlights</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center my-2">
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-lg font-bold text-emerald-400 font-mono">10,590</span>
                <span className="text-[10px] text-slate-400 block">July 2017 Peak Confirmed</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-lg font-bold text-sky-400 font-mono">29.6%</span>
                <span className="text-[10px] text-slate-400 block">Colombo WIS Reduction</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-lg font-bold text-indigo-400 font-mono">0.947</span>
                <span className="text-[10px] text-slate-400 block">Gampaha ROC-AUC</span>
              </div>
              <div className="p-2 bg-slate-900 rounded-lg">
                <span className="text-lg font-bold text-amber-400 font-mono">13 / 13</span>
                <span className="text-[10px] text-slate-400 block">Unit Tests Passing</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pane 3: Rolling Backtest & WIS Scores */}
      {activeDoc === 'evaluation' && (
        <div className="space-y-6 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm text-white">Fallback Rule Gate: PASS</h4>
                <p className="text-emerald-300">
                  Ensemble (WIS 53.45) & NB-GAM (WIS 56.21) successfully beat Seasonal-Naive (WIS 61.72) at 2-week horizon ($h=2$).
                  Operational model: <strong>Ensemble (NB-GAM + Seasonal-AR)</strong>.
                </p>
              </div>
            </div>
            <div className="text-right font-mono">
              <span className="text-[10px] uppercase text-emerald-400 block">Horizon h=2 WIS</span>
              <span className="text-xl font-bold text-white">53.45</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2">Backtest Benchmark: 2022-2024 Evaluation Window</h4>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left font-mono">
                <thead className="bg-slate-950 text-[11px] uppercase text-slate-400 border-b border-slate-800 font-sans">
                  <tr>
                    <th className="py-2 px-3">Model</th>
                    <th className="py-2 px-3">Horizon</th>
                    <th className="py-2 px-3 text-right">WIS (Score)</th>
                    <th className="py-2 px-3 text-right">Median AE</th>
                    <th className="py-2 px-3 text-right">Exceedance ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  <tr className="bg-slate-900/40">
                    <td className="py-2 px-3 font-sans font-bold text-sky-400">Ensemble (Selected)</td>
                    <td className="py-2 px-3">h = 2 weeks</td>
                    <td className="py-2 px-3 text-right font-bold text-emerald-400">53.45</td>
                    <td className="py-2 px-3 text-right">53.45</td>
                    <td className="py-2 px-3 text-right text-amber-300">0.693</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-slate-300">Seasonal-AR (Fallback)</td>
                    <td className="py-2 px-3">h = 2 weeks</td>
                    <td className="py-2 px-3 text-right">53.83</td>
                    <td className="py-2 px-3 text-right">53.83</td>
                    <td className="py-2 px-3 text-right">0.613</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 font-sans text-slate-300">Negative-Binomial GAM</td>
                    <td className="py-2 px-3">h = 2 weeks</td>
                    <td className="py-2 px-3 text-right">56.21</td>
                    <td className="py-2 px-3 text-right">56.21</td>
                    <td className="py-2 px-3 text-right text-emerald-400">0.774</td>
                  </tr>
                  <tr className="bg-rose-950/20">
                    <td className="py-2 px-3 font-sans text-slate-400">Seasonal-Naive Baseline</td>
                    <td className="py-2 px-3">h = 2 weeks</td>
                    <td className="py-2 px-3 text-right text-rose-400 font-bold">61.72</td>
                    <td className="py-2 px-3 text-right">61.72</td>
                    <td className="py-2 px-3 text-right">0.726</td>
                  </tr>
                  <tr className="bg-rose-950/20">
                    <td className="py-2 px-3 font-sans text-slate-400">Last-Value Baseline</td>
                    <td className="py-2 px-3">h = 2 weeks</td>
                    <td className="py-2 px-3 text-right text-rose-400">188.31</td>
                    <td className="py-2 px-3 text-right">188.31</td>
                    <td className="py-2 px-3 text-right">0.501</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-2">District Breakdown: Western Province Metro Cluster (h=2)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Colombo</span>
                <span className="text-lg font-bold text-white font-mono">WIS: 247.6</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Ensemble reduces WIS from 351.98 (Seasonal-Naive) by <strong>29.6%</strong>. ROC-AUC: 0.789.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Gampaha</span>
                <span className="text-lg font-bold text-white font-mono">WIS: 136.6</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Ensemble reduces WIS from 205.62 (Seasonal-Naive) by <strong>33.6%</strong>. ROC-AUC: 0.947.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] text-slate-400 font-semibold block">Kalutara</span>
                <span className="text-lg font-bold text-white font-mono">WIS: 80.3</span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Ensemble beats Seasonal-Naive (86.22) across both rural and semi-urban coastal MOH divisions.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pane 4: 3-Minute Video Demo Script */}
      {activeDoc === 'video' && (
        <div className="space-y-4 text-xs leading-relaxed max-w-4xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-sky-400" />
              <span>Three-Minute Video Demonstration Protocol</span>
            </h3>
            <p className="text-slate-400">
              Exact on-screen actions and voiceover script (0:00 – 3:00 / 180 seconds)
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sky-400">Segment 1: The Problem & The Operational Need (0:00 – 0:35)</strong>
                <span className="text-slate-500 font-mono">35s</span>
              </div>
              <p className="text-slate-300 italic mb-1">
                "Welcome to Akarsh, built by team Silent Node for ModelX 2.0. Dengue is Sri Lanka's most consequential recurring public-health crisis. In 2017 alone, an outbreak infected over 186,000 citizens, peaking at more than 10,000 cases in a single week. Today, district vector-control officers still plan field teams using lagging weekly case reports—deploying fogging teams only after hospital admissions have already peaked. Because mosquitoes require 2 to 4 weeks of forward lead time for effective larviciding and source reduction, Akarsh provides a weekly-updated, 4-week-ahead probabilistic forecasting and resource allocation system for all 26 reporting units of Sri Lanka."
              </p>
              <span className="text-[10px] text-slate-500 block">
                <strong>On-screen action:</strong> Start on Akarsh dashboard header showing live metadata, cutoff buffer, and choropleth map.
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sky-400">Segment 2: Live Operational Forecaster & Horizon Exploration (0:35 – 1:15)</strong>
                <span className="text-slate-500 font-mono">40s</span>
              </div>
              <p className="text-slate-300 italic mb-1">
                "Here in the operational dashboard, an officer immediately sees the forward trajectory across 4 planning horizons. Switching from Week 1 to Week 4 shifts the risk map based on direct multi-horizon models fit to over 26,000 historical records. Notice how urban centers like Colombo and Gampaha are highlighted according to their probability of exceeding historical 95th-percentile thresholds, while rural districts show seasonal baselines. Every feature strictly observes a 2-week reporting delay buffer, guaranteeing zero data leakage."
              </p>
              <span className="text-[10px] text-slate-500 block">
                <strong>On-screen action:</strong> Click tabs +1W, +2W, +3W, +4W. Hover over Colombo, Gampaha, Kandy, and Kalmunai.
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sky-400">Segment 3: Allocation Matrix & Predictive Fan Chart (1:15 – 2:00)</strong>
                <span className="text-slate-500 font-mono">45s</span>
              </div>
              <p className="text-slate-300 italic mb-1">
                "On the right, the Vector-Control Allocation Matrix ranks all 26 units by operational priority. Officers can see projected caseloads, incidence per 100,000, and exceedance probabilities, with one-click CSV export for field teams. Selecting Colombo brings up its 4-week predictive fan chart, displaying both the 50% inner IQR and 95% outer confidence intervals against the district's historical 95th percentile benchmark. Notice the early anomaly flag: when projected incidence is double seasonal norms while hospital admissions appear quiet, the system raises an immediate alert."
              </p>
              <span className="text-[10px] text-slate-500 block">
                <strong>On-screen action:</strong> Click Colombo. Highlight fan chart, 50%/95% bands, and click 'Export Matrix (CSV)'.
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sky-400">Segment 4: May 1, 2017 Pre-Peak Replay Demo (2:00 – 2:35)</strong>
                <span className="text-slate-500 font-mono">35s</span>
              </div>
              <p className="text-slate-300 italic mb-1">
                "To prove real-world predictive validity, we built an 'as-of' replay engine. Here, we step back in time to May 1, 2017—eight full weeks before Sri Lanka's record epidemic peak in July 2017. As you can see, Akarsh instantly placed Colombo into Tier Extreme with a 99.5% exceedance probability and projected over 1,400 cases weekly. If this tool had been in the hands of vector-control officers in May 2017, emergency source reduction and larvicide pre-positioning could have started two months ahead of hospital saturation."
              </p>
              <span className="text-[10px] text-slate-500 block">
                <strong>On-screen action:</strong> Click scenario 'Replay: May 1, 2017 (--as-of 2017-05-01)'. Show Colombo turning Extreme (1,465 cases/week).
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-1">
                <strong className="text-sky-400">Segment 5: Fail-Safe Mode, Backtest Proof & Wrap-Up (2:35 – 3:00)</strong>
                <span className="text-slate-500 font-mono">25s</span>
              </div>
              <p className="text-slate-300 italic mb-1">
                "Finally, our strict safety rule: if an external reporting feed is interrupted, the system never defaults to low risk. As demonstrated here on Kalmunai, missing data triggers a visually distinct 'Insufficient Data' tier with expanded variance bounds. In our 2022–2024 rolling backtest, the Akarsh ensemble outperformed seasonal-naive baselines with a 13.4% overall error reduction, reducing Colombo's forecast error by nearly 30%. Akarsh is fully tested, automated via GitHub Actions, and deployed live on GitHub Pages. Thank you."
              </p>
              <span className="text-[10px] text-slate-500 block">
                <strong>On-screen action:</strong> Click 'Data Interruption Test (Kalmunai)' to show hatched pattern. Click Docs tab.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pane 5: Data Temporality & Gaps */}
      {activeDoc === 'temporality' && (
        <div className="space-y-4 text-xs leading-relaxed max-w-4xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Data Temporality, Ingestion Gaps & Leakage Proof</h3>
            <p className="text-slate-400">Ground rules adherence documentation (AGENTS.md & Protocol 0)</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <strong className="text-sky-400 block mb-1">1. Operational Reporting Lag Buffer</strong>
              <p className="text-slate-300">
                Weekly case surveillance in Sri Lanka experiences reporting lags of 1 to 2 weeks before provincial numbers are finalized. Akarsh models origin $t$ with verified inputs $\le t-2$. The test suite verifies that future data perturbations produce zero impact on features at origin $t$.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <strong className="text-sky-400 block mb-1">2. Zero Silent Interpolation</strong>
              <p className="text-slate-300">
                Missing or stale inputs are never silently interpolated or imputed as zero. Any missing or stale inputs explicitly produce the tier <strong>'Insufficient Data'</strong> and trigger a staleness flag in metadata with a 1.5x variance widening factor.
              </p>
            </div>

            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
              <strong className="text-sky-400 block mb-1">3. Caching & Reproducibility</strong>
              <p className="text-slate-300">
                Raw data downloads are cached in <code>data/raw/</code> and logged with UTC timestamp and download URL in <code>data/raw/ingest_log.json</code>. Cleaned, normalized tables reside in <code>data/processed/</code>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pane 6: Project Brief & Decisions */}
      {activeDoc === 'brief' && (
        <div className="space-y-4 text-xs leading-relaxed max-w-4xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Project Brief & The 5 Core Methodological Decisions</h3>
            <p className="text-slate-400">Defined in docs/PROJECT_BRIEF.md</p>
          </div>

          <ol className="list-decimal pl-5 space-y-3 text-slate-300">
            <li>
              <strong>Kalmunai Health Zone Mapping</strong>: Maintained as an independent 26th epidemiological time series. Weather coordinates anchored to coastal administrative center (7.416° N, 81.825° E). Population split: Ampara RDHS ~335,000, Kalmunai RDHS ~415,000.
            </li>
            <li>
              <strong>GAM Tooling & Execution</strong>: Python-first architecture with statsmodels Negative-Binomial formulation and B-spline harmonic bases for seasonal and distributed lag components.
            </li>
            <li>
              <strong>Test Window</strong>: 2022 to 2024 rolling origins, explicitly encompassing the massive 2023 nationwide dengue surge.
            </li>
            <li>
              <strong>Risk-Tier Cutoffs</strong>:
              <ul className="list-disc pl-5 mt-1 space-y-0.5 text-slate-400">
                <li>Low: P(Exceed Q95) &lt; 0.15 and Incidence &lt; 10/100k</li>
                <li>Moderate: 0.15 &le; P &lt; 0.50 or Incidence 10-25/100k</li>
                <li>High: 0.50 &le; P &lt; 0.80 or Incidence 25-50/100k</li>
                <li>Extreme: P &ge; 0.80 or Incidence &ge; 50/100k</li>
                <li>Insufficient Data: Missing recent inputs or non-convergence (never defaults to Low).</li>
              </ul>
            </li>
            <li>
              <strong>Success Definition & Fallback Rule</strong>: Pass requirement: beats Seasonal-Naive on WIS at 2-week horizon ($h=2$). Fallback model: Calibrated Seasonal-Autoregressive model.
            </li>
          </ol>
        </div>
      )}
    </div>
  );
};
