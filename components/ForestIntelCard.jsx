"use client";

import { useEffect, useRef } from "react";

const AOI = {
  id:        "IOM-01",
  location:  "South Barrule",
  region:    "Isle of Man",
  coords:    "54.09°N · 4.72°W",
  elevation: "483m asl",
  habitat:   "Upland Heath & Plantation",
  year:      "2025",
};

const STATS = [
  { key: "biomass",      label: "Biomass",      unit: "t/ha",  base: 48.3, range: 1.8, dec: 1, prefix: "",  red: false, sub: "mean · ±6.1"   },
  { key: "canopy",       label: "Canopy ht",    unit: "m",     base: 7.4,  range: 0.4, dec: 1, prefix: "",  red: false, sub: "p95 dominant"  },
  { key: "biodiversity", label: "Biodiversity", unit: "BNG",   base: 3.2,  range: 0.3, dec: 1, prefix: "",  red: false, sub: "habitat units" },
  { key: "growth",       label: "Growth",       unit: "ha/yr", base: 14,   range: 2,   dec: 0, prefix: "+", red: false, sub: "afforestation" },
  { key: "mortality",    label: "Mortality",    unit: "ha/yr", base: 3.2,  range: 0.5, dec: 1, prefix: "−", red: true,  sub: "dieback det."  },
];

const KEYFRAMES = `
@keyframes fic-cardPulse  { 0%,100%{border-color:transparent} 50%{border-color:rgba(42,72,56,0.12)} }
@keyframes fic-dotPulse   { 0%,100%{opacity:1} 50%{opacity:0.15} }
@keyframes fic-liveDot    { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.7)} }
@keyframes fic-shimmer    { 0%,100%{opacity:0} 50%{opacity:1} }
@keyframes fic-rPulse1    { 0%,100%{r:10;opacity:0.5}  50%{r:15;opacity:0.15} }
@keyframes fic-rPulse2    { 0%,100%{r:18;opacity:0.3}  50%{r:24;opacity:0.08} }
@keyframes fic-rPulse3    { 0%,100%{r:26;opacity:0.15} 50%{r:32;opacity:0.04} }
@keyframes fic-corePulse  { 0%,100%{opacity:0.9} 50%{opacity:0.5} }
@keyframes fic-rotA       { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
@keyframes fic-rotB       { from{transform:rotate(0deg)}   to{transform:rotate(-360deg)} }
@keyframes fic-flowIn     { from{stroke-dashoffset:0} to{stroke-dashoffset:-22} }
@keyframes fic-flowOut    { from{stroke-dashoffset:0} to{stroke-dashoffset:-26} }
@keyframes fic-numFlip    { 0%{opacity:1;transform:translateY(0)} 30%{opacity:0;transform:translateY(-6px)} 60%{opacity:0;transform:translateY(6px)} 100%{opacity:1;transform:translateY(0)} }
@keyframes fic-procAnim   { 0%{width:0%;opacity:1} 70%{width:100%;opacity:1} 100%{width:100%;opacity:0} }
.fic-wrap::before { content:''; position:absolute; inset:-1px; border-radius:9px; border:1px solid transparent; pointer-events:none; animation: fic-cardPulse 4s ease-in-out infinite; }
.fic-dot-active { animation: fic-dotPulse 3s ease-in-out infinite; }
.fic-live-dot   { width:5px;height:5px;border-radius:50%;background:#3a9060;display:inline-block; animation: fic-liveDot 1.4s ease-in-out infinite; }
.fic-tile::after  { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse at 15% 50%, rgba(42,72,56,0.05) 0%, transparent 65%); animation: fic-shimmer 5s ease-in-out infinite; }
.fic-ptile::after { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse at 85% 50%, rgba(22,40,32,0.05)  0%, transparent 60%); animation: fic-shimmer 5s ease-in-out infinite; }
.fic-rtile::after { content:''; position:absolute; inset:0; pointer-events:none; background: radial-gradient(ellipse at 85% 50%, rgba(192,42,26,0.07) 0%, transparent 60%); animation: fic-shimmer 5s ease-in-out infinite; }
.fic-rp1  { animation: fic-rPulse1 3s ease-in-out infinite; }
.fic-rp2  { animation: fic-rPulse2 3s ease-in-out infinite 0.4s; }
.fic-rp3  { animation: fic-rPulse3 3s ease-in-out infinite 0.8s; }
.fic-core { animation: fic-corePulse 2s ease-in-out infinite; }
.fic-rotA { animation: fic-rotA 12s linear infinite; transform-origin: 36px 36px; }
.fic-rotB { animation: fic-rotB 18s linear infinite; transform-origin: 36px 36px; }
.fic-fl-in       { fill:none;stroke:#4a7860;stroke-width:1.1;stroke-dasharray:2 9;opacity:0.5; animation: fic-flowIn 3.2s linear infinite; }
.fic-fl-out-glow { fill:none;stroke:#3a6050;stroke-width:5;stroke-dasharray:5 8;opacity:0.1; animation: fic-flowOut 2s linear infinite; }
.fic-fl-out      { fill:none;stroke:#162820;stroke-width:1.6;stroke-dasharray:5 8;opacity:0.82; animation: fic-flowOut 2s linear infinite; }
.fic-fl-red-glow { fill:none;stroke:#c02a1a;stroke-width:5;stroke-dasharray:5 8;opacity:0.1; animation: fic-flowOut 2s linear infinite; }
.fic-fl-red      { fill:none;stroke:#c02a1a;stroke-width:1.6;stroke-dasharray:5 8;opacity:0.85; animation: fic-flowOut 2s linear infinite; }
.fic-num-update  { animation: fic-numFlip 0.5s ease; }
.fic-proc-fill   { height:100%;background:#3a6050;border-radius:2px; animation: fic-procAnim 3s ease-in-out infinite; }
`;

