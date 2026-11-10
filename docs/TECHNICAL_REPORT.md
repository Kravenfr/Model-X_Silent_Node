# Akarsh: Technical Implementation Report
**ModelX 2.0 Competition — Phase 2: Implementation**
**Team Name**: Silent Node • **Category**: 03 Health and Wellbeing
**IEEE Computational Intelligence Society Student Chapter, IIT**

---

## 1. Executive Overview
Akarsh is a 4-week-ahead, weekly-updated dengue risk forecasting and field resource-allocation decision-support framework covering all 26 reporting units of Sri Lanka (25 administrative districts plus the Kalmunai health zone). 

Designed specifically for district vector-control officers and Medical Officers of Health (MOH), the system bridges the gap between raw epidemiological/meteorological surveillance data and operational planning decisions.

---

## 2. Technical Stack Selection and Rationale

| Layer | Technologies Selected | Rationale & Trade-Offs |
| :--- | :--- | :--- |
| **Modeling & Analytics** | Python 3.10 (`statsmodels`, `scikit-learn`, `numpy`, `scipy`) | **Why chosen**: Robust, self-contained Generalized Linear Model (GLM) routines with Negative-Binomial distribution support and spline expansions. **Alternative evaluated**: R `mgcv` was considered in the proposal, but deploying a Python-only pipeline eliminated dual-runtime container complexity and runtime dependency conflicts across CI/CD runners. |
| **Analytical Storage & SQL** | DuckDB & SQLite 3 | **Why chosen**: Zero-configuration, serverless, high-throughput analytical query engine. DuckDB/SQLite executes aggregations over 26,000+ weekly district records in sub-millisecond execution times without external database daemon overhead. |
| **GIS & Spatial Operations** | GeoPandas / OCHA COD-AB Queen Contiguity | **Why chosen**: Enables row-standardized spatial contiguity matrices ($W_{ij} = 1/|N(i)|$) modeling inter-district viral transmission spillovers across contiguous borders (e.g., Colombo-Gampaha-Kalutara metro corridor and Batticaloa-Kalmunai-Ampara coastal axis). |
| **Pipeline Automation** | GitHub Actions (`weekly_forecast.yml`, `pr_tests.yml`) | **Why chosen**: Automated weekly cron execution scheduled every Monday at 04:00 UTC (aligned with Sri Lanka Epidemiology Unit weekly report publication), producing versioned artifacts and data releases with zero server hosting costs. |
| **Web Presentation** | React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion | **Why chosen**: High-performance, client-side interactive rendering. Allows instant horizon switching (+1W to +4W), dynamic vector allocation ranking, interactive SVG choropleth mapping, and one-click CSV export with zero server roundtrip latency. |
| **Hosting & GitHub Pages** | GitHub Pages (`base: './'`) & Cloud Run / Node.js | **Why chosen**: Enables competition judges and field personnel to immediately inspect the live dashboard from any browser without installing software. |

---

## 3. Four-Stage Architecture Breakdown

### Stage 1: Data Ingestion & Spatial Structure
- **Surveillance**: Ingests `srilanka_weekly_data` from `denguedatahub` (26,311 records spanning 2006-W52 to 2026-W20). Validates 26 reporting units, zero negative cases, and verifies the July 2017 national peak at exactly 10,590 cases/week.
- **Meteorology**: Automated query of Open-Meteo ERA5 reanalysis and 14-day forecasts at district centroid coordinates, aggregated to ISO epidemiological weeks. Includes synthetic climatology fallback based on Sri Lanka's southwest and northeast monsoon profiles.
- **Static Covariates**: OCHA COD-PS 2023 population denominators and CPH-2024 Table A5 piped-water access shares (Colombo: 84.4%, National: 41.4%).
- **Spatial Matrix**: 26x26 row-standardized Queen contiguity matrix. Jaffna connected via Elephant Pass; Kalmunai connected to Ampara, Batticaloa, and Monaragala.

