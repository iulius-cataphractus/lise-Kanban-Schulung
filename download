const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat
} = require('docx');
const fs = require('fs');

const BLUE = "1F4E79";
const GRAY = "404040";
const LIGHT_BLUE = "D6E4F0";
const LIGHT_GRAY = "F2F2F2";
const BC = "CCCCCC";
const border = { style: BorderStyle.SINGLE, size: 1, color: BC };
const borders = { top: border, bottom: border, left: border, right: border };
const cellM = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 100, after: opts.after || 100 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({ text, size: 22, font: "Arial", bold: opts.bold || false, italics: opts.italic || false, color: opts.color || "000000" })]
  });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: BLUE })] });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: GRAY })] });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function infoBox(title, text) {
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200],
    rows: [new TableRow({ children: [new TableCell({
      borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: cellM,
      width: { size: 9200, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: BLUE })] }),
        new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] }),
      ]
    })]})],
  });
}

function warnBox(title, text) {
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200],
    rows: [new TableRow({ children: [new TableCell({
      borders, shading: { fill: "FFE6CC", type: ShadingType.CLEAR }, margins: cellM,
      width: { size: 9200, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: "C00000" })] }),
        new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] }),
      ]
    })]})],
  });
}

function greenBox(title, text) {
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200],
    rows: [new TableRow({ children: [new TableCell({
      borders, shading: { fill: "E2EFDA", type: ShadingType.CLEAR }, margins: cellM,
      width: { size: 9200, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: "375623" })] }),
        new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] }),
      ]
    })]})],
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun("")] });
}

// ─── ABLAUF TABLE (90 Min, Option A) ────────────────────────────────────────
// Timing: 0+5+18+10+3+3+18+5+10+8+10 = 90
const ablaufData = [
  ["Zeit", "Inhalt", "Methode", "Sozialform", "Medium", "E"],
  ["0-5 Min", "R\u00fcckblick: 'Was habt ihr seit S1 beobachtet? Wo hat Arbeit gewartet?' Jede:r nennt 1 Beobachtung. Facilitator clustert auf Blocker-Board.", "Blitzlicht + Clustering", "Plenum", "Miro", "\u2191"],
  ["5-23 Min", "TWiG Runde 1 (WIP 4-6-4): Simulation (~10 Min) + Debriefing R1 (~8 Min). 'Was ist passiert? Wie viel wurde fertig? Wie hat sich das angef\u00fchlt?'", "Simulation + Debriefing", "Breakout-Paare", "TWiG + Miro", "\u2191"],
  ["23-33 Min", "TWiG Runde 2 (Kontrast): Neue WIP-Grenzen (2-2-2 oder eigene Entscheidung der Gruppe \u2013 siehe Hinweis). Debriefing R2: 'Was war anders? Warum?' (~7 Min)", "Simulation + Debriefing", "Breakout-Paare", "TWiG + Miro", "\u2191"],
  ["33-36 Min", "Murmelphase: 'Was war euer \u00fcberraschendstes Erlebnis in der Simulation?' 1 Satz im Chat. Facilitator liest 2-3 vor. Keine Diskussion \u2013 nur Ankommen.", "Murmelphase", "Plenum", "Chat", "\u2192"],
  ["36-39 Min", "Retrieval Practice (NEU v4): 'Bevor wir zum Scatterplot kommen: Schreibt in 2 Minuten die vier Flussmetriken auf, die ihr gerade erlebt habt \u2013 ohne nachzuschauen.' Aufl\u00f6sung zusammen.", "Retrieval Practice", "Einzelarbeit + Plenum", "Chat/Miro", "\u2192"],
  ["39-57 Min", "Scatterplot-Analyse: Cycle Time erkl\u00e4ren anhand eigener TWiG-Daten. Percentile zeigen. SLE gemeinsam ableiten. Verweis auf Flussmetriken-Handout f\u00fcr WIP, Throughput, Work Item Age.", "Geleitete Analyse", "Plenum", "Miro + Folie", "\u2193"],
  ["57-62 Min", "Pause / Stretch (5 Min): Kamera aus, kurz bewegen.", "Pause", "\u2013", "\u2013", "\u2193"],
  ["62-72 Min", "Bridging: 'Was aus der Simulation kennt ihr aus eurem Alltag?' 3 typische Verbindungen. Optional: KI-Kontext.", "Moderiertes Gespr\u00e4ch", "Plenum", "Miro", "\u2192"],
  ["72-80 Min", "Transfer-Commitment: Vorab-Auftrag S3 ausgeben. Jede:r formuliert: 'Was beobachte ich bis zur n\u00e4chsten Session gezielt?' Commitment im Miro.", "Commitment", "Plenum", "Miro", "\u2192"],
  ["80-90 Min", "Puffer (10 Min) \u2013 f\u00fcr l\u00e4ngeres Bridging, Nachfragen oder fr\u00fcheren Abschluss.", "\u2013", "\u2013", "\u2013", "\u2013"],
];
const ablaufWidths = [700, 3400, 1400, 1400, 1000, 300];
const ablaufTotalW = ablaufWidths.reduce((a, b) => a + b, 0);

