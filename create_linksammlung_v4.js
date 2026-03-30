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
const YELLOW = "FFF2CC";
const GREEN_LIGHT = "E2EFDA";
const BC = "CCCCCC";
const border = { style: BorderStyle.SINGLE, size: 1, color: BC };
const borders = { top: border, bottom: border, left: border, right: border };
const cellM = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  const children = [];
  if (opts.prefix) children.push(new TextRun({ text: opts.prefix + " ", bold: true, size: 22, font: "Arial" }));
  children.push(new TextRun({ text, size: 22, font: "Arial", bold: opts.bold || false, italics: opts.italic || false, color: opts.color || "000000" }));
  return new Paragraph({ spacing: { before: opts.before || 100, after: opts.after || 100 }, alignment: opts.align || AlignmentType.LEFT, children });
}

function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: BLUE })] });
}

function h2(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 180, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: GRAY })] });
}

function h3(text) {
  return new Paragraph({ spacing: { before: 140, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: GRAY })] });
}

function bullet(text, indent = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level: indent },
    spacing: { before: 60, after: 60 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function warnBox(title, text) {
  const rows = [
    new TableRow({ children: [new TableCell({
      borders, shading: { fill: "FFE6CC", type: ShadingType.CLEAR }, margins: cellM,
      width: { size: 9200, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: "C00000" })] }),
        new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] }),
      ]
    })]})
  ];
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200], rows });
}

function infoBox(title, text) {
  const rows = [
    new TableRow({ children: [new TableCell({
      borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: cellM,
      width: { size: 9200, type: WidthType.DXA },
      children: [
        new Paragraph({ spacing: { before: 60, after: 40 }, children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: BLUE })] }),
        new Paragraph({ spacing: { before: 40, after: 60 }, children: [new TextRun({ text, size: 22, font: "Arial" })] }),
      ]
    })]})
  ];
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200], rows });
}

function makeRow(cells, colWidths, isHeader = false, shade = "FFFFFF") {
  return new TableRow({
    tableHeader: isHeader,
    children: cells.map((cell, i) => new TableCell({
      borders,
      width: { size: colWidths[i], type: WidthType.DXA },
      shading: { fill: isHeader ? LIGHT_BLUE : shade, type: ShadingType.CLEAR },
      margins: cellM,
      verticalAlign: VerticalAlign.TOP,
      children: [new Paragraph({ children: [
        new TextRun({ text: typeof cell === 'object' ? cell.text : cell, bold: (typeof cell === 'object' && cell.bold) || isHeader, size: isHeader ? 20 : 20, font: "Arial" })
      ]})]
    }))
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun("")] });
}

// ─── ABLAUF TABLE ────────────────────────────────────────────────────────────
const ablaufRows = [
  ["Zeit", "Inhalt", "Methode", "Sozialform", "Medium", "E"],
  ["0-5 Min", "Check-in: Blitzlicht + Sch\u00e4tzung (Neu V4)\n\"Bevor wir starten: Schreibt in den Chat eine Zahl \u2013 wie viele Arbeitstage dauert ein typisches Work Item bei euch, bis es fertig ist?\" Zahlen sammeln, Streuung sichtbar machen: \"Interessant \u2013 von X bis Y. Genau daf\u00fcr ist heute. Jede:r nennt dann kurz: Was hat dich beim Skizzieren \u00fcberrascht?\"", "Blitzlicht + Sch\u00e4tzung", "Plenum", "Chat + Miro", "\u2191"],
  ["5-20 Min", "Peer-Review Runde 1: Person A erkl\u00e4rt Workflow (max. 5 Min), Person B stellt Fragen anhand DoW-Checkliste. B erg\u00e4nzt direkt im Miro-Board von A.", "Strukturiertes Peer-Interview", "Breakout-Paare", "Miro + Checkliste", "\u2192"],
  ["20-35 Min", "Peer-Review Runde 2: Rollen tauschen. Gleiche Struktur: B erkl\u00e4rt, A fragt anhand Checkliste.", "Strukturiertes Peer-Interview", "Breakout-Paare", "Miro + Checkliste", "\u2192"],
  ["35-50 Min", "Debriefing: Was fehlte am h\u00e4ufigsten? SLE-Konzept als Vorschau verankern. Offene Fragen kl\u00e4ren. Optional: KI-Kontext (siehe Moderationshinweis).", "Moderiertes Gespr\u00e4ch", "Plenum", "Miro", "\u2193"],
  ["50-55 Min", "Abschluss: Jede:r benennt 1 konkretes offenes Element. Vorab-Auftrag S2 bekannt geben.", "Kurz-Runde", "Plenum", "\u2013", "\u2192"],
  ["55-60 Min", "Puffer \u2013 bei reibungslosem Ablauf f\u00fcr zus\u00e4tzliche Debriefing-Frage oder fr\u00fcheren Abschluss nutzen.", "\u2013", "\u2013", "\u2013", "\u2013"],
];
const ablaufWidths = [700, 3400, 1400, 1400, 1100, 400];

