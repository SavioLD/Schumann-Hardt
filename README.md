# Schumann & Hardt – Karriereseite

Recruiting-Landingpage der **Schumann & Hardt GmbH & Co. KG**,
Am Haselsee 1–5, 64832 Babenhausen-Harreshausen (Kieswerk am Haselsee).

Ausgeschriebene Stellen: **Mechatroniker (m/w/d)** und **Geräteführer (m/w/d)**
– und ausschließlich diese beiden. Keine Initiativbewerbung, kein
„weitere offene Stellen“-Bereich, keine Verlinkung auf andere Vakanzen.

Aufbau und Sektionen 1:1 nach der ALWA-Referenzseite
(`saviold.github.io/alwa-gmbh/`): Topbar · Sticky-Mobile-CTA · Hero ·
Trust-Band · Offene Stellen · Benefits · Ablauf · Mid-CTA · Bewerbung ·
FAQ · Footer.

## Inhalt

- `index.html` – die komplette Seite (self-contained, kein Build-Schritt nötig)
- `bilder/` – Bildmaterial (siehe `bilder/HIER-BILDER-ABLEGEN.txt`)
- `.nojekyll` – sorgt dafür, dass GitHub Pages die Dateien 1:1 ausliefert

## Live schalten (GitHub Pages)

1. Repo-Settings → **Pages** → Source: **Deploy from a branch**, Branch: `main` / `/ (root)`
2. Nach ein paar Minuten unter `https://saviold.github.io/Schumann-Hardt/` erreichbar

## CI – aktuell VORLÄUFIG

Die Firmenwebsite (`schumann-kies.de`) war beim Bau nicht erreichbar –
weder live noch über das Webarchiv. Farben, Schrift und Logo konnten
deshalb noch **nicht** übernommen werden. Gesetzt ist ein vorläufiges,
branchentypisches CI (Tiefblau für Wasser/Nassauskiesung + Sand-/Kieston
als Akzent, Schrift Barlow).

Sobald das Original-Logo in `bilder/` liegt, werden die Farben direkt aus
dem Logo ausgelesen. Alle Farben und Schriften stecken **ausschließlich**
im `:root`-Block ganz oben in `index.html` – dort einmal ändern, die ganze
Seite zieht nach:

```css
--brand:#e3a72f;       --brand-rgb:227,167,47;   /* Akzent: Buttons, Marker */
--brand-dark:#c98f1d;  /* Hover                                          */
--brand-700:#8a5c0c;   /* Akzent als Text auf Weiß                        */
--brand-900:#0f2b46;   --brand-900-rgb:15,43,70; /* Topbar, Hero, Footer  */
--brand-soft:#fbf1dc;  /* helle Flächen                                   */
--on-brand:#0f2b46;    /* Textfarbe AUF dem Akzent (Kontrast!)            */
--f-display / --f-body: Barlow
```

Das Logo wird automatisch eingesetzt, sobald eine Datei unter einem der
Namen in `LOGO_CANDIDATES` (im `<script>`) liegt – bis dahin steht der
Schriftzug „SCHUMANN & HARDT“.

## Stellen pflegen

Beide Stellen stehen in **einer** Config (`var JOBS` im `<script>` am
Seitenende). Sie speist gleichzeitig Stellenkarten, Stellenauswahl im
Formular, Screening-Ablauf, Hero-Text bei `?stelle=…`, FAQ
„Voraussetzungen“ und die JobPosting-Structured-Data.

Die Aufgaben sind laut Vorgabe für beide Stellen identisch; sie stehen nur
in unterschiedlicher Reihenfolge (Mechatroniker: Instandsetzung zuerst,
Geräteführer: Bedienung zuerst).

**Benefits.** Vorgegeben ist ausschließlich „sicherer und
zukunftsorientierter Arbeitsplatz“. Die übrigen Benefit-Kacheln
beschreiben den Arbeitsplatz aus den Aufgaben und Anforderungen heraus
(Technik, Abwechslung, Selbstständigkeit, Standort). Es werden **keine**
zusätzlichen Leistungen versprochen – kein Gehalt, keine Zulagen, kein
„unbefristet“, kein Firmenwagen.

## Stellen-Deeplinks für die Anzeige

Die Anzeige kann direkt auf eine Stelle verlinken. Die Seite textet dann
den Hero auf die Stelle, wählt sie im Formular vor und **überspringt den
Auswahl-Schritt**.

- `…/?stelle=mechatroniker`
- `…/?stelle=geraetefuehrer`

Ohne Parameter beginnt das Formular mit der Stellenauswahl.

## Vorfilterung (Screening)

