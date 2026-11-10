# Akarsh: Three-Minute Video Demonstration Protocol
**ModelX 2.0 Competition — Phase 2: Implementation**
**System Walkthrough Script (Target Duration: 3 Minutes / 180 Seconds)**
**Team**: Silent Node • **IEEE CIS Student Chapter, IIT**

This script outlines the exact sequence, on-screen actions, and voiceover script to record the 3-minute video demonstration of Akarsh working on real surveillance data.

---

### Segment 1: The Problem & The Operational Need (0:00 – 0:35)
- **Visual**: Open on the Akarsh Operational Forecaster Header showing the non-clinical disclaimer, live metadata (2024-W20 origin, 2-week cutoff buffer), and the Sri Lanka 26-Unit Choropleth Map.
- **Voiceover**: 
  > "Welcome to Akarsh, built by team Silent Node for ModelX 2.0. Dengue is Sri Lanka's most consequential recurring public-health crisis. In 2017 alone, an outbreak infected over 186,000 citizens, peaking at more than 10,000 cases in a single week. Today, district vector-control officers still plan field teams using lagging weekly case reports—deploying fogging teams only after hospital admissions have already peaked. Because mosquitoes require 2 to 4 weeks of forward lead time for effective larviciding and source reduction, Akarsh provides a weekly-updated, 4-week-ahead probabilistic forecasting and resource allocation system for all 26 reporting units of Sri Lanka."

---

### Segment 2: Live Operational Forecaster & Horizon Exploration (0:35 – 1:15)
- **Visual**: 
  1. Click through the **Horizon Selector tabs** (+1W, +2W, +3W, +4W). Show the map colors updating dynamically.
  2. Hover over Colombo, Gampaha, Kandy, and Kalmunai.
  3. Explain the colorblind-safe risk tiers (Extreme in red, High in orange, Moderate in amber, Low in blue).
- **Voiceover**:
  > "Here in the operational dashboard, an officer immediately sees the forward trajectory across 4 planning horizons. Switching from Week 1 to Week 4 shifts the risk map based on direct multi-horizon models fit to over 26,000 historical records. Notice how urban centers like Colombo and Gampaha are highlighted according to their probability of exceeding historical 95th-percentile thresholds, while rural districts show seasonal baselines. Every feature strictly observes a 2-week reporting delay buffer, guaranteeing zero data leakage."

---

### Segment 3: Vector-Control Allocation Matrix & Predictive Fan Chart (1:15 – 2:00)
- **Visual**:
  1. Pan to the **Vector-Control Allocation Matrix** on the right. Search for "Colombo" or sort by risk priority.
  2. Click on **Colombo** to load the District Deep Dive.
  3. Point out the **4-Week Predictive Fan Chart**: the solid median line, 50% IQR band, 95% confidence interval, and the red dashed historical $Q_{95}$ threshold.
  4. Click the **'Export Matrix (CSV)'** button to demonstrate one-click file generation.
- **Voiceover**:
  > "On the right, the Vector-Control Allocation Matrix ranks all 26 units by operational priority. Officers can see projected caseloads, incidence per 100,000, and exceedance probabilities, with one-click CSV export for field teams. Selecting Colombo brings up its 4-week predictive fan chart, displaying both the 50% inner IQR and 95% outer confidence intervals against the district's historical 95th percentile benchmark. Notice the early anomaly flag: when projected incidence is double seasonal norms while hospital admissions appear quiet, the system raises an immediate alert."

---

### Segment 4: Historical Replay: May 1, 2017 Pre-Peak Demonstration (2:00 – 2:35)
- **Visual**:
  1. In the **Simulation / Origin Scenario** bar at the top, click **'Replay: May 1, 2017 (--as-of 2017-05-01)'**.
  2. Show Colombo and the Western Province escalating to **Extreme** tier (1,465 cases/week).
- **Voiceover**:
  > "To prove real-world predictive validity, we built an 'as-of' replay engine. Here, we step back in time to May 1, 2017—eight full weeks before Sri Lanka's record epidemic peak in July 2017. As you can see, Akarsh instantly placed Colombo into Tier Extreme with a 99.5% exceedance probability and projected over 1,400 cases weekly. If this tool had been in the hands of vector-control officers in May 2017, emergency source reduction and larvicide pre-positioning could have started two months ahead of hospital saturation."

---

### Segment 5: Fail-Safe Mode, Backtest Proof & Wrap-Up (2:35 – 3:00)
- **Visual**:
  1. Click **'Data Interruption Test (Kalmunai)'**. Show Kalmunai displayed in **hatched slate 'Insufficient Data'**.
  2. Click **'Docs & Verification'** tab to show the backtest comparison table where Ensemble (WIS 53.45) beats Seasonal-Naive (WIS 61.72).
  3. End on the Akarsh header and GitHub Pages deployment badge.
- **Voiceover**:
  > "Finally, our strict safety rule: if an external reporting feed is interrupted, the system never defaults to low risk. As demonstrated here on Kalmunai, missing data triggers a visually distinct 'Insufficient Data' tier with expanded variance bounds. In our 2022–2024 rolling backtest, the Akarsh ensemble outperformed seasonal-naive baselines with a 13.4% overall error reduction, reducing Colombo's forecast error by nearly 30%. Akarsh is fully tested, automated via GitHub Actions, and deployed live on GitHub Pages. Thank you."
