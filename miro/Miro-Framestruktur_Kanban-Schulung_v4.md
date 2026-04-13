# Miro-Framestruktur: Kanban-Schulung lise v4

*Setup-Anleitung für die drei Sessions | Stand: April 2026*
*Dieses Dokument beschreibt die vollständige Board-Architektur – zum Nachbauen in Miro oder als Grundlage für ein Board-Template.*

---

## Übergeordnete Board-Architektur

Ein einziges Miro-Board für alle drei Sessions. Jede Session bekommt ihren eigenen Bereich (Frame), aber die Boards der Teilnehmenden bleiben über alle Sessions sichtbar – das ist der Transferbogen.

```
[Board-Übersicht oben]
    ↓
[ZONE A: Teilnehmenden-Boards] – persistent, alle Sessions
    ↓
[ZONE B: Session 1 – Workflow definieren]
    ↓
[ZONE C: Session 2 – Flussmetriken & TWiG]
    ↓
[ZONE D: Session 3 – Kontinuierliche Verbesserung]
```

---

## ZONE A: Teilnehmenden-Boards (persistent, immer sichtbar)

**Zweck:** Jede:r Teilnehmende hat einen eigenen Bereich, in dem der Team-Workflow über alle drei Sessions wächst.

**Setup (1 Board-Bereich pro Person):**
```
┌─────────────────────────────────────┐
│  [Name]  |  [Team]                  │
│                                     │
│  WORKFLOW-SKIZZE (S1)               │
│  [ freie Fläche für Miro-Skizze ]   │
│  → Platzhalter: Workflow-Skizze     │
│                                     │
│  DoW-CHECKLISTE (ausgefüllt in S1)  │
│  □ Werteinheiten: ____________      │
│  □ Start- & Endpunkt: _______       │
│  □ Spalten/Stages: ____________     │
│  □ WIP-Steuerung: _________         │
│  □ Exit Criteria: __________        │
│  □ Prognose (SLE): _________        │
│                                     │
│  BLOCKER (gesammelt S2)             │
│  [ Sticky-Bereich ]                 │
│                                     │
│  SCATTERPLOT-ERGEBNISSE (S2)        │
│  [ Platzhalter: Screenshot TWiG ]   │
│  85. Perzentil (SLE): ______        │
│                                     │
│  COMMITMENT (S2/S3)                 │
│  Mein nächster Schritt: _______     │
│  Daran erkenne ich es in __ Wochen: │
│  Braucht Rückendeckung? J/N         │
└─────────────────────────────────────┘
```

**Technischer Aufwand:** Template für eine Person anlegen → x-mal duplizieren.
**Tipp:** Sticky Note-Cluster mit Farb-Kodierung pro Person einführen.

---

## ZONE B: Session 1 – Workflow definieren & visualisieren

### Frame B1: Check-in + Schätzfrage

**Arbeitsauftrag für Teilnehmende (Facilitator teilt Bildschirm oder verlinkt Frame):**
```
┌─────────────────────────────────────────┐
│  CHECK-IN   |   S1 Start                │
│                                         │
│  Frage 1: Wie viele Arbeitstage         │
│  dauert ein typisches Work Item         │
│  bei euch? Schreibt eine Zahl.          │
│  → Sticky auf diesen Frame kleben       │
│                                         │
│  [ Sticky-Bereich: Zahlen sammeln ]     │
│                                         │
│  Frage 2: Was hat dich beim             │
│  Skizzieren überrascht oder war         │
│  schwieriger als erwartet?              │
│  → 1 Satz, max. 30 Sek.                 │
└─────────────────────────────────────────┘
```

### Frame B2: Peer-Review – Briefing

**Arbeitsauftrag (wird als Briefing-Frame geteilt, 14 Min Timer):**
```
┌─────────────────────────────────────────────────────────┐
│  PEER-REVIEW RUNDE 1   |   14 Minuten                   │
│                                                         │
│  PERSON A:                                              │
│  Erkläre deinen Workflow – max. 5 Minuten.              │
│  Was fließt durch euer Board?                           │
│  Wie heißen die Spalten, was bedeuten sie?              │
│                                                         │
│  PERSON B:                                              │
│  Stelle Fragen anhand der DoW-Checkliste.               │
│  Ergänze direkt im Miro-Board von A.                    │
│  Nicht bewerten – nachfragen und schärfen.              │
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ DoW-CHECKLISTE (Person B fragt):                 │  │
│  │ □ 1. Werteinheiten: Was fließt durch dein Board? │  │
│  │ □ 2. Start/Ende: Wann startet, wann ist fertig?  │  │
│  │ □ 3. Spalten/Stages: Sind Wartezeiten sichtbar?  │  │
│  │ □ 4. WIP-Steuerung: Gibt es Limits?              │  │
│  │ □ 5. Exit Criteria: Sind Kriterien explizit?     │  │
│  │ □ 6. Prognose (SLE): Wie lange dauert's realist? │  │
│  └──────────────────────────────────────────────────┘  │
│                                                         │
│  Nach 14 Min: Rollen tauschen.                          │
└─────────────────────────────────────────────────────────┘
```