Eine Frage pro Schritt. Davor die Stellenauswahl (entfällt beim Deeplink
und nach Klick auf „Jetzt als … bewerben“), danach die Kontaktdaten. Die
Fragen hängen an der Stelle – **Pflichtfragen stehen vorne**, damit ein
K.-o. so früh wie möglich greift.

### Mechatroniker (m/w/d) – 5 Fragen

| # | Frage | Kategorie | Erfüllt bei |
|---|-------|-----------|-------------|
| 1 | Ausbildung | **Pflicht** | Abgeschlossene Ausbildung als Mechatroniker/Schlosser (Industrie-, Landmaschinen-, Aufbereitungstechnik) **oder** in einem anderen Beruf der Baustoff-/Metallindustrie |
| 2 | Vollzeit | **Pflicht** | Vollzeit passt |
| 3 | Großgeräte & Spezialmaschinen | optional | sicher und routiniert |
| 4 | Baustoffe & Aufbereitung | optional | Praxis oder Grundverständnis |
| 5 | Arbeitsweise | optional | selbstständig, zuverlässig, einsatzbereit |

### Geräteführer (m/w/d) – 4 Fragen

| # | Frage | Kategorie | Erfüllt bei |
|---|-------|-----------|-------------|
| 1 | Großgeräte & Spezialmaschinen | **Pflicht** | sicher und routiniert |
| 2 | Baustoffe & Aufbereitung | **Pflicht** | Praxis oder Grundverständnis |
| 3 | Vollzeit | **Pflicht** | Vollzeit passt |
| 4 | Arbeitsweise | optional | selbstständig, zuverlässig, einsatzbereit |

> **Bitte bestätigen:**
> - „Einsatz- und Leistungsbereitschaft, selbstständige Arbeitsweise und
>   Zuverlässigkeit“ stand beim Geräteführer **sowohl** unter Pflicht
>   **als auch** unter optional. Umgesetzt als **optional** (die eigens
>   gesetzte Optional-Zeile). Auf Pflicht umstellen = in `JOBS` beim
>   Geräteführer `F("arbeitsweise",OPTIONAL)` → `F("arbeitsweise",PFLICHT)`.
> - „Vollzeit“ ist als Pflichtfrage umgesetzt – wer nur Teilzeit oder einen
>   Minijob sucht, passt nicht auf eine Vollzeitstelle.

**Logik**

- **Pflichtfrage nicht erfüllt** → Bewerbung endet sofort. Freundlicher
  Abschlusshinweis, keine weiteren Schritte, **kein Lead an die Lead Table**.
  Es werden bewusst keine anderen Stellen angeboten.
- **Optionale Frage nicht erfüllt** → Bewerber kommt normal weiter. Die
  Antwort wird übertragen und markiert: Vor dem Wert steht
  `[nicht erfüllt]`, zusätzlich listet das Feld `nicht_erfuellt` die
  betroffenen Fragen.

Welche Antwort als „erfüllt“ gilt, steht direkt am Radio-Input als
`data-ok="1"`. Pflicht/optional und Reihenfolge stehen je Stelle in
`JOBS[…].fragen`. Die Stellenkarten („Das setzen wir voraus“ /
„Wünschenswert“) werden aus derselben Config erzeugt – die Anzeige
verlangt also exakt das, was das Screening prüft.

**AGG:** Es werden nur berufsbezogene Kriterien abgefragt – nichts zu
Alter, Herkunft, Gesundheit, Religion oder Familienstand.

**Kein Lebenslauf-Upload, keine Dateianhänge** – bewusst nicht vorgesehen.

## Mobile Laufruhe

Beim Schrittwechsel passiert ausschließlich ein Klassenwechsel. Es gibt
**kein** `window.scrollTo`, **kein** `scrollIntoView`, **kein** `focus()`,
keinen Reload und keinen Hash-Sprung. Der Formularcontainer hat eine feste
Mindesthöhe (`--form-min` 520 px / `--form-min-mobile` 514 px, nachgemessen
am jeweils höchsten Schritt), die auch in der Mobile-Query gesetzt bleibt.
Alle Schritte sind dadurch exakt gleich hoch, der Weiter-Button steht
immer an derselben Stelle.

Nachgemessen im Browser (Chromium, Touch-Emulation, echte Finger-Taps),
für **beide Stellen** und jeweils beide Wege (mit Deeplink / mit
Stellenauswahl), von Frage 1 bis zur Bestätigung:

| Viewport | scrollY über alle Schritte | Höhe Formular | Weiter-Button | Topbar + Karte |
|----------|----------------------------|---------------|---------------|----------------|
| 360 × 640 | konstant | 514 px | fix | 632 px |
| 375 × 667 | konstant | 514 px | fix | 632 px |
| 390 × 844 | konstant | 514 px | fix | 632 px |
| 414 × 896 | konstant | 514 px | fix | 632 px |

Ein Schritt passt damit auf jedem Standard-Handy ohne Scrollen ins Bild.
Auch beim K.-o.-Abbruch springt nichts.

## Lead Table

**Jede Stelle hat ihre eigene Kachel.** Die URL steht oben im `<script>`
(`HOOK_MECHATRONIKER`, `HOOK_GERAETEFUEHRER`) und ist beim jeweiligen
`JOBS`-Eintrag unter `webhook` verknüpft.

| Stelle | `tableID` der Kachel |
|--------|----------------------|
| Mechatroniker (m/w/d) | `6af1bc527ef0f4c459e5299e` |
| Geräteführer (m/w/d) | `6af1bc85407a16b695898dde` |

Beide gehören zu `customerID 6af1bc3e407a16b695890df4`.

Gesendet wird **nur** bei vollständiger, qualifizierter Bewerbung.
K.-o.-Abbrüche verlassen die Seite nie.

**Payload** – jedes Feld genau einmal, Vor- und Nachname getrennt,
**kein** kombiniertes `name`/`fullname`/`vollstaendiger_name`. Übertragen
werden nur die Fragen der gewählten Stelle (der Geräteführer sendet also
kein `ausbildung`):

```json
{
  "vorname": "Max",
  "nachname": "Mustermann",
  "telefon": "0151 23456789",
  "email": "max.mustermann@beispiel.de",
  "stelle": "Mechatroniker (m/w/d)",
  "ausbildung": "…",
  "vollzeit": "Ja, Vollzeit passt",
  "grossgeraete": "Sicher und routiniert",
  "baustoffe": "[nicht erfüllt] Bisher keine Berührungspunkte",
  "arbeitsweise": "…",
  "nicht_erfuellt": "Baustoffe & Aufbereitung",
  "datum": "09.11.2026",
  "datenschutz": "Ja (Einwilligung mit Absenden, Art. 6 Abs. 1 lit. a DSGVO)",
  "quelle": "Karriere-Landingpage Schumann & Hardt",
  "seite": "https://…"
}
```

Die Feldnamen folgen der Konvention der bestehenden, funktionierenden
Lead-Table-Anbindungen derselben Agentur (`vorname`, `nachname`,
`telefon`, `email` als Standardfelder, alles Weitere als Zusatzfelder).

**Testeintrag (09.11.2026)** – je Kachel ein Eintrag über das echte
Formular, beide mit HTTP 200 angenommen:

| Kachel | Name | Telefon | E-Mail | Lead-ID |
|--------|------|---------|--------|---------|
| Mechatroniker | Test / Testeintrag Mechatroniker (bitte loeschen) | 0151 11111111 | test-mechatroniker@example.com | `6af1c295acae5c874869493a` |
| Geräteführer | Test / Testeintrag Geraetefuehrer (bitte loeschen) | 0151 22222222 | test-geraetefuehrer@example.com | `6af1c29e6279c3a7d4c8b04f` |

Die beiden Testeinträge können in der Lead Table gelöscht werden.

## Noch zu prüfen

- **CI** (siehe oben) – wird nach dem Logo-Upload aus dem Original-Logo
  übernommen.
- **Links zu Impressum und Datenschutz** – aktuell
  `schumann-kies.de/impressum.html` und `/datenschutz.html`
  (abgeleitet aus `schumann-kies.de/jobs.html`, wegen der nicht
  erreichbaren Website ungeprüft).
- **Kontakt** – Adresse und Telefon (06073 6002-0) stammen aus
  Branchenverzeichnissen. Eine Bewerbungs-E-Mail-Adresse ist nicht bekannt,
  deshalb verweist die Seite auf das Telefon.
- **Pflicht/optional** beim Geräteführer und **Vollzeit als Pflicht**
  (siehe Kasten unter „Vorfilterung“).
- Das Analytics-Snippet am Seitenende (`analytics.laendle-digital.com`,
  `data-website-id="schumann_hardt"`) ist 1:1 von der Referenzseite
  übernommen – bei Bedarf entfernen oder die ID anpassen.
- Eine E-Mail-Benachrichtigung bei neuer Bewerbung (wie bei ALWA über
  Web3Forms) ist **nicht** eingebaut – dafür bräuchte es einen eigenen
  Access Key mit dem richtigen Empfänger.