const Icons = {
  Satellite: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f6f9f7"/>
      <rect x="0" y="0" width="30" height="14" fill="#f2f8f4"/>
      <path d="M1 27 Q6 14 10 18 Q13 21 15 13 Q17 7 21 11 Q25 15 29 10 L30 27Z" fill="#162820" opacity="0.88"/>
      <rect x="0" y="13" width="30" height="5" fill="#fff" opacity="0.6"/>
      <circle cx="23" cy="7" r="3" fill="none" stroke="#3a6050" strokeWidth="0.8" opacity="0.6"/>
      <line x1="23" y1="10" x2="23" y2="12" stroke="#3a6050" strokeWidth="0.8" opacity="0.6"/>
    </svg>
  ),
  UAV: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f4f9f6"/>
      <rect x="0" y="0" width="30" height="14" fill="#f0f7f2"/>
      <path d="M0 27 Q4 20 8 22 Q11 24 15 17 Q18 11 22 15 Q26 19 30 16 L30 30 L0 30Z" fill="#1e3228" opacity="0.82"/>
      <rect x="0" y="13" width="30" height="4" fill="#fff" opacity="0.6"/>
      <line x1="11" y1="6" x2="19" y2="6" stroke="#2a4838" strokeWidth="1" opacity="0.7"/>
      <circle cx="11" cy="5.5" r="1.5" fill="none" stroke="#2a4838" strokeWidth="0.8" opacity="0.7"/>
      <circle cx="19" cy="5.5" r="1.5" fill="none" stroke="#2a4838" strokeWidth="0.8" opacity="0.7"/>
      <circle cx="15" cy="7" r="1" fill="#2a4838" opacity="0.6"/>
    </svg>
  ),
  DTM: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f4f8f6"/>
      <rect x="0" y="0" width="30" height="14" fill="#f0f6f2"/>
      <path d="M0 27 Q4 20 8 22 Q11 24 15 17 Q18 11 22 15 Q26 19 30 16 L30 30 L0 30Z" fill="#1e3228" opacity="0.78"/>
      <path d="M1 21 Q8 17 15 19 Q22 21 29 18" fill="none" stroke="#2a4838" strokeWidth="0.7" opacity="0.4"/>
      <path d="M2 18 Q9 14 15 16 Q22 18 28 15" fill="none" stroke="#2a4838" strokeWidth="0.5" opacity="0.25"/>
      <rect x="0" y="13" width="30" height="4" fill="#fff" opacity="0.6"/>
    </svg>
  ),
  Acoustics: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f4f8f6"/>
      <path d="M3 15 L6 15 L7 10 L9 20 L11 12 L13 18 L15 9 L17 21 L19 13 L21 17 L23 15 L27 15"
        fill="none" stroke="#162820" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.75"/>
    </svg>
  ),
  Biomass: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f8faf8"/>
      <rect x="0" y="0" width="30" height="12" fill="#f4f9f5"/>
      <path d="M0 27 Q5 11 10 15 Q13 18 15 10 Q17 4 21 8 Q25 12 30 7 L30 27Z" fill="#162820" opacity="0.92"/>
      <rect x="0" y="12" width="30" height="4" fill="#fff" opacity="0.7"/>
    </svg>
  ),
  Canopy: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f6faf7"/>
      <rect x="0" y="0" width="30" height="12" fill="#f2f8f4"/>
      <path d="M0 27 Q5 12 9 16 Q12 19 15 11 Q18 5 22 9 Q26 13 30 8 L30 27Z" fill="#162820" opacity="0.92"/>
      <rect x="0" y="12" width="30" height="4" fill="#fff" opacity="0.7"/>
    </svg>
  ),
  Biodiversity: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f4f9f6"/>
      <path d="M6 12 Q9 9 12 11 Q10 11 8 13Z"     fill="#162820" opacity="0.7"/>
      <path d="M14 9 Q17 6 20 8 Q18 8 16 10Z"     fill="#162820" opacity="0.65"/>
      <path d="M20 14 Q23 11 26 13 Q24 13 22 15Z" fill="#162820" opacity="0.55"/>
      <path d="M13 28 L13 21 L17 21 L17 28Z"      fill="#162820" opacity="0.4"/>
      <ellipse cx="15" cy="19" rx="5" ry="6"      fill="#162820" opacity="0.6"/>
      <ellipse cx="11" cy="21" rx="4" ry="5"      fill="#162820" opacity="0.45"/>
      <ellipse cx="19" cy="21" rx="4" ry="5"      fill="#162820" opacity="0.45"/>
    </svg>
  ),
  Growth: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#f4f9f6"/>
      <rect x="0" y="0" width="30" height="11" fill="#f0f7f2"/>
      <circle cx="15" cy="21" r="8"   fill="none" stroke="#162820" strokeWidth="1"   opacity="0.13"/>
      <circle cx="15" cy="21" r="5.5" fill="none" stroke="#162820" strokeWidth="1"   opacity="0.25"/>
      <circle cx="15" cy="21" r="3"   fill="none" stroke="#162820" strokeWidth="0.9" opacity="0.45"/>
      <circle cx="15" cy="21" r="1.2" fill="#162820" opacity="0.8"/>
      <path d="M15 15 L15 5 M11.5 8.5 L15 5 L18.5 8.5"
        fill="none" stroke="#162820" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.88"/>
      <rect x="0" y="11" width="30" height="3.5" fill="#fff" opacity="0.65"/>
    </svg>
  ),
  Mortality: () => (
    <svg viewBox="0 0 30 30" width="30" height="30">
      <circle cx="15" cy="15" r="15" fill="#fff8f7"/>
      <rect x="0" y="0" width="30" height="11" fill="#fff2f0"/>
      <path d="M5 26 Q7 18 9 22 L9 26Z"     fill="#c02a1a" opacity="0.7"/>
      <path d="M12 26 Q13 16 15 20 L15 26Z"  fill="#c02a1a" opacity="0.6"/>
      <path d="M18 26 Q20 17 22 21 L22 26Z"  fill="#c02a1a" opacity="0.55"/>
      <path d="M24 26 Q25 20 27 23 L27 26Z"  fill="#c02a1a" opacity="0.5"/>
      <path d="M15 15 L15 5 M11.5 11.5 L15 15 L18.5 11.5"
        fill="none" stroke="#c02a1a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.9"/>
      <path d="M9 6 L13 10 M13 6 L9 10" stroke="#c02a1a" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
      <rect x="0" y="11" width="30" height="3.5" fill="#fff" opacity="0.6"/>
    </svg>
  ),
};

