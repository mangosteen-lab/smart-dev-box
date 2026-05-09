# Extract Sections — Mode Glossary

Terminology used when discussing the **Extract Sections** tool (`extract-sections`) in smart-dev-box.

---

## Modes

### extract mode
The initial state before any section has been confirmed.

- Raw input editor on the left
- Empty result panel on the right
- "Choose sections" button opens the selection popup
- Resets automatically whenever the input changes

---

### single view mode
Reached when **1 section** is confirmed from the popup.

- Result area shows a single `ResultPane` with the extracted content
- "Reselect" button in the view header reopens the popup (`maxSelect=2`)
- Selecting 2 sections from reselect promotes to dual view mode

---

### dual view mode
Reached when **2 sections** are confirmed from the popup.

- Result area shows two `ResultPane`s side by side (Left / Right)
- Each pane has its own **replace** button that opens the popup with `maxSelect=1`, replacing only that pane
- A **compare** toggle in the view header shows/hides a line-by-line diff panel below the two panes
- "Reselect" button does a full reselect (both panes, `maxSelect=2`)

---

### extracted single view mode
Single view mode where a format or transform tool has been run on the section, producing output in the pane's output bar.

- The textarea still contains the original extracted text (not replaced by tool output)
- Behavior is otherwise identical to single view mode

---

### extracted dual view mode
Dual view mode where one or both panes have had a tool run, producing output in their respective output bars.

- Each pane's textarea still contains the original extracted text
- The **compare** diff still compares the two panes' original text, not the tool output
- Behavior is otherwise identical to dual view mode

---

## Summary Table

| Mode | Sections confirmed | Tool run | Textarea content | Compare uses |
|---|---|---|---|---|
| extract mode | 0 | — | — | — |
| single view mode | 1 | no | extracted text | — |
| dual view mode | 2 | no | extracted text | pane textarea text |
| extracted single view mode | 1 | yes (≥1 pane) | extracted text (unchanged) | — |
| extracted dual view mode | 2 | yes (≥1 pane) | extracted text (unchanged) | pane textarea text |
