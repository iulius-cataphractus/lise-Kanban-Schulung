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

// ─── ABLAUF TABLE ────────────────────────────────────────────────────────────
const ablaufData = [
  ["Zeit", "Inhalt", "Methode", "Sozialform", "Medium", "E"],
  ["0-5 Min", "Check-in: Vorab-S\u00e4tze teilen. Jede:r liest Satz vor. Facilitator notiert Muster im Miro.", "Blitzlicht", "Plenum", "Miro", "\u2191"],
  ["5-12 Min", "Input: Deming-Zitat. Blocker-Policies (3 Kernfragen). 2 Strategien + 2 Board-Lifehacks kurz anrei\u00dfen (Verweis auf Handout).", "Mini-Input", "Plenum", "2 Folien", "\u2192"],
  ["12-27 Min", "Workflow-Retro am eigenen Miro-Material: 3 Fragen (Was funktioniert? Was blockiert Fluss? Mein n\u00e4chster Schritt + Messung?).", "Strukturierte Einzel-Retro", "Einzelarbeit", "Miro-Vorlage", "\u2192"],
  ["27-47 Min", "Tandems (neue Paare!): Ergebnis teilen, gegenseitig sch\u00e4rfen. 'Ist der Schritt konkret genug? Hast du eine Metrik?' Kurze Workflow-Vorstellung (1 Min pro Person) am Anfang.", "Peer-Feedback", "Breakout-Paare", "\u2013", "\u2191"],
  ["47-55 Min", "Commitment-Runde: 'Mein n\u00e4chster Schritt ist X \u2013 daran erkenne ich in Y Wochen ob es gewirkt hat.' Alle S\u00e4tze ins Miro. + Transfer-Klima-Frage (NEU v2.2) + Follow-up-Angebot (NEU v4).", "Commitment-Runde", "Plenum", "Miro", "\u2192"],
  ["55-57 Min", "Feedback einsammeln: 2-3 Miro-Stickies (Was nimmst du mit? Was w\u00fcrdest du \u00e4ndern?). Optional: Reminder-Ping in 3 Tagen ank\u00fcndigen.", "Feedback", "Einzelarbeit", "Miro", "\u2193"],
  ["57-58 Min", "Ausblick: Lean Coffee als Ort f\u00fcr Workflow-Fragen. Euer SM/Kanban-Expertin ist ansprechbar.", "Abschluss", "Plenum", "\u2013", "\u2193"],
  ["58-60 Min", "Puffer.", "\u2013", "\u2013", "\u2013", "\u2013"],
];
const ablaufWidths = [700, 3500, 1400, 1400, 1000, 300];
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
  ["Lernziel", "Inspect & Adapt als Prinzip verstehen; Blocker-Policies benennen; konkreten, messbaren n\u00e4chsten Schritt committen"],
  ["Voraussetzung", "Ausformulierter Satz: Was w\u00fcrdest du verbessern \u2013 und was bringt das deinem Team? (Pflicht)"],
  ["Material", "Miro-Vorlage Workflow-Retro (3 Fragen), eigenes Workflow-Board aus S1 sichtbar, Folien: Deming-Zitat + Blocker-Policies"],
  ["Nicht k\u00fcrzen", "Commitment-Runde ist das Lernprodukt der gesamten Schulung. Bei Zeitdruck: Einzel-Retro k\u00fcrzen, nie die Commitment-Runde."],
  ["Puffer", "2 Min am Ende eingeplant"],
  ["Paare", "NEUE Paare \u2013 wieder andere Kombination als S1 und S2. \u00dcber die drei Sessions soll jede:r mit mindestens zwei verschiedenen Personen gearbeitet haben."],
  ["Facilitation", "Empfehlung: Zu zweit facilitieren (eine moderiert, eine technisch im Hintergrund)."],
  ["Backup", "Wenn Einzelarbeit nicht zieht: Tandem direkt nach 10 Min starten. Wenn Commitment-Runde zu vage wird: Facilitor gibt Beispiel-Satz vor (eigenes Commitment demonstrieren)."],
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

