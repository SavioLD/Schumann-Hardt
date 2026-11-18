/* =====================================================================
   CREATIVES SERIE 2 · Schumann & Hardt GmbH & Co. KG
   ---------------------------------------------------------------------
   Ehrlich UND verlockend: Rohstoffindustrie, viel draußen, im Winter
   auch mal nass und ungemütlich – dafür überdurchschnittlich bezahlt.
   Jedes Motiv: Stelle sofort erkennbar, ein starker Satz, wenig
   Kleingedrucktes, klarer CTA.

     node creatives/build-v2.mjs      -> creatives/v2/

   Ergebnis: je Stelle 3 Motive x 2 Formate (4:5, 9:16) = 12 Creatives
     wetter – „Schlechtes Wetter. Gutes Geld.“
     fell   – „<Stelle> mit dickem Fell gesucht.“ + Absperrband + Sticker
     check  – „Passt das zu dir?“ – Checkliste zum Selbst-Abhaken
   CI wie Karriereseite: Logo-Magenta, Anthrazit, Barlow / Barlow Condensed.
   Bildmaterial ausschließlich aus bilder/, Logo unverändert.
   ===================================================================== */

import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, readdirSync, existsSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const OUT  = join(HERE, 'v2');
const TMP  = join(OUT, '.render.html');
mkdirSync(OUT, { recursive: true });

const CI = { brand: '#b20058', brandRgb: '178,0,88', dunkel: '#26252a', akzent: '#f4a6c8' };

/* ---------- Schriften lokal einbetten ---------- */
const ff = (fam, w, file) =>
  `@font-face{font-family:'${fam}';font-style:normal;font-weight:${w};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(join(HERE, 'fonts', file)).toString('base64')}) format('woff2')}`;
const FONTS = [
  ...[500, 700, 800, 900].map(w => ff('Barlow', w, `barlow-latin-${w}-normal.woff2`)),
  ...[700, 800, 900].map(w => ff('Barlow Condensed', w, `barlow-condensed-latin-${w}-normal.woff2`))
].join('\n');

