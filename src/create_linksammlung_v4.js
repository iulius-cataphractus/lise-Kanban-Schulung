const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  LevelFormat, ExternalHyperlink, PageBreak
} = require('docx');
const fs = require('fs');

// ─── color palette (consistent with other v4 docs) ──────────────────────────
const BLUE   = "1F4E79";
const GRAY   = "404040";
const LBLUE  = "D6E4F0";
const LGRAY  = "F2F2F2";
const GREEN  = "1A5C38";
const LGREEN = "D6EAD9";
const PURP   = "4B2D7F";
const LPURP  = "EBE0FF";
const TEAL   = "0D6E6E";
const LTEAL  = "D0EEEE";
const BORD   = "CCCCCC";
const border  = { style: BorderStyle.SINGLE, size: 1, color: BORD };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
const cellM = { top: 80, bottom: 80, left: 140, right: 140 };

// ─── helpers ─────────────────────────────────────────────────────────────────
function spacer(pts = 120) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun("")] });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 80, after: opts.after || 80 },
    alignment: opts.align || AlignmentType.LEFT,
    children: [new TextRun({
      text,
      bold: opts.bold || false,
      italics: opts.italic || false,
      size: (opts.size || 11) * 2,
      font: "Arial",
      color: opts.color || "000000",
    })]
  });
}

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 28, font: "Arial", color: BLUE })]
  });
}

function h2(text, color = GRAY) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, font: "Arial", color })]
  });
}

function bullet(runs, opts = {}) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 60, after: 60 },
    children: Array.isArray(runs) ? runs : [new TextRun({ text: runs, size: 22, font: "Arial", ...opts })]
  });
}

function link(label, url) {
  return new ExternalHyperlink({
    children: [new TextRun({ text: label, size: 22, font: "Arial", color: BLUE, underline: {} })],
    link: url
  });
}

// ─── resource card: one row per resource ─────────────────────────────────────
// row layout: [TITEL & URL | TYP | AUFWAND | WARUM RELEVANT]
// widths: 3200 + 1200 + 1000 + 3800 = 9200
function resourceCard(title, url, type, effort, rationale, headerFill = LBLUE) {
  const titleRuns = url
    ? [new ExternalHyperlink({
        children: [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: BLUE, underline: {} })],
        link: url
      })]
    : [new TextRun({ text: title, bold: true, size: 22, font: "Arial", color: GRAY })];

  const urlRuns = url
    ? [new Paragraph({ spacing: { before: 40, after: 0 }, children: [new TextRun({ text: url, size: 18, font: "Arial", color: "888888", italics: true })] })]
    : [];

  return new TableRow({
    children: [
      new TableCell({
        borders, width: { size: 3200, type: WidthType.DXA }, margins: cellM,
        children: [
          new Paragraph({ spacing: { before: 0, after: 40 }, children: titleRuns }),
          ...urlRuns
        ]
      }),
      new TableCell({
        borders, width: { size: 1200, type: WidthType.DXA }, margins: cellM,
        shading: { fill: LGRAY, type: ShadingType.CLEAR },
        verticalAlign: "center",
        children: [new Paragraph({ children: [new TextRun({ text: type, size: 20, font: "Arial", color: GRAY })] })]
      }),
      new TableCell({
        borders, width: { size: 1000, type: WidthType.DXA }, margins: cellM,
        shading: { fill: LGRAY, type: ShadingType.CLEAR },
        verticalAlign: "center",
        children: [new Paragraph({ children: [new TextRun({ text: effort, size: 20, font: "Arial", color: GRAY })] })]
      }),
      new TableCell({
        borders, width: { size: 3800, type: WidthType.DXA }, margins: cellM,
        children: [new Paragraph({ children: [new TextRun({ text: rationale, size: 20, font: "Arial" })] })]
      }),
    ]
  });
}

function tableHeader(fill = LBLUE) {
  const hCell = (text, w) => new TableCell({
    borders,
    width: { size: w, type: WidthType.DXA },
    margins: cellM,
    shading: { fill, type: ShadingType.CLEAR },
    children: [new Paragraph({ children: [new TextRun({ text, bold: true, size: 20, font: "Arial" })] })]
  });
  return new TableRow({
    tableHeader: true,
    children: [
      hCell("Quelle", 3200),
      hCell("Typ", 1200),
      hCell("Aufwand", 1000),
      hCell("Warum relevant", 3800),
    ]
  });
}

function resourceTable(rows, fill = LBLUE) {
  return new Table({
    width: { size: 9200, type: WidthType.DXA },
    columnWidths: [3200, 1200, 1000, 3800],
    rows: [tableHeader(fill), ...rows]
  });
}

// ─── section divider bar ──────────────────────────────────────────────────────
function sectionBar(label, fill, textColor = "FFFFFF") {
  return new Table({
    width: { size: 9200, type: WidthType.DXA },
    columnWidths: [9200],
    rows: [new TableRow({ children: [new TableCell({
      borders: noBorders,
      width: { size: 9200, type: WidthType.DXA },
      shading: { fill, type: ShadingType.CLEAR },
      margins: { top: 80, bottom: 80, left: 180, right: 180 },
      children: [new Paragraph({
        children: [new TextRun({ text: label, bold: true, size: 26, font: "Arial", color: textColor })]
      })]
    })]})
    ]
  });
}