const ablaufTable = new Table({
  width: { size: 8400, type: WidthType.DXA },
  columnWidths: ablaufWidths,
  rows: ablaufRows.map((row, rIdx) => new TableRow({
    tableHeader: rIdx === 0,
    children: row.map((cell, cIdx) => new TableCell({
      borders,
      width: { size: ablaufWidths[cIdx], type: WidthType.DXA },
      shading: { fill: rIdx === 0 ? LIGHT_BLUE : (rIdx % 2 === 0 ? "FFFFFF" : LIGHT_GRAY), type: ShadingType.CLEAR },
      margins: cellM,
      verticalAlign: VerticalAlign.TOP,
      children: cell.split('\n').map((line, li) => new Paragraph({
        spacing: { before: li === 0 ? 0 : 60, after: 0 },
        children: [new TextRun({ text: line, bold: rIdx === 0, size: 18, font: "Arial" })]
      }))
    }))
  }))
});

// ─── DOW CHECKLISTE TABLE ────────────────────────────────────────────────────
const dowRows = [
  ["DoW-Element", "Leitfrage f\u00fcr Peer-Interview"],
  ["1. Werteinheiten", "Was flie\u00dft durch deinen Workflow? Was ist deine 'Penny'?"],
  ["2. Start- & Endpunkt", "Wann startest du offiziell an etwas? Wann ist es wirklich fertig?"],
  ["3. Definierte Zust\u00e4nde", "Welche Stationen durchl\u00e4uft eine Arbeit? Sind Wartezeiten sichtbar? Tipp: Teile Spalten in 'In Arbeit' und 'Fertig/Bereit' auf."],
  ["4. WIP-Steuerung", "Gibt es eine Begrenzung, wie viel gleichzeitig in Arbeit ist?"],
  ["5. Explizite Policies", "Welche Regeln gelten, wann Arbeit weiterr\u00fccken darf? Aufgeschrieben?"],
  ["6. SLE (Vorschau)", "Gibt es eine Erwartung, wie lange eine Arbeit maximal dauern sollte? (Vertiefung in S2)"],
];
const dowWidths = [2800, 6400];

const dowTable = new Table({
  width: { size: 9200, type: WidthType.DXA },
  columnWidths: dowWidths,
  rows: dowRows.map((row, rIdx) => new TableRow({
    tableHeader: rIdx === 0,
    children: row.map((cell, cIdx) => new TableCell({
      borders,
      width: { size: dowWidths[cIdx], type: WidthType.DXA },
      shading: { fill: rIdx === 0 ? LIGHT_BLUE : (rIdx % 2 === 0 ? "FFFFFF" : LIGHT_GRAY), type: ShadingType.CLEAR },
      margins: cellM,
      children: [new Paragraph({ children: [new TextRun({ text: cell, bold: rIdx === 0, size: 20, font: "Arial" })] })]
    }))
  }))
});

// ─── OVERVIEW TABLE ──────────────────────────────────────────────────────────
const overviewRows = [
  ["Lernziel", "Eigenen Team-Workflow mit den 6 DoW-Bausteinen strukturieren; SLE konzeptuell verstehen; Peer-Feedback zur eigenen Visualisierung erhalten"],
  ["Voraussetzung", "Workflow-Skizze in Miro fertig (Pflicht \u2013 wer ohne kommt, nimmt nicht teil)"],
  ["Material", "DoW-Peer-Review-Checkliste (Anhang), Miro-Board vorbereitet"],
  ["Backup", "Beispiel-Workflow in Miro bereithalten (f\u00fcr eigene Demo falls Konzepte unklar werden)"],
  ["Puffer", "5 Min am Ende eingeplant \u2013 bei reibungslosem Ablauf f\u00fcr eine zus\u00e4tzliche Debriefing-Frage nutzen"],
  ["Facilitation", "Empfehlung: Zu zweit facilitieren (eine Person moderiert, eine ist technisch im Hintergrund). F\u00fcr erste Durchf\u00fchrungen stark empfohlen."],
];
const overviewWidths = [2200, 7000];