### Stage 2: Leakage-Safe Multi-Horizon Feature Store
- **Direct Multi-Horizon Design**: For each forecast origin $t$, separate models are fit for horizons $h \in \{1, 2, 3, 4\}$, targeting cases at $t+h$.
- **2-Week Operational Delay Buffer**: Enforces strict historical data availability. Data from $t$ and $t-1$ are treated as incomplete; autoregressive features are anchored to $t-2$.
- **Features Extracted at Origin $t$**:
  - Autoregressive lags: $\log(1+y_{t-k})$ for $k \in \{2, 3, 4, 5\}$ and 3-week/6-week rolling means.
  - Climate distributed lags: 3-week smoothed rainfall windows at lags 4–6, 7–9, 10–12 weeks.
  - Temperature & humidity smoothed lags: lags 8–11, 12–14 weeks.
  - Seasonality: Harmonic B-splines ($\sin(2\pi w/52), \cos(2\pi w/52), \sin(4\pi w/52), \cos(4\pi w/52)$) and SW/NE monsoon flags.
  - Spatial transmission: Queen neighbor-weighted log case counts at lags 1 to 3.
  - Exposure offset: $\log(\text{population})$ ensuring equitable per-100k incidence rates.
- **Leakage Test**: Unit test `test_future_perturbation_does_not_affect_origin_features` verifies that perturbing future data ($> t$) produces zero change in origin feature vectors (`PASS`).

### Stage 3: Ensemble Forecasting & Fallback Rule
- **Primary Model**: Negative-Binomial GAM per district with spline terms for harmonic seasonality and distributed climate lags, estimating dispersion parameter $\alpha$ ($\text{Var}(Y) = \mu + \alpha \mu^2$).
- **Complementary Model**: Ridge-regularized Seasonal-Autoregressive Negative-Binomial model.
- **Quantile Ensemble**: Convex combination across 15 probability levels followed by monotonic isotonic projection, strictly preventing quantile crossing ($q_a \le q_b$ for all $a < b$).
- **Success Criterion & Fallback Gate**: The ensemble must beat Seasonal-Naive on Weighted Interval Score (WIS) at horizon $h=2$. If not, the system automatically falls back to the calibrated Seasonal-AR model.

### Stage 4: Decision Delivery & Allocation Engine
- **Risk Tiers**: Low ($P < 0.15$ and Inc $< 10$), Moderate ($0.15 \le P < 0.50$ or Inc $10-25$), High ($0.50 \le P < 0.80$ or Inc $25-50$), Extreme ($P \ge 0.80$ or Inc $\ge 50$).
- **Insufficient Data Fail-Safe**: Triggered when recent surveillance bulletins or weather feeds are stale. It is rendered with distinct hatched styling and **never defaults to Low Risk**.
- **Early Anomaly Detection**: Flags districts where predicted cases are $\ge 2.0\times$ seasonal norm while current clinical incidence is $< 15$ per 100k.
- **Allocation Matrix**: Districts ranked 1 to 26 by composite risk priority score to guide field inspections 2 to 4 weeks forward.

---

## 4. Honest Evaluation Against Phase 1 Proposal

### What Matched the Proposal
1. **26 Health Units Fully Modeled**: All 25 districts plus Kalmunai RDHS are integrated with full data continuity.
2. **Empirical Benchmarks Replicated**: Confirmed the 2017-W29 epidemic peak at exactly 10,590 cases/week.
3. **Beating the Baseline on Lead Time**: At horizon $h=2$, the Ensemble achieved a WIS of **53.45** versus Seasonal-Naive's **61.72** (passing the fallback rule).
4. **Massive Reductions in Urban Epicenters**: In Colombo, WIS was reduced from 351.98 to 247.62 (**29.6% reduction**); in Gampaha, WIS was cut from 205.62 to 136.57 (**33.6% reduction**, ROC-AUC **0.947**).

### Honest Account of What Was Adjusted
1. **R vs. Python Tooling**: While the proposal permitted R `mgcv`, our implementation adopted pure Python statsmodels and B-spline formulations. This simplified continuous integration and eliminated multi-language deployment failure points.
2. **Moderate Climate Teleconnections**: As cautioned in our proposal risk statement, empirical correlation between weekly rainfall and cases peaks at $r \approx +0.18$ at an 8-week lag in Colombo. Macro ENSO/DMI indices at 3–6 month lags showed minimal out-of-sample incremental gain over local weather splines and harmonic seasonal terms during the 2022–2024 test window. We reported this loss honestly rather than overfitting noise.
3. **Sub-District Granularity**: Operational surveillance bulletins report at district/RDHS levels. While MOH officers desire neighborhood-level predictions, published data supports 26-unit resolution; sub-district prioritization relies on local MOH field inspections informed by our district risk allocations.

---

## 5. Verification and Reproduction
The codebase includes 13 automated unit tests executed via:
```bash
make test
# Or: python -m unittest discover -s tests -p "test_*.py"
```
Output:
```
Ran 13 tests in 0.586s
OK
```
All numbers, charts, and tables in this report are computed directly by code from the repository data files.
