const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, AlignmentType, HeadingLevel, BorderStyle, WidthType, ShadingType,
  VerticalAlign, LevelFormat, ExternalHyperlink
} = require('docx');
const fs = require('fs');

const BLUE = "1F4E79";
const GRAY = "404040";
const LIGHT_BLUE = "D6E4F0";
const LIGHT_GRAY = "F2F2F2";
const YELLOW = "FFF9C4";
const GREEN = "E8F5E9";
const ORANGE = "FFF3E0";
const PURPLE = "F3E5F5";
const BC = "CCCCCC";
const border = { style: BorderStyle.SINGLE, size: 1, color: BC };
const borders = { top: border, bottom: border, left: border, right: border };
const cellM = { top: 80, bottom: 80, left: 120, right: 120 };

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: opts.before || 80, after: opts.after || 80 },
    children: [new TextRun({ text, size: opts.size || 20, font: "Arial", bold: opts.bold || false, color: opts.color || "000000", italics: opts.italic || false })]
  });
}
function h1(text) {
  return new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, font: "Arial", color: BLUE })] });
}
function h2(text, color) {
  return new Paragraph({ spacing: { before: 140, after: 80 },
    children: [new TextRun({ text, bold: true, size: 22, font: "Arial", color: color || GRAY })] });
}
function spacer(pts = 80) {
  return new Paragraph({ spacing: { before: pts, after: 0 }, children: [new TextRun("")] });
}
function bullet(text) {
  return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 20, font: "Arial" })] });
}

// ─── 4 METRIC CARDS ──────────────────────────────────────────────────────────
function metricCard(name, color, tagline, definition, twig, tool, hint) {
  const rows = [
    // Header row
    new TableRow({ children: [new TableCell({
      borders, columnSpan: 2,
      width: { size: 9200, type: WidthType.DXA },
      shading: { fill: color, type: ShadingType.CLEAR }, margins: cellM,
      children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [
        new TextRun({ text: name, bold: true, size: 26, font: "Arial", color: BLUE }),
        new TextRun({ text: "   \u2014   " + tagline, size: 20, font: "Arial", color: GRAY }),
      ]})]
    })]})
  ];
  // Content rows: label + value
  const contentRows = [
    ["Was ist das?", definition],
    ["TWiG-Beispiel", twig],
    ["Im Tool finden", tool],
    ["Praxis-Tipp", hint],
  ];
  contentRows.forEach(([label, val]) => {
    rows.push(new TableRow({ children: [
      new TableCell({
        borders,
        width: { size: 1800, type: WidthType.DXA },
        shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR }, margins: cellM,
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 18, font: "Arial" })] })]
      }),
      new TableCell({
        borders,
        width: { size: 7400, type: WidthType.DXA },
        shading: { fill: "FFFFFF", type: ShadingType.CLEAR }, margins: cellM,
        children: [new Paragraph({ children: [new TextRun({ text: val, size: 18, font: "Arial" })] })]
      }),
    ]}));
  });
  return new Table({ width: { size: 9200, type: WidthType.DXA }, columnWidths: [1800, 7400], rows });
}

// ─── SLE CARD ───────────────────────────────────────────────────────────────
function sleCard() {
  return new Table({
    width: { size: 9200, type: WidthType.DXA },
    columnWidths: [9200],
    rows: [
      new TableRow({ children: [new TableCell({
        borders,
        width: { size: 9200, type: WidthType.DXA },
        shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR }, margins: { top: 120, bottom: 120, left: 150, right: 150 },
        children: [
          new Paragraph({ spacing: { before: 40, after: 60 }, children: [
            new TextRun({ text: "SLE (Service Level Expectation)", bold: true, size: 26, font: "Arial", color: BLUE }),
            new TextRun({ text: "   \u2014   Deine messbare Lieferversprechen", size: 20, font: "Arial", color: GRAY }),
          ]}),
          new Paragraph({ spacing: { before: 0, after: 60 }, children: [
            new TextRun({ text: "Definition: ", bold: true, size: 18, font: "Arial" }),
            new TextRun({ text: "Eine SLE ist ein Wahrscheinlichkeitsversprechen: \"Wir liefern X% unserer Work Items in Y Tagen oder weniger.\" Keine Garantie \u2013 eine datenbasierte Erwartung.", size: 18, font: "Arial" }),
          ]}),
          new Paragraph({ spacing: { before: 40, after: 60 }, children: [
            new TextRun({ text: "Berechnung: ", bold: true, size: 18, font: "Arial" }),
            new TextRun({ text: "Scatterplot aller Cycle Times \u2192 85. Perzentil ablesen = SLE. Beispiel: 85% der Items waren in 12 Tagen fertig \u2192 SLE: \"85% in 12 Tagen.\"", size: 18, font: "Arial" }),
          ]}),
          new Paragraph({ spacing: { before: 40, after: 60 }, children: [
            new TextRun({ text: "Warum 85%? ", bold: true, size: 18, font: "Arial" }),
            new TextRun({ text: "Nicht 100% \u2013 Ausrei\u00dfer w\u00fcrden die SLE unrealistisch hoch machen. 85% ist der Industriestandard f\u00fcr die erste SLE.", size: 18, font: "Arial" }),
          ]}),
          new Paragraph({ spacing: { before: 40, after: 40 }, children: [
            new TextRun({ text: "Einsatz: ", bold: true, size: 18, font: "Arial" }),
            new TextRun({ text: "\"Wann ist das fertig?\" \u2192 SLE geben, nicht raten. Erwartungen managen. Anomalien erkennen (Items \u00fcber SLE = Handlungsbedarf).", size: 18, font: "Arial" }),
          ]}),
        ]
      })]})
    ]
  });
}

