import React, { useState } from 'react';
import { Layers, Network, MapPin, Eye } from 'lucide-react';

export interface DistrictGeoNode {
  id: string;
  name: string;
  province: string;
  x: number;
  y: number;
  w: number;
  h: number;
  shapeType?: 'rect' | 'circle';
}

// Geographically calibrated coordinates for Sri Lanka's 26 reporting units
// (x: 0..460, y: 0..640)
export const SRI_LANKA_DISTRICT_COORDS: Record<string, { x: number; y: number; r: number; province: string }> = {
  // Northern Province
  'Jaffna': { x: 165, y: 55, r: 26, province: 'Northern' },
  'Kilinochchi': { x: 195, y: 110, r: 24, province: 'Northern' },
  'Mannar': { x: 135, y: 165, r: 26, province: 'Northern' },
  'Mullaitivu': { x: 255, y: 135, r: 26, province: 'Northern' },
  'Vavuniya': { x: 200, y: 180, r: 24, province: 'Northern' },

  // North Central Province
  'Anuradhapura': { x: 190, y: 240, r: 38, province: 'North Central' },
  'Polonnaruwa': { x: 275, y: 275, r: 32, province: 'North Central' },

  // Eastern Province
  'Trincomalee': { x: 290, y: 200, r: 28, province: 'Eastern' },
  'Batticaloa': { x: 335, y: 310, r: 26, province: 'Eastern' },
  'Ampara': { x: 315, y: 385, r: 34, province: 'Eastern' },
  'Kalmunai': { x: 365, y: 360, r: 22, province: 'Eastern' }, // Coastal RDHS health zone

  // North Western Province
  'Puttalam': { x: 115, y: 255, r: 32, province: 'North Western' },
  'Kurunegala': { x: 165, y: 330, r: 36, province: 'North Western' },

  // Central Province
  'Matale': { x: 235, y: 320, r: 26, province: 'Central' },
  'Kandy': { x: 225, y: 375, r: 30, province: 'Central' },
  'Nuwara Eliya': { x: 240, y: 435, r: 28, province: 'Central' },

  // Sabaragamuwa Province
  'Kegalle': { x: 170, y: 395, r: 24, province: 'Sabaragamuwa' },
  'Ratnapura': { x: 205, y: 470, r: 34, province: 'Sabaragamuwa' },

  // Western Province
  'Gampaha': { x: 125, y: 370, r: 24, province: 'Western' },
  'Colombo': { x: 115, y: 420, r: 22, province: 'Western' },
  'Kalutara': { x: 130, y: 470, r: 24, province: 'Western' },

  // Uva Province
  'Badulla': { x: 285, y: 430, r: 30, province: 'Uva' },
  'Monaragala': { x: 305, y: 495, r: 34, province: 'Uva' },

  // Southern Province
  'Galle': { x: 145, y: 535, r: 26, province: 'Southern' },
  'Matara': { x: 195, y: 560, r: 26, province: 'Southern' },
  'Hambantota': { x: 270, y: 555, r: 32, province: 'Southern' },
};

// Neighbor adjacency pairs for Queen-contiguity spatial transmission network
export const ADJACENCY_PAIRS: [string, string][] = [
  ['Jaffna', 'Kilinochchi'],
  ['Kilinochchi', 'Mannar'],
  ['Kilinochchi', 'Mullaitivu'],
  ['Mannar', 'Vavuniya'],
  ['Mannar', 'Anuradhapura'],
  ['Mannar', 'Puttalam'],
  ['Mullaitivu', 'Vavuniya'],
  ['Mullaitivu', 'Trincomalee'],
  ['Vavuniya', 'Anuradhapura'],
  ['Anuradhapura', 'Trincomalee'],
  ['Anuradhapura', 'Polonnaruwa'],
  ['Anuradhapura', 'Matale'],
  ['Anuradhapura', 'Kurunegala'],
  ['Anuradhapura', 'Puttalam'],
  ['Trincomalee', 'Polonnaruwa'],
  ['Trincomalee', 'Batticaloa'],
  ['Polonnaruwa', 'Batticaloa'],
  ['Polonnaruwa', 'Ampara'],
  ['Polonnaruwa', 'Matale'],
  ['Polonnaruwa', 'Badulla'],
  ['Batticaloa', 'Kalmunai'],
  ['Batticaloa', 'Ampara'],
  ['Kalmunai', 'Ampara'],
  ['Kalmunai', 'Monaragala'],
  ['Ampara', 'Monaragala'],
  ['Ampara', 'Badulla'],
  ['Ampara', 'Kandy'],
  ['Puttalam', 'Kurunegala'],
  ['Puttalam', 'Gampaha'],
  ['Kurunegala', 'Matale'],
  ['Kurunegala', 'Kandy'],
  ['Kurunegala', 'Kegalle'],
  ['Kurunegala', 'Gampaha'],
  ['Matale', 'Kandy'],
  ['Matale', 'Badulla'],
  ['Kandy', 'Nuwara Eliya'],
  ['Kandy', 'Badulla'],
  ['Kandy', 'Kegalle'],
  ['Nuwara Eliya', 'Badulla'],
  ['Nuwara Eliya', 'Ratnapura'],
  ['Nuwara Eliya', 'Kegalle'],
  ['Kegalle', 'Ratnapura'],
  ['Kegalle', 'Colombo'],
  ['Kegalle', 'Gampaha'],
  ['Gampaha', 'Colombo'],
  ['Colombo', 'Kalutara'],
  ['Kalutara', 'Ratnapura'],
  ['Kalutara', 'Galle'],
  ['Ratnapura', 'Badulla'],
  ['Ratnapura', 'Monaragala'],
  ['Ratnapura', 'Hambantota'],
  ['Ratnapura', 'Matara'],
  ['Ratnapura', 'Galle'],
  ['Badulla', 'Monaragala'],
  ['Monaragala', 'Hambantota'],
  ['Galle', 'Matara'],
  ['Matara', 'Hambantota'],
];

