# Akarsh: 4-Week District Dengue Risk Forecaster

[![ModelX 2.0](https://img.shields.io/badge/ModelX%202.0-Phase%202%20Implementation-emerald)](https://github.com/Kravenfr/Model-X_Silent_Node)
[![Team](https://img.shields.io/badge/Team-Silent%20Node-blue)](https://github.com/Kravenfr/Model-X_Silent_Node)
[![Category](https://img.shields.io/badge/Category-03%20Health%20and%20Wellbeing-rose)](https://github.com/Kravenfr/Model-X_Silent_Node)
[![IEEE CIS IIT](https://img.shields.io/badge/Organizer-IEEE%20CIS%20Student%20Chapter%20IIT-cyan)](https://github.com/Kravenfr/Model-X_Silent_Node)
[![GitHub Pages Ready](https://img.shields.io/badge/Deployment-GitHub%20Pages%20Ready-success)](https://kravenfr.github.io/Model-X_Silent_Node/)
[![Tests](https://img.shields.io/badge/Tests-13%2F13%20Passing-brightgreen)](https://github.com/Kravenfr/Model-X_Silent_Node)

**Akarsh** is an operational, weekly-updated, 4-week-ahead dengue risk forecasting and field resource-allocation decision-support system covering Sri Lanka's 26 primary reporting units (25 administrative districts plus the Kalmunai health zone).

Built by **Team Silent Node** for the **ModelX 2.0 Competition** (organized by the IEEE Computational Intelligence Society Student Chapter, Informatics Institute of Technology).

> **Planning Decision-Support Notice**: Akarsh is an administrative planning decision-support framework for Medical Officers of Health (MOH) and district vector-control teams to allocate field resources 2 to 4 weeks forward. It is **NOT a clinical diagnostic tool**.

---

## 🌐 Live GitHub Pages Deployment

- **Official Live URL**: [**https://kravenfr.github.io/Model-X_Silent_Node/**](https://kravenfr.github.io/Model-X_Silent_Node/)
- **GitHub Repository**: [https://github.com/Kravenfr/Model-X_Silent_Node](https://github.com/Kravenfr/Model-X_Silent_Node)
- **Deployment Workflow**: [`.github/workflows/deploy_gh_pages.yml`](.github/workflows/deploy_gh_pages.yml)

### How to Enable GitHub Pages on Your Fork / Repository:
1. Push this repository to your GitHub account.
2. In your repository, navigate to **Settings** → **Pages**.
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Push to `main` (or run the workflow manually under the **Actions** tab). Your live dashboard will be deployed in ~60 seconds!

---

## 📑 Competition Submission Deliverables

Per the ModelX 2.0 Phase 2 Implementation requirements, all core documentation is compiled in the repository:

1. 📄 [**Two-Page Executive Summary** (`docs/TWO_PAGE_SUMMARY.md`)](docs/TWO_PAGE_SUMMARY.md)
   - Concise 2-page brief covering the operational user, the multi-horizon architecture, the 2022–2024 rolling backtest results, and the May 2017 pre-peak demonstration.
2. 📘 [**Comprehensive Technical Report** (`docs/TECHNICAL_REPORT.md`)](docs/TECHNICAL_REPORT.md)
   - In-depth account of the stack selection rationale (Python GLM, DuckDB, GeoPandas, React/Vite), 4-stage pipeline architecture, and honest evaluation against the Phase 1 proposal.
3. 📊 [**Data Temporality and Gaps Account** (`docs/DATA_TEMPORALITY_AND_GAPS.md`)](docs/DATA_TEMPORALITY_AND_GAPS.md)
   - Complete inventory of primary datasets (26,311 surveillance records, ERA5 weather archive, CPH-2024 census, OCHA population), the 2-week lag buffer, and observed data gaps.
4. 🎥 [**Three-Minute Video Walkthrough Protocol** (`docs/THREE_MINUTE_DEMO_VIDEO_SCRIPT.md`)](docs/THREE_MINUTE_DEMO_VIDEO_SCRIPT.md)
   - Precise 180-second recording sequence with on-screen actions and exact voiceover timestamps.
5. 📈 [**Rolling Backtest & Fallback Evaluation Report** (`docs/EVALUATION.md`)](docs/EVALUATION.md)
   - Empirical WIS tables across 2022–2024 test windows proving the Akarsh Ensemble (WIS 53.45) beats Seasonal-Naive (WIS 61.72), passing the fallback rule.
6. 🏗️ [**System Architecture & Flow Diagram** (`docs/ARCHITECTURE.md`)](docs/ARCHITECTURE.md)
   - End-to-end diagram of ingestion, feature store, modeling, and presentation layers.
7. ⚠️ [**Methodological Limitations & Constraints** (`docs/LIMITATIONS.md`)](docs/LIMITATIONS.md)
   - Honest evaluation of climate correlation limits, reporting delays, and sub-district resolution boundaries.

---

## 🚀 Key Pipeline Capabilities

- **26 Reporting Units Supported**: Ingests weekly counts from `denguedatahub` and Sri Lanka Epidemiology Unit reports (2006 to 2026), with distinct modeling for Kalmunai RDHS.
- **Zero Data Leakage Protocol**: Strict direct multi-horizon design ($h \in \{1, 2, 3, 4\}$ weeks forward). 2-week reporting delay buffer enforced at every forecast origin. Invariance verified against future dataset perturbations.
- **Ensemble Modeling**: Distributed Lag Negative-Binomial GAM + Calibrated Seasonal-Autoregressive model with monotonic isotonic non-crossing quantile projection.
- **Decision-Ready Risk Tiers**: Districts classified into **Low**, **Moderate**, **High**, **Extreme**, and **Insufficient Data** (missing inputs never default to low risk).
- **Early Anomaly Detection**: Proactively alerts officers when projected caseload is $\ge 2.0\times$ higher than seasonal baselines while hospital admissions appear quiet.
- **Vector-Control Allocation Matrix**: Ranks all 26 units by operational priority, with **One-Click CSV Export** for field inspection teams.
- **Interactive Officer Dashboard**: Interactive SVG choropleth map, 4-week predictive fan charts with 50% IQR and 95% confidence intervals, and scenario simulator.

---

## ⚡ Quick Start & Reproduction

### Prerequisites
- Python 3.10+
- Node.js 20+

### 1. Setup Environment
```bash
make setup
# Or: npm install
```

### 2. Ingest Data & Build Static Covariates
```bash
make ingest
# Runs: python scripts/ingest_cases.py
#       python scripts/ingest_weather.py
#       python scripts/build_static_covariates.py
```

### 3. Run Automated Unit & Leakage Test Suite
```bash
make test
# Runs: python -m unittest discover -s tests -p "test_*.py"
```
*13 of 13 tests passing, validating 26-unit integrity, 2017 peak confirmation (10,590 cases/week), WIS calculation, and future perturbation leakage prevention.*

### 4. Execute Rolling-Origin Backtest (2022–2024)
```bash
make backtest
# Runs: python scripts/run_backtest.py
```

### 5. Execute Operational Forecast Engine
```bash
# Generate current operational forecast (outputs to outputs/latest/)
make forecast

# Reproduce historical origin (e.g. May 1, 2017 before the July 2017 peak)
python scripts/run_forecast.py --as-of 2017-05-01
```

### 6. Launch Officer Web Dashboard
```bash
make app
# Or: npm run dev (opens at http://localhost:3000)
```

### 7. Build Static Bundle (for GitHub Pages / Production)
```bash
npm run build
# Outputs self-contained relative assets to dist/
```

---

## 👥 Team & Competition Attribution
- **Competition**: ModelX 2.0 (Phase 2: Implementation)
- **Organizer**: IEEE Computational Intelligence Society Student Chapter, Informatics Institute of Technology (IIT)
- **Team Name**: Silent Node
- **Category**: 03 Health and Wellbeing
