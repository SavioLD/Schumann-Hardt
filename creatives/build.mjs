/* =====================================================================
   CREATIVE-GENERATOR · Schumann & Hardt GmbH & Co. KG
   ---------------------------------------------------------------------
   Rendert alle Meta-Ads-Creatives und die beiden Facebook-Bilder aus
   einer Config – im CI der Karriereseite (gleiche Farben, gleiche
   Schrift Barlow, lokal eingebettet -> offline identisch).

     node creatives/build.mjs

   Ergebnis: je Stelle 3 Motive x 2 Formate (4:5, 9:16) = 12 Creatives
             + facebook-profilbild.png + facebook-titelbild.png

   Bildmaterial: AUSSCHLIESSLICH die hochgeladenen Dateien aus bilder/.
   Das Logo wird unverändert eingesetzt (bilder/logo-hd.png = Original,
   nur transparenter Rand entfernt) – nicht nachgebaut, nicht eingefärbt,
   Seitenverhältnis bleibt.
   ===================================================================== */

import { chromium } from '/opt/node-tools/node_modules/playwright/index.mjs';
import { readFileSync, readdirSync, existsSync, writeFileSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const TMP  = join(HERE, '.render.html');   // temporäre Render-Datei, wird am Ende gelöscht

/* ---------- CI (identisch mit dem :root-Block in index.html) ---------- */
const CI = {
  brand:    '#b20058',   // Logo-Magenta
  brandRgb: '178,0,88',
  grau:     '#817f84',   // Logo-Grau
  dunkel:   '#26252a',   // Anthrazit aus dem Logo-Grau
  dunkel2:  '#1d1c20',
  akzent:   '#f4a6c8',   // Magenta-Ton als Text auf Anthrazit
  hell:     '#f1f0f3'
};

/* ---------- Schrift lokal einbetten ---------- */
const font = w =>
  `@font-face{font-family:Barlow;font-style:normal;font-weight:${w};font-display:block;` +
  `src:url(data:font/woff2;base64,${readFileSync(join(HERE, 'fonts', `barlow-latin-${w}-normal.woff2`)).toString('base64')}) format('woff2')}`;
const FONTS = [500, 700, 800, 900].map(font).join('\n');

/* ---------- Bildmaterial ---------- */
/* Dateien werden über den Namensanfang gefunden – "Schwimmbänder" liegt
   mit einem beim Upload verunstalteten Umlaut im Repo. */
function finde(prefix) {
  const f = readdirSync(join(ROOT, 'bilder')).find(n => n.normalize('NFC').startsWith(prefix));
  if (!f) throw new Error(`Bild "${prefix}…" nicht in bilder/ gefunden`);
  return 'bilder/' + f;
}
const url = rel => '../' + rel.split('/').map(encodeURIComponent).join('/');

/* fx/fy = Bildmittelpunkt des Motivs (0..1) – darauf wird zugeschnitten. */
const FOTOS = {
  aufbereitung:   { src: finde('Neubau Aufbereitung'), w: 2560, h: 1211, fx: 0.34, fy: 0.42 },  // Aufbereitungsanlage, Förderbänder, Silos
  schwimmbaender: { src: finde('Schwimmb'),            w: 2000, h: 924,  fx: 0.74, fy: 0.42 },  // Schwimmbänder auf dem See
  schwimmgreifer: { src: finde('Schwimmgreifer'),      w: 2560, h: 1183, fx: 0.33, fy: 0.52 }   // Schwimmgreifer
};
const LOGO = 'bilder/logo-hd.png';
if (!existsSync(join(ROOT, LOGO))) throw new Error('Logo fehlt: ' + LOGO);

/* background-position so berechnen, dass (fx,fy) möglichst mittig sitzt. */
function position(foto, bw, bh) {
  const s = Math.max(bw / foto.w, bh / foto.h);
  const sw = foto.w * s, sh = foto.h * s;
  const px = sw > bw ? Math.min(Math.max(foto.fx * sw - bw / 2, 0), sw - bw) / (sw - bw) * 100 : 50;
  const py = sh > bh ? Math.min(Math.max(foto.fy * sh - bh / 2, 0), sh - bh) / (sh - bh) * 100 : 50;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

/* ---------- Stellen + Motive ----------
   Drei unterschiedliche Ansätze je Stelle, alle auf Qualität statt Masse:
   jedes Motiv nennt die Hürde (Ausbildung bzw. sicherer Umgang mit
   Großgeräten) – wer sie nicht erfüllt, klickt gar nicht erst. */
const CHIPS = ['Vollzeit', 'Sicherer Arbeitsplatz', 'Zukunftsorientiert'];
const STELLEN = [
  {
    key: 'mechatroniker',
    motive: {
      stelle: {
        foto: 'aufbereitung',
        eyebrow: 'Wir stellen ein · Babenhausen',
        head: 'Mechatroniker (m/w/d)<br><span class="akzent">für unser Kieswerk.</span>',
        sub: 'Du hältst moderne Aufbereitungsanlagen am Laufen – mit abgeschlossener Ausbildung als Mechatroniker oder Schlosser.',
        chips: CHIPS,
        cta: 'In 60 Sekunden bewerben'
      },
      check: {
        foto: 'schwimmbaender',
        eyebrow: 'Mechatroniker (m/w/d) · Passt das zu dir?',
        head: 'Du hältst Anlagen am Laufen, <span class="akzent">bevor sie stehen?</span>',
        liste: ['Abgeschlossene Ausbildung als Mechatroniker oder Schlosser',
                'Aus Industrie-, Landmaschinen- oder Aufbereitungstechnik',
                'Bereit für Vollzeit im Kieswerk'],
        cta: 'Dann sollten wir reden'
      },
      benefit: {
        foto: 'schwimmgreifer',
        eyebrow: 'Sicherer Job gesucht?',
        head: 'Sand und Kies werden immer gebraucht. <span class="akzent">Du&nbsp;auch.</span>',
        sub: 'Mechatroniker (m/w/d) mit abgeschlossener Ausbildung – für unser Kieswerk am Haselsee in Babenhausen.',
        chips: ['Vollzeit', 'Sicherer Arbeitsplatz', 'Moderne Anlagen'],
        cta: 'Jetzt bewerben'
      }
    }
  },
  {
    key: 'geraetefuehrer',
    motive: {
      stelle: {
        foto: 'schwimmgreifer',
        eyebrow: 'Wir stellen ein · Babenhausen',
        head: 'Geräteführer (m/w/d)<br><span class="akzent">für unser Kieswerk.</span>',
        sub: 'Radlader, Schwimmgreifer, Aufbereitungsanlagen: Du bedienst Großgeräte sicher und verstehst Baustoffe.',
        chips: CHIPS,
        cta: 'In 60 Sekunden bewerben'
      },
      check: {
        foto: 'schwimmbaender',
        eyebrow: 'Geräteführer (m/w/d) · Passt das zu dir?',
        head: 'Radlader, Bagger, Schwimmgreifer – <span class="akzent">du hast sie im Griff?</span>',
        liste: ['Sicherer Umgang mit Großgeräten und Spezialmaschinen',
                'Verständnis für Baustoffe und Aufbereitung',
                'Bereit für Vollzeit im Kieswerk'],
        cta: 'Dann sollten wir reden'
      },
      benefit: {
        foto: 'aufbereitung',
        eyebrow: 'Sicherer Job gesucht?',
        head: 'Sand und Kies werden immer gebraucht. <span class="akzent">Du&nbsp;auch.</span>',
        sub: 'Geräteführer (m/w/d) mit Erfahrung an Großgeräten – für unser Kieswerk am Haselsee in Babenhausen.',
        chips: ['Vollzeit', 'Sicherer Arbeitsplatz', 'Moderne Anlagen'],
        cta: 'Jetzt bewerben'
      }
    }
  }
];

/* ---------- Formate ----------
   9:16: oben 250 px und unten 340 px bleiben frei von Text/Logo
   (Safe Zones für Stories/Reels – dort liegen Profil, Buttons, Caption). */
const FORMATE = {
  '4x5':  { w: 1080, h: 1350, fotoH: 620, logoTop: 48,  logoH: 92,  padX: 64, padBottom: 64,  headPx: 76, subPx: 31, gap: 26 },
  '9x16': { w: 1080, h: 1920, fotoH: 1000, logoTop: 270, logoH: 108, padX: 72, padBottom: 340, headPx: 90, subPx: 35, gap: 30 }
};

/* ---------- Template Creative ---------- */
const PFEIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
const HAKEN = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

function creative(fmt, m) {
  const foto = FOTOS[m.foto];
  const chips = m.chips ? `<div class="chips">${m.chips.map(c => `<span class="chip">${c}</span>`).join('')}</div>` : '';
  const liste = m.liste ? `<ul class="liste">${m.liste.map(l => `<li><i>${HAKEN}</i><span>${l}</span></li>`).join('')}</ul>` : '';
  const sub = m.sub ? `<p class="sub">${m.sub}</p>` : '';
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${fmt.w}px;height:${fmt.h}px}
body{font-family:Barlow,sans-serif;color:#fff;background:${CI.dunkel};position:relative;overflow:hidden}
.foto{position:absolute;left:0;right:0;top:0;height:${fmt.fotoH}px;
  background:url('${url(foto.src)}') ${position(foto, fmt.w, fmt.fotoH)}/cover no-repeat}
/* Foto läuft weich ins Anthrazit aus */
.foto::after{content:"";position:absolute;left:0;right:0;bottom:0;height:46%;
  background:linear-gradient(180deg,rgba(38,37,42,0) 0%,rgba(38,37,42,.72) 62%,${CI.dunkel} 100%)}
/* Logo unverändert auf weißer Fläche – so ist es auf jedem Foto lesbar */
.logo{position:absolute;left:${fmt.padX}px;top:${fmt.logoTop}px;background:#fff;border-radius:18px;
  padding:${Math.round(fmt.logoH * .16)}px ${Math.round(fmt.logoH * .24)}px;box-shadow:0 10px 34px rgba(0,0,0,.28)}
.logo img{display:block;height:${fmt.logoH}px;width:auto}
.frame{position:absolute;left:${fmt.padX}px;right:${fmt.padX}px;top:${fmt.fotoH - 150}px;bottom:${fmt.padBottom}px;
  display:flex;flex-direction:column;justify-content:flex-end}
.inner{display:flex;flex-direction:column}
.eyebrow{align-self:flex-start;background:${CI.brand};color:#fff;font-weight:800;font-size:${Math.round(fmt.subPx * .78)}px;
  letter-spacing:.08em;text-transform:uppercase;padding:${Math.round(fmt.subPx * .3)}px ${Math.round(fmt.subPx * .62)}px;border-radius:999px;margin-bottom:${fmt.gap}px}
h1{font-weight:900;font-size:${fmt.headPx}px;line-height:1.03;letter-spacing:-.015em;text-shadow:0 4px 26px rgba(0,0,0,.35)}
h1 .akzent{color:${CI.akzent}}
.sub{margin-top:${fmt.gap}px;font-weight:500;font-size:${fmt.subPx}px;line-height:1.38;color:#e2e1e6;max-width:95%}
.liste{list-style:none;margin-top:${fmt.gap + 6}px;display:grid;gap:${Math.round(fmt.gap * .7)}px}
.liste li{display:flex;align-items:flex-start;gap:18px;font-weight:700;font-size:${fmt.subPx + 1}px;line-height:1.28}
.liste i{flex:0 0 auto;width:${fmt.subPx + 12}px;height:${fmt.subPx + 12}px;border-radius:50%;background:${CI.brand};
  display:grid;place-items:center;margin-top:-3px}
.liste i svg{width:${fmt.subPx - 6}px;height:${fmt.subPx - 6}px}
.chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:${fmt.gap}px}
.chip{font-weight:700;font-size:${Math.round(fmt.subPx * .8)}px;padding:10px 20px;border-radius:999px;
  border:2px solid rgba(255,255,255,.32);color:${CI.hell}}
.cta{display:inline-flex;align-items:center;gap:16px;align-self:flex-start;margin-top:${fmt.gap + 10}px;
  background:${CI.brand};color:#fff;font-weight:800;font-size:${Math.round(fmt.subPx * 1.08)}px;
  padding:${Math.round(fmt.subPx * .72)}px ${Math.round(fmt.subPx * 1.25)}px;border-radius:14px;box-shadow:0 14px 40px rgba(${CI.brandRgb},.45)}
.cta svg{width:${fmt.subPx}px;height:${fmt.subPx}px}
.fuss{margin-top:${Math.round(fmt.gap * .8)}px;font-weight:700;font-size:${Math.round(fmt.subPx * .66)}px;letter-spacing:.06em;color:#a9a7ae}
.kante{position:absolute;left:0;right:0;bottom:0;height:12px;background:${CI.brand}}
</style></head><body>
<div class="foto"></div>
<div class="logo"><img src="${url(LOGO)}" alt=""></div>
<div class="frame"><div class="inner">
  <div class="eyebrow">${m.eyebrow}</div>
  <h1>${m.head}</h1>
  ${sub}${liste}${chips}
  <div class="cta">${m.cta} ${PFEIL}</div>
  <div class="fuss">SCHUMANN &amp; HARDT · KIESWERK AM HASELSEE · BABENHAUSEN</div>
</div></div>
<div class="kante"></div>
<script>
/* Headline verkleinern, bis der Textblock sicher in seinen Rahmen passt
   (nie ins Logo, nie in die Safe Zone). */
(function(){
  var h=document.querySelector('h1'), f=document.querySelector('.frame'), inn=document.querySelector('.inner');
  var px=parseFloat(getComputedStyle(h).fontSize), n=0;
  while(inn.offsetHeight>f.clientHeight && px>40 && n++<80){ px-=2; h.style.fontSize=px+'px'; }
  document.documentElement.dataset.headpx=px;
  document.documentElement.dataset.ready='1';
})();
</script></body></html>`;
}

/* =====================================================================
   FACEBOOK-SEITE
   Profilbild 1080 x 1080 – Facebook beschneidet rund: Logo mittig mit
              viel Rand, nichts Wichtiges im Eckbereich.
   Titelbild  1640 x 856 – Logo + Claim in der mittigen Sicherheitszone
              1092 x 616; unten rechts frei (dort liegt der Button).
   ===================================================================== */
function fbProfil() {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1080px}
body{background:#fff;display:grid;place-items:center;position:relative}
/* Logo-Breite 740 px: Diagonale des Logos 930 px < Kreis 1080 px –
   auch die Ecken der Logo-Fläche liegen sicher im runden Ausschnitt. */
img{width:740px;height:auto;display:block}
</style></head><body><img src="${url(LOGO)}" alt="">
<script>document.documentElement.dataset.ready='1'</script></body></html>`;
}

function fbTitel() {
  const foto = FOTOS.schwimmgreifer;
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1640px;height:856px}
body{font-family:Barlow,sans-serif;background:${CI.dunkel};position:relative;overflow:hidden;color:#fff}
.foto{position:absolute;top:0;bottom:0;right:0;width:920px;
  background:url('${url(foto.src)}') ${position({ ...foto, fx: .36 }, 920, 856)}/cover no-repeat;
  -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 300px);mask-image:linear-gradient(90deg,transparent 0,#000 300px)}
/* Sicherheitszone 1092 x 616 mittig (x 274–1366, y 120–736) */
.safe{position:absolute;left:274px;top:120px;width:1092px;height:616px;display:flex;flex-direction:column;justify-content:center;gap:30px}
.logo{align-self:flex-start;background:#fff;border-radius:20px;padding:20px 28px;box-shadow:0 12px 36px rgba(0,0,0,.3)}
.logo img{display:block;height:120px;width:auto}
.claim{font-weight:900;font-size:60px;line-height:1.05;letter-spacing:-.015em;max-width:640px;text-shadow:0 4px 24px rgba(0,0,0,.35)}
.claim span{color:${CI.akzent}}
.meta{display:flex;gap:12px;flex-wrap:wrap;max-width:640px}
.meta b{font-weight:800;font-size:22px;letter-spacing:.06em;text-transform:uppercase;background:${CI.brand};padding:10px 20px;border-radius:999px}
.meta i{font-style:normal;font-weight:700;font-size:22px;padding:10px 20px;border-radius:999px;border:2px solid rgba(255,255,255,.32);color:${CI.hell}}
.kante{position:absolute;left:0;right:0;bottom:0;height:12px;background:${CI.brand}}
</style></head><body>
<div class="foto"></div>
<div class="safe">
  <div class="logo"><img src="${url(LOGO)}" alt=""></div>
  <div class="claim">Sicherer Arbeitsplatz <span>mit Zukunft.</span></div>
  <div class="meta"><b>Wir stellen ein</b><i>Mechatroniker (m/w/d)</i><i>Geräteführer (m/w/d)</i></div>
</div>
<div class="kante"></div>
<script>document.documentElement.dataset.ready='1'</script></body></html>`;
}

/* ---------- Rendern ---------- */
const browser = await chromium.launch();
const erzeugt = [];
async function render(datei, w, h, html) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  writeFileSync(TMP, html);
  await page.goto('file://' + TMP, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  const info = await page.evaluate(() => {
    const imgs = [...document.images].map(i => i.complete && i.naturalWidth > 0);
    return { headpx: document.documentElement.dataset.headpx || '', bilderOk: imgs.every(Boolean) };
  });
  if (!info.bilderOk) throw new Error(datei + ': Bild konnte nicht geladen werden');
  await page.screenshot({ path: join(HERE, datei) });
  erzeugt.push(datei + (info.headpx ? `  (Headline ${info.headpx}px)` : ''));
  await ctx.close();
}

for (const s of STELLEN) {
  for (const [motivName, m] of Object.entries(s.motive)) {
    for (const [fmtName, fmt] of Object.entries(FORMATE)) {
      /* Schutz vor stillen Lücken: ein fehlendes Feld landet sonst als
         "undefined" im fertigen Creative. */
      for (const [feld, wert] of Object.entries(m)) {
        const t = Array.isArray(wert) ? wert.join(' ') : String(wert);
        if (/undefined|null|NaN/.test(t)) throw new Error(`${s.key}/${motivName}: Feld "${feld}" ist leer`);
      }
      await render(`${s.key}-${motivName}-${fmtName}.png`, fmt.w, fmt.h, creative(fmt, m));
    }
  }
}
await render('facebook-profilbild.png', 1080, 1080, fbProfil());
await render('facebook-titelbild.png', 1640, 856, fbTitel());

await browser.close();
rmSync(TMP, { force: true });
console.log(`${erzeugt.length} Dateien gerendert nach creatives/`);
erzeugt.forEach(d => console.log('  ' + d));
