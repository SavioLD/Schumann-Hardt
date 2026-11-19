/* =====================================================================
   CREATIVES IM JOBBAHN-DESIGN · Mechatroniker + Geräteführer, Babenhausen
   ---------------------------------------------------------------------
   Die Anzeigen laufen über Jobbahn, nicht über den Arbeitgeber: kein
   Firmenname, kein Firmenlogo – Absender ist Jobbahn. Botschaft wie
   Serie 2: ehrlich (Rohstoffindustrie, viel draußen, im Winter nass und
   ungemütlich) und verlockend (überdurchschnittlich bezahlt).

     node creatives/build-jobbahn.mjs      -> creatives/jobbahn/

   Design aus dem Jobbahn-Repo (config/marke.json): Nachtblau #0F1B2D,
   Blau #2B59C3, Hellblau #7FA2F0, Schrift Plus Jakarta Sans,
   Umlaufbahnen als Markenmotiv, „Neuer Treffer“-Karte und weiße
   Info-Karte wie auf jobbahn.com. Logo: assets/jobbahn-logo-weiss.png
   (unverändert aus dem Jobbahn-Repo).

   3 Motive x 2 Stellen x 4 Formate = 24 Dateien
     wetter – „Schlechtes Wetter. Gutes Geld.“
     fell   – „<Stelle> mit dickem Fell gesucht.“ + Absperrband
              (im kleinen 1:1 ohne Band – dort wäre es zu voll)
     check  – „Passt das zu dir?“ – Checkliste
   ===================================================================== */

import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, readdirSync, existsSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT  = join(HERE, 'jobbahn');
const TMP  = join(OUT, '.render.html');
mkdirSync(OUT, { recursive: true });

/* ---------- Jobbahn-CI ---------- */
const JB = {
  nacht: '#0F1B2D', nacht2: '#0B1220', flaeche: '#121B2C', linie: '#26324A',
  blau: '#2B59C3', blauRgb: '43,89,195', hell: '#7FA2F0', hellRgb: '127,162,240', hellText: '#9DB8F5',
  text: '#E8ECF2', text2: '#A3AEBF', gruen: '#34D399'
};
const FONT = `@font-face{font-family:'Plus Jakarta Sans';font-style:normal;font-weight:400 800;font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(join(OUT, 'assets', 'plus-jakarta-sans-var.woff2')).toString('base64')}) format('woff2')}`;
const LOGO = 'assets/jobbahn-logo-weiss.png';
if (!existsSync(join(OUT, LOGO))) throw new Error('Jobbahn-Logo fehlt: ' + LOGO);

