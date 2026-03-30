# src/ – Generierungsskripte

Die Word-Dokumente in `docs/` werden programmatisch aus diesen JavaScript-Skripten erzeugt. Das ermöglicht konsistentes Styling, einfache Anpassung und Versionierung des Inhalts.

## Voraussetzungen

- Node.js >= 18 ([nodejs.org](https://nodejs.org))
- npm (kommt mit Node.js)

## Einmalig: Abhängigkeiten installieren

```bash
cd src/
npm install
```

Das installiert `docx` (die einzige Abhängigkeit) in einen lokalen `node_modules/`-Ordner.

## Dokumente generieren

Einzelnes Dokument:
```bash
node create_s1_v4.js
# → erzeugt Facilitator-Guide_S1_Kanban-Schulung_v4.docx im aktuellen Ordner
```

Alle Dokumente auf einmal:
```bash
npm run build:all
```

Die erzeugten `.docx`-Dateien dann nach `docs/` verschieben oder direkt dort ausgeben (Pfad im Skript anpassen).

## Skripte im Überblick

| Skript | Erzeugt |
|--------|---------|
| `create_einladung_v4.js` | `Einladungstemplate_Kanban-Schulung_v4.docx` |
| `create_s1_v4.js` | `Facilitator-Guide_S1_Kanban-Schulung_v4.docx` |
| `create_s2_v4.js` | `Facilitator-Guide_S2_Kanban-Schulung_v4.docx` |
| `create_s3_v4.js` | `Facilitator-Guide_S3_Kanban-Schulung_v4.docx` |
| `create_handout_v4.js` | `Flussmetriken-Handout_Kanban-Schulung_v4.docx` |
| `create_linksammlung_v4.js` | `Linksammlung_Kanban-Schulung_v4.docx` |

## Inhalt anpassen

Alle Skripte folgen demselben Muster:

1. Hilfsfunktionen oben (`p()`, `h1()`, `h2()`, Tabellen-Helper)
2. Inhalt als JavaScript-Arrays und -Objekte definiert
3. `new Document({ sections: [...] })` baut das Dokument
4. `Packer.toBuffer(doc)` schreibt die `.docx`-Datei

Um zum Beispiel den Ablauf von S2 zu ändern: In `create_s2_v4.js` die entsprechende Zeile in der Ablauf-Tabelle editieren und neu rendern.

## Warum nicht direkt in Word editieren?

Word-Dokumente mit komplexen Tabellen, konsistentem Farbschema und einheitlichem Spacing sind mühsam manuell zu pflegen. Die Skripte garantieren, dass alle Materialien dasselbe visuelle System nutzen – und Änderungen propagieren sich sauber.
