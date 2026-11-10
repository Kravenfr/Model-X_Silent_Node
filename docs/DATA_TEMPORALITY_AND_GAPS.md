# Akarsh: Account of Data Used, Temporality, and Gaps
**ModelX 2.0 Competition — Phase 2: Implementation**
**Team**: Silent Node • **IEEE CIS Student Chapter, IIT**

This document provides a comprehensive, transparent account of all datasets incorporated into the Akarsh forecasting system, their temporal characteristics, access protocols, and observed data gaps.

---

## 1. Datasets Finally Used

| Dataset | Provider / Source | Time Horizon & Granularity | Ingestion Method | Records Used | Role in System |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sri Lanka Weekly Dengue Surveillance** | `denguedatahub` (Talagala, 2021) / Sri Lanka Epidemiology Unit | 2006-W52 to 2026-W20 (Weekly counts per district) | Direct CSV ingestion from raw GitHub repository | **26,311** validated district-week records | Target variable $y_{t+h}$, autoregressive lags, seasonal baselines, historical 95th-percentile thresholds ($Q_{95}$) |
| **ERA5 Atmospheric Reanalysis** | Open-Meteo / ECMWF Copernicus Climate Change Service | 2014-01-01 to 2024-12-31 (Daily aggregated to ISO epi-weeks) | Automated REST API queries at 26 district centroids with local cache | **20,332** weekly weather rows | Weekly rainfall sum (mm), mean temperature (°C), mean relative humidity (%) |
| **Open-Meteo 14-Day Forward Weather Forecasts** | Open-Meteo Forecast API | Real-time 14-day forward daily projections | REST API queries at district centroids | Daily precipitation and temperature | Forward meteorological trends for near-term forecasting |
| **Subnational Population (2023)** | UN OCHA / WorldPop COD-PS (`lka_admpop_adm2_2023.csv`) | 2023 static population benchmark | Standardized demographic table | 26 reporting units | Exposure offset $\log(\text{pop})$ and incidence per 100,000 calculation |
| **Piped-Water Access Share** | Department of Census and Statistics, Sri Lanka (CPH-2024 Table A5) | 2024 census benchmark | Structured tabular parser | 26 reporting units | Static infrastructural vulnerability covariate |
| **Subnational Boundaries (COD-AB)** | UN OCHA Humanitarian Data Exchange (HDX) | Administrative ADM2 district polygons | GeoJSON / Queen-contiguity adjacency matrix | 26 reporting units | Row-standardized spatial weights matrix ($W$) modeling neighbor transmission |
| **Sample WER Bulletins** | Ministry of Health Sri Lanka (`epid.gov.lk`) | Weekly Epidemiological Reports (WER) | PDF parser (`pdfplumber` / text) with WHO SEARO fallback | Sample weekly bulletins | Live surveillance ingestion and automated bulletin parsing pipeline |

---

## 2. Temporality and Timing Characteristics

### 2.1 The Two-Week Surveillance Lag Buffer
- **Operational Reality**: Clinical dengue cases diagnosed in government and private hospitals must undergo notification, laboratory confirmation, and regional data entry before publication in weekly bulletins.
- **The Gap**: Data from the most recent 1 to 2 weeks is consistently incomplete and subject to retroactive upward revisions.
- **Enforced Protocol**: Akarsh strictly treats the most recent 2 weeks of case counts at any forecast origin week $t$ as provisional/incomplete. Autoregressive features are strictly anchored to verified weeks $\le t-2$.
- **Leakage Prevention**: Our unit test `test_future_perturbation_does_not_affect_origin_features` perturbs all data after origin $t$ and verifies that origin features remain 100% invariant (`PASS`).

### 2.2 Climate Lead Times (5 to 12 Weeks)
- **Biological Mechanism**: Monsoon rainfall creates stagnant pools for mosquito oviposition. Egg hatching, larval maturation, pupation, and viral incubation within the mosquito take 2 to 3 weeks. Subsequent human incubation takes another 4 to 10 days.
- **Observed Peak Correlation**: Cross-correlation analysis of 692 weeks of Colombo surveillance data confirmed:
  - Weekly precipitation correlation peaks at an **8-week lag** ($r \approx +0.18$).
  - Mean temperature correlation peaks at a **10–14 week lag** ($r \approx +0.13$).
- **Smoothing Solution**: To prevent multi-collinearity across individual weekly weather parameters, features are aggregated into 3-week smoothed rolling windows (lags 4–6, 7–9, 10–12 weeks).

### 2.3 Static Covariate Temporality
- Demographics and piped-water infrastructure are updated on multi-year national census cycles (2023 OCHA population estimates and 2024 Census of Population and Housing).
- These variables are treated as static baseline vulnerability vectors rather than dynamic time series.

---

## 3. Account of Gaps and Observed Limitations

### Gap 1: Sub-District / MOH Division Resolution
- **Observed Limitation**: Public health interventions are implemented by Medical Officers of Health (MOH) across approximately 350 MOH divisions, while national weekly surveillance bulletins report at the 26 primary district/RDHS levels.
- **System Accommodation**: Akarsh models and forecasts at the 26-unit level to preserve statistical power and complete historical continuity (692+ weeks). The resulting Vector-Control Allocation Matrix provides macro prioritization across districts to guide deployment of mobile fogging units and larvicide stocks.

### Gap 2: Primary Portal Bandwidth and Ingestion Fallback
- **Observed Limitation**: Sri Lanka Ministry of Health web endpoints (`epid.gov.lk`) occasionally experience bandwidth throttling and temporary downtime.
- **System Accommodation**: Akarsh implements a multi-tier fallback architecture:
  1. Primary PDF parser (`src/silentnode/ingest/pdf_parser.py`)
  2. Secondary automated query to the WHO SEARO Dengue Dashboard
  3. Last valid period fallback with an explicit **Staleness Flag** and 1.5x predictive variance expansion.

### Gap 3: Kalmunai Health Zone Boundary Discrepancy
- **Observed Limitation**: Kalmunai is an administrative health zone (RDHS) established within the geographical district of Ampara, not an official OCHA ADM2 district polygon.
- **System Accommodation**: Kalmunai is maintained as an independent 26th epidemiological time series matching official surveillance reports. Its population was split based on MOH records (~415,000 for Kalmunai RDHS vs. ~335,000 for Ampara RDHS), and weather coordinates were anchored to its coastal administrative center (7.4165° N, 81.8252° E).

### Gap 4: Zero Invented or Silently Interpolated Data
- In accordance with the ground rules (`AGENTS.md`), missing or stale inputs are **never defaulted to low risk or silently interpolated**. Missing inputs automatically trigger the visually distinct **'Insufficient Data'** tier (rendered with diagonal hatching), preventing false reassurance.