const ablaufTable = new Table({
  width: { size: ablaufTotalW, type: WidthType.DXA },
  columnWidths: ablaufWidths,
  rows: ablaufData.map((row, rIdx) => new TableRow({
    tableHeader: rIdx === 0,
    children: row.map((cell, cIdx) => new TableCell({
      borders,
      width: { size: ablaufWidths[cIdx], type: WidthType.DXA },
      shading: { fill: rIdx === 0 ? LIGHT_BLUE : (rIdx % 2 === 0 ? "FFFFFF" : LIGHT_GRAY), type: ShadingType.CLEAR },
      margins: cellM,
      verticalAlign: VerticalAlign.TOP,
      children: [new Paragraph({ children: [new TextRun({ text: cell, bold: rIdx === 0, size: 18, font: "Arial" })] })]
    }))
  }))
});

// ─── OVERVIEW TABLE ──────────────────────────────────────────────────────────
const overviewRows = [
  ["Lernziel", "Fluss erleben (TWiG); Cycle Time und SLE verstehen und berechnen; eigene Blocker einordnen"],
  ["Voraussetzung", "2-3 Blocker-Beobachtungen aus dem Arbeitsalltag (Pflicht)"],
  ["Material", "TWiG-Simulation vorbereitet (getwigged.com), Miro-Board mit Scatterplot-Vorlage, Flussmetriken-Handout (alle 4 Metriken)"],
  ["Dauer", "90 Minuten (Option A \u2013 beschlossen am 27.03.2026)"],
  ["Backup", "Wenn TWiG technisch scheitert: Blocker-Clustering direkt starten (Breakouts mit eigenen Beobachtungen)"],
  ["Puffer", "10 Min am Ende eingeplant"],
  ["Paare", "NEUE Paare \u2013 bewusst andere Kombination als S1. Gemischt nach Rolle."],
  ["Facilitation", "Empfehlung: Zu zweit facilitieren. Bei 90 Min besonders wertvoll: eine Person h\u00e4lt die Zeit, die andere moderiert inhaltlich."],
];
const overviewWidths = [2200, 7000];

const overviewTable = new Table({
  width: { size: 9200, type: WidthType.DXA },
  columnWidths: overviewWidths,
  rows: overviewRows.map((row) => new TableRow({
    children: row.map((cell, cIdx) => new TableCell({
      borders,
      width: { size: overviewWidths[cIdx], type: WidthType.DXA },
      shading: { fill: cIdx === 0 ? LIGHT_BLUE : "FFFFFF", type: ShadingType.CLEAR },
      margins: cellM,
      children: [new Paragraph({ children: [new TextRun({ text: cell, bold: cIdx === 0, size: 20, font: "Arial" })] })]
    }))
  }))
});