/* ---------- Bildmaterial ---------- */
function finde(prefix) {
  const f = readdirSync(join(ROOT, 'bilder')).find(n => n.normalize('NFC').startsWith(prefix));
  if (!f) throw new Error(`Bild "${prefix}…" nicht in bilder/ gefunden`);
  return 'bilder/' + f;
}
const url = rel => '../../' + rel.split('/').map(encodeURIComponent).join('/');
const FOTOS = {
  aufbereitung:   { src: finde('Neubau Aufbereitung'), w: 2560, h: 1211, fx: 0.34, fy: 0.42 },
  schwimmbaender: { src: finde('Schwimmb'),            w: 2000, h: 924,  fx: 0.70, fy: 0.38 },
  schwimmgreifer: { src: finde('Schwimmgreifer'),      w: 2560, h: 1183, fx: 0.33, fy: 0.50 }
};
const LOGO = 'bilder/logo-hd.png';
if (!existsSync(join(ROOT, LOGO))) throw new Error('Logo fehlt: ' + LOGO);
function position(foto, bw, bh, tx = .5, ty = .5) {
  const s = Math.max(bw / foto.w, bh / foto.h), sw = foto.w * s, sh = foto.h * s;
  const px = sw > bw ? Math.min(Math.max(foto.fx * sw - bw * tx, 0), sw - bw) / (sw - bw) * 100 : 50;
  const py = sh > bh ? Math.min(Math.max(foto.fy * sh - bh * ty, 0), sh - bh) / (sh - bh) * 100 : 50;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

/* ---------- Icons ---------- */
const ICON = {
  schild: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
  werk:   '<path d="M2 20h20"/><path d="M4 20V10l5 3v-3l5 3V5h6v15"/>',
  pin:    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'
};
const PFEIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const HAKEN = `<svg viewBox="0 0 24 24" fill="none" stroke="${CI.brand}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

/* ---------- Stellen + Motive ---------- */
const STELLEN = [
  {
    key: 'mechatroniker',
    motive: {
      wetter: {
        foto: 'aufbereitung',
        callout: 'Mechatroniker (m/w/d) gesucht',
        sub: 'Viel draußen im Kieswerk – auch wenn’s im Winter nass und ungemütlich wird. Dafür zahlen wir überdurchschnittlich.',
        proofs: [['schild', 'Sicherer Job mit Zukunft'], ['pin', 'Babenhausen']]
      },
      fell: {
        foto: 'schwimmbaender',
        head: '<span class="akzent">Mechatroniker</span><br>mit dickem Fell<br>gesucht.',
        sub: 'Regen, Wind und Matsch schrecken dich nicht? Dann bist du im Kieswerk am Haselsee genau richtig.'
      },
      check: {
        foto: 'schwimmgreifer',
        callout: 'Mechatroniker (m/w/d) · Babenhausen',
        liste: ['Ausbildung als Mechatroniker oder Schlosser',
                'Wetter? Ist dir egal.',
                'Lieber Kieswerk als Großraumbüro',
                'Du willst überdurchschnittlich verdienen']
      }
    }
  },
  {
    key: 'geraetefuehrer',
    motive: {
      wetter: {
        foto: 'schwimmbaender',
        callout: 'Geräteführer (m/w/d) gesucht',
        sub: 'Radlader, Schwimmgreifer, Aufbereitung – draußen, bei jedem Wetter. Dafür zahlen wir überdurchschnittlich.',
        proofs: [['schild', 'Sicherer Job mit Zukunft'], ['pin', 'Babenhausen']]
      },
      fell: {
        foto: 'schwimmgreifer',
        head: '<span class="akzent">Geräteführer</span><br>mit dickem Fell<br>gesucht.',
        sub: 'Regen, Wind und Matsch schrecken dich nicht? Dann gehören Radlader und Schwimmgreifer bald dir.'
      },
      check: {
        foto: 'aufbereitung',
        callout: 'Geräteführer (m/w/d) · Babenhausen',
        liste: ['Du fährst Radlader & Co. sicher',
                'Wetter? Ist dir egal.',
                'Lieber Kieswerk als Großraumbüro',
                'Du willst überdurchschnittlich verdienen']
      }
    }
  }
];

/* ---------- Formate – alles, was Meta für die Platzierungen braucht ----------
   story-9x16     Stories + Reels (Facebook, Instagram, Messenger).
                  Oben 250 px und unten 340 px frei von Text/Logo (Safe Zones).
   feed-4x5       Feed Instagram + Facebook (empfohlenes Feed-Format)
   feed-1x1       Quadrat: rechte Spalte, Marketplace, Suche, Feed-Alternative
   quer-1200x628  Querformat 1,91:1: Link-Anzeigen, rechte Spalte, In-Article,
                  Audience Network – eigenes Layout (Text links, Foto rechts) */
const FORMATE = {
  'story-9x16':    { w: 1080, h: 1920, art: 'hoch',    top: 270, bottom: 340, padX: 72, logoH: 100, head: 176, sub: 38, sticker: 270, call: 52 },
  'feed-4x5':      { w: 1080, h: 1350, art: 'post',    top: 48,  bottom: 60,  padX: 64, logoH: 88,  head: 156, sub: 34, sticker: 250, call: 46 },
  'feed-1x1':      { w: 1080, h: 1080, art: 'quadrat', top: 44,  bottom: 52,  padX: 60, logoH: 80,  head: 144, sub: 31, sticker: 220, call: 42 },
  'quer-1200x628': { w: 1200, h: 628,  art: 'quer',    top: 34,  bottom: 40,  padX: 50, logoH: 56,  head: 100, sub: 21, sticker: 150, call: 27 }
};

function seite(fmt, motivName, m) {
  if (fmt.art === 'quer') return quer(fmt, motivName, m);
  const s = fmt.sub, foto = FOTOS[m.foto];
  const k = o => o[fmt.art];   // Wert je Format (hoch / post / quadrat)
  const fotoH = { wetter: Math.round(fmt.h * k({ hoch: .43, post: .46, quadrat: .40 })), fell: fmt.h, check: Math.round(fmt.h * k({ hoch: .40, post: .36, quadrat: .30 })) }[motivName];
  const frameTop = { wetter: fotoH - k({ hoch: 150, post: 150, quadrat: 130 }), fell: Math.round(fmt.h * k({ hoch: .385, post: .41, quadrat: .42 })), check: fotoH - 110 }[motivName];
  const verlauf = {
    wetter: 'linear-gradient(180deg,rgba(29,28,32,0) 45%,rgba(38,37,42,.7) 78%,#26252a 100%)',
    fell:   'linear-gradient(180deg,rgba(29,28,32,.08) 0%,rgba(29,28,32,.15) 28%,rgba(29,28,32,.82) 50%,rgba(38,37,42,.97) 64%,#26252a 100%)',
    check:  'linear-gradient(180deg,rgba(29,28,32,0) 40%,rgba(38,37,42,.75) 80%,#26252a 100%)'
  }[motivName];

  const callout = m.callout ? `<div class="callout">${m.callout}</div>` : '';
  const proofs = m.proofs ? `<div class="proofs">${m.proofs.map(([i, t]) => `<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[i]}</svg>${t}</span>`).join('')}</div>` : '';
  const cta = `<div class="ctawrap"><div class="cta">Jetzt in 60 Sek. bewerben ${PFEIL}</div><div class="ohne">Ohne Anschreiben.<br>Ohne Lebenslauf.</div></div>`;

  let inhalt = '', deko = '';
  if (motivName === 'wetter') {
    inhalt = `${callout}<h1 class="bloecke"><span class="b1">Schlechtes</span><br><span class="b1">Wetter.</span><br><span class="b2">Gutes Geld.</span></h1><p class="sub">${m.sub}</p>${proofs}${cta}`;
  } else if (motivName === 'fell') {
    deko = `<div class="sticker"><div><small>Überdurch-<br>schnittlich</small><b>bezahlt</b></div></div><div class="tape"><span>· Achtung: Nichts für Schönwetter-Typen ·</span></div>`;
    inhalt = `<h1>${m.head}</h1><p class="sub">${m.sub}</p>${cta}`;
  } else {
    inhalt = `${callout}<h1>Passt das<br>zu dir?</h1><ul class="liste">${m.liste.map(t => `<li><i>${HAKEN}</i><span>${t}</span></li>`).join('')}</ul><div class="alle">Alle Haken gesetzt? Dann suchen wir dich.</div>${cta}`;
  }

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${fmt.w}px;height:${fmt.h}px}
body{font-family:Barlow,sans-serif;color:#fff;background:${CI.dunkel};position:relative;overflow:hidden}
.foto{position:absolute;left:0;right:0;top:0;height:${fotoH}px;background:url('${url(foto.src)}') ${position(foto, fmt.w, fotoH)}/cover no-repeat}
.foto::after{content:"";position:absolute;inset:0;background:${verlauf}}
.logo{position:absolute;z-index:5;left:${fmt.padX}px;top:${fmt.top}px;background:#fff;border-radius:18px;padding:${Math.round(fmt.logoH*.16)}px ${Math.round(fmt.logoH*.24)}px;box-shadow:0 10px 34px rgba(0,0,0,.3)}
.logo img{display:block;height:${fmt.logoH}px;width:auto}

.sticker{position:absolute;z-index:6;right:${fmt.padX - 10}px;top:${fmt.top - 8}px;width:${fmt.sticker}px;height:${fmt.sticker}px;border-radius:50%;
  background:${CI.brand};display:grid;place-items:center;text-align:center;transform:rotate(11deg);
  box-shadow:0 18px 44px rgba(0,0,0,.45),inset 0 0 0 9px ${CI.brand},inset 0 0 0 12px rgba(255,255,255,.9)}
.sticker div{font-family:'Barlow Condensed';text-transform:uppercase;line-height:.9}
.sticker small{display:block;font-weight:800;font-size:${Math.round(fmt.sticker*.15)}px}
.sticker b{display:block;font-weight:900;font-size:${Math.round(fmt.sticker*.235)}px;margin-top:6px}
.tape{position:absolute;z-index:4;left:-80px;right:-80px;top:${Math.round(fmt.h * k({ hoch: .275, post: .30, quadrat: .235 }))}px;transform:rotate(-6deg);
  background:${CI.brand};padding:${Math.round(s*.42)}px 0;box-shadow:0 14px 40px rgba(0,0,0,.45);overflow:hidden;white-space:nowrap;text-align:center}
.tape::before,.tape::after{content:"";position:absolute;left:0;right:0;height:14px;background:repeating-linear-gradient(-45deg,#fff 0 16px,${CI.dunkel} 16px 32px)}
.tape::before{top:0}.tape::after{bottom:0}
.tape span{display:inline-block;font-family:'Barlow Condensed';font-weight:900;font-size:${Math.round(s*1.42)}px;letter-spacing:.04em;text-transform:uppercase;padding:8px 0}

.frame{position:absolute;z-index:3;left:${fmt.padX}px;right:${fmt.padX}px;top:${frameTop}px;bottom:${fmt.bottom}px;display:flex;flex-direction:column;justify-content:flex-end}
.inner{display:flex;flex-direction:column}
/* Stelle sofort erkennbar */
.callout{align-self:flex-start;background:${CI.brand};font-family:'Barlow Condensed';font-weight:900;font-size:${fmt.call}px;line-height:1;text-transform:uppercase;letter-spacing:.02em;
  padding:${Math.round(fmt.call*.24)}px ${Math.round(fmt.call*.42)}px;border-radius:10px;margin-bottom:${Math.round(s*.85)}px;box-shadow:0 10px 30px rgba(${CI.brandRgb},.45)}
h1{font-family:'Barlow Condensed';font-weight:900;font-size:${fmt.head}px;line-height:.9;text-transform:uppercase;letter-spacing:-.005em;text-shadow:0 6px 30px rgba(0,0,0,.35)}
h1 .akzent{color:${CI.akzent}}
/* Plakat-Optik: jede Zeile auf eigenem Farbblock */
h1.bloecke{line-height:1.13;text-shadow:none;transform:rotate(-2deg);transform-origin:left bottom;margin-bottom:.06em}
h1.bloecke span{padding:0 .13em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
h1.bloecke .b1{background:#fff;color:${CI.dunkel}}
h1.bloecke .b2{background:${CI.brand};color:#fff}
.sub{margin-top:${Math.round(s*.85)}px;font-weight:600;font-size:${s}px;line-height:1.35;color:#ecebef;max-width:97%}
.proofs{display:flex;flex-wrap:wrap;gap:12px 26px;margin-top:${Math.round(s*.75)}px}
.proofs span{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:${Math.round(s*.92)}px}
.proofs svg{width:${s}px;height:${s}px;color:${CI.akzent}}
.liste{list-style:none;margin-top:${Math.round(s*.9)}px;display:grid;gap:${Math.round(s*.5)}px}
.liste li{display:flex;align-items:center;gap:18px;font-weight:800;font-size:${Math.round(s*1.12)}px;line-height:1.2}
.liste i{flex:0 0 auto;width:${s + 22}px;height:${s + 22}px;border-radius:9px;background:#fff;display:grid;place-items:center;box-shadow:0 6px 18px rgba(0,0,0,.3)}
.liste i svg{width:${s}px;height:${s}px}
.alle{margin-top:${Math.round(s*.9)}px;font-weight:800;font-size:${Math.round(s*1.05)}px;color:${CI.akzent}}
.ctawrap{display:flex;align-items:center;gap:22px;margin-top:${Math.round(s*1.05)}px}
.cta{display:inline-flex;align-items:center;gap:16px;background:${CI.brand};color:#fff;font-weight:900;font-size:${Math.round(s*1.15)}px;
  padding:${Math.round(s*.72)}px ${Math.round(s*1.15)}px;border-radius:14px;box-shadow:0 16px 44px rgba(${CI.brandRgb},.5);white-space:nowrap}
.cta svg{width:${s+2}px;height:${s+2}px}
.ohne{font-weight:700;font-size:${Math.round(s*.72)}px;line-height:1.3;color:#c9c8ce}
.kante{position:absolute;left:0;right:0;bottom:0;height:12px;background:${CI.brand}}
</style></head><body>
<div class="foto"></div>
<div class="logo"><img src="${url(LOGO)}" alt=""></div>
${deko}
<div class="frame"><div class="inner">${inhalt}</div></div>
<div class="kante"></div>
<script>
/* Erst nach dem Laden der Schrift messen, dann Headline so groß wie möglich. */
document.fonts.ready.then(function(){
  var h=document.querySelector('h1'), f=document.querySelector('.frame'), inn=document.querySelector('.inner');
  var px=parseFloat(getComputedStyle(h).fontSize), n=0;
  while((inn.offsetHeight>f.clientHeight || inn.scrollWidth>f.clientWidth) && px>50 && n++<90){ px-=2; h.style.fontSize=px+'px'; }
  document.documentElement.dataset.headpx=px;
  document.documentElement.dataset.ready='1';
});
</script></body></html>`;
}