### Frame B3: Debriefing – Cluster

**Setup (Facilitator befüllt live während Debriefing):**
```
┌──────────────────────────────────────────────────┐
│  DEBRIEFING S1   |   Was fehlte am häufigsten?   │
│                                                  │
│  [ Cluster 1 ]       [ Cluster 2 ]               │
│  Fehlende Exit Criteria  WIP-Steuerung fehlt     │
│  [Stickies]          [Stickies]                  │
│                                                  │
│  [ Cluster 3 ]       [ Cluster 4 ]               │
│  Prognose unklar     Werteinheiten diffus        │
│  [Stickies]          [Stickies]                  │
│                                                  │
│  VORAB-AUFTRAG S2:                               │
│  Beobachte bis zur nächsten Session:             │
│  Wo wartet etwas auf jemanden?                   │
│  2–3 Beobachtungen + Zeitangabe mitbringen.      │
└──────────────────────────────────────────────────┘
```

---

## ZONE C: Session 2 – Flussmetriken & TWiG

### Frame C1: Rückblick – Blocker-Clustering

**Arbeitsauftrag:**
```
┌─────────────────────────────────────────────────┐
│  RÜCKBLICK S2   |   Was habt ihr beobachtet?    │
│                                                 │
│  Jede:r: 1 Sticky mit einer Beobachtung         │
│  → "Wo hat Arbeit gewartet?"                    │
│                                                 │
│  WARTEN AUF      TECHNISCHE    FEHLENDE         │
│  REVIEWS         PROBLEME      INFOS            │
│  [Stickies]      [Stickies]    [Stickies]       │
│                                                 │
│  SONSTIGES                                      │
│  [Stickies]                                     │
└─────────────────────────────────────────────────┘
```

### Frame C2: TWiG – Debriefing-Boards

**TWiG-Link (anklickbar):** https://analytics.actionableagile.com/twig

**Einstellungshinweis:** WIP-Limits manuell setzen | R1 empfohlen: 4-6-4 | R2: Gruppe wählt frei (Einstieg: 2-2-2)

**Setup (je 1 kleines Debriefing-Board pro Runde):**
```
┌─────────────────────────────────────┐
│  TWiG RUNDE 1   |   WIP 4-6-4       │
│                                     │
│  Wie viel wurde fertig? ___         │
│  Wie hat es sich angefühlt? ___     │
│  Wo lagen die Engpässe? ___         │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  TWiG RUNDE 2   |   Freie Wahl      │
│  (Empfehlung: 2-2-2)                │
│                                     │
│  Was war anders? ___                │
│  Warum? ___                         │
│  Was würdest du ab Montag ändern?   │
└─────────────────────────────────────┘
```

### Frame C3: Murmelphase + Retrieval

**Arbeitsauftrag:**
```
┌───────────────────────────────────────────────┐
│  MURMELPHASE   |   1 Satz in den Chat          │
│                                               │
│  "Was war euer überraschendstes               │
│  Erlebnis in der Simulation?"                 │
│                                               │
│  ────────────────────────────────────────     │
│                                               │
│  RETRIEVAL PRACTICE   |   90 Sekunden         │
│                                               │
│  Schreibt ohne nachzuschauen:                 │
│  Welche vier Flussmetriken habt ihr           │
│  gerade in der Simulation erlebt?             │
│                                               │
│  1. _______  2. _______                       │
│  3. _______  4. _______                       │
│  → Antworten in den Chat                      │
└───────────────────────────────────────────────┘
```

### Frame C4: Scatterplot-Analyse

**Setup (Facilitator zeigt TWiG-Scatterplot + Erklärung):**
```
┌─────────────────────────────────────────────────────┐
│  SCATTERPLOT   |   Eure TWiG-Daten                  │
│                                                     │
│  [Screenshot TWiG-Scatterplot hier einfügen]        │
│                                                     │
│  Cycle Time = Zeit von Start bis Fertig             │
│  85. Perzentil = eure Prognose (SLE)                │
│                                                     │
│  "85% eurer Items waren in ___ fertig"              │
│  → Eure SLE: 85% in ___ Tagen oder weniger         │
│                                                     │
│  HINWEIS: Alle 4 Metriken → Flussmetriken-Handout  │
└─────────────────────────────────────────────────────┘
```

### Frame C5: Bridging

**Arbeitsauftrag:**
```
┌──────────────────────────────────────────────────────┐
│  BRIDGING   |   Simulation ↔ Euer Alltag             │
│                                                      │
│  4 Verbindungen, die wir gerade gesehen haben:       │
│                                                      │
│  1. Zu viel WIP → lange Cycle Times                  │
│  2. Blocker → alles dahinter wartet                  │
│  3. Blocker in Übergängen = fehlende Exit Criteria   │
│  4. Pull-Signale explizit machen – wer zieht wann?   │
│                                                      │
│  EURE BEOBACHTUNGEN:                                 │
│  Was aus der Simulation kennt ihr aus dem Alltag?    │
│  → 1 Sticky pro Person                               │
└──────────────────────────────────────────────────────┘
```

