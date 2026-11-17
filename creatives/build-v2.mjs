/* =====================================================================
   CREATIVES SERIE 2 · Schumann & Hardt GmbH & Co. KG
   ---------------------------------------------------------------------
   Laute, ehrliche Serie: Rohstoffindustrie, viel draußen, im Winter
   auch mal nass und ungemütlich – dafür überdurchschnittlich bezahlt.
   Ziel: maximal auffallen, genau die richtigen Leute ansprechen und
   so überzeugen, dass sie sich bewerben.

     node creatives/build-v2.mjs      -> creatives/v2/

   Ergebnis: je Stelle 3 Motive x 2 Formate (4:5, 9:16) = 12 Creatives.
   CI wie Karriereseite: Logo-Magenta, Anthrazit, Barlow (für die großen
   Headlines Barlow Condensed aus derselben Schriftfamilie).
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

const CI = { brand: '#b20058', brandRgb: '178,0,88', dunkel: '#26252a', akzent: '#f4a6c8', hell: '#f1f0f3' };

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
  schwimmbaender: { src: finde('Schwimmb'),            w: 2000, h: 924,  fx: 0.72, fy: 0.40 },
  schwimmgreifer: { src: finde('Schwimmgreifer'),      w: 2560, h: 1183, fx: 0.33, fy: 0.50 }
};
const LOGO = 'bilder/logo-hd.png';
if (!existsSync(join(ROOT, LOGO))) throw new Error('Logo fehlt: ' + LOGO);
function position(foto, bw, bh) {
  const s = Math.max(bw / foto.w, bh / foto.h), sw = foto.w * s, sh = foto.h * s;
  const px = sw > bw ? Math.min(Math.max(foto.fx * sw - bw / 2, 0), sw - bw) / (sw - bw) * 100 : 50;
  const py = sh > bh ? Math.min(Math.max(foto.fy * sh - bh / 2, 0), sh - bh) / (sh - bh) * 100 : 50;
  return `${px.toFixed(1)}% ${py.toFixed(1)}%`;
}

/* ---------- Icons ---------- */
const ICON = {
  werk:   '<path d="M2 20h20"/><path d="M4 20V10l5 3v-3l5 3V5h6v15"/>',
  regen:  '<path d="M20 16.6A5 5 0 0 0 18 7h-1.3A8 8 0 1 0 4 15.3"/><path d="M8 19v2M8 13v2M16 19v2M16 13v2M12 21v2M12 15v2"/>',
  technik:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  geld:   '<path d="M18.5 6.5A7.5 7.5 0 1 0 18.5 17.5"/><path d="M3.5 10h10M3.5 14h10"/>',
  schild: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>'
};
const PFEIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';

/* ---------- Stellen + Motive ---------- */
const STELLEN = [
  {
    key: 'mechatroniker', titel: 'Mechatroniker (m/w/d)',
    motive: {
      absperrband: {
        foto: 'aufbereitung',
        head: 'Regen. Kälte.<br>Matsch.<br><span class="akzent">Na und?</span>',
        sub: 'Als <b>Mechatroniker (m/w/d)</b> hältst du unser Kieswerk am Laufen – draußen, bei jedem Wetter, mitten in der Rohstoffindustrie.',
        cta: 'Jetzt in 60 Sek. bewerben'
      },
      block: {
        foto: 'schwimmbaender',
        head: 'Kein Bürojob.<br><mark>Zum Glück.</mark>',
        zeile: 'Mechatroniker (m/w/d) gesucht',
        chips: ['Viel draußen', 'Rohstoffindustrie', 'Vollzeit'],
        cta: 'Jetzt bewerben'
      },
      ehrlich: {
        foto: 'schwimmgreifer',
        label: 'Ehrlich gesagt:',
        head: 'Das ist kein <span class="akzent nowrap">Schönwetter-Job.</span>',
        liste: [['werk', 'Rohstoffindustrie: Kieswerk statt Büro'],
                ['regen', 'Viel draußen – im Winter auch mal nass und ungemütlich'],
                ['technik', 'Instandsetzung an Radlader, Schwimmgreifer & Anlage'],
                ['geld', 'Dafür: überdurchschnittlich bezahlt']],
        cta: 'Klingt nach dir? Jetzt bewerben'
      }
    }
  },
  {
    key: 'geraetefuehrer', titel: 'Geräteführer (m/w/d)',
    motive: {
      absperrband: {
        foto: 'schwimmbaender',
        head: 'Regen. Kälte.<br>Matsch.<br><span class="akzent">Na und?</span>',
        sub: 'Als <b>Geräteführer (m/w/d)</b> bedienst du Radlader, Schwimmgreifer und Aufbereitung – draußen, bei jedem Wetter, mitten in der Rohstoffindustrie.',
        cta: 'Jetzt in 60 Sek. bewerben'
      },
      block: {
        foto: 'schwimmgreifer',
        head: 'Dein Arbeitsplatz<br><mark>schwimmt.</mark>',
        zeile: 'Geräteführer (m/w/d) gesucht',
        chips: ['Viel draußen', 'Rohstoffindustrie', 'Vollzeit'],
        cta: 'Jetzt bewerben'
      },
      ehrlich: {
        foto: 'aufbereitung',
        label: 'Ehrlich gesagt:',
        head: 'Das ist kein <span class="akzent nowrap">Schönwetter-Job.</span>',
        liste: [['werk', 'Rohstoffindustrie: Kieswerk statt Büro'],
                ['regen', 'Viel draußen – im Winter auch mal nass und ungemütlich'],
                ['technik', 'Radlader, Schwimmgreifer, Aufbereitungsanlage'],
                ['geld', 'Dafür: überdurchschnittlich bezahlt']],
        cta: 'Klingt nach dir? Jetzt bewerben'
      }
    }
  }
];