const SENSORS = [
  { id: "satellite", name: "Satellite",  sub: "S2 · Landsat · S1", Icon: Icons.Satellite },
  { id: "uav",       name: "UAV LiDAR", sub: "ALS · TLS",          Icon: Icons.UAV       },
  { id: "dtm",       name: "DTM",        sub: "Elevation",          Icon: Icons.DTM       },
  { id: "acoustics", name: "Acoustics",  sub: "Passive audio",      Icon: Icons.Acoustics },
];

const PRODUCTS = [
  { id: "biomass",      name: "Biomass",       unit: "t/ha",     red: false, Icon: Icons.Biomass      },
  { id: "canopy",       name: "Canopy height", unit: "m",        red: false, Icon: Icons.Canopy       },
  { id: "biodiversity", name: "Biodiversity",  unit: "BNG score",red: false, Icon: Icons.Biodiversity },
  { id: "growth",       name: "Growth",        unit: "ha/yr",    red: false, Icon: Icons.Growth       },
  { id: "mortality",    name: "Mortality",     unit: "ha/yr",    red: true,  Icon: Icons.Mortality    },
];

const CX = 236, CY = 215, SX = 118, PX = 354;
const sensorYs  = [54, 162, 270, 376];
const productYs = [43, 129, 215, 301, 387];