// ─── DOCUMENT ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: {
    config: [{
      reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 720, hanging: 360 } } }
      }]
    }]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GRAY },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 1 } },
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({ text: "Facilitator-Guide | Kanban-Schulung lise | v4 | Stand: M\u00e4rz 2026 | ", size: 18, font: "Arial", color: "888888" }),
            new TextRun({ text: "DREHBUCH \u2013 NICHT ZUR WEITERGABE AN TEILNEHMENDE", size: 18, font: "Arial", color: "CC0000", bold: true }),
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [
        new TextRun({ text: "Facilitator-Guide Kanban-Schulung lise", bold: true, size: 36, font: "Arial", color: BLUE })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 200 }, children: [
        new TextRun({ text: "Session 2: Aktives Workflow-Management & Flussmetriken  |  v4  |  M\u00e4rz 2026  |  Nur f\u00fcr Kanban-Expertinnen", size: 22, font: "Arial", color: GRAY, italics: true })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "90 Minuten | Remote (Video-Call + Miro + TWiG) | TWiG-Simulation nie streichen", size: 20, font: "Arial", color: GRAY })
      ]}),

      spacer(160),
      h1("Auf einen Blick"),
      overviewTable,

      spacer(200),
      h1("Vorbereitung (vor der Session)"),
      bullet("TWiG-Simulation eingerichtet und getestet (getwigged.com) \u2013 Runde 1: WIP 4-6-4, Runde 2: WIP 2-2-2 (oder offene Variante \u2013 siehe Hinweis)"),
      bullet("Miro-Board: Scatterplot-Vorlage, Blocker-Clustering-Frame, Bridging-Frame"),
      bullet("Neue Breakout-Paare festgelegt \u2013 bewusst andere Kombination als S1. Ziel: Andere Workflows kennenlernen, frische Perspektiven auf eigene Blocker. Idealerweise wieder gemischt nach Rolle."),
      bullet("Flussmetriken-Handout bereit (als Miro-Element oder PDF zum Teilen) \u2013 alle 4 Metriken"),
      bullet("Facilitation-Partner:in einweisen (Zeitmanagement bei 90 Min besonders wichtig)"),
      bullet("Kalender-Einladung auf 90 Min pr\u00fcfen"),

      spacer(200),
      h1("Ablauf (90 Minuten \u2013 Option A)"),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "\u00c4nderungen v4: ", bold: true, size: 20, font: "Arial", color: "006600" }),
        new TextRun({ text: "Session auf 90 Min erweitert. Murmelphase ausgebaut. Retrieval Practice neu. Pause/Stretch eingebaut. Mehr Bridging- und Transfer-Zeit. 10 Min Puffer.", size: 20, font: "Arial", color: "006600" })
      ]}),
      ablaufTable,

      spacer(200),
      h1("Moderationshinweise im Detail"),

      h2("0\u20135 Min: R\u00fcckblick"),
      p("Kurz und fokussiert. Jede:r eine Beobachtung. Du clusterst live im Miro: 'Ich sehe, viele nennen Warten auf Reviews...' Das wird dein Bridging-Material."),

      h2("5\u201333 Min: TWiG-Simulation"),
      p("Briefing vor Runde 1:"),
      infoBox("Briefing TWiG Runde 1",
        "\"Ihr spielt gleich eine Simulation. Ziel: Arbeit abschlie\u00dfen. Euer WIP-Limit ist 4-6-4. Arbeitet so gut ihr k\u00f6nnt.\""),
      p("Nach Runde 1 \u2013 Debriefing-Fragen: 'Wie viel wurde fertig? Wie hat sich das angef\u00fchlt? Wo lagen die Engp\u00e4sse?' (ca. 8 Min)"),
      p("Briefing Runde 2:"),
      infoBox("Briefing TWiG Runde 2 (zwei Varianten)",
        "Standard-Variante (empfohlen f\u00fcr erste Durchf\u00fchrungen): 'Gleiche Simulation. Neues WIP-Limit: 2-2-2. Sonst alles gleich.'\n\nOffene Variante (Benes Ansatz, f\u00fcr erfahrene Gruppen): 'Gleiche Simulation. Entscheidet selbst als Team: Was \u00e4ndert ihr, um mehr durchzubekommen? Ihr habt 2 Minuten Planungszeit.' Dann starten. Das gibt der Gruppe mehr Autonomie und f\u00fchrt zu reicheren Debriefing-Diskussionen."),
      p("Nach Runde 2: 'Was war anders? Was hat sich ver\u00e4ndert \u2013 am Ergebnis UND am Gef\u00fchl?' (ca. 7 Min)"),
      p("Wenn TWiG technisch nicht funktioniert: Sofort auf Plan B wechseln (Blocker-Clustering mit eigenen Beobachtungen in Breakouts)."),

      h2("33\u201336 Min: Murmelphase"),
      infoBox("Formulierung Murmelphase",
        "'Bevor wir in die Zahlen gehen: Schreibt in den Chat \u2013 was war euer \u00fcberraschendstes Erlebnis in der Simulation? Einen Satz.' Facilitator liest 2-3 Antworten vor. Keine Diskussion \u2013 nur Ankommen."),
      p("Diese 3 Minuten sind kein nice-to-have \u2013 sie sind der kognitive Puffer zwischen Simulation (Emotion/Aktion) und Scatterplot (Analyse). Ohne sie verlierst du die H\u00e4lfte der Aufmerksamkeit f\u00fcr die Metriken."),

      h2("36\u201339 Min: Retrieval Practice (NEU v4)"),
      infoBox("Retrieval-Aufgabe",
        "'Jetzt eine kurze \u00dcbung: Schreibt ohne nachzuschauen \u2013 welche vier Flussmetriken habt ihr gerade in der Simulation erlebt? Ihr habt 90 Sekunden.' Antworten einsammeln, dann aufl\u00f6sen: Cycle Time, WIP, Throughput, Work Item Age."),
      p("Didaktischer Grund: Retrieval verankert Begriffe besser als nochmaliges Zeigen. Die 3 Minuten verdoppeln die Wahrscheinlichkeit, dass die Metriken eine Woche sp\u00e4ter noch pr\u00e4sent sind."),

      h2("39\u201357 Min: Scatterplot-Analyse"),
      p("Zeige den Scatterplot aus der TWiG-Simulation. Erkl\u00e4re Cycle Time anhand der Daten, die die Gruppe gerade selbst erzeugt hat."),
      p("Dann: Percentile zeigen. 'In 85% eurer Items waren in X Minuten fertig. Das ist eure SLE: Wir liefern 85% der Items in X Minuten oder weniger.'"),
      p("Verweis auf Flussmetriken-Handout:"),
      infoBox("Handout-Verweis (vorlesen)",
        "'In der Simulation habt ihr vier Dinge erlebt: wie lange Items brauchen (Cycle Time), wie viel gleichzeitig in Arbeit war (WIP), wie viel fertig wurde (Throughput), und wie lange offene Items schon liegen (Work Item Age). Wir konzentrieren uns jetzt auf Cycle Time \u2013 weil daraus eure SLE entsteht. Die anderen drei findet ihr auf dem Handout \u2013 die sind genauso wichtig, aber ihr braucht sie nicht alle heute.'"),

      h2("57\u201362 Min: Pause / Stretch"),
      p("Kamera aus, kurz bewegen. 5 Minuten sind keine Verschwendung bei 90 Minuten Remote \u2013 sie sichern die Aufmerksamkeit f\u00fcr Bridging und Transfer."),

      h2("62\u201372 Min: Bridging"),
      p("3 typische Verbindungen zwischen Simulation und Praxis:"),
      bullet("Zu viel WIP = lange Cycle Times: WIP-Limit als Hebel (Kern-Learning der Simulation)"),
      bullet("Blocker verz\u00f6gern alles dahinter: Blocker sichtbar machen ist Fluss-Management"),
      bullet("Blocker in \u00dcberg\u00e4ngen = fehlende Exit Criteria: Policies aus S1 greifen hier"),
      spacer(80),
      infoBox("Optionaler KI-Kontext (1-2 S\u00e4tze)",
        "'Eine SLE ist nicht nur f\u00fcr euer Team n\u00fctzlich \u2013 sie w\u00e4re auch der Interventions-Trigger f\u00fcr einen KI-Agenten: Wenn ein Item \u00e4lter als X Tage ist, eskaliere. Aber das ist Zukunftsmusik. Heute z\u00e4hlt: Ihr habt jetzt eine messbare Erwartung.' Das KI-Thema ist optional \u2013 nutze es nur wenn es nat\u00fcrlich passt."),

      h2("72\u201380 Min: Transfer-Commitment"),
      infoBox("Vorab-Auftrag S3 (vorlesen)",
        "'Formuliere einen Satz: Was w\u00fcrde ich an meinem Workflow als erstes verbessern \u2013 und was bringt das meinem Team?' Jede:r notiert im Miro. Kein Kommentieren."),

      spacer(200),
      h1("Typische Fehler & wie du sie vermeidest"),
      bullet("TWiG funktioniert nicht: Sofort Plan B (Blocker-Clustering). Nicht 10 Minuten troubleshooten."),
      bullet("Debriefing Runde 1 dauert zu lang: Max. 8 Minuten. Die Pointe kommt in Runde 2."),
      bullet("Murmelphase weglassen wenn Zeit knapp: Nicht tun. Die 3 Minuten schlechteste Sparoption \u2013 sie sichern die Scatterplot-Aufmerksamkeit."),
      bullet("Retrieval weglassen wenn Zeit knapp: Erlaubt. Wenn gek\u00fcrzt werden muss, lieber Transfer-Zeit k\u00fcrzen als Retrieval."),
      bullet("Scatterplot \u00fcberfordert: Nur Cycle Time + SLE erkl\u00e4ren. Rest \u00fcbers Handout."),
      bullet("Bridging zu abstrakt: Konkreten Blocker aus dem R\u00fcckblick aufgreifen: '[Name] hat erz\u00e4hlt, dass Reviews 3 Tage warten. Das ist genau das, was wir in der Simulation gesehen haben.'"),
      bullet("Puffer aufgebraucht: Kein Problem \u2013 der Puffer ist genau daf\u00fcr. Transfer-Commitment darf nicht fallen."),

      spacer(200),
      greenBox("Feedback einsammeln \u2013 Hinweis f\u00fcr Kanban-Expertinnen",
        "Feedback direkt am Ende der Session einsammeln \u2013 nicht danach schicken (Marcel Geist, 27.03.2026). Empfehlung: 2-3 Feedback-Stickies im Miro am Ende des Transfer-Blocks ('Was nimmst du mit? Was w\u00fcrdest du \u00e4ndern?'). Optional: Erinnerungs-Ping an Teilnehmende 3 Tage sp\u00e4ter mit Link zum Miro-Board."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Facilitator-Guide_S2_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Facilitator-Guide_S2_Kanban-Schulung_v4.docx");
});
