const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, ExternalHyperlink
} = require('docx');
const fs = require('fs');

// ─── helpers ──────────────────────────────────────────────────────────────────
const GRAY_HEADER = "404040";
const BLUE_ACCENT = "1F4E79";
const LIGHT_BLUE  = "D6E4F0";
const LIGHT_GRAY  = "F2F2F2";
const BORDER_COLOR= "CCCCCC";
const border = { style: BorderStyle.SINGLE, size: 1, color: BORDER_COLOR };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorders = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};
const cellM = { top: 100, bottom: 100, left: 150, right: 150 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.spaceBefore || 120, after: opts.spaceAfter || 120 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text,
      bold: opts.bold || false,
      size: (opts.size || 11) * 2,
      font: "Arial",
      color: opts.color || "000000",
      italics: opts.italic || false,
    })]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 160 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: BLUE_ACCENT })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 120 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color: GRAY_HEADER })]
  });
}

function bullet(text, bold_prefix = null, opts = {}) {
  const children = [];
  if (bold_prefix) {
    children.push(new TextRun({ text: bold_prefix + " ", bold: true, size: 22, font: "Arial" }));
  }
  children.push(new TextRun({ text, size: 22, font: "Arial" }));
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children,
  });
}

function makeTable(rows, colWidths, headerRow = false) {
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: tableWidth, type: WidthType.DXA },
    columnWidths: colWidths,
    rows: rows.map((row, rIdx) => new TableRow({
      tableHeader: headerRow && rIdx === 0,
      children: row.map((cell, cIdx) => new TableCell({
        borders,
        width: { size: colWidths[cIdx], type: WidthType.DXA },
        shading: (headerRow && rIdx === 0)
          ? { fill: LIGHT_BLUE, type: ShadingType.CLEAR }
          : (rIdx % 2 === 0 ? { fill: "FFFFFF", type: ShadingType.CLEAR } : { fill: LIGHT_GRAY, type: ShadingType.CLEAR }),
        margins: cellM,
        children: [new Paragraph({
          children: [new TextRun({
            text: cell.text || cell,
            bold: (typeof cell === 'object' && cell.bold) || (headerRow && rIdx === 0),
            size: 20,
            font: "Arial",
          })]
        })]
      }))
    }))
  });
}

function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun("")] });
}