// ─── document ─────────────────────────────────────────────────────────────────
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
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: GRAY },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
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
          children: [new TextRun({
            text: "Begleitende Ressourcen | Kanban-Schulung lise | v4 | Stand: M\u00e4rz 2026",
            size: 18, font: "Arial", color: "888888", italics: true
          })]
        })]
      })
    },
    children: [

      // ── Titel
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Begleitende Ressourcen", bold: true, size: 40, font: "Arial", color: BLUE })]
      }),
      new Paragraph({
        spacing: { before: 0, after: 200 },
        children: [new TextRun({ text: "Kanban-Schulung lise \u2013 kuratierte Linksammlung f\u00fcr Teilnehmende", size: 22, font: "Arial", color: GRAY, italics: true })]
      }),

      // ── Einleitung
      new Paragraph({
        spacing: { before: 80, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: BLUE, space: 6 } },
        indent: { left: 360 },
        children: [new TextRun({
          text: "Diese Linksammlung erg\u00e4nzt die drei Schulungssessions. Alle Quellen sind auf die Schulungstiefe abgestimmt und handverlesen: keine \u00dcbersichtsartikel, kein Marketing. Wer tiefer einsteigen m\u00f6chte, findet hier den direkten Weg zu den besten Prim\u00e4rquellen.",
          size: 21, font: "Arial", italics: true
        })]
      }),

      spacer(160),

      // ══════════════════════════════════════════════════════════
      // PFLICHTLEKT\u00dcRE
      // ══════════════════════════════════════════════════════════
      sectionBar("\u2605 Pflichtlekt\u00fcre \u2013 vor Session 1 lesen", BLUE),
      spacer(80),

      p("Diese Quelle ist die Grundlage aller drei Sessions. Ohne sie fehlt das gemeinsame Vokabular.", { italic: true, color: "555555" }),
      spacer(60),

      resourceTable([
        resourceCard(
          "The Kanban Guide",
          "https://prokanban.org/the-kanban-guide/",
          "Guide (PDF)",
          "~15 Min",
          "Der offizielle, kompakte Leitfaden von ProKanban.org. Alle Kernkonzepte (Workflow, WIP, SLE, Policies) auf 8 Seiten. Pflichtlekt\u00fcre vor Session 1.",
          LBLUE
        ),
      ]),

      spacer(200),

      // ══════════════════════════════════════════════════════════
      // SESSION 1
      // ══════════════════════════════════════════════════════════
      sectionBar("Session 1 \u2013 Workflow definieren & visualisieren", GREEN),
      spacer(80),

      resourceTable([
        resourceCard(
          "Kanban Guide (Kanban University)",
          "https://kanban.university/kanban-guide/",
          "Guide (Web)",
          "~20 Min",
          "Alternative Fassung des Kanban-Leitfadens mit Fokus auf STATIK und Visualisierungsprinzipien. Gut als zweite Perspektive neben dem ProKanban Guide.",
          LGREEN
        ),
        resourceCard(
          "Kanban: Successful Evolutionary Change",
          null,
          "Buch",
          "Kap. 1\u20134 (~60 Min)",
          "David J. Anderson, 2010. Das Ursprungswerk. Kapitel 1\u20134 erkl\u00e4ren, wie Kanban-Boards entstanden und warum Workflow-Visualisierung keine Trivialit\u00e4t ist.",
          LGREEN
        ),
        resourceCard(
          "STATIK \u2013 Systems Thinking Approach to Implementing Kanban",
          "https://leankanban.com/statik/",
          "Methode",
          "~10 Min",
          "Die strukturierte Methode, um einen Kanban-Workflow zu designen: von Werteinheiten \u00fcber Zust\u00e4nde bis zu Policies. Direkt anwendbar auf den Vorab-Auftrag von S1.",
          LGREEN
        ),
      ], LGREEN),

      spacer(200),

      // ══════════════════════════════════════════════════════════
      // SESSION 2
      // ══════════════════════════════════════════════════════════
      sectionBar("Session 2 \u2013 Aktives Workflow-Management & Flussmetriken", TEAL),
      spacer(80),

      resourceTable([
        resourceCard(
          "TWiG \u2013 The Workflow Improvement Game (Simulation)",
          "https://analytics.actionableagile.com/twig",
          "Simulation",
          "Live in S2",
          "Die Simulation, die in Session 2 gespielt wird. Vorab testen ist kein Muss, aber wer neugierig ist: Eine Runde dauert ~10 Minuten.",
          LTEAL
        ),
        resourceCard(
          "Actionable Agile Metrics for Predictability",
          "https://actionableagile.com/resources/publications/aafp/",
          "Buch",
          "Kap. 1\u20135 (~90 Min)",
          "Daniel S. Vacanti, 2015. Das Standardwerk f\u00fcr Cycle Time, WIP, Throughput und CFD. Auch als kompakte Blogpost-Serie verf\u00fcgbar auf actionableagile.com.",
          LTEAL
        ),
        resourceCard(
          "When Will It Be Done? (Lean-Agile Forecasting)",
          "https://actionableagile.com/resources/publications/wwibd/",
          "Buch",
          "Kap. 1\u20133 (~60 Min)",
          "Daniel S. Vacanti, 2018. Erg\u00e4nzung mit Fokus auf probabilistische Vorhersage und Service Level Expectations. Ideal f\u00fcr alle, die nach S2 tiefer in SLE und Forecasting einsteigen wollen.",
          LTEAL
        ),
        resourceCard(
          "Flow Metrics \u2013 Free Resources (Focused Objective)",
          "https://www.focusedobjective.com/w/free_resources",
          "Tools & Artikel",
          "nach Bedarf",
          "Troy Magennis / Focused Objective: kostenlose Excel-Tools und Artikel zu Monte-Carlo-Simulationen, Throughput-Histogrammen und WIP-Analyse. Sehr praxisnah.",
          LTEAL
        ),
        resourceCard(
          "Little\u2019s Law \u2013 The Core of Kanban Flow",
          "https://prokanban.org/blog/",
          "Blogpost",
          "~10 Min",
          "Erkl\u00e4rt mathematisch, warum WIP-Limits funktionieren: CT = WIP / TH. Mehrere gute Fassungen auf ProKanban.org und ActionableAgile.com erh\u00e4ltlich.",
          LTEAL
        ),
      ], LTEAL),

      spacer(200),

      // ══════════════════════════════════════════════════════════
      // SESSION 3
      // ══════════════════════════════════════════════════════════
      sectionBar("Session 3 \u2013 Kontinuierliche Verbesserung", PURP),
      spacer(80),

      resourceTable([
        resourceCard(
          "Rethinking Agile (Flight Levels)",
          null,
          "Buch",
          "Kap. 1\u20133 (~45 Min)",
          "Klaus Leopold, 2018. Erkl\u00e4rt, warum Team-Kanban allein nicht reicht und was systemisches Denken (Flight Levels) bedeutet. Gibt Session 3 einen strategischen Rahmen.",
          LPURP
        ),
        resourceCard(
          "Toyota Kata \u2013 Improvement Kata Overview",
          "https://www.toyota-kata.org/",
          "Website",
          "~20 Min",
          "Mike Rother. Die Grundlage f\u00fcr strukturierte Verbesserungsroutinen: Ist-Zustand, Ziel-Zustand, Hindernisse, n\u00e4chster Experiment-Schritt. Passt direkt zum Commitment-Format aus S3.",
          LPURP
        ),
        resourceCard(
          "ProKanban.org Blog & Podcast",
          "https://prokanban.org/blog/",
          "Blog / Podcast",
          "nach Bedarf",
          "Laufend aktualisierte Praxisbeitr\u00e4ge, Case Studies und Interviewepisoden von aktiven Kanban-Practitioners. Gut f\u00fcr langfristiges Dranbleiben nach der Schulung.",
          LPURP
        ),
      ], LPURP),

      spacer(200),

      // ══════════════════════════════════════════════════════════
      // VERTIEFUNG
      // ══════════════════════════════════════════════════════════
      sectionBar("Allgemeine Vertiefung \u2013 f\u00fcr alle, die mehr wollen", "595959"),
      spacer(80),

      resourceTable([
        resourceCard(
          "Kanban Maturity Model (KMM)",
          "https://www.kanbanmaturitymodel.com/",
          "Website",
          "~30 Min",
          "Beschreibt, wie Kanban-Adoption in Organisationen reift \u2013 von individuellem Board bis zu unternehmensweitem Flow. Gut als Orientierungsrahmen f\u00fcr Teams, die weitergehen wollen.",
          LGRAY
        ),
        resourceCard(
          "Agendashift \u2013 Outcome-Oriented Transformation",
          "https://www.agendashift.com/resources",
          "Website & Buch",
          "nach Bedarf",
          "Mike Burrows. Verbindet Kanban-Praktiken mit partizipativer Ver\u00e4nderungsarbeit. Besonders relevant, wenn Schulungsergebnisse in Organisations-/Teamver\u00e4nderungen m\u00fcnden sollen.",
          LGRAY
        ),
      ], LGRAY),

      spacer(200),

      // ══════════════════════════════════════════════════════════
      // HINWEIS
      // ══════════════════════════════════════════════════════════
      new Paragraph({
        spacing: { before: 100, after: 80 },
        border: { left: { style: BorderStyle.SINGLE, size: 8, color: GRAY, space: 6 } },
        indent: { left: 360 },
        children: [new TextRun({
          text: "Alle verlinkten Quellen sind kostenlos zug\u00e4nglich oder als Kurzlesung in B\u00fcchern angegeben. B\u00fccher sind nicht Pflicht \u2013 sie sind f\u00fcr diejenigen, die tiefer einsteigen m\u00f6chten. Keines davon ist Voraussetzung f\u00fcr die Teilnahme an der Schulung.",
          size: 20, font: "Arial", italics: true, color: "555555"
        })]
      }),

    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Linksammlung_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Linksammlung_Kanban-Schulung_v4.docx");
});
