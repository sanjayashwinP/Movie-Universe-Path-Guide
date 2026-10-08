/**
 * Generates custom, authentic themed SVG teaser artwork or fallback posters
 * for all Marvel Cinematic Universe and Multiverse projects.
 */

const BESPOKE_THEMES = {
  'spider-man: brand new day': {
    primaryGrad: ['#0d0408', '#881337', '#020617'],
    accentColor: '#00f0ff',
    badgeColor: '#e11d48',
    badgeText: 'STREET-LEVEL ERA',
    symbol: `
      <!-- Spider Emblem -->
      <polygon points="250,310 262,330 258,348 250,358 242,348 238,330" fill="#00f0ff"/>
      <line x1="262" y1="330" x2="285" y2="315" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="262" y1="335" x2="295" y2="335" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="258" y1="345" x2="290" y2="365" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="250" y1="358" x2="278" y2="385" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="238" y1="330" x2="215" y2="315" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="238" y1="335" x2="205" y2="335" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="242" y1="345" x2="210" y2="365" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
      <line x1="250" y1="358" x2="222" y2="385" stroke="#00f0ff" stroke-width="3" stroke-linecap="round"/>
    `
  },
  'avengers: doomsday': {
    primaryGrad: ['#021208', '#064e3b', '#020617'],
    accentColor: '#34d399',
    badgeColor: '#10b981',
    badgeText: 'LATVERIA & BATTLEWORLD',
    symbol: `
      <!-- Doctor Doom Mask & Hood Silhouette -->
      <path d="M 250 290 Q 210 320 215 375 Q 230 405 250 410 Q 270 405 285 375 Q 290 320 250 290 Z" fill="#334155" stroke="#34d399" stroke-width="3"/>
      <rect x="230" y="340" width="16" height="8" rx="2" fill="#34d399"/>
      <rect x="254" y="340" width="16" height="8" rx="2" fill="#34d399"/>
      <line x1="250" y1="350" x2="250" y2="375" stroke="#0f172a" stroke-width="3"/>
      <line x1="235" y1="380" x2="265" y2="380" stroke="#0f172a" stroke-width="3"/>
    `
  },
  'avengers: secret wars': {
    primaryGrad: ['#090314', '#581c87', '#030712'],
    accentColor: '#c084fc',
    badgeColor: '#a855f7',
    badgeText: 'MULTIVERSE CLIMAX',
    symbol: `
      <!-- Battleworld Prism / Shattered Reality Core -->
      <polygon points="250,290 295,335 270,395 230,395 205,335" fill="none" stroke="#c084fc" stroke-width="3"/>
      <polygon points="250,310 280,340 262,380 238,380 220,340" fill="rgba(192, 132, 252, 0.2)" stroke="#a855f7" stroke-width="2"/>
      <circle cx="250" cy="345" r="8" fill="#ffffff"/>
      <line x1="250" y1="290" x2="250" y2="337" stroke="#38bdf8" stroke-width="2"/>
      <line x1="295" y1="335" x2="258" y2="345" stroke="#e11d48" stroke-width="2"/>
      <line x1="205" y1="335" x2="242" y2="345" stroke="#fbbf24" stroke-width="2"/>
    `
  },
  'ghost rider': {
    primaryGrad: ['#120300', '#7c2d12', '#020617'],
    accentColor: '#fb923c',
    badgeColor: '#ea580c',
    badgeText: 'SPIRIT OF VENGEANCE',
    symbol: `
      <!-- Flaming Skull & Hellfire Chain -->
      <circle cx="250" cy="340" r="32" fill="#1c1917" stroke="#fb923c" stroke-width="3"/>
      <circle cx="238" cy="335" r="6" fill="#f97316"/>
      <circle cx="262" cy="335" r="6" fill="#f97316"/>
      <path d="M 238 360 L 262 360 L 258 375 L 242 375 Z" fill="#44403c" stroke="#fb923c" stroke-width="2"/>
      <!-- Hellfire Flames -->
      <path d="M 230 310 Q 250 270 240 285 Q 260 265 255 285 Q 275 275 270 310 Z" fill="#f97316" opacity="0.8"/>
    `
  },
  'x-men: mutant genesis': {
    primaryGrad: ['#020b18', '#1e3a8a', '#030712'],
    accentColor: '#fbbf24',
    badgeColor: '#2563eb',
    badgeText: 'CHILDREN OF THE ATOM',
    symbol: `
      <!-- Iconic X-Men Crest -->
      <circle cx="250" cy="345" r="48" fill="#1e293b" stroke="#fbbf24" stroke-width="4"/>
      <line x1="220" y1="315" x2="280" y2="375" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>
      <line x1="280" y1="315" x2="220" y2="375" stroke="#fbbf24" stroke-width="8" stroke-linecap="round"/>
    `
  },
  'black panther 3': {
    primaryGrad: ['#090514', '#4c1d95', '#020617'],
    accentColor: '#fbbf24',
    badgeColor: '#7c3aed',
    badgeText: 'WAKANDA FOREVER',
    symbol: `
      <!-- Vibranium Panther Mask Outline -->
      <path d="M 215 315 L 235 300 L 245 320 L 255 320 L 265 300 L 285 315 L 275 355 L 250 380 L 225 355 Z" fill="#1e1b4b" stroke="#fbbf24" stroke-width="3"/>
      <line x1="230" y1="335" x2="242" y2="340" stroke="#a78bfa" stroke-width="3"/>
      <line x1="270" y1="335" x2="258" y2="340" stroke="#a78bfa" stroke-width="3"/>
      <circle cx="250" cy="360" r="4" fill="#fbbf24"/>
    `
  },
  'visionquest': {
    primaryGrad: ['#040d1a', '#0369a1', '#020617'],
    accentColor: '#38bdf8',
    badgeColor: '#0284c7',
    badgeText: 'SYNTHETIC REBIRTH',
    symbol: `
      <!-- White Vision Diamond Mind Stone -->
      <polygon points="250,305 275,345 250,385 225,345" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <polygon points="250,320 265,345 250,370 235,345" fill="#e0f2fe" opacity="0.9"/>
      <circle cx="250" cy="345" r="5" fill="#38bdf8"/>
    `
  },
  'daredevil: born again (season 2)': {
    primaryGrad: ['#140205', '#7f1d1d', '#020617'],
    accentColor: '#ef4444',
    badgeColor: '#dc2626',
    badgeText: 'STREET RECKONING',
    symbol: `
      <!-- Daredevil Twin 'D' Horns -->
      <text x="250" y="365" font-family="'Cinzel', sans-serif" font-weight="900" font-size="52" fill="#ef4444" text-anchor="middle" letter-spacing="-6">DD</text>
      <polygon points="232,315 238,328 230,328" fill="#ef4444"/>
      <polygon points="268,315 270,328 262,328" fill="#ef4444"/>
    `
  },
  'the punisher: special presentation': {
    primaryGrad: ['#050505', '#1e293b', '#030712'],
    accentColor: '#f8fafc',
    badgeColor: '#475569',
    badgeText: 'ONE MAN ARMY',
    symbol: `
      <!-- Punisher Skull -->
      <path d="M 230 310 Q 250 300 270 310 L 275 345 L 265 345 L 265 375 L 255 375 L 255 350 L 245 350 L 245 375 L 235 375 L 235 345 L 225 345 Z" fill="#f8fafc"/>
      <circle cx="240" cy="330" r="5" fill="#050505"/>
      <circle cx="260" cy="330" r="5" fill="#050505"/>
    `
  }
};