function inboundPath(i) {
  const y = sensorYs[i];
  if (Math.abs(y - CY) < 8) return `M ${SX} ${CY} L ${CX} ${CY}`;
  return `M ${SX} ${y} C ${SX+50} ${y}, ${CX-40} ${CY}, ${CX} ${CY}`;
}

function outboundPath(i) {
  const y = productYs[i];
  const dy = y - CY;
  return `M ${CX} ${CY} C ${CX+38} ${CY+dy*0.2}, ${PX-48} ${y-dy*0.08}, ${PX} ${y}`;
}

const S = {
  card:          { background:"#fff", border:"1px solid #b8d0c4", borderRadius:"8px", width:"520px", padding:"24px", boxShadow:"0 2px 8px rgba(22,40,32,0.05),0 16px 56px rgba(22,40,32,0.06)", position:"relative", fontFamily:"'Inter',system-ui,sans-serif" },
  header:        { display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"3px" },
  title:         { fontSize:"11px", fontWeight:600, letterSpacing:"0.12em", color:"#2a4838", textTransform:"uppercase", margin:0 },
  sub:           { fontSize:"10px", fontWeight:400, color:"#7a9e8c", margin:"3px 0 20px" },
  headerRight:   { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"6px" },
  dots:          { display:"flex", gap:"5px" },
  dot:           { width:"7px", height:"7px", borderRadius:"50%", background:"#b8d0c4", display:"inline-block" },
  dotActive:     { background:"#1e3228" },
  liveBadge:     { fontSize:"8px", fontWeight:600, letterSpacing:"0.1em", color:"#3a6050", border:"1px solid #b8d0c4", padding:"2px 7px", borderRadius:"20px", display:"flex", alignItems:"center", gap:"5px" },
  sectionLabels: { display:"flex", justifyContent:"space-between", fontSize:"9px", fontWeight:500, letterSpacing:"0.1em", textTransform:"uppercase", color:"#7a9e8c", marginBottom:"8px" },
  flowArea:      { position:"relative", width:"100%", height:"430px" },
  flowSvg:       { position:"absolute", top:0, left:0, width:"100%", height:"100%", overflow:"visible" },
  sensorCol:     { position:"absolute", left:0, top:0, width:"124px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-around", padding:"10px 0" },
  productCol:    { position:"absolute", right:0, top:0, width:"124px", height:"100%", display:"flex", flexDirection:"column", justifyContent:"space-around", padding:"14px 0" },
  tile:          { width:"114px", border:"1px solid #dde8e2", borderRadius:"5px", padding:"8px 10px", display:"flex", alignItems:"center", gap:"9px", background:"#fff", position:"relative", overflow:"hidden" },
  ptile:         { width:"114px", border:"1px solid #2a4838", borderRadius:"5px", padding:"8px 10px", display:"flex", alignItems:"center", gap:"9px", background:"#fff", position:"relative", overflow:"hidden" },
  rtile:         { width:"114px", border:"1px solid #c02a1a", borderRadius:"5px", padding:"8px 10px", display:"flex", alignItems:"center", gap:"9px", background:"#fff", position:"relative", overflow:"hidden" },
  icon:          { width:"30px", height:"30px", borderRadius:"50%", flexShrink:0, overflow:"hidden", border:"1px solid #dde8e2" },
  tileName:      { fontSize:"10px", fontWeight:600, color:"#162820", lineHeight:1.3, margin:0 },
  tileSub:       { fontSize:"9px",  fontWeight:400, color:"#7a9e8c", margin:"1px 0 0" },
  pName:         { fontSize:"10px", fontWeight:600, color:"#162820", lineHeight:1.3, margin:0 },
  pUnit:         { fontSize:"9px",  fontWeight:400, color:"#3a6050", margin:"1px 0 0" },
  rName:         { fontSize:"10px", fontWeight:600, color:"#c02a1a", lineHeight:1.3, margin:0 },
  rUnit:         { fontSize:"9px",  fontWeight:400, color:"#c02a1a", margin:"1px 0 0", opacity:0.75 },
  node:          { position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%)", width:"72px", height:"72px" },
  statsBar:      { display:"grid", gridTemplateColumns:"repeat(5,1fr)", marginTop:"20px", borderTop:"1px solid #dde8e2", paddingTop:"16px" },
  stat:          { padding:"0 5px", borderRight:"1px solid #dde8e2" },
  statLabel:     { fontSize:"9px", fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase", color:"#7a9e8c", margin:"0 0 5px" },
  statVal:       { fontSize:"17px", fontWeight:600, letterSpacing:"-0.02em", lineHeight:1, color:"#162820", display:"inline-block" },
  statValRed:    { fontSize:"17px", fontWeight:600, letterSpacing:"-0.02em", lineHeight:1, color:"#c02a1a", display:"inline-block" },
  statUnit:      { fontSize:"9px", fontWeight:400, color:"#3a6050" },
  statUnitRed:   { fontSize:"9px", fontWeight:400, color:"#c02a1a", opacity:0.8 },
  statSub:       { fontSize:"9px", fontWeight:400, color:"#7a9e8c", marginTop:"4px" },
  footer:        { display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:"16px", paddingTop:"12px", borderTop:"1px solid #dde8e2" },
  footerLeft:    { display:"flex", flexDirection:"column", gap:"4px" },
  footerCoords:  { fontSize:"9px", fontWeight:400, color:"#7a9e8c" },
  footerRight:   { display:"flex", gap:"14px", alignItems:"center" },
  footerLabel:   { fontSize:"9px", fontWeight:400, color:"#7a9e8c" },
  footerYear:    { fontSize:"10px", fontWeight:600, color:"#162820", border:"1px solid #2a4838", padding:"3px 10px", borderRadius:"3px" },
  processing:    { display:"flex", alignItems:"center", gap:"6px", fontSize:"9px", fontWeight:500, color:"#7a9e8c", letterSpacing:"0.06em" },
  procBar:       { width:"60px", height:"2px", background:"#dde8e2", borderRadius:"2px", overflow:"hidden" },
};

export default function ForestIntelCard() {
  const statRefs = useRef({});

  useEffect(() => {
    if (document.getElementById("fic-styles")) return;
    const el = document.createElement("style");
    el.id = "fic-styles";
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    return () => el.remove();
  }, []);

  useEffect(() => {
    const tick = () => {
      STATS.forEach((stat, i) => {
        const el = statRefs.current[stat.key];
        if (!el) return;
        setTimeout(() => {
          el.classList.remove("fic-num-update");
          void el.offsetWidth;
          el.classList.add("fic-num-update");
          const v = (stat.base + (Math.random() - 0.5) * stat.range * 2).toFixed(stat.dec);
          el.textContent = stat.prefix + v;
        }, i * 120);
      });
    };
    const id = setInterval(tick, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={S.card} className="fic-wrap">
      <div style={S.header}>
        <div>
          <p style={S.title}>AOI-{AOI.id} · {AOI.location} · {AOI.region}</p>
          <p style={S.sub}>{AOI.coords} · {AOI.habitat} · {AOI.elevation}</p>
        </div>
        <div style={S.headerRight}>
          <div style={S.dots}>
            <span style={{...S.dot,...S.dotActive}} className="fic-dot-active"/>
            <span style={S.dot}/><span style={S.dot}/>
          </div>
          <div style={S.liveBadge}><span className="fic-live-dot"/>LIVE</div>
        </div>
      </div>

      <div style={S.sectionLabels}><span>Sensors</span><span>Products</span></div>

      <div style={S.flowArea}>
        <div style={S.sensorCol}>
          {SENSORS.map((sensor) => (
            <div key={sensor.id} style={S.tile} className="fic-tile">
              <div style={S.icon}><sensor.Icon/></div>
              <div>
                <p style={S.tileName}>{sensor.name}</p>
                <p style={S.tileSub}>{sensor.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={S.productCol}>
          {PRODUCTS.map((product) => (
            <div key={product.id} style={product.red ? S.rtile : S.ptile} className={product.red ? "fic-rtile" : "fic-ptile"}>
              <div style={S.icon}><product.Icon/></div>
              <div>
                <p style={product.red ? S.rName : S.pName}>{product.name}</p>
                <p style={product.red ? S.rUnit : S.pUnit}>{product.unit}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={S.node}>
          <svg viewBox="0 0 72 72" width="72" height="72" overflow="visible">
            <circle cx="36" cy="36" r="26" fill="none" stroke="#c2d4ca" strokeWidth="0.6" className="fic-rp3"/>
            <circle cx="36" cy="36" r="18" fill="none" stroke="#98b8a8" strokeWidth="0.8" className="fic-rp2"/>
            <circle cx="36" cy="36" r="10" fill="none" stroke="#4a7860" strokeWidth="1"   className="fic-rp1"/>
            <ellipse cx="36" cy="36" rx="30" ry="22" stroke="#d0e4da" strokeWidth="0.6" fill="none" strokeDasharray="2 6" opacity="0.6" className="fic-rotA"/>
            <ellipse cx="36" cy="36" rx="22" ry="30" stroke="#c0d8cc" strokeWidth="0.6" fill="none" strokeDasharray="2 7" opacity="0.45" className="fic-rotB"/>
            <circle cx="36" cy="36" r="26" stroke="#e2ede8" strokeWidth="0.5" fill="none" opacity="0.7"/>
            <circle cx="36" cy="36" r="18" stroke="#c8dcd4" strokeWidth="0.5" fill="none" opacity="0.6"/>
            <circle cx="36" cy="36" r="4"  fill="#2a4838" className="fic-core"/>
            <circle cx="36" cy="36" r="2"  fill="#162820"/>
          </svg>
        </div>

        <svg style={S.flowSvg} viewBox="0 0 472 430" preserveAspectRatio="none">
          {SENSORS.map((s, i) => (
            <path key={s.id} className="fic-fl-in" style={{animationDelay:`${i*0.8}s`}} d={inboundPath(i)}/>
          ))}
          {PRODUCTS.map((p, i) => (
            <g key={p.id}>
              <path className={p.red ? "fic-fl-red-glow" : "fic-fl-out-glow"} style={{animationDelay:`${0.3+i*0.55}s`}} d={outboundPath(i)}/>
              <path className={p.red ? "fic-fl-red" : "fic-fl-out"} style={{animationDelay:`${0.3+i*0.55}s`}} d={outboundPath(i)}/>
            </g>
          ))}
        </svg>
      </div>

      <div style={S.statsBar}>
        {STATS.map((stat, i) => (
          <div key={stat.key} style={{...S.stat,...(i===0?{paddingLeft:0}:{}),...(i===STATS.length-1?{borderRight:"none"}:{})}}>
            <p style={S.statLabel}>{stat.label}</p>
            <div>
              <span ref={(el)=>{statRefs.current[stat.key]=el;}} style={stat.red ? S.statValRed : S.statVal}>
                {stat.prefix}{stat.base.toFixed(stat.dec)}
              </span>
              <span style={stat.red ? S.statUnitRed : S.statUnit}> {stat.unit}</span>
            </div>
            <p style={S.statSub}>{stat.sub}</p>
          </div>
        ))}
      </div>

      <div style={S.footer}>
        <div style={S.footerLeft}>
          <span style={S.footerCoords}>{AOI.coords} · {AOI.elevation}</span>
          <div style={S.processing}>
            <span>Processing</span>
            <div style={S.procBar}><div className="fic-proc-fill"/></div>
          </div>
        </div>
        <div style={S.footerRight}>
          <span style={S.footerLabel}>Annual estimate</span>
          <span style={S.footerYear}>{AOI.year}</span>
        </div>
      </div>
    </div>
  );
}