// ─── DOCUMENT ────────────────────────────────────────────────────────────────
const doc = new Document({
  numbering: { config: [{ reference: "bullets",
    levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 720, hanging: 360 } } } }]
  }]},
  styles: {
    default: { document: { run: { font: "Arial", size: 20 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 0 } },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: BLUE, space: 1 } },
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({ text: "Flussmetriken-Referenzkarte | Kanban-Schulung lise | v4 | Stand: M\u00e4rz 2026 | ", size: 16, font: "Arial", color: "888888" }),
            new TextRun({ text: "Begleitmaterial f\u00fcr alle Sessions", size: 16, font: "Arial", color: BLUE }),
          ]
        })]
      })
    },
    children: [
      // Title
      new Paragraph({ spacing: { before: 0, after: 60 }, children: [
        new TextRun({ text: "Flussmetriken-Referenzkarte", bold: true, size: 36, font: "Arial", color: BLUE })
      ]}),
      new Paragraph({ spacing: { before: 0, after: 160 }, children: [
        new TextRun({ text: "Vier Metriken, ein Ziel: Fluss sichtbar machen und verbessern.", size: 22, font: "Arial", color: GRAY, italics: true })
      ]}),

      // Intro
      new Table({
        width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200],
        rows: [new TableRow({ children: [new TableCell({
          borders, shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR }, margins: { top: 100, bottom: 100, left: 150, right: 150 },
          width: { size: 9200, type: WidthType.DXA },
          children: [
            new Paragraph({ spacing: { before: 40, after: 40 }, children: [
              new TextRun({ text: "In Session 2 habt ihr diese vier Metriken in der TWiG-Simulation erlebt. Diese Referenzkarte erkl\u00e4rt sie kompakt \u2013 als Nachschlagewerk f\u00fcr danach.", size: 19, font: "Arial" })
            ]}),
            new Paragraph({ spacing: { before: 20, after: 40 }, children: [
              new TextRun({ text: "Fokus in Session 2: ", bold: true, size: 19, font: "Arial" }),
              new TextRun({ text: "Cycle Time + SLE. Die anderen drei sind ebenso wichtig \u2013 aber ihr baut sie nach und nach in eure Praxis ein.", size: 19, font: "Arial" })
            ]}),
          ]
        })]})],
      }),

      spacer(160),

      // 1. Cycle Time
      h2("1 \u2014 Cycle Time", BLUE),
      metricCard(
        "Cycle Time",
        YELLOW,
        "Wie lange braucht ein Work Item von Start bis Fertig?",
        "Die Zeit (in Arbeitstagen), die ein Work Item vom Eintreten in den aktiven Workflow bis zur Fertigstellung braucht. Beginnt, wenn Arbeit startet \u2013 nicht wenn sie angefragt wird.",
        "Du ziehst eine Karte von 'Bereit' in 'In Arbeit' am Montag. Am Freitag geht sie in 'Fertig'. Cycle Time = 5 Tage.",
        "Jira: Issue-Erstellung bis Resolution. Azure DevOps: Column 'Active' bis 'Closed'. Scatterplot in ActionableAgile oder Jira Dashboards.",
        "Lange Cycle Times sind das Symptom \u2013 nicht die Ursache. Die Ursache liegt meistens im WIP oder in Blockern."
      ),

      spacer(120),

      // 2. Work Item Age
      h2("2 \u2014 Work Item Age", BLUE),
      metricCard(
        "Work Item Age",
        ORANGE,
        "Wie lange liegt eine offene Arbeit schon in deinem System?",
        "Die Zeit (in Arbeitstagen), die ein noch nicht fertiges Work Item bereits im aktiven Workflow liegt. Ein Echtzeit-Signal f\u00fcr 'alte' Items.",
        "Drei Karten liegen gerade in 'In Arbeit': 2 Tage, 5 Tage, 14 Tage. Work Item Ages: 2, 5, 14. Die 14-Tage-Karte verdient Aufmerksamkeit.",
        "Jira/ADO: Date(today) minus Date(in 'Active'/'In Progress'). Viele Kanban-Tools zeigen das direkt auf der Karte als Zahl oder Farbkodierung.",
        "Work Item Age \u00fcber der SLE = sofortiger Handlungsbedarf. Im Daily Standup: Nicht Status abfragen, sondern alte Items identifizieren."
      ),

      spacer(120),

      // 3. Throughput
      h2("3 \u2014 Throughput", BLUE),
      metricCard(
        "Throughput",
        GREEN,
        "Wie viel schafft dein Team pro Zeiteinheit?",
        "Die Anzahl abgeschlossener Work Items pro Zeiteinheit (typisch: pro Woche). Zeigt die Kapazit\u00e4t des Systems \u2013 ohne Sch\u00e4tzungen.",
        "In TWiG Runde 1 (WIP 4-6-4) wurden X Items fertig in 8 Runden. In Runde 2 (WIP 2-2-2) wurden Y Items fertig. Throughput Runde 2 > Runde 1.",
        "Jira: 'Resolved issues per week' Chart. ADO: Burnup Chart (Slope = Throughput). Einfach: Zahl fertiger Items pro Woche z\u00e4hlen.",
        "Throughput ist der objektivste Fortschrittsindikator. 'Wie viel haben wir letzte Woche fertig gemacht?' \u2013 keine Sch\u00e4tzung, nur Fakten."
      ),

      spacer(120),

      // 4. WIP
      h2("4 \u2014 WIP (Work in Progress)", BLUE),
      metricCard(
        "WIP \u2013 Work in Progress",
        PURPLE,
        "Wie viel Arbeit liegt gleichzeitig in eurem Workflow?",
        "Die Anzahl der Work Items, die sich aktuell im aktiven Workflow befinden (angefangen, aber nicht fertig). Hoher WIP = lange Cycle Times (Littles Gesetz).",
        "TWiG Runde 1: WIP-Limit 4-6-4 = bis zu 14 Items gleichzeitig im Fluss. Runde 2: WIP 2-2-2 = max. 6. Ergebnis: Runde 2 hatte k\u00fcrzere Cycle Times und h\u00f6heren Throughput.",
        "Jira/ADO: Einfach die Anzahl der Karten in aktiven Spalten z\u00e4hlen. Oder: WIP-Limits in Board-Einstellungen setzen (Jira Software hat diese Funktion).",
        "Littles Gesetz: Cycle Time = WIP / Throughput. Weniger WIP = k\u00fcrzere Cycle Times \u2013 auch ohne mehr Leute. Das ist der Kern-Insight der TWiG-Simulation."
      ),

      spacer(160),

      // SLE
      h2("Bonus: SLE \u2013 abgeleitet aus Cycle Time", BLUE),
      sleCard(),

      spacer(160),

      // Zusammenhang
      new Table({
        width: { size: 9200, type: WidthType.DXA }, columnWidths: [9200],
        rows: [new TableRow({ children: [new TableCell({
          borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 150, right: 150 },
          width: { size: 9200, type: WidthType.DXA },
          children: [
            new Paragraph({ spacing: { before: 40, after: 60 }, children: [
              new TextRun({ text: "Wie die Metriken zusammenh\u00e4ngen", bold: true, size: 20, font: "Arial", color: BLUE })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 40 }, children: [
              new TextRun({ text: "\u2191 WIP  \u2192  \u2191 Cycle Time  \u2192  \u2193 Throughput  \u2192  SLE verf\u00e4llt", size: 20, font: "Arial", bold: true, color: "C00000" })
            ]}),
            new Paragraph({ spacing: { before: 0, after: 40 }, children: [
              new TextRun({ text: "\u2193 WIP  \u2192  \u2193 Cycle Time  \u2192  \u2191 Throughput  \u2192  SLE h\u00e4lt", size: 20, font: "Arial", bold: true, color: "006600" })
            ]}),
            new Paragraph({ spacing: { before: 40, after: 40 }, children: [
              new TextRun({ text: "Work Item Age zeigt in Echtzeit, welche Items drohen, die SLE zu reissen \u2013 bevor sie es tun.", size: 18, font: "Arial", italics: true })
            ]}),
          ]
        })]})],
      }),

      spacer(160),

      // Literatur-Hinweis
      p("Weiterf\u00fchrend: Daniel Vacanti \u2013 'Actionable Agile Metrics for Predictability' (das Standardwerk zu Flow-Metriken). Gratis-Einstieg: prokanban.org", { italic: true, color: "666666" }),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("Flussmetriken-Handout_Kanban-Schulung_v4.docx", buf);
  console.log("Created: Flussmetriken-Handout_Kanban-Schulung_v4.docx");
});
