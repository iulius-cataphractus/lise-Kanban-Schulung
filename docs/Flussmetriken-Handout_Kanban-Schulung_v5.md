# Flussmetriken – Kanban-Schulung lise
*Referenzdokument für Teilnehmende | Session 1 | v5*

---

## Die vier Flussmetriken

### WIP – Work in Progress
Wie viele Items befinden sich gerade gleichzeitig in Bearbeitung?

**WIP-Limits können auf zwei Ebenen gesetzt werden:**
- **Pro Spalte** (primäre Visualisierungslogik): Wie im TWiG-Spiel – jede Spalte hat ein eigenes Limit
- **System-WiP** (theoretisches Fundament): Die Gesamtmenge aller aktiven Items im System bestimmt die Cycle Time

**Little's Law:** `CT = WiP ÷ Throughput`
Je weniger Items gleichzeitig in Arbeit, desto kürzer die Cycle Time. Das ist Mathematik, kein Gefühl.

---

### Cycle Time
Wie lange braucht ein Item vom Start bis zur Fertigstellung?

**Beginnt am Commitment Point** – dem Moment, an dem das Team sich committet, ein Item zu liefern. Nicht wenn es angefragt wird, nicht wenn es ins Backlog kommt. Das Team definiert diesen Punkt in seiner Definition of Workflow.

*Einheit: Tage (oder Spielrunden im TWiG)*

---

### Throughput
Wie viele Items stellt das Team pro Zeiteinheit fertig?

Beispiel: 3 Items pro Woche. Zusammen mit WiP ergibt das die Cycle Time (Little's Law).

*Einheit: Items pro Zeiteinheit*

---

### Work Item Age
Wie lange ist ein Item bereits in Bearbeitung – ohne fertig zu sein?

Zeigt, welche Items gerade „stecken". Im TWiG-Dashboard rechts neben dem Scatterplot sichtbar.

*Einheit: Tage (oder Spielrunden)*

---

## Scatterplot lesen
Jeder Punkt im Scatterplot = ein abgeschlossenes Item.

- **X-Achse:** Wann wurde das Item fertig?
- **Y-Achse:** Wie lange hat es gedauert? (Cycle Time)

**Prognose (SLE) ablesen:**
> „In 85% der Fälle ist ein Item in X Tagen fertig – oder wir sprechen darüber."

Das ist keine Garantie. Das ist eine datenbasierte Aussage – Service Level Expectation.

---

*Kanban-Schulung lise v5 | lise GmbH | CC BY 4.0*
*https://github.com/iulius-cataphractus/lise-Kanban-Schulung*