/* ---------- Formate ----------
   9:16: oben 250 px und unten 340 px frei von Text/Logo (Safe Zones). */
const FORMATE = {
  '4x5':  { w: 1080, h: 1350, top: 48,  bottom: 64,  padX: 64, logoH: 88,  head: 136, sub: 33, sticker: 250 },
  '9x16': { w: 1080, h: 1920, top: 270, bottom: 340, padX: 72, logoH: 100, head: 156, sub: 36, sticker: 270 }
};

/* ---------- Bausteine ---------- */
const sticker = (fmt, hell) => `<div class="sticker${hell ? ' sticker--hell' : ''}"><div><small>Überdurch-<br>schnittlich</small><b>bezahlt</b></div></div>`;
const tape = () => {
  return `<div class="tape"><span>· Achtung: Nichts für Schönwetter-Typen ·</span></div>`;
};

function seite(fmt, motivName, m) {
  const foto = FOTOS[m.foto];
  const hoch = fmt.h > 1500;   // 9:16
  const fotoH = { absperrband: fmt.h, block: Math.round(fmt.h * (hoch ? .47 : .54)), ehrlich: Math.round(fmt.h * (hoch ? .40 : .46)) }[motivName];
  const s = fmt.sub, H = fmt.head;
  const chips = m.chips ? `<div class="chips">${m.chips.map(c => `<span>${c}</span>`).join('')}</div>` : '';
  const liste = m.liste ? `<ul class="liste">${m.liste.map(([ic, t]) => `<li><i><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${ICON[ic]}</svg></i><span>${t}</span></li>`).join('')}</ul>` : '';

  let inhalt = '', deko = '', panel = '';
  if (motivName === 'absperrband') {
    deko = sticker(fmt) + tape();
    inhalt = `<h1>${m.head}</h1><p class="sub">${m.sub}</p><div class="cta">${m.cta} ${PFEIL}</div>`;
  } else if (motivName === 'block') {
    panel = '<div class="panel"></div>';
    deko = sticker(fmt, true);
    inhalt = `<h1>${m.head}</h1><div class="zeile">${m.zeile}</div>${chips}<div class="cta cta--weiss">${m.cta} ${PFEIL}</div>`;
  } else {
    inhalt = `<div class="label">${m.label}</div><h1>${m.head}</h1>${liste}<div class="cta">${m.cta} ${PFEIL}</div>`;
  }

  const verlauf = {
    absperrband: 'linear-gradient(180deg,rgba(29,28,32,.10) 0%,rgba(29,28,32,.18) 30%,rgba(29,28,32,.80) 52%,rgba(38,37,42,.97) 66%,#26252a 100%)',
    block: 'linear-gradient(180deg,rgba(29,28,32,0) 60%,rgba(29,28,32,.35) 100%)',
    ehrlich: 'linear-gradient(180deg,rgba(29,28,32,0) 45%,rgba(38,37,42,.75) 80%,#26252a 100%)'
  }[motivName];

  /* Rahmen für den Text: beginnt unter Logo/Band bzw. im Panel und endet
     über der unteren Safe Zone. */
  const frameTop = {
    absperrband: Math.round(fmt.h * (hoch ? .37 : .43)),
    block: fotoH - 40,
    ehrlich: fotoH - 120
  }[motivName];

  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><style>
${FONTS}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${fmt.w}px;height:${fmt.h}px}
body{font-family:Barlow,sans-serif;color:#fff;background:${CI.dunkel};position:relative;overflow:hidden}
.foto{position:absolute;left:0;right:0;top:0;height:${fotoH}px;background:url('${url(foto.src)}') ${position(foto, fmt.w, fotoH)}/cover no-repeat}
.foto::after{content:"";position:absolute;inset:0;background:${verlauf}}
.logo{position:absolute;z-index:5;left:${fmt.padX}px;top:${fmt.top}px;background:#fff;border-radius:18px;padding:${Math.round(fmt.logoH*.16)}px ${Math.round(fmt.logoH*.24)}px;box-shadow:0 10px 34px rgba(0,0,0,.3)}
.logo img{display:block;height:${fmt.logoH}px;width:auto}

/* Sticker "Überdurchschnittlich bezahlt" */
.sticker{position:absolute;z-index:6;right:${fmt.padX - 10}px;top:${fmt.top - 8}px;width:${fmt.sticker}px;height:${fmt.sticker}px;border-radius:50%;
  background:${CI.brand};color:#fff;display:grid;place-items:center;text-align:center;transform:rotate(11deg);
  box-shadow:0 18px 44px rgba(0,0,0,.45),inset 0 0 0 9px ${CI.brand},inset 0 0 0 12px rgba(255,255,255,.9)}
.sticker div{font-family:'Barlow Condensed';text-transform:uppercase;line-height:.9}
.sticker small{display:block;font-weight:800;font-size:${Math.round(fmt.sticker*.15)}px;letter-spacing:.01em}
.sticker b{display:block;font-weight:900;font-size:${Math.round(fmt.sticker*.235)}px;margin-top:6px;letter-spacing:.01em}
.sticker--hell{background:#fff;color:${CI.brand};box-shadow:0 18px 44px rgba(0,0,0,.4),inset 0 0 0 9px #fff,inset 0 0 0 12px ${CI.brand}}

/* Absperrband */
.tape{position:absolute;z-index:4;left:-80px;right:-80px;top:${Math.round(fmt.h * (hoch ? .30 : .31))}px;transform:rotate(-6deg);
  background:${CI.brand};padding:${Math.round(s*.42)}px 0;box-shadow:0 14px 40px rgba(0,0,0,.45);overflow:hidden;white-space:nowrap;text-align:center}
.tape::before,.tape::after{content:"";position:absolute;left:0;right:0;height:14px;background:repeating-linear-gradient(-45deg,#fff 0 16px,${CI.dunkel} 16px 32px)}
.tape::before{top:0}.tape::after{bottom:0}
.tape span{display:inline-block;font-family:'Barlow Condensed';font-weight:900;font-size:${Math.round(s*1.42)}px;letter-spacing:.04em;text-transform:uppercase;padding:8px 0}

/* Magenta-Block mit schräger Kante */
.panel{position:absolute;left:0;right:0;bottom:0;top:${fotoH - 110}px;background:${CI.brand};clip-path:polygon(0 110px,100% 0,100% 100%,0 100%)}

.frame{position:absolute;z-index:3;left:${fmt.padX}px;right:${fmt.padX}px;top:${frameTop}px;bottom:${fmt.bottom}px;display:flex;flex-direction:column;justify-content:flex-end}
.inner{display:flex;flex-direction:column}
h1{font-family:'Barlow Condensed';font-weight:900;font-size:${H}px;line-height:.9;text-transform:uppercase;letter-spacing:-.005em;text-shadow:0 6px 30px rgba(0,0,0,.35)}
h1 .akzent{color:${CI.akzent}}
h1 .nowrap{white-space:nowrap}
h1 mark{background:${CI.dunkel};color:#fff;padding:0 .14em;box-decoration-break:clone;-webkit-box-decoration-break:clone;display:inline-block;margin-top:.08em;text-shadow:none}
.label{align-self:flex-start;background:${CI.brand};font-family:'Barlow Condensed';font-weight:900;font-size:${Math.round(s*1.15)}px;text-transform:uppercase;letter-spacing:.04em;padding:${Math.round(s*.18)}px ${Math.round(s*.55)}px;border-radius:10px;margin-bottom:${Math.round(s*.7)}px;transform:rotate(-2deg)}
.sub{margin-top:${Math.round(s*.8)}px;font-weight:500;font-size:${s}px;line-height:1.36;color:#e6e5ea;max-width:96%}
.sub b{font-weight:800;color:#fff}
.zeile{margin-top:${Math.round(s*.8)}px;font-weight:800;font-size:${Math.round(s*1.2)}px;line-height:1.2}
.chips{display:flex;flex-wrap:wrap;gap:12px;margin-top:${Math.round(s*.7)}px}
.chips span{font-weight:800;font-size:${Math.round(s*.82)}px;padding:9px 20px;border-radius:999px;border:2.5px solid rgba(255,255,255,.75)}
.liste{list-style:none;margin-top:${Math.round(s*.9)}px;display:grid;gap:${Math.round(s*.55)}px}
.liste li{display:flex;align-items:center;gap:18px;font-weight:700;font-size:${s + 1}px;line-height:1.25}
.liste i{flex:0 0 auto;width:${s + 26}px;height:${s + 26}px;border-radius:50%;background:${CI.brand};display:grid;place-items:center}
.liste i svg{width:${s - 2}px;height:${s - 2}px}
.liste li:last-child span{color:${CI.akzent};font-weight:800}
.cta{display:inline-flex;align-items:center;gap:16px;align-self:flex-start;margin-top:${Math.round(s*1.1)}px;
  background:${CI.brand};color:#fff;font-weight:900;font-size:${Math.round(s*1.15)}px;padding:${Math.round(s*.72)}px ${Math.round(s*1.2)}px;border-radius:14px;
  box-shadow:0 16px 44px rgba(${CI.brandRgb},.5)}
.cta svg{width:${s+2}px;height:${s+2}px}
.cta--weiss{background:#fff;color:${CI.brand};box-shadow:0 16px 44px rgba(0,0,0,.3)}
.fuss{margin-top:${Math.round(s*.75)}px;font-weight:700;font-size:${Math.round(s*.64)}px;letter-spacing:.07em;color:${motivName === 'block' ? 'rgba(255,255,255,.78)' : '#a9a7ae'}}
.kante{position:absolute;left:0;right:0;bottom:0;height:12px;background:${motivName === 'block' ? CI.dunkel : CI.brand}}
</style></head><body>
<div class="foto"></div>${panel}
<div class="logo"><img src="${url(LOGO)}" alt=""></div>
${deko}
<div class="frame"><div class="inner">
  ${inhalt}
  <div class="fuss">SCHUMANN &amp; HARDT · KIESWERK AM HASELSEE · BABENHAUSEN</div>
</div></div>
<div class="kante"></div>
<script>
/* Erst nach dem Laden der Schrift messen – sonst rechnet die Schleife mit
   der Ersatzschrift und verkleinert unnötig stark. */
document.fonts.ready.then(function(){
  var h=document.querySelector('h1'), f=document.querySelector('.frame'), inn=document.querySelector('.inner');
  var px=parseFloat(getComputedStyle(h).fontSize), n=0;
  while((inn.offsetHeight>f.clientHeight || inn.scrollWidth>f.clientWidth) && px>50 && n++<90){ px-=2; h.style.fontSize=px+'px'; }
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
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
      const info = await page.evaluate(() => ({
        headpx: document.documentElement.dataset.headpx,
        bilderOk: [...document.images].every(i => i.complete && i.naturalWidth > 0),
        /* Text darf weder ins Logo noch (bei 9:16) in die obere Safe Zone */
        frameTop: Math.round(document.querySelector('.inner').getBoundingClientRect().top),
        logoBottom: Math.round(document.querySelector('.logo').getBoundingClientRect().bottom)
      }));
      if (!info.bilderOk) throw new Error('Bild nicht geladen: ' + st.key + '/' + motivName);
      if (info.frameTop < info.logoBottom) throw new Error(`${st.key}/${motivName}/${fmtName}: Text überlappt das Logo`);
      const datei = `${st.key}-${motivName}-${fmtName}.png`;
      await page.screenshot({ path: join(OUT, datei) });
      erzeugt.push(`${datei}  (Headline ${info.headpx}px, Text ab y=${info.frameTop})`);
      await ctx.close();
    }
  }
}
await browser.close();
if (!process.env.KEEP) rmSync(TMP, { force: true });
console.log(`${erzeugt.length} Dateien gerendert nach creatives/v2/`);
erzeugt.forEach(d => console.log('  ' + d));