// ─── document ─────────────────────────────────────────────────────────────────

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: BLUE_ACCENT },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GRAY_HEADER },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
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
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE_ACCENT, space: 1 } },
          spacing: { before: 0, after: 80 },
          children: [new TextRun({
            text: "Einladungstemplate | Kanban-Schulung lise | v4 | Stand: März 2026",
            size: 18, font: "Arial", color: "888888", italics: true
          })]
        })]
      })
    },
    children: [

      // ── Titel
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "Einladung: Kanban-Schulung", bold: true, size: 40, font: "Arial", color: BLUE_ACCENT })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "3 Sessions | Remote | [ZEITRAUM ERGÄNZEN]", size: 22, font: "Arial", color: GRAY_HEADER, italics: true })]
      }),

      // ── Hinweis
      new Paragraph({
        spacing: { before: 0, after: 160 },
        children: [new TextRun({
          text: "Dieses Format wurde mit Kanban-Schulungsteilnehmenden bei lise entwickelt und wird von Kanban-Expertinnen eigenständig durchgeführt.",
          size: 20, font: "Arial", color: "666666", italics: true
        })]
      }),

      // ── Was ist das?
      h1("Worum geht es?"),
      p("Kanban-Expertinnen bei lise haben Kanban systematisch gelernt. Jetzt tragen wir dieses Wissen gemeinsam in die Teams – nicht als Theorie-Vortrag, sondern als aktives Arbeiten an deinem eigenen Team-Workflow."),
      p("In drei Sessions wirst du den Workflow deines Teams visualisieren, Verbesserungspotenziale erkennen und einen konkreten nächsten Schritt formulieren – mit direktem Nutzen für eure tägliche Arbeit."),

      spacer(160),

      // ── Überblick
      h1("Überblick: 3 Sessions"),
      p("Alle Sessions finden remote statt (Video-Call + Miro). Zwischen den Sessions liegen bewusst einige Tage – diese Zeit brauchst du für den jeweiligen Vorab-Auftrag."),

      spacer(120),

      makeTable([
        ["Session", "Thema", "Dauer", "Datum", "Vorab-Auftrag (Pflicht)"],
        ["Session 1", "Workflow definieren & visualisieren", "60 Min", "[DATUM]", "Skizze des Team-Workflows in Miro (Details unten)"],
        ["Session 2", "Aktives Workflow-Management & Flussmetriken", "90 Min", "[DATUM]", "2–3 Beobachtungen: Wo gibt es Blocker / stockt der Fluss? (Details unten)"],
        ["Session 3", "Kontinuierliche Verbesserung & nächster Schritt", "60 Min", "[DATUM]", "Einen Satz: Was würdest du verbessern & was bringt das? (Details unten)"],
      ], [1800, 3500, 1000, 1000, 3400], true),

      spacer(160),

      // ── Teilnahmebedingung
      h1("Wichtig: Teilnahmebedingung"),
      p("Der Vorab-Auftrag vor jeder Session ist Pflicht – er ist die Grundlage für die gemeinsame Arbeitszeit. Wer ohne abgeschlossenen Vorab-Auftrag erscheint, kann nicht teilnehmen und meldet sich für die nächste Runde an."),
      p("Diese Regel gilt für alle gleich – sie schützt die Gruppenqualität und sichert, dass die Zeit für alle wirklich produktiv ist. Die Vorab-Aufträge dauern je 10–15 Minuten."),

      spacer(160),

      // ── Vorab-Aufträge
      h1("Die Vorab-Aufträge im Detail"),

      h2("Vor Session 1: Den Team-Workflow skizzieren"),
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: 'Was ist gemeint mit \u201eWorkflow\u201c? ', bold: true, size: 22, font: "Arial" }),
          new TextRun({ text: "Gemeint ist der Workflow deines Teams – also wie Arbeit in dem Projekt oder Team fließt, an dem du arbeitest. Das ist in der Regel das Board, das du in Jira, Azure DevOps oder einem ähnlichen Tool siehst. Nicht gemeint ist dein persönlicher Arbeitsstil oder deine persönliche To-do-Liste. Wenn du in mehreren Teams arbeitest, wähle eines aus.", size: 22, font: "Arial" }),
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: "Zur Vorbereitung empfiehlt sich: ", bold: true, size: 22, font: "Arial" }),
        ]
      }),
      new Paragraph({
        numbering: { reference: "bullets", level: 0 },
        spacing: { before: 60, after: 60 },
        children: [
          new TextRun({ text: "Der ", size: 22, font: "Arial" }),
          new ExternalHyperlink({
            children: [new TextRun({ text: "Kanban Guide von ProKanban.org", size: 22, font: "Arial", style: "Hyperlink", color: "1F4E79", underline: {} })],
            link: "https://prokanban.org/the-kanban-guide/",
          }),
          new TextRun({ text: " (kostenlos, ca. 15 Minuten Lesen) – ein kompakter Überblick über Kanban-Grundbegriffe.", size: 22, font: "Arial" }),
        ]
      }),
      bullet("Zus\u00e4tzlich empfiehlt sich eine kurze Video-Recherche zum Einstieg (z.B. Suche nach 'Kanban Grundlagen 10 Minuten' auf YouTube). Diese Materialien sind keine optionale Vorbereitung \u2013 sie sind die Wissensbasis f\u00fcr Session 1."),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: "Anschließend skizzierst du den Workflow deines Teams in Miro – so wie er wirklich ist, nicht wie er sein sollte. Die Skizze bringst du fertig in Session 1.", size: 22, font: "Arial" })]
      }),

      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: "Miro-Board: ", bold: true, size: 22, font: "Arial" }),
          new TextRun({ text: "[LINK ERGÄNZEN]", size: 22, font: "Arial", color: "CC0000" }),
        ]
      }),

      new Paragraph({
        spacing: { before: 120, after: 160 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: BLUE_ACCENT, space: 6 } },
        indent: { left: 360 },
        children: [
          new TextRun({ text: "Einstiegscheck – Skizze als Eintrittskarte: ", bold: true, size: 22, font: "Arial", color: BLUE_ACCENT }),
          new TextRun({ text: "Zu Beginn von Session 1 wird kurz geprüft, ob eine fertige Miro-Skizze vorliegt. Wer ohne Skizze erscheint, wird freundlich, aber konsequent gebeten, die Session zu verlassen und sich für die nächste Runde anzumelden. Das gilt für alle gleich.", size: 22, font: "Arial" }),
        ]
      }),

      h2("Vor Session 2: Blocker beobachten"),
      p("Zwischen Session 1 und 2 beobachtest du deinen Arbeitsalltag: Wo wartet etwas auf jemanden? Wo gibt es Blocker – Dinge, die den Fluss aufhalten? Notiere 2–3 konkrete Beobachtungen – mit Zeitangaben wenn möglich. Diese bringst du in Session 2."),

      h2("Vor Session 3: Einen Verbesserungssatz formulieren"),
      p("Nach Session 2 formulierst du einen Satz: Was w\u00fcrdest du an deinem Workflow als erstes verbessern \u2013 und was bringt das deinem Team? Genau einen Satz. Diesen bringst du in Session 3."),

      spacer(160),

      // ── Was dich erwartet
      h1("Was dich erwartet"),
      p("Die Sessions sind aktive Arbeitszeit an deinem eigenen Kontext – mit Peer-Feedback, Simulation und konkreten Arbeitsergebnissen. Am Ende der drei Sessions hast du:"),

      bullet("einen visualisierten, mit Kanban-Konzepten angereicherten Team-Workflow"),
      bullet("ein Verständnis für Flussmetriken und wie du sie für deine Arbeit nutzt"),
      bullet("eine SLE (Service Level Expectation) als Ausgangspunkt für Messung"),
      bullet("einen konkreten nächsten Schritt, den du direkt angehen kannst"),

      spacer(100),
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [new TextRun({ text: "Kein Frontalunterricht – alle Sessions sind aktive Arbeitszeit, kein Zuschauen.", size: 20, font: "Arial", color: "666666", italics: true })]
      }),

      spacer(160),

      // ── Anmeldung
      h1("Anmeldung & Rückfragen"),
      new Paragraph({
        spacing: { before: 120, after: 120 },
        children: [
          new TextRun({ text: "Melde dich bis [DATUM] an unter: ", size: 22, font: "Arial" }),
          new TextRun({ text: "[ANMELDEWEG ERGÄNZEN]", size: 22, font: "Arial", color: "CC0000" }),
        ]
      }),
      new Paragraph({
        spacing: { before: 80, after: 120 },
        children: [
          new TextRun({ text: "Bei Fragen wende dich an ", size: 22, font: "Arial" }),
          new TextRun({ text: "[NAME KANBAN-EXPERTIN] ([EMAIL])", size: 22, font: "Arial", color: "CC0000" }),
          new TextRun({ text: ".", size: 22, font: "Arial" }),
        ]
      }),
      p("Wir freuen uns auf dich."),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Einladungstemplate_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Einladungstemplate_Kanban-Schulung_v4.docx");
});