/* ---------- Querformat 1,91:1 – Text links, Foto rechts ---------- */
function quer(fmt, motivName, m) {
  const s = fmt.sub, foto = FOTOS[m.foto], W = fmt.w, H = fmt.h;
  const voll = motivName === 'fell';                  // fell: Foto vollflächig, Text auf Verlauf
  const fotoL = voll ? 0 : Math.round(W * .46);
  const fotoW = W - fotoL;
  const pos = voll ? position(foto, W, H, .74, .5) : position(foto, fotoW, H, .58, .5);
  const callout = m.callout ? `<div class="callout">${m.callout}</div>` : '';
  const cta = `<div class="ctawrap"><div class="cta">Jetzt in 60 Sek. bewerben ${PFEIL}</div><div class="ohne">Ohne Anschreiben.<br>Ohne Lebenslauf.</div></div>`;
  let inhalt = '', deko = '';
  if (motivName === 'wetter') {
    inhalt = `${callout}<h1 class="bloecke"><span class="b1">Schlechtes Wetter.</span><br><span class="b2">Gutes Geld.</span></h1><p class="sub">${m.sub}</p>${cta}`;
  } else if (motivName === 'fell') {
    deko = `<div class="sticker"><div><small>Überdurch-<br>schnittlich</small><b>bezahlt</b></div></div><div class="tape"><span>· Achtung: Nichts für Schönwetter-Typen ·</span></div>`;
    inhalt = `<h1>${m.head}</h1><p class="sub">${m.sub}</p>${cta}`;
  } else {
    inhalt = `${callout}<h1>Passt das zu dir?</h1><ul class="liste">${m.liste.map(t => `<li><i>${HAKEN}</i><span>${t}</span></li>`).join('')}</ul><div class="alle">Alle Haken gesetzt? Dann suchen wir dich.</div>${cta}`;
  }
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px}
body{font-family:Barlow,sans-serif;color:#fff;background:${CI.dunkel};position:relative;overflow:hidden}
.foto{position:absolute;top:0;bottom:0;left:${fotoL}px;width:${fotoW}px;background:url('${url(foto.src)}') ${pos}/cover no-repeat;
  ${voll ? '' : '-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 150px);mask-image:linear-gradient(90deg,transparent 0,#000 150px);'}}
${voll ? `.foto::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(29,28,32,.97) 0%,rgba(29,28,32,.92) 36%,rgba(29,28,32,.35) 62%,rgba(29,28,32,.08) 100%)}` : ''}
.logo{position:absolute;z-index:5;right:${fmt.padX}px;top:${fmt.top}px;background:#fff;border-radius:12px;padding:${Math.round(fmt.logoH*.16)}px ${Math.round(fmt.logoH*.24)}px;box-shadow:0 8px 26px rgba(0,0,0,.3)}
.logo img{display:block;height:${fmt.logoH}px;width:auto}
.sticker{position:absolute;z-index:6;right:${fmt.padX - 6}px;bottom:${fmt.bottom - 4}px;width:${fmt.sticker}px;height:${fmt.sticker}px;border-radius:50%;
  background:${CI.brand};display:grid;place-items:center;text-align:center;transform:rotate(11deg);
  box-shadow:0 12px 32px rgba(0,0,0,.45),inset 0 0 0 6px ${CI.brand},inset 0 0 0 8px rgba(255,255,255,.9)}
.sticker div{font-family:'Barlow Condensed';text-transform:uppercase;line-height:.9}
.sticker small{display:block;font-weight:800;font-size:${Math.round(fmt.sticker*.15)}px}
.sticker b{display:block;font-weight:900;font-size:${Math.round(fmt.sticker*.235)}px;margin-top:4px}
.tape{position:absolute;z-index:4;left:${Math.round(W*.53)}px;right:-60px;top:${Math.round(H*.40)}px;transform:rotate(-7deg);
  background:${CI.brand};padding:${Math.round(s*.5)}px 0;box-shadow:0 10px 30px rgba(0,0,0,.45);overflow:hidden;white-space:nowrap;text-align:center}
.tape::before,.tape::after{content:"";position:absolute;left:0;right:0;height:9px;background:repeating-linear-gradient(-45deg,#fff 0 11px,${CI.dunkel} 11px 22px)}
.tape::before{top:0}.tape::after{bottom:0}
.tape span{display:inline-block;font-family:'Barlow Condensed';font-weight:900;font-size:${Math.round(s*1.3)}px;letter-spacing:.04em;text-transform:uppercase;padding:5px 0}
.frame{position:absolute;z-index:3;left:${fmt.padX}px;width:${Math.round(W * (voll ? .50 : .46)) - fmt.padX}px;top:${fmt.top}px;bottom:${fmt.bottom}px;display:flex;flex-direction:column;justify-content:center}
.inner{display:flex;flex-direction:column}
.callout{align-self:flex-start;background:${CI.brand};font-family:'Barlow Condensed';font-weight:900;font-size:${fmt.call}px;line-height:1;text-transform:uppercase;letter-spacing:.02em;
  padding:${Math.round(fmt.call*.24)}px ${Math.round(fmt.call*.42)}px;border-radius:7px;margin-bottom:${Math.round(s*.8)}px;box-shadow:0 8px 22px rgba(${CI.brandRgb},.45)}
h1{font-family:'Barlow Condensed';font-weight:900;font-size:${fmt.head}px;line-height:.9;text-transform:uppercase;letter-spacing:-.005em}
h1 .akzent{color:${CI.akzent}}
h1.bloecke{line-height:1.13;transform:rotate(-2deg);transform-origin:left bottom;margin-bottom:.06em}
h1.bloecke span{padding:0 .13em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
h1.bloecke .b1{background:#fff;color:${CI.dunkel}}
h1.bloecke .b2{background:${CI.brand};color:#fff}
.sub{margin-top:${Math.round(s*.8)}px;font-weight:600;font-size:${s}px;line-height:1.35;color:#ecebef}
.liste{list-style:none;margin-top:${Math.round(s*.75)}px;display:grid;gap:${Math.round(s*.42)}px}
.liste li{display:flex;align-items:center;gap:12px;font-weight:800;font-size:${s}px;line-height:1.2}
.liste i{flex:0 0 auto;width:${s + 12}px;height:${s + 12}px;border-radius:6px;background:#fff;display:grid;place-items:center}
.liste i svg{width:${s - 2}px;height:${s - 2}px}
.alle{margin-top:${Math.round(s*.7)}px;font-weight:800;font-size:${s}px;color:${CI.akzent}}
.ctawrap{display:flex;align-items:center;gap:14px;margin-top:${Math.round(s*1.0)}px}
.cta{display:inline-flex;align-items:center;gap:10px;background:${CI.brand};color:#fff;font-weight:900;font-size:${Math.round(s*1.08)}px;
  padding:${Math.round(s*.62)}px ${Math.round(s*.95)}px;border-radius:10px;box-shadow:0 10px 28px rgba(${CI.brandRgb},.5);white-space:nowrap}
.cta svg{width:${s}px;height:${s}px}
.ohne{font-weight:700;font-size:${Math.round(s*.68)}px;line-height:1.3;color:#c9c8ce}
.kante{position:absolute;left:0;right:0;bottom:0;height:8px;background:${CI.brand}}
</style></head><body>
<div class="foto"></div>
<div class="logo"><img src="${url(LOGO)}" alt=""></div>
${deko}
<div class="frame"><div class="inner">${inhalt}</div></div>
<div class="kante"></div>
<script>
document.fonts.ready.then(function(){
  var h=document.querySelector('h1'), f=document.querySelector('.frame'), inn=document.querySelector('.inner');
  var px=parseFloat(getComputedStyle(h).fontSize), n=0;
  while((inn.offsetHeight>f.clientHeight || inn.scrollWidth>f.clientWidth) && px>30 && n++<90){ px-=2; h.style.fontSize=px+'px'; }
  document.documentElement.dataset.headpx=px;
  document.documentElement.dataset.ready='1';
});
</script></body></html>`;
}

/* ---------- Rendern ---------- */
const browser = await chromium.launch();
const erzeugt = [];
for (const st of STELLEN) {
  for (const [motivName, m] of Object.entries(st.motive)) {
    for (const [fmtName, fmt] of Object.entries(FORMATE)) {
      const ctx = await browser.newContext({ viewport: { width: fmt.w, height: fmt.h }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      writeFileSync(TMP, seite(fmt, motivName, m));
      await page.goto('file://' + TMP, { waitUntil: 'load' });
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
      const info = await page.evaluate(() => ({
        headpx: document.documentElement.dataset.headpx,
        bilderOk: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        kollision: (function(){
          var t = document.querySelector('.inner').getBoundingClientRect();
          return ['.logo', '.sticker', '.tape'].filter(function(sel){
            var el = document.querySelector(sel); if (!el) return false;
            var r = el.getBoundingClientRect();
            return !(r.right <= t.left || r.left >= t.right || r.bottom <= t.top || r.top >= t.bottom);
          });
        })()
      }));
      if (!info.bilderOk) throw new Error('Bild nicht geladen: ' + st.key + '/' + motivName);
      if (info.kollision.length) throw new Error(`${st.key}/${motivName}/${fmtName}: Text berührt ${info.kollision.join(', ')}`);
      const datei = `${st.key}-${motivName}-${fmtName}.png`;
      await page.screenshot({ path: join(OUT, datei) });
      erzeugt.push(`${datei}  (Headline ${info.headpx}px)`);
      await ctx.close();
    }
  }
}
await browser.close();
rmSync(TMP, { force: true });
console.log(`${erzeugt.length} Dateien gerendert nach creatives/v2/`);
erzeugt.forEach(d => console.log('  ' + d));