/* ---------- Bildmaterial (hochgeladene Fotos aus bilder/) ---------- */
function finde(prefix) {
  const f = readdirSync(join(ROOT, 'bilder')).find(n => n.normalize('NFC').startsWith(prefix));
  if (!f) throw new Error(`Bild "${prefix}…" nicht in bilder/ gefunden`);
  return '../../bilder/' + encodeURIComponent(f);
}
const FOTOS = {
  aufbereitung:   { src: finde('Neubau Aufbereitung'), w: 2560, h: 1211, fx: 0.34, fy: 0.42 },
  schwimmbaender: { src: finde('Schwimmb'),            w: 2000, h: 924,  fx: 0.70, fy: 0.40 },
  schwimmgreifer: { src: finde('Schwimmgreifer'),      w: 2560, h: 1183, fx: 0.33, fy: 0.50 }
};
function position(foto, bw, bh, tx = .5, ty = .5) {
  const s = Math.max(bw / foto.w, bh / foto.h), sw = foto.w * s, sh = foto.h * s;
  const px = sw > bw ? Math.min(Math.max(foto.fx * sw - bw * tx, 0), sw - bw) / (sw - bw) * 100 : 50;
  const py = sh > bh ? Math.min(Math.max(foto.fy * sh - bh * ty, 0), sh - bh) / (sh - bh) * 100 : 50;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

/* ---------- Icons ---------- */
const SVG = (p, sw = 2.2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const I = {
  pfeil: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  haken: '<path d="M20 6 9 17l-5-5"/>',
  euro:  '<path d="M18.5 6.5A7.5 7.5 0 1 0 18.5 17.5"/><path d="M3.5 10h10M3.5 14h10"/>',
  tel:   '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>'
};

/* ---------- Inhalte ---------- */
const STELLEN = [
  {
    key: 'mechatroniker', beruf: 'Mechatroniker',
    motive: {
      wetter: { foto: 'aufbereitung',
        sub: 'Mechatroniker (m/w/d) im Kieswerk. Viel draußen – auch wenn’s im Winter nass und ungemütlich wird.' },
      fell: { foto: 'schwimmbaender',
        sub: 'Regen, Wind und Matsch? Na und. Dafür lohnt sich der Job in Babenhausen richtig.' },
      check: { foto: 'schwimmgreifer',
        liste: ['Ausbildung als Mechatroniker oder Schlosser', 'Wetter? Ist dir egal.', 'Lieber Kieswerk als Großraumbüro', 'Du willst überdurchschnittlich verdienen'] }
    }
  },
  {
    key: 'geraetefuehrer', beruf: 'Geräteführer',
    motive: {
      wetter: { foto: 'schwimmbaender',
        sub: 'Geräteführer (m/w/d) im Kieswerk. Radlader und Schwimmgreifer – bei jedem Wetter.' },
      fell: { foto: 'schwimmgreifer',
        sub: 'Regen, Wind und Matsch? Na und. Dafür lohnt sich der Job in Babenhausen richtig.' },
      check: { foto: 'aufbereitung',
        liste: ['Du fährst Radlader & Co. sicher', 'Wetter? Ist dir egal.', 'Lieber Kieswerk als Großraumbüro', 'Du willst überdurchschnittlich verdienen'] }
    }
  }
];

/* ---------- Formate ----------
   story: oben 250 px / unten 340 px frei von Text und Logo (Safe Zones). */
const FORMATE = {
  'story-9x16':    { w: 1080, h: 1920, art: 'hoch',    padX: 72, top: 270, bottom: 340, fotoUnten: 620, logoH: 62, head: 176, sub: 38 },
  'feed-4x5':      { w: 1080, h: 1350, art: 'post',    padX: 64, top: 48,  bottom: 60,  fotoTop: 40,  fotoH: { wetter: 430, fell: 430, check: 360 }, logoH: 52, head: 150, sub: 33 },
  'feed-1x1':      { w: 1080, h: 1080, art: 'quadrat', padX: 60, top: 44,  bottom: 52,  fotoTop: 36,  fotoH: { wetter: 300, fell: 300, check: 240 }, logoH: 46, head: 128, sub: 30 },
  'quer-1200x628': { w: 1200, h: 628,  art: 'quer',    padX: 48, top: 36,  bottom: 40,  logoH: 38, head: 84, sub: 20 }
};

function seite(fmt, st, motivName, m) {
  const quer = fmt.art === 'quer', s = fmt.sub, W = fmt.w, H = fmt.h, foto = FOTOS[m.foto];
  const stelle = `${st.beruf} (m/w/d)`;

  /* Foto-Karte (abgerundet, mit Umlaufbahn) */
  const story = fmt.art === 'hoch';
  const fk = quer
    ? { x: Math.round(W * .555), y: 30, w: Math.round(W * .445) - 30, h: H - 60 }
    : story
      ? { x: fmt.padX, y: H - fmt.fotoUnten - 60, w: W - fmt.padX * 2, h: fmt.fotoUnten }   // Story: Foto füllt unten (Bild darf in die Safe Zone, Text nicht)
      : { x: fmt.padX, y: fmt.fotoTop, w: W - fmt.padX * 2, h: fmt.fotoH[motivName] };
  const r = quer ? 22 : 34;

  /* Text */
  const trust = `<div class="trust">${['Kostenlos', 'Ohne Lebenslauf', 'Wir rufen dich an'].map(t => `<span>${SVG(I.haken, 2.8)}${t}</span>`).join('')}</div>`;
  const cta = `<div class="cta">Jetzt bewerben ${SVG(I.pfeil, 2.8)}</div>`;
  const eyebrow = `<div class="eyebrow"><i></i>${stelle} · Kieswerk Babenhausen</div>`;
  let inhalt;
  if (motivName === 'wetter') {
    inhalt = `${eyebrow}<h1>Schlechtes<br>Wetter.<br><mark>Gutes Geld.</mark></h1>${story ? '' : `<p class="sub">${m.sub}</p>`}${trust}${cta}`;
  } else if (motivName === 'fell') {
    inhalt = `${eyebrow}<h1><span class="akzent">${st.beruf}</span><br>mit dickem<br>Fell gesucht.</h1>${story ? '' : `<p class="sub">${m.sub}</p>`}${trust}${cta}`;
  } else {
    inhalt = `${eyebrow}<h1>Passt das<br>zu dir?</h1><ul class="liste">${m.liste.map(t => `<li><b>${SVG(I.haken, 3.2)}</b>${t}</li>`).join('')}</ul><div class="alle">Alle Haken? Dann bewirb dich – wir rufen dich an.</div>${cta}`;
  }

  /* Karten auf dem Foto */
  const treffer = `<div class="treffer"><i></i><div><small>Neuer Treffer</small><b>${st.beruf} · Vollzeit · Babenhausen</b></div></div>`;
  const bezahlt = `<div class="bezahlt"><span>${SVG(I.euro, 2.4)}</span><div><b>Überdurchschnittlich bezahlt</b><small>Weil der Job es in sich hat.</small></div></div>`;
  const tape = `<div class="tape"><span>${quer ? 'Nichts für Schönwetter-Typen' : 'Achtung: Nichts für Schönwetter-Typen'}</span></div>`;
  const karten = { wetter: treffer + bezahlt, fell: bezahlt, check: treffer }[motivName];

  /* Textrahmen */
  const frame = quer
    ? { l: fmt.padX, t: fmt.top + fmt.logoH + 18, w: Math.round(W * .555) - fmt.padX - 34, b: fmt.bottom }
    : story
      ? { l: fmt.padX, t: fmt.top + fmt.logoH + 44, w: W - fmt.padX * 2, b: H - fk.y + (motivName === 'check' ? 40 : Math.round(s * .92 * 1.7) + 34) }
      : { l: fmt.padX, t: fk.y + fk.h + (motivName === 'check' ? Math.round(s * 1.4) : Math.round(s * .92 * 2.3 + s * .8)), w: W - fmt.padX * 2, b: fmt.bottom };
  const fotoPos = position(foto, fk.w, fk.h, quer ? .5 : .5, .5);

  /* Orbit-Ringe um die Foto-Karte */
  const cx = fk.x + fk.w / 2, cy = fk.y + fk.h / 2;
  const R1 = Math.max(fk.w, fk.h) * .62, R2 = R1 * 1.28;
  const orbits = `<svg class="orbits" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <ellipse cx="${cx}" cy="${cy}" rx="${R1 * 1.05}" ry="${R1 * .78}" fill="none" stroke="rgba(${JB.hellRgb},.30)" stroke-width="2"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${R2 * 1.05}" ry="${R2 * .80}" fill="none" stroke="rgba(${JB.hellRgb},.16)" stroke-width="2"/>
    <circle cx="${cx + R1 * 1.05 * Math.cos(-0.6)}" cy="${cy + R1 * .78 * Math.sin(-0.6)}" r="${quer ? 6 : 11}" fill="${JB.hell}"/>
    <circle cx="${cx + R2 * 1.05 * Math.cos(2.5)}" cy="${cy + R2 * .80 * Math.sin(2.5)}" r="${quer ? 4 : 7}" fill="${JB.blau}"/>
  </svg>`;

  /* Größen der Karten */
  const kS = quer ? 15 : Math.round(s * .78);       // Schrift Treffer-Karte
  const bS = quer ? 17 : Math.round(s * .92);       // Schrift Bezahlt-Karte

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONT}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{font-family:'Plus Jakarta Sans',sans-serif;color:#fff;position:relative;overflow:hidden;
  background:radial-gradient(60% 42% at ${quer ? '25% 50%' : story ? '30% 32%' : '28% 70%'},rgba(${JB.blauRgb},.62) 0%,rgba(${JB.blauRgb},0) 100%),
    radial-gradient(120% 80% at 85% 10%,#1A2B4D 0%,${JB.nacht} 46%,${JB.nacht2} 100%)}
.orbits{position:absolute;inset:0;z-index:1}
.foto{position:absolute;z-index:2;left:${fk.x}px;top:${fk.y}px;width:${fk.w}px;height:${fk.h}px;border-radius:${r}px;overflow:hidden;
  background:url('${foto.src}') ${fotoPos}/cover no-repeat;box-shadow:0 30px 80px rgba(0,0,0,.5),0 0 0 2px rgba(${JB.hellRgb},.35)}
.foto::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(11,18,32,.35) 0%,rgba(11,18,32,0) 30%,rgba(11,18,32,0) 70%,rgba(11,18,32,.35) 100%)}
.logo{position:absolute;z-index:6;${quer || story ? `left:${fmt.padX}px;top:${fmt.top}px;` : `left:${fk.x + 26}px;top:${fk.y + 24}px;background:rgba(11,18,32,.82);padding:${Math.round(fmt.logoH * .32)}px ${Math.round(fmt.logoH * .48)}px;border-radius:999px;border:1.5px solid rgba(${JB.hellRgb},.35);`}}
.logo img{display:block;height:${fmt.logoH}px;width:auto}

/* „Neuer Treffer“-Karte wie auf jobbahn.com */
.treffer{position:absolute;z-index:6;display:flex;align-items:center;gap:${Math.round(kS*.8)}px;background:rgba(11,18,32,.92);border:1.5px solid rgba(${JB.hellRgb},.45);
  border-radius:${Math.round(kS*.9)}px;padding:${Math.round(kS*.75)}px ${Math.round(kS*1.1)}px;box-shadow:0 18px 40px rgba(0,0,0,.45);
  ${quer ? `left:${fk.x + 20}px;top:${fk.y + 20}px;` : `right:${W - fk.x - fk.w + 24}px;top:${story ? fk.y + (motivName === 'check' ? 30 : Math.round(s * 2.4)) : fk.y + Math.round(fmt.logoH * 2.2)}px;`}}
.treffer i{width:${Math.round(kS*.75)}px;height:${Math.round(kS*.75)}px;border-radius:50%;background:${JB.gruen};box-shadow:0 0 0 ${Math.round(kS*.35)}px rgba(52,211,153,.22);flex:0 0 auto}
.treffer small{display:block;font-size:${Math.round(kS*.72)}px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:${JB.hellText}}
.treffer b{display:block;font-size:${kS}px;font-weight:800;white-space:nowrap}

/* Weiße Info-Karte (wie „Wir rufen dich an.“) – hier: Bezahlung */
.bezahlt{position:absolute;z-index:6;display:flex;align-items:center;gap:${Math.round(bS*.8)}px;background:#fff;color:${JB.nacht};border-radius:${Math.round(bS*1.1)}px;
  padding:${Math.round(bS*.85)}px ${Math.round(bS*1.2)}px ${Math.round(bS*.85)}px ${Math.round(bS*.9)}px;box-shadow:0 24px 50px rgba(0,0,0,.5);transform:rotate(-2deg);
  ${quer ? `left:${fk.x + 18}px;bottom:${50}px;` : `${motivName === 'fell' && !story ? `right:${W - fk.x - fk.w - 18}px;` : `left:${fk.x - 18}px;`}top:${story ? fk.y - Math.round(bS * 1.7) : fk.y + fk.h - Math.round(bS * 2.4)}px;`}}
.bezahlt span{width:${Math.round(bS*2.6)}px;height:${Math.round(bS*2.6)}px;border-radius:${Math.round(bS*.7)}px;background:${JB.blau};color:#fff;display:grid;place-items:center;flex:0 0 auto}
.bezahlt span svg{width:${Math.round(bS*1.5)}px;height:${Math.round(bS*1.5)}px}
.bezahlt b{display:block;font-size:${Math.round(bS*1.18)}px;font-weight:800;letter-spacing:-.01em;white-space:nowrap}
.bezahlt small{display:block;font-size:${Math.round(bS*.82)}px;font-weight:600;color:#4A5568;margin-top:2px}

/* Absperrband in Jobbahn-Blau */
.tape{position:absolute;z-index:5;left:${quer ? fk.x + 10 : -80}px;right:-80px;top:${quer ? Math.round(H * .30) : story ? fk.y + Math.round(bS * 2.6) + 100 : fk.y + Math.round(fk.h * .36)}px;transform:rotate(-6deg);
  background:${JB.blau};padding:${Math.round(s*.45)}px 0;box-shadow:0 14px 36px rgba(0,0,0,.45);white-space:nowrap;text-align:center;overflow:hidden}
.tape::before,.tape::after{content:"";position:absolute;left:0;right:0;height:${quer ? 8 : 13}px;background:repeating-linear-gradient(-45deg,#fff 0 ${quer ? 10 : 15}px,${JB.nacht} ${quer ? 10 : 15}px ${quer ? 20 : 30}px)}
.tape::before{top:0}.tape::after{bottom:0}
.tape span{display:inline-block;font-weight:800;font-size:${Math.round(s*1.08)}px;letter-spacing:.06em;text-transform:uppercase;padding:${quer ? 4 : 7}px 0}

.frame{position:absolute;z-index:4;left:${frame.l}px;width:${frame.w}px;top:${frame.t}px;bottom:${frame.b}px;display:flex;flex-direction:column;justify-content:${quer || story ? 'center' : 'flex-end'}}
.inner{display:flex;flex-direction:column}
.eyebrow{align-self:flex-start;display:inline-flex;align-items:center;gap:${Math.round(s*.4)}px;font-size:${Math.round(s*.66)}px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;
  color:${JB.hellText};border:1.5px solid rgba(${JB.hellRgb},.45);border-radius:999px;padding:${Math.round(s*.3)}px ${Math.round(s*.6)}px;margin-bottom:${Math.round(s*.7)}px}
.eyebrow i{width:${Math.round(s*.28)}px;height:${Math.round(s*.28)}px;border-radius:50%;background:${JB.hell}}
h1{font-size:${fmt.head}px;font-weight:800;line-height:1.0;letter-spacing:-.035em}
h1 .akzent{color:${JB.hell}}
h1 mark{background:${JB.hell};color:${JB.nacht2};padding:0 .14em .04em;border-radius:.12em;box-decoration-break:clone;-webkit-box-decoration-break:clone;
  box-shadow:0 14px 44px rgba(${JB.hellRgb},.55);line-height:1.18}
.sub{margin-top:${Math.round(s*.8)}px;font-size:${s}px;font-weight:500;line-height:1.42;color:${JB.text}}
.liste{list-style:none;margin-top:${Math.round(s*.8)}px;display:grid;gap:${Math.round(s*.45)}px}
.liste li{display:flex;align-items:center;gap:${Math.round(s*.5)}px;font-size:${Math.round(s*1.04)}px;font-weight:700;line-height:1.25}
.liste b{flex:0 0 auto;width:${Math.round(s*1.4)}px;height:${Math.round(s*1.4)}px;border-radius:50%;background:${JB.blau};color:#fff;display:grid;place-items:center;box-shadow:0 0 0 ${Math.round(s*.18)}px rgba(${JB.blauRgb},.3)}
.liste b svg{width:${Math.round(s*.8)}px;height:${Math.round(s*.8)}px}
.alle{margin-top:${Math.round(s*.8)}px;font-size:${s}px;font-weight:800;color:${JB.hell}}
.trust{display:flex;flex-wrap:wrap;gap:${Math.round(s*.35)}px ${Math.round(s*.8)}px;margin-top:${Math.round(s*.7)}px}
.trust span{display:inline-flex;align-items:center;gap:${Math.round(s*.25)}px;font-size:${Math.round(s*.78)}px;font-weight:700;color:${JB.text}}
.trust svg{width:${Math.round(s*.8)}px;height:${Math.round(s*.8)}px;color:${JB.hell}}
.cta{align-self:flex-start;display:inline-flex;align-items:center;gap:${Math.round(s*.45)}px;margin-top:${Math.round(s*1.0)}px;background:#fff;color:${JB.nacht};
  font-size:${Math.round(s*1.18)}px;font-weight:800;padding:${Math.round(s*.7)}px ${Math.round(s*1.2)}px;border-radius:${Math.round(s*.45)}px;box-shadow:0 16px 44px rgba(0,0,0,.4),0 0 0 ${Math.round(s*.18)}px rgba(${JB.hellRgb},.35)}
.cta svg{width:${s}px;height:${s}px;color:${JB.blau}}
.kante{position:absolute;left:0;right:0;bottom:0;height:${quer ? 7 : 12}px;background:linear-gradient(90deg,${JB.blau},${JB.hell})}
</style></head><body>
${orbits}
<div class="foto"></div>
<div class="logo"><img src="${LOGO}" alt="Jobbahn"></div>
${motivName === 'fell' && fmt.art !== 'quadrat' ? tape : ''}${karten}
<div class="frame"><div class="inner">${inhalt}</div></div>
<div class="kante"></div>
<script>
document.fonts.ready.then(function(){
  var h=document.querySelector('h1'), f=document.querySelector('.frame'), inn=document.querySelector('.inner');
  var px=parseFloat(getComputedStyle(h).fontSize), n=0;
  while((inn.offsetHeight>f.clientHeight || inn.scrollWidth>f.clientWidth) && px>28 && n++<100){ px-=2; h.style.fontSize=px+'px'; }
  document.documentElement.dataset.headpx=px;
  document.documentElement.dataset.ready='1';
});
</script></body></html>`;
}

/* ---------- Rendern + Prüfen ---------- */
const browser = await chromium.launch();
const erzeugt = [];
for (const st of STELLEN) {
  for (const [motivName, m] of Object.entries(st.motive)) {
    for (const [fmtName, fmt] of Object.entries(FORMATE)) {
      const ctx = await browser.newContext({ viewport: { width: fmt.w, height: fmt.h }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      writeFileSync(TMP, seite(fmt, st, motivName, m));
      await page.goto('file://' + TMP, { waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
      const info = await page.evaluate(([hoch]) => {
        const rect = s => { const e = document.querySelector(s); return e ? e.getBoundingClientRect() : null; };
        const hit = (a, b) => a && b && !(a.right <= b.left || a.left >= b.right || a.bottom <= b.top || a.top >= b.bottom);
        const t = rect('.inner');
        const kollision = ['.logo', '.treffer', '.bezahlt', '.tape'].filter(s => hit(t, rect(s)));
        /* Karten dürfen das Logo nicht verdecken */
        if (hit(rect('.logo'), rect('.treffer'))) kollision.push('Logo/Treffer');
        if (hit(rect('.tape'), rect('.treffer'))) kollision.push('Band/Treffer');
        if (hit(rect('.tape'), rect('.bezahlt'))) kollision.push('Band/Bezahlt');
        /* Story: Text und Logo nicht in den Safe Zones */
        const safe = [];
        if (hoch) for (const s of ['.logo', '.treffer', '.bezahlt', '.inner', '.tape span']) { const r = rect(s); if (r && (r.top < 250 || r.bottom > 1920 - 340)) safe.push(s); }
        return { headpx: document.documentElement.dataset.headpx, kollision, safe,
                 bilderOk: [...document.images].every(i => i.complete && i.naturalWidth > 0),
                 fotoOk: getComputedStyle(document.querySelector('.foto')).backgroundImage.includes('url(') };
      }, [fmt.art === 'hoch']);
      const datei = `${st.key}-${motivName}-${fmtName}.png`;
      if (!info.bilderOk || !info.fotoOk) throw new Error(datei + ': Bild nicht geladen');
      const fehler = [...info.kollision.map(k => 'Überlappung ' + k), ...info.safe.map(k => 'Safe Zone ' + k)];
      if (fehler.length && process.env.PRUEFEN !== '0') throw new Error(`${datei}: ${fehler.join(', ')}`);
      if (fehler.length) console.log('  WARNUNG ' + datei + ': ' + fehler.join(', '));
      await page.screenshot({ path: join(OUT, datei) });
      erzeugt.push(`${datei}  (Headline ${info.headpx}px)`);
      await ctx.close();
    }
  }
}
await browser.close();
rmSync(TMP, { force: true });
console.log(`${erzeugt.length} Dateien gerendert nach creatives/jobbahn/`);
erzeugt.forEach(d => console.log('  ' + d));
