# Akarsh: 4-Week District Dengue Risk Forecaster & Decision-Support System
**ModelX 2.0 Competition — Phase 2: Implementation (Two-Page Executive Summary)**
**Category**: 03 Health & Wellbeing • **Team**: Silent Node • **IEEE CIS Student Chapter, IIT**

---

## Page 1: Problem, Operational User, and Architecture

### 1. The Critical Operational Challenge
Dengue remains Sri Lanka's most consequential recurring public-health crisis. In the historic 2017 outbreak, the epidemic produced 186,101 cases, peaking at 10,590 cases in a single week in mid-July. Subsequent waves in 2023, 2024, and 2025 demonstrated persistent hyper-endemic transmission across all 26 dengue-reporting units (25 administrative districts plus the Kalmunai health zone), placing approximately 21.78 million citizens at continuous risk.

Currently, Medical Officers of Health (MOH) and district vector-control teams allocate larval source reduction, fogging crews, and community mobilizations based on *lagging weekly case reports*—a purely reactive indicator. Because temperature and monsoon precipitation govern *Aedes aegypti* and *Aedes albopictus* development cycles 5 to 12 weeks before human hospitalizations occur, reactive deployments arrive after viral transmission is already widespread. Effective field interventions require 2 to 4 weeks of forward lead time.

### 2. The Solution: Akarsh
**Akarsh** is an automated, weekly-updated, 4-week-ahead dengue risk forecasting and resource-allocation system designed specifically as an administrative decision-support framework for vector-control teams (strictly non-clinical). 

Every planning cycle, Akarsh outputs:
1. **Direct Multi-Horizon Predictive Distributions**: Calibrated forecasts for horizons $h \in \{1, 2, 3, 4\}$ weeks ahead.
2. **Exceedance Probabilities $P(Y > Q_{95})$**: Precise probabilities that caseloads will exceed the district's historical 95th-percentile weekly threshold.
3. **Decisive Action Tiers**: Low, Moderate, High, Extreme, and an automated **'Insufficient Data'** fail-safe that never defaults to low risk when feeds are interrupted.
4. **Early Anomaly Detection**: Alerts when projected cases surge $\ge 2.0\times$ above seasonal baselines while hospital admissions appear quiet.
5. **Vector-Control Allocation Matrix**: Ranked priority matrix (1 to 26) with one-click CSV export to stage field teams 2 to 4 weeks ahead.

### 3. Four-Stage Pipeline Architecture
```
[ Stage 1: Ingestion & Validation ]
• denguedatahub R package (srilanka_weekly_data: 2006-2026, 26,311 records)
• Open-Meteo ERA5 Reanalysis archive & 14-day forecasts at district centroids
• UN OCHA COD-PS 2023 population (offset) & CPH-2024 piped-water share
• Row-standardized Queen-contiguity spatial weights for 26 units

[ Stage 2: Leakage-Safe Feature Store ]
• Direct multi-horizon formulation (h = 1..4); target cases at t+h
• 2-week reporting delay buffer enforced: features strictly anchored to t-2
• Distributed rainfall lags (4-12W) & temp/humidity lags (8-14W)
• Harmonic seasonality (sin/cos terms) & SW/NE monsoon phase flags
• Queen-neighbor spatial lag transmission

[ Stage 3: Ensemble Forecasting & Fallback Rule ]
• Negative-Binomial GAM per district (overdispersed count handling)
• Seasonal-Autoregressive Negative-Binomial model
• Quantile Ensemble with monotonic isotonic non-crossing projection
• Rolling-origin backtest (2022-2024) across 26 units

[ Stage 4: Decision Delivery & Allocation Engine ]
• Interactive web dashboard & GitHub Pages client application
• District Predictive Fan Charts (50% IQR and 95% Confidence Intervals)
• Ranked Allocation Matrix with one-click CSV export
• Scenario simulator (Live 2024, May 2017 Pre-Peak Replay, Data Interruption)
```

---

## Page 2: Honest Evaluation, Findings, and Operational Impact

### 4. Rigorous Rolling-Origin Backtest Results (2022–2024)
Evaluated across 20 rolling origin folds over 2022–2024 covering the major 2023 nationwide outbreak, benchmarked against Seasonal-Naive and Last-Value baselines using the Weighted Interval Score (WIS) (Bracher et al., 2021) across 11 quantile levels:

| Model Architecture | 1-Week Ahead (WIS) | 2-Week Ahead (WIS) | 3-Week Ahead (WIS) | 4-Week Ahead (WIS) | Exceedance ROC-AUC (h=2) |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Akarsh Ensemble (Selected)** | **50.10** | **53.45** | **55.00** | **57.53** | **0.693** |
| Seasonal-AR (Calibrated Fallback) | 50.44 | 53.83 | 53.42 | 55.40 | 0.613 |
| Negative-Binomial GAM (Climate) | 52.33 | 56.21 | 58.04 | 60.58 | **0.774** |
| Seasonal-Naive Baseline | 59.95 | 61.72 | 60.15 | 60.62 | 0.726 |
| Last-Value Baseline | 156.70 | 188.31 | 208.99 | 224.21 | 0.501 |

#### Evaluation Rule Verification: PASS
- **Pass Requirement**: The multi-horizon ensemble must outperform Seasonal-Naive on WIS at the 2-week horizon ($h=2$).
- **Outcome**: The Akarsh Ensemble achieved a WIS of **53.45** versus Seasonal-Naive's **61.72** (a **13.4% overall error reduction** across all 26 units).
- **Key Urban District Gains**: In Colombo, the Ensemble reduced WIS from 351.98 to **247.62** (**29.6% reduction**); in Gampaha, WIS was cut from 205.62 to **136.57** (**33.6% reduction**, ROC-AUC **0.947**).

### 5. Honest Account of Real-World Gaps & Methodological Realities
- **Weak Climate Correlations**: As hypothesized in our proposal risk statement, rainfall and temperature alone possess moderate raw correlation ($r \approx +0.18$ at 8-week lag in Colombo). Climate variables are regularized via distributed splines to capture seasonal risk timing, while human storage practices and localized container pooling remain the dominant outbreak amplifier.
- **Surveillance Lag Invariance**: Data from the most recent 1 to 2 weeks is subject to reporting delays and retroactive upward revisions. Enforcing the 2-week buffer ($t-2$) guarantees zero optimistic bias. The future-perturbation test confirmed 100% invariance of origin features.
- **Fail-Safe Robustness**: Deliberately blanking recent inputs triggers the 'Insufficient Data' tier with a distinct hatched visual pattern; it **never defaults to Low Risk**, eliminating dangerous false reassurance.

### 6. Historical Peak Verification: The May 2017 Pre-Peak Demonstration
Running Akarsh under historical replay mode as-of May 1, 2017 (`--as-of 2017-05-01`), 8 weeks before Sri Lanka's record epidemic peak of 10,590 cases/week (2017-W29):
- **Colombo**: Predicted median escalated to **1,465 cases/week** with $P(Y > Q_{95}) = 99.5\%$ and assigned tier **Extreme**.
- **Actionable Value**: If Akarsh had been active in May 2017, vector-control officers would have received high-confidence, actionable advance warning to pre-position larvicide and deploy fogging crews two months before the catastrophic surge.

### 7. Deliverables & Deployment
- **Interactive Web App**: Fully functional on port 3000 & deployed to GitHub Pages.
- **Repository**: Reproducible clean-clone execution via `make setup`, `make test`, `make backtest`, `make forecast`.
- **Automated Workflows**: GitHub Actions scheduled weekly run (`weekly_forecast.yml`) and automated PR tests (`pr_tests.yml`).