---

## ZONE D: Session 3 – Kontinuierliche Verbesserung

### Frame D1: Check-in + Vorab-Sätze

**Arbeitsauftrag:**
```
┌──────────────────────────────────────────────┐
│  CHECK-IN S3   |   Euer Vorab-Satz           │
│                                              │
│  Jede:r liest Satz vor und postet ihn hier:  │
│                                              │
│  "Was würde ich als erstes verbessern –      │
│  und was bringt das meinem Team?"            │
│                                              │
│  [Sticky-Bereich für alle Sätze]             │
└──────────────────────────────────────────────┘
```

### Frame D2: Workflow-Retro (Einzelarbeit)

**Arbeitsauftrag (jede:r hat eine Kopie dieses Frames):**
```
┌──────────────────────────────────────────────────────┐
│  MEINE WORKFLOW-RETRO   |   [Name]   |   15 Minuten  │
│                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────┐  │
│  │ WAS LÄUFT GUT? │  │ WAS BLOCKIERT  │  │ MEIN   │  │
│  │                │  │ DEN FLUSS?     │  │ NÄCHS- │  │
│  │ [Stickies]     │  │ Policy? J/N    │  │ TER    │  │
│  │                │  │ [Stickies]     │  │ SCHRIT │  │
│  │                │  │                │  │ T      │  │
│  └────────────────┘  └────────────────┘  └────────┘  │
│                                                      │
│  Nächster Schritt + Metrik:                          │
│  "Daran erkenne ich in ___ Wochen ob es gewirkt hat: │
│  ______________________________________________"      │
└──────────────────────────────────────────────────────┘
```

### Frame D3: Commitment-Board

**Das zentrale Ergebnis der gesamten Schulung:**
```
┌─────────────────────────────────────────────────────────┐
│  UNSERE COMMITMENTS   |   [Datum]                       │
│                                                         │
│  Format: "Mein nächster Schritt ist [X].                │
│  Daran erkenne ich in [Y Wochen] ob es gewirkt hat:     │
│  [Messgröße oder Beobachtung]."                         │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  [Name 1]    │  │  [Name 2]    │  │  [Name 3]    │  │
│  │              │  │              │  │              │  │
│  │  Commitment  │  │  Commitment  │  │  Commitment  │  │
│  │  ──────────  │  │  ──────────  │  │  ──────────  │  │
│  │  Braucht     │  │  Braucht     │  │  Braucht     │  │
│  │  Rücken-     │  │  Rücken-     │  │  Rücken-     │  │
│  │  deckung:    │  │  deckung:    │  │  deckung:    │  │
│  │  J / N       │  │  J / N       │  │  J / N       │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Frame D4: Feedback

```
┌────────────────────────────────────────────────────┐
│  FEEDBACK   |   2 Fragen, 2 Minuten                │
│                                                    │
│  ┌────────────────────┐  ┌───────────────────────┐ │
│  │ Was nehme ich      │  │ Was hätte ich mir      │ │
│  │ aus den drei       │  │ anders oder besser     │ │
│  │ Sessions mit?      │  │ gewünscht?             │ │
│  │                    │  │                        │ │
│  │  [Stickies]        │  │  [Stickies]            │ │
│  └────────────────────┘  └───────────────────────┘ │
└────────────────────────────────────────────────────┘
```

---

## Technische Setup-Checkliste

**Vor Session 1:**
- [ ] Board angelegt (1 Board für alle 3 Sessions)
- [ ] Teilnehmenden-Bereiche (Zone A) angelegt – eine Vorlage, x-mal dupliziert
- [ ] Zone B Frames angelegt
- [ ] Alle Teilnehmenden haben Miro-Zugang (Editor-Rechte)
- [ ] Miro-Link in Einladung eingefügt

**Vor Session 2:**
- [ ] Zone C Frames angelegt
- [ ] TWiG-Einstellungen vorab prüfen: WIP-Limits müssen manuell gesetzt werden können; Test-Runde empfohlen
- [ ] TWiG-Screenshot-Bereich vorbereitet (Frame C2)
- [ ] Flussmetriken-Handout als PDF im Board hinterlegt (Miro: Attachment oder Embed)

**Vor Session 3:**
- [ ] Zone D Frames angelegt
- [ ] Commitment-Board mit Platzhaltern für alle Teilnehmenden vorbereitet
- [ ] Feedback-Bereich angelegt

---

## Import-Option: Als druckbares Plakat

Alle Frames (besonders Briefing-Frames und Commitment-Board) können als PNG exportiert und:
1. **In Miro** als Hintergrundbild für interaktive Arbeit genutzt werden
2. **Auf einem Plotter** als A0/A1 für Präsenzveranstaltungen ausgedruckt werden
3. **In einer Präsentation** als Slide-Hintergrund genutzt werden

→ Export: Miro → Frame auswählen → Export als PNG (hohe Auflösung)