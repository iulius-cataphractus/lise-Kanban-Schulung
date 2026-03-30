<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>S2 – Aktives Workflow-Management & Flussmetriken | Kanban-Schulung lise v4</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; font-family: Arial, Helvetica, sans-serif; background: #0d1117; color: #1a1a2e; }
  .stage { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; min-height: 100vh; padding: 20px 20px 80px; }
  .slide { display: none; width: 100%; max-width: 960px; background: #fff; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.4); overflow: hidden; animation: fadeIn 0.2s ease; }
  .slide.active { display: flex; flex-direction: column; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
  .slide-header { padding: 14px 28px 12px; display: flex; justify-content: space-between; align-items: baseline; }
  .slide-header .session-label { font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; opacity: 0.85; }
  .slide-header .slide-num { font-size: 12px; opacity: 0.6; }
  .phase-intro   { background: #0D6E6E; color: #fff; }
  .phase-twig    { background: #1A5C38; color: #fff; }
  .phase-metrics { background: #1F4E79; color: #fff; }
  .phase-bridge  { background: #4B2D7F; color: #fff; }
  .phase-info    { background: #404040; color: #fff; }
  .phase-pause   { background: #856404; color: #fff; }
  .slide-body { padding: 28px 36px 32px; flex: 1; }
  .slide-title { font-size: 26px; font-weight: bold; color: #1F4E79; margin-bottom: 6px; line-height: 1.2; }
  .slide-subtitle { font-size: 14px; color: #666; margin-bottom: 22px; font-style: italic; }
  .timer { display: inline-block; background: #D6E4F0; color: #1F4E79; font-weight: bold; font-size: 13px; padding: 4px 12px; border-radius: 20px; margin-bottom: 20px; }
  .timer.green { background: #D6EAD9; color: #1A5C38; }
  .timer.warn  { background: #FFF3CD; color: #856404; }
  .timer.purp  { background: #EBE0FF; color: #4B2D7F; }
  .cols { display: grid; gap: 20px; margin-top: 8px; }
  .cols-2 { grid-template-columns: 1fr 1fr; }
  .cols-3 { grid-template-columns: 1fr 1fr 1fr; }
  .card { border-left: 5px solid #1F4E79; background: #F7FAFC; padding: 16px 18px; border-radius: 0 6px 6px 0; }
  .card.green  { border-color: #1A5C38; background: #F0F8F2; }
  .card.teal   { border-color: #0D6E6E; background: #F0F8F8; }
  .card.purple { border-color: #4B2D7F; background: #F5F0FF; }
  .card.gray   { border-color: #888; background: #F8F8F8; }
  .card.warn   { border-color: #c0392b; background: #FEF5F5; }
  .card.amber  { border-color: #d4a017; background: #FFFDE7; }
  .card-title { font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #1F4E79; margin-bottom: 8px; }
  .card.green  .card-title { color: #1A5C38; }
  .card.teal   .card-title { color: #0D6E6E; }
  .card.purple .card-title { color: #4B2D7F; }
  .card.gray   .card-title { color: #555; }
  .card.warn   .card-title { color: #c0392b; }
  .card.amber  .card-title { color: #856404; }
  p { font-size: 15px; line-height: 1.6; color: #222; margin-bottom: 8px; }
  p:last-child { margin-bottom: 0; }
  strong { color: #1F4E79; }
  ul { padding-left: 20px; margin: 6px 0; }
  li { font-size: 15px; line-height: 1.7; color: #222; }
  li + li { margin-top: 2px; }
  .checklist { list-style: none; padding: 0; }
  .checklist li { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; padding: 6px 0; border-bottom: 1px solid #eee; }
  .checklist li:last-child { border-bottom: none; }
  .checklist li .num { width: 22px; height: 22px; background: #1F4E79; color: #fff; font-weight: bold; font-size: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .checklist li .num.green { background: #1A5C38; }
  .instruction { background: #EEF4FB; border: 1px solid #B0CCE6; border-radius: 6px; padding: 14px 18px; font-size: 15px; line-height: 1.6; color: #1a1a2e; font-style: italic; margin: 12px 0; }
  .fac-note { background: #FFFDE7; border-left: 4px solid #F9A825; padding: 10px 14px; border-radius: 0 4px 4px 0; font-size: 13px; color: #555; margin-top: 14px; }
  .fac-note strong { color: #856404; }
  .big-num { font-size: 48px; font-weight: bold; color: #1F4E79; line-height: 1; }
  .big-label { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-top: 2px; }
  .metric-pill { display: inline-block; background: #1F4E79; color: #fff; font-weight: bold; font-size: 13px; padding: 5px 14px; border-radius: 20px; margin: 3px; }
  .metric-pill.green { background: #1A5C38; }
  .metric-pill.teal  { background: #0D6E6E; }
  .metric-pill.purp  { background: #4B2D7F; }
  .timeline { display: flex; gap: 0; margin: 16px 0; overflow: hidden; border-radius: 4px; }
  .timeline-item { flex: 1; padding: 8px 4px; text-align: center; font-size: 10px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.3px; }
  hr { border: none; border-top: 1px solid #E0E8F0; margin: 16px 0; }
  .progress-wrap { position: fixed; bottom: 0; left: 0; width: 100%; height: 4px; background: #333; z-index: 100; }
  .progress-bar { height: 100%; background: #0D6E6E; transition: width 0.3s ease; }
  .nav { position: fixed; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; align-items: center; gap: 12px; z-index: 200; background: rgba(0,0,0,0.75); padding: 8px 16px; border-radius: 30px; backdrop-filter: blur(4px); }
  .nav button { background: #fff; color: #1a1a2e; border: none; cursor: pointer; width: 36px; height: 36px; border-radius: 50%; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; font-weight: bold; }
  .nav button:hover { background: #D6E4F0; }
  .nav button:disabled { opacity: 0.3; cursor: default; }
  .nav .counter { color: #ccc; font-size: 13px; min-width: 60px; text-align: center; }
  .key-hint { color: #888; font-size: 11px; }
  @media print { body { background: white; } .nav, .progress-wrap { display: none !important; } .stage { padding: 0; } .slide { display: flex !important; page-break-after: always; box-shadow: none; border: 1px solid #ccc; max-width: 100%; } .slide:last-child { page-break-after: auto; } }
</style>
</head>
<body>
<div class="stage">

<!-- SLIDE 0: Titel -->
<div class="slide active" id="slide-0">
  <div class="slide-header phase-intro">
    <span class="session-label">Kanban-Schulung lise | Session 2</span>
    <span class="slide-num">1 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Session 2</div>
    <div style="font-size: 30px; font-weight: bold; color: #1F4E79; margin-bottom: 10px;">Aktives Workflow-Management &amp; Flussmetriken</div>
    <div class="slide-subtitle">90 Minuten &nbsp;·&nbsp; Remote (Video + Miro + TWiG) &nbsp;·&nbsp; Kanban-Schulung lise v4</div>
    <div class="timeline">
      <div class="timeline-item" style="background:#0D6E6E; color:#fff;">Rückblick<br/>0–5'</div>
      <div class="timeline-item" style="background:#1A5C38; color:#fff;">TWiG R1<br/>5–23'</div>
      <div class="timeline-item" style="background:#1A5C38; color:#fff;">TWiG R2<br/>23–33'</div>
      <div class="timeline-item" style="background:#2196a8; color:#fff;">Retrieval<br/>33–39'</div>
      <div class="timeline-item" style="background:#1F4E79; color:#fff;">Scatterplot<br/>39–57'</div>
      <div class="timeline-item" style="background:#856404; color:#fff;">Pause<br/>57–62'</div>
      <div class="timeline-item" style="background:#4B2D7F; color:#fff;">Bridging<br/>62–72'</div>
      <div class="timeline-item" style="background:#4B2D7F; color:#fff;">Transfer<br/>72–80'</div>
      <div class="timeline-item" style="background:#555; color:#fff;">Puffer<br/>80–90'</div>
    </div>
    <div class="cols cols-2" style="margin-top: 20px;">
      <div class="card teal">
        <div class="card-title">Lernziel der Session</div>
        <p>Teilnehmende erleben WIP-Limits als Flusshebel (TWiG-Simulation) und können Cycle Time, Throughput, WIP und SLE aus Daten ablesen und erklären.</p>
      </div>
      <div class="card warn">
        <div class="card-title">Eintrittscheck</div>
        <ul>
          <li>Beobachtungsauftrag (Wartezeiten) mitgebracht?</li>
          <li>Wer ohne Beobachtungen erscheint → freundlich ansprechen</li>
          <li>TWiG-Link vorab getestet?</li>
        </ul>
      </div>
    </div>
    <div class="fac-note"><strong>Facilitator:</strong> TWiG niemals streichen. Technische Probleme → sofort Plan B (Blocker-Clustering). Nicht troubleshooten.</div>
  </div>
</div>

<!-- SLIDE 1: Rückblick -->
<div class="slide" id="slide-1">
  <div class="slide-header phase-intro">
    <span class="session-label">Rückblick &nbsp;·&nbsp; 0–5 Min</span>
    <span class="slide-num">2 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Rückblick</div>
    <div class="slide-subtitle">Beobachtungsauftrag auswerten</div>
    <span class="timer">⏱ 5 Minuten</span>
    <div class="instruction">
      <strong>Auftrag an alle:</strong> Wo hat etwas gewartet – und auf wen oder was? Kurz nennen (30 Sek. pro Person), kein Kommentar nötig.
    </div>
    <div class="cols cols-2">
      <div class="card teal">
        <div class="card-title">Facilitator clustert live (Miro)</div>
        <ul>
          <li>Warten auf Review / Freigabe</li>
          <li>Warten auf Information / Rückmeldung</li>
          <li>Warten auf externe Abhängigkeit</li>
          <li>Anderes</li>
        </ul>
        <p style="margin-top:8px; font-size:13px;">→ Cluster sichtbar lassen – wir kommen in der Scatterplot-Analyse darauf zurück</p>
      </div>
      <div class="card gray">
        <div class="card-title">Typisches Muster benennen</div>
        <p>„Ich sehe, viele nennen Wartezeiten auf Freigaben und Reviews. Das ist kein Zufall – und genau das schauen wir uns heute in Daten an."</p>
      </div>
    </div>
    <div class="fac-note"><strong>Facilitator:</strong> Straff halten. 5 Min reichen. Die emotionale Energie kommt aus der Simulation – nicht aus dem Rückblick.</div>
  </div>
</div>

<!-- SLIDE 2: TWiG Briefing R1 -->
<div class="slide" id="slide-2">
  <div class="slide-header phase-twig">
    <span class="session-label">TWiG Runde 1 &nbsp;·&nbsp; 5–23 Min</span>
    <span class="slide-num">3 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">TWiG – Runde 1</div>
    <div class="slide-subtitle">Simulation: WIP-Konfiguration 4-6-4</div>
    <span class="timer green">⏱ 18 Minuten (Spiel + Debriefing)</span>
    <div class="cols cols-2">
      <div class="card green">
        <div class="card-title">Briefing vor Runde 1</div>
        <ul>
          <li>TWiG-Link im Chat: <strong>analytics.actionableagile.com/twig</strong></li>
          <li>WIP-Konfiguration: <strong>4 – 6 – 4</strong> (voreingestellt)</li>
          <li>Ziel: So viele Items fertigstellen wie möglich</li>
          <li>Keine weiteren Erklärungen – einfach spielen</li>
        </ul>
      </div>
      <div class="card amber">
        <div class="card-title">Debriefing nach R1 (~5 Min)</div>
        <ul>
          <li>„Wie viel wurde fertig?"</li>
          <li>„Wie hat sich das angefühlt?"</li>
          <li>„Wo lagen die Engpässe?"</li>
        </ul>
        <p style="margin-top: 8px; font-size: 13px; color: #555;">→ Nicht zu lang: Max. 8 Min. Die Pointe kommt in Runde 2.</p>
      </div>
    </div>
    <div class="instruction">
      Link im Chat: <strong>analytics.actionableagile.com/twig</strong> &nbsp;|&nbsp; Konfiguration R1: WIP <strong>4 – 6 – 4</strong>
    </div>
    <div class="fac-note"><strong>Plan B (wenn TWiG nicht funktioniert):</strong> Sofort auf Blocker-Clustering wechseln. Die Beobachtungen aus dem Rückblick als Material nehmen. Nicht troubleshooten.</div>
  </div>
</div>

<!-- SLIDE 3: TWiG Briefing R2 -->
<div class="slide" id="slide-3">
  <div class="slide-header phase-twig">
    <span class="session-label">TWiG Runde 2 &nbsp;·&nbsp; 23–33 Min</span>
    <span class="slide-num">4 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">TWiG – Runde 2</div>
    <div class="slide-subtitle">Variante mit WIP-Limits oder freie Wahl</div>
    <span class="timer green">⏱ 10 Minuten (Spiel + Debriefing)</span>
    <div class="cols cols-2">
      <div class="card green">
        <div class="card-title">Briefing Runde 2</div>
        <p>„Gleiche Simulation – ihr dürft die WIP-Konfiguration selbst wählen. Oder wir spielen mit: <strong>2 – 2 – 2</strong>."</p>
        <p style="margin-top: 8px;">Empfehlung: Gruppe entscheiden lassen. Das erhöht die Eigenverantwortung für das Ergebnis.</p>
      </div>
      <div class="card">
        <div class="card-title">Debriefing nach R2 (~7 Min)</div>
        <ul>
          <li>„Was war anders – am Ergebnis?"</li>
          <li>„Was war anders – am Gefühl?"</li>
          <li>„Welche Verbindung siehst du zu deinem Arbeitsalltag?"</li>
        </ul>
      </div>
    </div>
    <div class="fac-note"><strong>Kernlearning benennen:</strong> „Je weniger gleichzeitig in Arbeit ist, desto schneller kommen Dinge durch. Das ist kein Gefühl – das ist Little's Law."</div>
  </div>
</div>

<!-- SLIDE 4: Murmel + Retrieval -->
<div class="slide" id="slide-4">
  <div class="slide-header phase-metrics">
    <span class="session-label">Murmelphase + Retrieval Practice &nbsp;·&nbsp; 33–39 Min</span>
    <span class="slide-num">5 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Murmelphase &amp; Retrieval Practice</div>
    <div class="slide-subtitle">Kognitive Verarbeitung + Begriffe verankern</div>
    <span class="timer">⏱ 6 Minuten (3 + 3)</span>
    <div class="cols cols-2">
      <div class="card teal">
        <div class="card-title">Murmelphase (3 Min)</div>
        <div class="instruction" style="margin: 8px 0 0;">
          „Was war dein überraschendstes Erlebnis in der Simulation – und warum?"
        </div>
        <p style="margin-top: 8px; font-size: 13px; color: #555;">1–2 Personen kurz teilen. Kein Sticky nötig. Kein Kommentar vom Facilitator.</p>
      </div>
      <div class="card">
        <div class="card-title">Retrieval Practice (3 Min) – NEU v4</div>
        <div class="instruction" style="margin: 8px 0 0;">
          „Nehmt 2 Minuten. Schreibt ohne nachzuschauen: Welche 4 Flussmetriken kennst du aus dem Handout?"
        </div>
        <p style="margin-top: 8px; font-size: 13px; color: #555;">Dann gemeinsam auflösen. Wer alle vier hat: prima. Wer nicht: normal.</p>
      </div>
    </div>
    <div style="margin-top: 16px; text-align: center;">
      <span class="metric-pill">Cycle Time</span>
      <span class="metric-pill green">Work Item Age</span>
      <span class="metric-pill teal">Throughput</span>
      <span class="metric-pill purp">WIP</span>
    </div>
    <div class="fac-note"><strong>Warum Retrieval?</strong> Begriffe durch Abrufen verankern sich besser als nochmaliges Zeigen. 3 Minuten verdoppeln die Behaltensrate – das ist evidenzbasiert.</div>
  </div>
</div>

<!-- SLIDE 5: Scatterplot-Analyse -->
<div class="slide" id="slide-5">
  <div class="slide-header phase-metrics">
    <span class="session-label">Scatterplot-Analyse &nbsp;·&nbsp; 39–57 Min</span>
    <span class="slide-num">6 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Scatterplot-Analyse</div>
    <div class="slide-subtitle">Cycle Time, SLE und Handout</div>
    <span class="timer">⏱ 18 Minuten</span>
    <div class="cols cols-2">
      <div>
        <div class="card">
          <div class="card-title">Schritt 1: Scatterplot zeigen</div>
          <ul>
            <li>TWiG-Daten der Gruppe öffnen</li>
            <li><strong>Cycle Time</strong> erklären: Zeit von Start bis Ende eines Items</li>
            <li>Ausreißer zeigen: „Was passiert hier?"</li>
          </ul>
        </div>
        <div class="card teal" style="margin-top: 14px;">
          <div class="card-title">Schritt 2: Percentile + SLE</div>
          <p>„In 85% der Fälle war ein Item in X Minuten fertig. Das ist eure SLE: <em>Wir liefern in X Tagen oder wir sprechen darüber.</em>"</p>
        </div>
      </div>
      <div>
        <div class="card green">
          <div class="card-title">Schritt 3: Handout aktivieren</div>
          <p>Flussmetriken-Handout ist das Referenzdokument für den Rest der Session. Teilnehmende sollen es offen haben.</p>
          <ul style="margin-top: 8px;">
            <li>Cycle Time ✓ (gerade erklärt)</li>
            <li>Work Item Age: Was gerade in Bearbeitung ist</li>
            <li>Throughput: Items pro Zeiteinheit</li>
            <li>WIP: Alles zwischen Start und Ende</li>
          </ul>
        </div>
        <div class="card gray" style="margin-top: 14px;">
          <div class="card-title">Wenn Scatterplot überfordert</div>
          <p>Nur Cycle Time + SLE erklären. Rest über das Handout. <strong>Nicht alle 4 Metriken tief erklären.</strong></p>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 6: Pause -->
<div class="slide" id="slide-6">
  <div class="slide-header phase-pause">
    <span class="session-label">Pause &nbsp;·&nbsp; 57–62 Min</span>
    <span class="slide-num">7 / 11</span>
  </div>
  <div class="slide-body" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <div class="big-num" style="color: #856404;">5'</div>
      <div class="big-label">Pause &amp; Stretch</div>
    </div>
    <div class="card amber" style="max-width: 500px; text-align: center;">
      <div class="card-title">Kamera aus – kurz bewegen</div>
      <p>5 Minuten Pause bei 90 Minuten Remote sind keine Verschwendung – sie sichern die Aufnahmefähigkeit für das Bridging.</p>
      <p style="margin-top: 8px; font-size: 13px; color: #555;">Zurück in 5 Minuten. Wer mag: kurz aufstehen, Fenster auf.</p>
    </div>
    <div class="fac-note" style="max-width: 500px; margin-top: 16px;"><strong>Facilitator:</strong> Pause ankündigen, Timer stellen. Nicht früher zurückholen.</div>
  </div>
</div>

<!-- SLIDE 7: Bridging -->
<div class="slide" id="slide-7">
  <div class="slide-header phase-bridge">
    <span class="session-label">Bridging &nbsp;·&nbsp; 62–72 Min</span>
    <span class="slide-num">8 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Bridging</div>
    <div class="slide-subtitle">Simulation → Praxis</div>
    <span class="timer purp">⏱ 10 Minuten</span>
    <p style="font-size: 14px; color: #555; margin-bottom: 16px;">3 Verbindungen zwischen Simulation und Alltag – jede kurz benennen, nicht erklären:</p>
    <ul class="checklist">
      <li>
        <span class="num" style="background: #1F4E79;">1</span>
        <div>
          <strong>Zu viel WIP = lange Cycle Times</strong>
          <p style="font-size: 14px; margin-top: 4px;">WIP-Limit ist kein bürokratisches Instrument – es ist der direkteste Hebel auf Flussgeschwindigkeit.</p>
        </div>
      </li>
      <li>
        <span class="num" style="background: #1A5C38;">2</span>
        <div>
          <strong>Blocker verzögern alles dahinter</strong>
          <p style="font-size: 14px; margin-top: 4px;">Blocker sichtbar machen ist aktives Workflow-Management. Ein unsichtbarer Blocker ist kein Blocker – es ist Zufall.</p>
        </div>
      </li>
      <li>
        <span class="num" style="background: #4B2D7F;">3</span>
        <div>
          <strong>Blocker in Übergängen = fehlende Exit Criteria</strong>
          <p style="font-size: 14px; margin-top: 4px;">Die Policies aus S1 greifen hier: Wann darf ein Item weiterziehen? Wer entscheidet das?</p>
        </div>
      </li>
    </ul>
    <div class="fac-note"><strong>Facilitator:</strong> Konkret werden: Blocker aus dem Rückblick aufgreifen. „[Name] hat erzählt, dass Reviews oft warten..." – das ist kein Zufall, das ist ein Pattern.</div>
  </div>
</div>

<!-- SLIDE 8: Transfer-Commitment -->
<div class="slide" id="slide-8">
  <div class="slide-header phase-bridge">
    <span class="session-label">Transfer-Commitment &nbsp;·&nbsp; 72–80 Min</span>
    <span class="slide-num">9 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Transfer-Commitment</div>
    <div class="slide-subtitle">Eine Sache, die ich in meinen Workflow nehme</div>
    <span class="timer purp">⏱ 8 Minuten</span>
    <div class="instruction">
      „Schreib einen Satz: <strong>Ich werde _______ einführen / ändern / sichtbar machen.</strong> Konkret genug, dass du es nächste Woche erklären könntest."
    </div>
    <div class="cols cols-2" style="margin-top: 8px;">
      <div class="card purple">
        <div class="card-title">Beispiel-Sätze</div>
        <ul>
          <li>Ich werde ein WIP-Limit von 3 für unsere Spalte „In Progress" einführen.</li>
          <li>Ich werde Blocker im Board als BLOCKED markieren, sobald sie auftreten.</li>
          <li>Ich werde eine Exit Criteria für unsere Review-Spalte aufschreiben.</li>
        </ul>
      </div>
      <div class="card gray">
        <div class="card-title">Commitment sichern</div>
        <ul>
          <li>Jede:r liest den Satz laut vor</li>
          <li>Keine Bewertung – nur Hören</li>
          <li>Optional: Screenshot machen</li>
        </ul>
        <p style="margin-top: 8px; font-size: 13px;">→ Commitment-Runde darf nicht fallen, auch wenn Zeit knapp</p>
      </div>
    </div>
  </div>
</div>

<!-- SLIDE 9: Vorab-Auftrag S3 -->
<div class="slide" id="slide-9">
  <div class="slide-header phase-bridge">
    <span class="session-label">Abschluss &amp; Vorab-Auftrag S3 &nbsp;·&nbsp; ~80 Min</span>
    <span class="slide-num">10 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">Bis zur nächsten Session</div>
    <div class="slide-subtitle">Vorab-Auftrag S3 – Pflicht</div>
    <span class="timer warn">⏱ 10–15 Min Aufwand zwischen den Sessions</span>
    <div class="card purple" style="margin-bottom: 16px;">
      <div class="card-title">Workflow-Retro vorbereiten</div>
      <p>Beantworte schriftlich drei Fragen zu deinem aktuellen Workflow:</p>
      <ul style="margin-top: 8px;">
        <li>Was funktioniert bereits gut?</li>
        <li>Was blockiert den Fluss – und gibt es eine Policy dafür?</li>
        <li>Was ist mein nächster Schritt – und woran erkenne ich, ob er gewirkt hat?</li>
      </ul>
    </div>
    <div class="cols cols-2">
      <div class="card gray">
        <div class="card-title">Format</div>
        <p>Direkt in Miro (Zone A wird wieder verwendet), Notiz, oder kurzer Text in Teams. Hauptsache: konkret und schriftlich.</p>
      </div>
      <div class="card warn">
        <div class="card-title">Eintrittscheck S3</div>
        <p>Wer ohne schriftliche Antworten erscheint, wird gebeten die Session zu verlassen.</p>
      </div>
    </div>
    <div class="fac-note"><strong>Facilitator:</strong> Datum S3 bestätigen. Miro-Link erneuern. Vorab-Auftrag wörtlich vorlesen.</div>
  </div>
</div>

<!-- SLIDE 10: Quick Reference -->
<div class="slide" id="slide-10">
  <div class="slide-header phase-info">
    <span class="session-label">Quick Reference &nbsp;·&nbsp; S2 im Überblick</span>
    <span class="slide-num">11 / 11</span>
  </div>
  <div class="slide-body">
    <div class="slide-title">S2 auf einen Blick</div>
    <div class="slide-subtitle">Ablauf, Zeiten, kritische Punkte</div>
    <table style="width:100%; border-collapse: collapse; font-size: 14px; margin-top: 8px;">
      <thead>
        <tr style="background: #0D6E6E; color: #fff;">
          <th style="padding: 7px 10px; text-align: left;">Phase</th>
          <th style="padding: 7px 10px; text-align: left;">Zeit</th>
          <th style="padding: 7px 10px; text-align: left;">Kerninhalt</th>
          <th style="padding: 7px 10px; text-align: left;">Nie streichen</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #F7FAFC;"><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Rückblick</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">0–5'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Beobachtungen clustern</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">–</td></tr>
        <tr><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">TWiG R1</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">5–23'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">WIP 4-6-4 + Debriefing</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">✓ TWiG</td></tr>
        <tr style="background: #F7FAFC;"><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">TWiG R2</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">23–33'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">WIP 2-2-2 / frei + Debriefing</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">✓ TWiG</td></tr>
        <tr><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Murmel + Retrieval</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">33–39'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">4 Metriken abrufen</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">✓ Murmelphase</td></tr>
        <tr style="background: #F7FAFC;"><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Scatterplot</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">39–57'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Cycle Time + SLE + Handout</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">✓ SLE erklären</td></tr>
        <tr><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Pause</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">57–62'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Kamera aus, Stretch</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">–</td></tr>
        <tr style="background: #F7FAFC;"><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Bridging</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">62–72'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">3 Verbindungen Sim → Praxis</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">–</td></tr>
        <tr><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">Transfer-Commitment</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">72–80'</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">1 Satz pro Person</td><td style="padding: 6px 10px; border-bottom: 1px solid #E0E8F0;">✓ Commitment</td></tr>
        <tr style="background: #F7FAFC;"><td style="padding: 6px 10px;">Puffer</td><td style="padding: 6px 10px;">80–90'</td><td style="padding: 6px 10px;">Vorab-Auftrag S3</td><td style="padding: 6px 10px;">–</td></tr>
      </tbody>
    </table>
    <div class="cols cols-3" style="margin-top: 16px;">
      <div class="card teal" style="text-align:center;"><div class="big-num" style="font-size:32px; color: #0D6E6E;">2</div><div class="big-label">TWiG-Runden</div></div>
      <div class="card green" style="text-align:center;"><div class="big-num" style="font-size:32px; color: #1A5C38;">4</div><div class="big-label">Flussmetriken</div></div>
      <div class="card" style="text-align:center;"><div class="big-num" style="font-size:32px;">90'</div><div class="big-label">Session gesamt</div></div>
    </div>
  </div>
</div>

</div>

<div class="progress-wrap"><div class="progress-bar" id="progressBar"></div></div>
<div class="nav">
  <button id="prevBtn" onclick="navigate(-1)" disabled>&#8592;</button>
  <span class="counter" id="counter">1 / 11</span>
  <button id="nextBtn" onclick="navigate(1)">&#8594;</button>
  <span class="key-hint">&nbsp;← →</span>
</div>
<script>
  const slides = document.querySelectorAll('.slide');
  let current = 0;
  const total = slides.length;
  function navigate(dir) {
    slides[current].classList.remove('active');
    current = Math.max(0, Math.min(total - 1, current + dir));
    slides[current].classList.add('active');
    document.getElementById('counter').textContent = (current + 1) + ' / ' + total;
    document.getElementById('prevBtn').disabled = current === 0;
    document.getElementById('nextBtn').disabled = current === total - 1;
    document.getElementById('progressBar').style.width = ((current + 1) / total * 100) + '%';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') navigate(1);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(-1);
  });
  document.getElementById('progressBar').style.width = (1 / total * 100) + '%';
</script>
</body>
</html>