const PROVINCES = [
  'ALL',
  'Western',
  'Central',
  'Southern',
  'Northern',
  'Eastern',
  'North Western',
  'North Central',
  'Uva',
  'Sabaragamuwa',
];

interface ChoroplethMapProps {
  districtTiers: Record<string, { tier: string; cases: number; incidence: number; exceedProb: number; isAnomaly?: boolean }>;
  selectedDistrict: string;
  onSelectDistrict: (districtName: string) => void;
  selectedHorizon: number;
}

export const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  districtTiers,
  selectedDistrict,
  onSelectDistrict,
  selectedHorizon,
}) => {
  const [selectedProvince, setSelectedProvince] = useState<string>('ALL');
  const [showNetwork, setShowNetwork] = useState<boolean>(true);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const getTierFill = (tier: string) => {
    switch (tier) {
      case 'Extreme':
        return '#dc2626'; // Deep crimson red
      case 'High':
        return '#ea580c'; // Vibrant orange
      case 'Moderate':
        return '#f59e0b'; // Amber yellow
      case 'Low':
        return '#0284c7'; // Sky blue
      case 'Insufficient Data':
        return 'url(#hatched-insufficient)';
      default:
        return '#475569';
    }
  };

  const getTierBorder = (tier: string) => {
    switch (tier) {
      case 'Extreme':
        return '#f87171';
      case 'High':
        return '#fb923c';
      case 'Moderate':
        return '#fcd34d';
      case 'Low':
        return '#38bdf8';
      case 'Insufficient Data':
        return '#94a3b8';
      default:
        return '#64748b';
    }
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-900/90 rounded-2xl border border-slate-800 p-4 flex flex-col shadow-2xl overflow-hidden">
      {/* Map Header with Controls */}
      <div className="flex flex-col gap-2 mb-2 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>Sri Lanka 26 Units Risk Map</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-sky-950 text-sky-400 border border-sky-800 font-mono font-bold">
                +{selectedHorizon}W Projection
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">Click a node to inspect fan chart & field staging needs</p>
          </div>

          {/* Adjacency Network Toggle */}
          <button
            onClick={() => setShowNetwork(!showNetwork)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
              showNetwork
                ? 'bg-sky-500/20 text-sky-300 border-sky-400/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Network className="w-3 h-3" />
            <span>{showNetwork ? 'Hide Network' : 'Queen Network'}</span>
          </button>
        </div>

        {/* Province Quick Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
          {PROVINCES.map((prov) => (
            <button
              key={prov}
              onClick={() => setSelectedProvince(prov)}
              className={`px-2 py-0.5 rounded-md text-[10px] whitespace-nowrap font-medium transition-all ${
                selectedProvince === prov
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {prov === 'ALL' ? 'All Units (26)' : prov}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas */}
      <div className="relative flex-1 flex items-center justify-center">
        <svg
          viewBox="0 0 440 620"
          className="w-full h-full max-h-[480px] drop-shadow-2xl select-none"
        >
          <defs>
            {/* SVG Hatched pattern for Insufficient Data */}
            <pattern
              id="hatched-insufficient"
              width="8"
              height="8"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="2.5" />
              <rect width="8" height="8" fill="#334155" opacity="0.65" />
            </pattern>

            {/* Pulsating glow filter for early anomalies */}
            <filter id="glow-anomaly" x="-25%" y="-25%" width="150%" height="150%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Island Landmass Contour Backdrop */}
          <ellipse cx="225" cy="360" rx="145" ry="215" fill="#0b1329" opacity="0.5" />

          {/* Queen-Contiguity Spatial Transmission Adjacency Network */}
          {showNetwork && (
            <g stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.25">
              {ADJACENCY_PAIRS.map(([d1, d2], idx) => {
                const c1 = SRI_LANKA_DISTRICT_COORDS[d1];
                const c2 = SRI_LANKA_DISTRICT_COORDS[d2];
                if (!c1 || !c2) return null;
                const isFocal =
                  selectedDistrict === d1 ||
                  selectedDistrict === d2 ||
                  hoveredDistrict === d1 ||
                  hoveredDistrict === d2;
                return (
                  <line
                    key={idx}
                    x1={c1.x}
                    y1={c1.y}
                    x2={c2.x}
                    y2={c2.y}
                    stroke={isFocal ? '#38bdf8' : '#334155'}
                    strokeWidth={isFocal ? 2 : 1}
                    opacity={isFocal ? 0.8 : 0.25}
                    strokeDasharray={isFocal ? 'none' : '3 3'}
                  />
                );
              })}
            </g>
          )}

          {/* District Interactive Nodes */}
          {Object.entries(SRI_LANKA_DISTRICT_COORDS).map(([name, coords]) => {
            const data = districtTiers[name] || {
              tier: 'Low',
              cases: 0,
              incidence: 0,
              exceedProb: 0,
              isAnomaly: false,
            };
            const isSelected = selectedDistrict === name;
            const isHovered = hoveredDistrict === name;
            const isProvinceMatch = selectedProvince === 'ALL' || coords.province === selectedProvince;
            const isKalmunai = name === 'Kalmunai';

            const fill = getTierFill(data.tier);
            const stroke = isSelected ? '#ffffff' : getTierBorder(data.tier);
            const strokeWidth = isSelected ? 3.5 : isHovered ? 2.5 : 1.5;
            const opacity = isProvinceMatch ? 1.0 : 0.25;

            return (
              <g
                key={name}
                onClick={() => onSelectDistrict(name)}
                onMouseEnter={() => setHoveredDistrict(name)}
                onMouseLeave={() => setHoveredDistrict(null)}
                className="cursor-pointer group transition-all duration-200"
                style={{ opacity }}
              >
                {/* Highlight animated pulse for selected unit */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.r + 6}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    className="animate-spin"
                    style={{ transformOrigin: `${coords.x}px ${coords.y}px`, animationDuration: '9s' }}
                  />
                )}

                {/* Early Anomaly Ping Warning */}
                {data.isAnomaly && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.r + 4}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="2.5"
                    className="animate-ping"
                    opacity="0.85"
                  />
                )}

                {/* Main District Bubble */}
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={coords.r}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  className={`transition-all duration-200 group-hover:scale-105 ${
                    isSelected ? 'filter drop-shadow-[0_0_12px_rgba(56,189,248,0.6)]' : ''
                  }`}
                />

                {/* Special dashed border for Kalmunai RDHS health zone */}
                {isKalmunai && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={coords.r - 3}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1.5"
                    strokeDasharray="3 2"
                  />
                )}

                {/* District Name Label */}
                <text
                  x={coords.x}
                  y={coords.y - 2}
                  textAnchor="middle"
                  fontSize={coords.r > 28 ? 10.5 : 9}
                  fontWeight="700"
                  fill="#ffffff"
                  pointerEvents="none"
                  className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                >
                  {name === 'Nuwara Eliya' ? 'N. Eliya' : name === 'Anuradhapura' ? 'Anuradh.' : name}
                </text>

                {/* Case count or Insufficient label */}
                <text
                  x={coords.x}
                  y={coords.y + 11}
                  textAnchor="middle"
                  fontSize="8"
                  fill={data.tier === 'Insufficient Data' ? '#cbd5e1' : '#ffffff'}
                  fontWeight="600"
                  pointerEvents="none"
                  opacity="0.95"
                >
                  {data.tier === 'Insufficient Data' ? 'NO DATA' : `${Math.round(data.cases)} cases`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected District Quick Summary Bar */}
        {selectedDistrict && districtTiers[selectedDistrict] && (
          <div className="absolute bottom-1 left-2 right-2 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 flex items-center justify-between text-xs shadow-2xl">
            <div className="flex items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor:
                    districtTiers[selectedDistrict].tier === 'Insufficient Data'
                      ? '#64748b'
                      : getTierBorder(districtTiers[selectedDistrict].tier),
                }}
              />
              <div>
                <span className="font-bold text-white text-sm">{selectedDistrict}</span>
                <span className="text-slate-400 ml-1.5 font-medium">
                  Tier: <strong className="text-white">{districtTiers[selectedDistrict].tier}</strong>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Pred. Cases</span>
                <span className="font-mono font-bold text-sky-400">
                  {Math.round(districtTiers[selectedDistrict].cases)}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">Incidence</span>
                <span className="font-mono font-bold text-white">
                  {districtTiers[selectedDistrict].incidence.toFixed(1)}/100k
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] uppercase block">P(Exceed Q95)</span>
                <span className="font-mono font-bold text-amber-400">
                  {(districtTiers[selectedDistrict].exceedProb * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mini Color Legend Footer */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
            <span>Extreme (&ge;80% exc.)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
            <span>High (50-80%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Mod (15-50%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
            <span>Low (&lt;15%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded bg-slate-600 border border-dashed border-slate-400"></span>
            <span>Insufficient Data</span>
          </div>
        </div>

        <span className="text-[10px] text-slate-500 italic">
          Kalmunai health zone rendered with dashed border
        </span>
      </div>
    </div>
  );
};