const overviewTable = new Table({
  width: { size: 9200, type: WidthType.DXA },
  columnWidths: overviewWidths,
  rows: overviewRows.map((row, rIdx) => new TableRow({
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
        new TextRun({ text: "Session 1: Workflow definieren & visualisieren  |  v4  |  M\u00e4rz 2026  |  Nur f\u00fcr Kanban-Expertinnen", size: 22, font: "Arial", color: GRAY, italics: true })
      ]}),

      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "60 Minuten | Remote (Video-Call + Miro) | Breakout-Rooms aktiv halten", size: 20, font: "Arial", color: GRAY })
      ]}),

      spacer(160),
      h1("Auf einen Blick"),
      overviewTable,

      spacer(200),
      h1("Vorbereitung (vor der Session)"),
      bullet("Miro-Board angelegt: Eigene Boards f\u00fcr alle Teilnehmenden vorbereitet"),
      bullet("DoW-Checkliste im Miro als Sticky-Note-Template oder Kommentar-Vorlage bereit"),
      bullet("Breakout-Rooms im Video-Call voreingestellt (Paare bekannt \u2013 idealerweise gemischt nach Rolle: Dev+PO, Frontend+Backend)"),
      bullet("Liste der angemeldeten Teilnehmenden \u2013 wer fehlt oder unvorbereitet ist, wird freundlich verwiesen"),
      bullet("Beispiel-Workflow als eigene Folie/Frame in Miro (f\u00fcr Demo bei Bedarf)"),
      bullet("Facilitation-Partner:in einweisen (technische Rolle: Breakouts verwalten, Chat beobachten, Countdown geben)"),

      spacer(120),
      warnBox("Reminder: Team-Workflow \u2013 nicht pers\u00f6nlicher Workflow",
        "Falls im Check-in auff\u00e4llt, dass jemand den pers\u00f6nlichen statt den Team-Workflow mitgebracht hat: Freundlich kl\u00e4ren. 'Gemeint ist der Workflow eures Teams \u2013 also wie Arbeit durch euer Board flie\u00dft. Nicht deine pers\u00f6nliche To-do-Liste.' Wer in mehreren Teams ist: eines ausw\u00e4hlen."),

      spacer(120),
      warnBox("\u26a0\ufe0f Session-Start: Teilnahme-Check",
        "Bevor die Session startet, kurz pr\u00fcfen, wer eine fertige Workflow-Skizze in Miro hat. Wenn jemand ohne Skizze erscheint: 'Hey [Name], ich sehe dass deine Miro-Skizze noch fehlt. Die Skizze ist die Grundlage f\u00fcr die heutige Session \u2013 ohne sie k\u00f6nnen wir das Peer-Review nicht sinnvoll durchf\u00fchren. Ich muss dich bitten, heute auszusteigen und dich f\u00fcr die n\u00e4chste Runde anzumelden. Das gilt f\u00fcr alle gleich.'"),

      spacer(200),
      h1("Ablauf (60 Minuten)"),
      new Paragraph({ spacing: { before: 0, after: 80 }, children: [
        new TextRun({ text: "\u00c4nderung v4: ", bold: true, size: 20, font: "Arial", color: "006600" }),
        new TextRun({ text: "Check-in erg\u00e4nzt durch Sch\u00e4tzfrage (emotionaler Einstieg). Tandem-Facilitation empfohlen.", size: 20, font: "Arial", color: "006600" })
      ]}),
      ablaufTable,

      spacer(200),
      h1("Moderationshinweise im Detail"),

      h2("0\u20135 Min: Check-in + Sch\u00e4tzfrage (NEU v4)"),
      p("Starte mit der Sch\u00e4tzfrage, bevor du den Blitzlicht-Check-in machst:"),
      infoBox("Formulierung Sch\u00e4tzfrage",
        "\"Bevor wir loslegen \u2013 schreibt bitte in den Chat eine Zahl: Wie viele Arbeitstage dauert ein typisches Work Item bei euch, bis es fertig ist? Einfach eine Sch\u00e4tzung, keine Recherche.\""),
      p("Zahlen sammeln (10\u201315 Sekunden), dann die Streuung aufzeigen: 'Ihr habt Zahlen von X bis Y. Das ist eine sp\u00e4nnende Spanne \u2013 und genau das, was wir heute besser verstehen wollen.' Dann in das normale Blitzlicht \u00fcbergehen: Jede:r nennt kurz, was sie/er beim Skizzieren \u00fcberrascht hat oder schwieriger als erwartet war."),
      p("Halte das Blitzlicht kurz. Wenn jemand ausf\u00fchrlich wird: 'Danke, das ist wertvoll \u2013 wir notieren das f\u00fcrs Debriefing.' Notiere im Miro sichtbar, was du h\u00f6rst."),

      h2("5\u201335 Min: Peer-Review"),
      p("Gib den Paaren klare Instruktionen (vorlesen):"),
      infoBox("Briefing Peer-Review",
        "\"Ihr habt 15 Minuten. Person A: Erkl\u00e4re deinen Workflow \u2013 max. 5 Minuten. Person B: Stelle Fragen anhand der Checkliste und erg\u00e4nze direkt im Miro-Board von A. Nach 15 Minuten kommt ihr zur\u00fcck und wir tauschen.\""),
      p("Gib nach 13 Minuten einen Countdown im Chat. Wenn ein Paar fr\u00fcher fertig ist: zweites Durchlesen der Checkliste."),

      h2("35\u201350 Min: Debriefing"),
      p("Sammle zuerst: 'Was fehlte am h\u00e4ufigsten?' \u2013 Gruppe antworten lassen, bevor du inhaltlich einsteigst."),
      p("Typische Muster:", { bold: true }),
      bullet("SLE fehlt bei fast allen: 'SLE gibt es als Idee ab heute \u2013 die Berechnung machen wir in Session 2 aus echten Daten.' (Vorschau, nicht vertiefen)"),
      bullet("Werteinheiten unklar: 'Was ist bei euch die kleinste sinnvolle Einheit, die jemand wertsch\u00e4tzt?'"),
      bullet("Policies nicht explizit: 'Das ist der h\u00e4ufigste blinde Fleck. Implizite Regeln sind unsichtbar f\u00fcr neue Teammitglieder.'"),
      bullet("Spalten nicht geteilt: 'Teile Spalten in In Arbeit und Fertig/Bereit auf \u2013 so entsteht ein klares Signal, was gezogen werden darf.'"),

      spacer(80),
      infoBox("Optionaler KI-Kontext (1-2 S\u00e4tze, nur wenn es nat\u00fcrlich passt)",
        "'\u00dcbrigens: Was ihr gerade gemacht habt \u2013 \u00dcbergabepunkte klar definieren, Policies explizit machen \u2013 ist auch die Voraussetzung daf\u00fcr, dass KI-Agenten irgendwann in eurem Workflow arbeiten k\u00f6nnen. Aber das ist Zukunftsmusik. Heute z\u00e4hlt: Euer Board ist klarer.' Das KI-Thema ist ein optionaler Kontext-Satz, kein Pflichtblock. Der Kernnutzen (Flow, Sichtbarkeit, Policies) tr\u00e4gt allein."),

      h2("50\u201355 Min: Abschluss"),
      p("Kurze Runde: Jede:r nennt ein offenes Element (max. 1 Satz). Vorab-Auftrag S2:"),
      infoBox("Vorab-Auftrag S2 (vorlesen)",
        "'Bis zur n\u00e4chsten Session: Beobachte deinen Arbeitsalltag. Wo wartet etwas auf jemanden? Wo stockt der Fluss? Notiere 2\u20133 konkrete Situationen \u2013 mit Zeitangabe wenn m\u00f6glich.'"),

      spacer(200),
      h1("Typische Fehler & wie du sie vermeidest"),
      bullet("Debriefing frisst zu viel Zeit: Zeitbox 12 Min hart einhalten. Offene Fragen in Miro notieren, nicht live l\u00f6sen."),
      bullet("Sch\u00e4tzfrage dauert zu lang: Zahlen einsammeln und weitermachen \u2013 keine Diskussion vor dem Review."),
      bullet("Jemand war unvorbereitet und ist trotzdem drin: Intern notieren. Beim n\u00e4chsten Mal konsequenter."),
      bullet("Teilnehmer:in hat pers\u00f6nlichen statt Team-Workflow: Freundlich kl\u00e4ren (siehe Reminder oben). Wenn m\u00f6glich im Peer-Review auf Team-Perspektive lenken."),
      bullet("Breakout-Paare kommen nicht rechtzeitig zur\u00fcck: Countdown im Chat, zur Not \u00fcber 'Breakout beenden'."),

      spacer(200),
      h1("Anhang: DoW-Peer-Review-Checkliste"),
      new Paragraph({ spacing: { before: 80, after: 120 }, children: [
        new TextRun({ text: "Hinweis an B: ", bold: true, size: 20, font: "Arial" }),
        new TextRun({ text: "Nicht alle 6 Elemente m\u00fcssen vollst\u00e4ndig ausgef\u00fcllt sein \u2013 es geht um Verst\u00e4ndnisfragen, nicht um Bewertung.", size: 20, font: "Arial" })
      ]}),
      dowTable,
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Facilitator-Guide_S1_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Facilitator-Guide_S1_Kanban-Schulung_v4.docx");
});