// ─── BLOCKER TABLE ───────────────────────────────────────────────────────────
const blockerRows = [
  ["Kernfrage", "Warum sie wichtig ist"],
  ["Ab wann ist etwas blockiert? (Stunden? 1 Tag? 2 Tage?)", "Ohne klare Definition bleibt Blocking unsichtbar."],
  ["Wie lange rechnen wir Blocker auf WIP an?", "Wenn blockierte Items auf WIP bleiben: Druck zur Aufl\u00f6sung. Wenn nicht: WIP schwillt an."],
  ["Ab wann verwerfen wir eine blockierte Arbeit?", "Nicht jede blockierte Arbeit ist es wert. Explizite Abbruch-Kriterien reduzieren versteckten WIP."],
];
const blockerWidths = [4000, 5200];

const blockerTable = new Table({
  width: { size: 9200, type: WidthType.DXA },
  columnWidths: blockerWidths,
  rows: blockerRows.map((row, rIdx) => new TableRow({
    tableHeader: rIdx === 0,
    children: row.map((cell, cIdx) => new TableCell({
      borders,
      width: { size: blockerWidths[cIdx], type: WidthType.DXA },
      shading: { fill: rIdx === 0 ? LIGHT_BLUE : (rIdx % 2 === 0 ? "FFFFFF" : LIGHT_GRAY), type: ShadingType.CLEAR },
      margins: cellM,
      children: [new Paragraph({ children: [new TextRun({ text: cell, bold: rIdx === 0, size: 20, font: "Arial" })] })]
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
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [
        new TextRun({ text: "Facilitator-Guide Kanban-Schulung lise", bold: true, size: 36, font: "Arial", color: BLUE })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 200 }, children: [
        new TextRun({ text: "Session 3: Kontinuierliche Verbesserung & n\u00e4chster Schritt  |  v4  |  M\u00e4rz 2026  |  Nur f\u00fcr Kanban-Expertinnen", size: 22, font: "Arial", color: GRAY, italics: true })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "60 Minuten | Remote (Video-Call + Miro) | Commitment-Runde nie streichen", size: 20, font: "Arial", color: GRAY })
      ]}),

      spacer(160),
      h1("Auf einen Blick"),
      overviewTable,

      spacer(200),
      h1("Vorbereitung (vor der Session)"),
      bullet("Miro-Board: Workflow-Retro-Vorlage als Frame vorbereitet (3 Felder: Was funktioniert? / Was blockiert Fluss? / Mein n\u00e4chster Schritt + Metrik)"),
      bullet("Workflow-Boards aus S1 sichtbar: Jede:r soll ihr/sein Board aus S1 w\u00e4hrend S3 offen haben"),
      bullet("Commitment-Board vorbereitet: Leere Sticky-Note-Sammlung f\u00fcr die finalen S\u00e4tze"),
      bullet("Folien: Deming-Zitat + Blocker-Policies-\u00dcbersicht (2 Folien)"),
      bullet("Neue Breakout-Paare festgelegt \u2013 wieder andere als S1 und S2"),
      bullet("Feedback-Bereich im Miro vorbereitet (2-3 leere Stickies: 'Was nimmst du mit?' / 'Was w\u00fcrdest du \u00e4ndern?')"),

      spacer(200),
      h1("Ablauf (60 Minuten)"),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "\u00c4nderungen v4: ", bold: true, size: 20, font: "Arial", color: "006600" }),
        new TextRun({ text: "Einzel-Retro auf 15 Min gek\u00fcrzt, Tandem auf 20 Min erweitert. Feedback-Block neu. Follow-up-Angebot neu. Tandem-Briefing sch\u00e4rfer.", size: 20, font: "Arial", color: "006600" })
      ]}),
      ablaufTable,

      spacer(200),
      h1("Moderationshinweise im Detail"),

      h2("0\u20135 Min: Check-in"),
      p("Alle S\u00e4tze vorlesen lassen. Dann clustern: 'Ich sehe, viele nennen X...' Das macht Muster sichtbar."),

      h2("5\u201312 Min: Input"),
      p("Einstieg mit Deming-Zitat \u2013 w\u00f6rtlich vorlesen:"),
      infoBox("Deming-Zitat",
        "'Ohne Daten bist du auch nur jemand weiteres mit einer Meinung.' \u2013 W. Edwards Deming"),
      p("Dann Blocker-Policies zeigen (3 Kernfragen). Nicht als Hausaufgabe, sondern als Impuls. 2-3 L\u00f6sungsstrategien und 2 Board-Lifehacks nur anrei\u00dfen \u2013 Verweis aufs Handout: 'Die k\u00f6nnt ihr nach der Session in Ruhe nachlesen.'"),
      spacer(80),
      p("Die 3 Kernfragen f\u00fcr Blocker-Policies:", { bold: true }),
      blockerTable,

      spacer(120),
      p("L\u00f6sungsstrategien (kurz benennen, nicht erkl\u00e4ren):", { bold: true }),
      bullet("Pair/Swarm: Zwei oder mehr Personen arbeiten gemeinsam am Blocker."),
      bullet("Eskalieren: Blocker au\u00dferhalb des Teams: nach X Tagen an Person Y eskalieren."),
      bullet("Time-Boxing: Max. 2 Stunden investieren. Ungel\u00f6st? Zur\u00fcklegen."),
      bullet("Visuell flaggen: Rote Flagge, BLOCKED-Label im Board."),
      bullet("Blocker als Retro-Thema: Wiederkehrende Blocker sind systemisch \u2013 Retro, nicht Ad-hoc."),

      h2("12\u201327 Min: Workflow-Retro"),
      p("Stille Einzelarbeit in Miro. Die drei Fragen:"),
      bullet("Was funktioniert in meinem Workflow bereits gut?"),
      bullet("Was blockiert den Fluss \u2013 und habe ich eine Policy daf\u00fcr?"),
      bullet("Was ist mein n\u00e4chster Schritt \u2013 und woran erkenne ich in X Wochen, ob er gewirkt hat?"),
      spacer(80),
      p("Wenn jemand nach 10 Minuten fertig scheint: 'Ist der n\u00e4chste Schritt konkret genug, dass du ihn morgen fr\u00fch angehen kannst?'"),
      p("Remote-Einzelarbeit in der Gruppe f\u00fchlt sich isolierend an \u2013 15 Min (statt 20) reduziert das, und das Tandem bekommt mehr Sch\u00e4rfungszeit."),

      h2("27\u201347 Min: Tandems (NEU: 20 Min + sch\u00e4rferes Briefing)"),
      infoBox("Tandem-Briefing (vorlesen)",
        "'Ihr arbeitet heute mit jemand Neuem. Stellt euch kurz gegenseitig euren Workflow vor \u2013 1 Minute pro Person. Dann teilt eure Retro-Ergebnisse. Person B: Stelle eine Frage \u2013 Ist der n\u00e4chste Schritt konkret genug? Hast du eine Metrik daf\u00fcr? Helft euch gegenseitig, vage S\u00e4tze scharf zu machen. Dann tauschen.'"),
      p("20 Minuten f\u00fcr das Tandem erlauben echtes Sch\u00e4rfen \u2013 nicht nur Teilen. Das ist der produktivste Lernmodus dieser Session."),

      h2("47\u201355 Min: Commitment-Runde (die wichtigste Phase)"),
      infoBox("Commitment-Formulierung (vorlesen)",
        "'Jede:r formuliert jetzt einen Satz \u2013 und nur einen. Das Format: Mein n\u00e4chster Schritt ist [konkrete Ma\u00dfnahme]. Daran erkenne ich in [Zeitraum], ob es gewirkt hat: [Messgr\u00f6\u00dfe oder Beobachtung].' Alle S\u00e4tze kommen ins Miro. Kein Kommentieren, kein Bewerten."),

      spacer(80),
      p("Transfer-Klima-Frage (nach der Commitment-Runde):", { bold: true }),
      infoBox("Transfer-Klima-Frage",
        "'Noch eine Frage: Welcher eurer Schritte braucht nur euch \u2013 und welcher braucht R\u00fcckendeckung von PM oder F\u00fchrung? Notiert das kurz neben eurem Commitment.' Das macht Transfer-Hindernisse sichtbar und gibt euch als Kanban-Expertinnen Material f\u00fcr die Nacharbeit."),

      spacer(80),
      p("Follow-up-Angebot (NEU v4, optional):", { bold: true }),
      infoBox("Follow-up-Angebot (optional, wer will)",
        "'Noch ein Angebot zum Abschluss: Wer m\u00f6chte, dass ich mich in 3 Wochen kurz bei ihm/ihr melde und frage, wie es l\u00e4uft? Schreibt einfach 'Ja' auf euer Commitment-Sticky oder sagt kurz Bescheid.' Kein Tracking, kein Druck \u2013 nur ein Angebot f\u00fcr die, die es m\u00f6chten."),

      h2("55\u201357 Min: Feedback einsammeln"),
      p("Vor dem Abschluss: Feedback direkt in der Session, nicht danach (sonst realistisch nicht mehr auswertbar)."),
      infoBox("Feedback-Fragen im Miro",
        "'Bevor wir abschlie\u00dfen: 2 kurze Fragen im Miro. 1 Sticky je Frage: Was nimmst du aus den drei Sessions mit? Was h\u00e4ttest du dir anders oder besser gew\u00fcnscht?' 1-2 Minuten, dann Abschluss."),
      p("Optional: 3-Tage-Reminder ank\u00fcndigen: 'Ich schicke euch in 3 Tagen eine kurze Nachricht mit dem Link zum Miro-Board \u2013 dann habt ihr nochmal Gelegenheit, Feedback zu hinterlassen.'"),

      h2("57\u201358 Min: Ausblick & Abschluss"),
      p("Kanban lebt durch Kontinuit\u00e4t. Lean Coffee ist der richtige Ort f\u00fcr Workflow-Fragen. Flurgespr\u00e4che sind oft wertvoller als formale Termine. Eure Kanban-Expertin ist ansprechbar."),
      p("Optional: KI-Kontext (1-2 S\u00e4tze):"),
      infoBox("Optionaler KI-Kontext",
        "'Explizite Policies \u2013 das was ihr gerade erarbeitet habt \u2013 sind \u00fcbrigens auch die Voraussetzung daf\u00fcr, dass KI-Agenten regelbasiert in eurem Workflow handeln k\u00f6nnten. Implizite Regeln existieren f\u00fcr einen Agenten nicht.' Nur wenn es nat\u00fcrlich passt."),

      spacer(200),
      h1("Typische Fehler & wie du sie vermeidest"),
      bullet("Input dauert zu lang: Zeitbox 7 Min. L\u00f6sungsstrategien nur anrei\u00dfen, nicht erkl\u00e4ren."),
      bullet("Commitment-S\u00e4tze zu vage: Nachfragen: 'Was w\u00fcrdest du nach 3 Wochen beobachten, wenn es besser l\u00e4uft?'"),
      bullet("Einzelarbeit zieht sich: Nach 12 Min sanft anstupen: 'Noch 3 Minuten, dann gehts ins Tandem.'"),
      bullet("Transfer-Klima-Frage weglassen wenn Zeit knapp: Nicht tun. Eine S\u00e4tze reicht \u2013 aber die Frage stellen."),
      bullet("Feedback weglassen wenn Zeit knapp: Besser kurz einsammeln als gar nicht. 2 Stickies in 90 Sekunden ist m\u00f6glich."),
      bullet("Follow-up-Angebot f\u00fchlt sich aufdringlich an: Es ist ein Angebot, kein Pflichtprogramm. Wer nicht will, sagt einfach nichts."),

      spacer(200),
      greenBox("Feedback-Auswertung \u2013 Hinweis",
        "Feedback-Stickies nach der Session in eine kurze Notiz \u00fcbertragen (5 Min) und im Repo ablegen. Das ist die Grundlage f\u00fcr die n\u00e4chste Iteration der Schulung. Wenn das Format wiederholt wird, zahlt diese Dokumentation sich aus."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Facilitator-Guide_S3_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Facilitator-Guide_S3_Kanban-Schulung_v4.docx");
});