export function getPosterFallback(title = 'Marvel Cinematic Project') {
  const normTitle = (title || '').toLowerCase().trim();
  const safeTitle = (title || 'Marvel Movie').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  
  // Find matching bespoke theme
  const matchedKey = Object.keys(BESPOKE_THEMES).find(k => normTitle.includes(k) || k.includes(normTitle));
  const theme = matchedKey ? BESPOKE_THEMES[matchedKey] : null;

  const bgGrad0 = theme ? theme.primaryGrad[0] : '#0a0c16';
  const bgGrad1 = theme ? theme.primaryGrad[1] : '#141829';
  const bgGrad2 = theme ? theme.primaryGrad[2] : '#07080f';
  const accent = theme ? theme.accentColor : '#00f0ff';
  const badgeBg = theme ? theme.badgeColor : '#e23636';
  const badgeText = theme ? theme.badgeText : 'MARVEL STUDIOS';
  const symbolMarkup = theme ? theme.symbol : `
    <circle cx="250" cy="350" r="65" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4"/>
    <circle cx="250" cy="350" r="45" fill="none" stroke="#e23636" stroke-width="2" opacity="0.5"/>
    <polygon points="250,325 272,337 272,363 250,375 228,363 228,337" fill="none" stroke="${accent}" stroke-width="2.5"/>
  `;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${bgGrad0}"/>
          <stop offset="45%" stop-color="${bgGrad1}"/>
          <stop offset="100%" stop-color="${bgGrad2}"/>
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="500" height="750" fill="url(#bgGrad)"/>
      <rect width="500" height="750" fill="url(#grid)"/>
      <rect x="3" y="3" width="494" height="744" fill="none" stroke="${accent}" stroke-width="2" opacity="0.4" rx="14"/>
      
      <!-- Studio Header Badge -->
      <g transform="translate(140, 160)">
        <rect x="0" y="0" width="220" height="34" fill="${badgeBg}" rx="4"/>
        <text x="110" y="23" font-family="'Cinzel', sans-serif" font-weight="900" font-size="14" fill="#ffffff" text-anchor="middle" letter-spacing="3">${badgeText}</text>
      </g>

      <!-- Center Themed Symbol -->
      <g>
        ${symbolMarkup}
      </g>

      <!-- Title Text Container -->
      <foreignObject x="30" y="470" width="440" height="170">
        <div xmlns="http://www.w3.org/1999/xhtml" style="display:flex;align-items:center;justify-content:center;height:100%;text-align:center;">
          <h2 style="font-family:'Outfit',sans-serif;font-weight:900;font-size:26px;color:#ffffff;margin:0;line-height:1.2;text-shadow:0 3px 16px rgba(0,0,0,0.95);letter-spacing:0.5px;text-transform:uppercase;">
            ${safeTitle}
          </h2>
        </div>
      </foreignObject>

      <!-- Footer Subtitle -->
      <text x="250" y="690" font-family="'JetBrains Mono', monospace" font-size="11" fill="#94a3b8" text-anchor="middle" letter-spacing="3">
        OFFICIAL CINEMATIC DOSSIER
      </text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`;
}

