# Network Diagnostic Workbench
## SPEC.md
Version: 0.2 (MVP)
Target Course: CST630 Network Engineering & Security
Deployment: Vercel
Export Format: .txt only
Authentication: None (MVP)

---

# 1. Purpose

The Network Diagnostic Workbench is a browser-based diagnostic simulation tool used in Week 2 and Week 3 of CST630.

Its purpose is to allow students to analyze network performance using diagnostic artifacts (simulated tool outputs) and cite evidence in written assignments.

The application must:
- Support authentic, open-ended troubleshooting.
- Provide no answer key or scoring.
- Require students to interpret artifacts and justify conclusions.

---

# 2. Core Pedagogical Constraints

1. No downloadable software required.
2. No student login required.
3. No auto-grading or correctness feedback.
4. Scenarios must allow multiple plausible hypotheses.
5. Evidence citation must be structured and stable.
6. Graphs must always have:
   - A table view
   - A short text summary

---

# 3. Technical Stack

- Framework: Next.js (TypeScript)
- Hosting: Vercel
- Data: Static JSON files in `/scenarios-data`
- State: Client-side only
- Storage: No server storage
- Export: Client-side `.txt` generation

---

# 4. Routes and Pages

## `/`
Landing page:
- Purpose
- How to use
- Accessibility statement

## `/scenarios`
Scenario list page:
- Displays all scenarios
- Filter by week tag (Week 2, Week 3)
- Shows:
  - Title
  - Week tag
  - Short context summary
  - Time estimate

## `/scenario/[id]`
Scenario detail page:
- Tab navigation
- Artifact rendering
- Notes and export tab

---

# 5. Scenario Loading

- Load scenario JSON from `/scenarios-data/<ScenarioID>.json`
- Do not fetch from external APIs.
- No dynamic database calls.

If scenario not found:
- Display accessible error message.
- Do not crash application.

---

# 6. Artifact Tabs

Each scenario must include the following tabs in this order:

1. Overview
2. Ping
3. Traceroute
4. DNS logs
5. Firewall logs
6. Flow summary
7. Notes and export

If a scenario omits a particular artifact type:
- Hide the tab.

---

# 7. Artifact Renderers

## 7.1 TextLogViewer

For artifacts with `format: "text"`:

- Display numbered lines.
- Allow selection of line ranges.
- Provide:
  - "Copy citation"
  - "Copy selected text"

Citation format:
`<ScenarioID>:<ArtifactID>:LINE:<start>-<end>`

Line numbers are 1-indexed.

---

## 7.2 TableViewer

For artifacts with `format: "table"`:

- Render table with column headers.
- Each row must have stable `row_id`.
- Provide "Copy citation" per row.

Citation format:
`<ScenarioID>:<ArtifactID>:ROW:<row_id>`

---

## 7.3 TimeSeriesViewer

For artifacts with `format: "timeseries"`:

Must include:

1. Graph view
2. Table view
3. Text summary above graph

Graph requirements:
- Line or bar chart
- No color-only meaning
- High contrast
- Accessible labels

Table view:
- All rows shown
- Each row has `row_id`
- Citation per row

Text summary:
- Automatically generated or defined in JSON
- Example:
  "RTT remains below 30ms until 10:15, then spikes above 90ms with intermittent packet loss."

---

# 8. Citation System

- Citation tokens must be stable.
- Tokens must include:
  - Scenario ID
  - Artifact ID
  - Reference type
  - Reference range or row_id

Provide a visible help block:
"How to cite evidence"

Example usage in prose:
"Traceroute output indicates path variability (W3-S1:TRACEROUTE-HQ01:LINE:12-18)."

---

# 9. Notes and Export Tab

Must include editable template with headings:

- Symptoms observed
- Evidence and citations
- OSI layer mapping
- Root cause hypothesis
- Alternative hypothesis
- Validation steps
- Architectural recommendation
- Performance-security tradeoff statement

Controls:
- Copy all notes
- Download as `.txt`

`.txt` file must include:
- Scenario ID
- Scenario title
- Local timestamp
- Notes content

No server submission.

---

# 10. Accessibility Requirements

- Keyboard navigable tabs
- ARIA roles for tablist and tab panels
- Visible focus state
- Graphs must have:
  - Data table
  - Text summary
- No color-only meaning
- All buttons must have descriptive labels
- Logs must be selectable and copyable

---

# 11. Authenticity Requirements

The app must NOT:

- Display a “correct answer”
- Provide scoring
- Reveal intended root cause
- Highlight the “correct” artifact

The app MAY:

- Provide interpretation tips
- Provide common misconceptions
- Encourage hypothesis-driven reasoning

---

# 12. Performance Requirements

- Initial load < 2 seconds on standard broadband.
- All scenario data bundled statically.
- No heavy external dependencies.

---

# 13. Error Handling

- If JSON is malformed, display error message.
- Do not crash entire app.
- Validate presence of required fields.

---

# 14. MVP Acceptance Criteria

The MVP is complete when:

- Two scenarios (W2-S1 and W3-S1) load successfully.
- All artifact tabs render correctly.
- Citation tokens generate correctly.
- Notes export to `.txt` works.
- Graphs include tables and summaries.
- App deploys successfully to Vercel.
- Accessibility requirements pass manual keyboard test.

---

# 15. Non-Goals (MVP)

- LMS integration
- Student accounts
- Persistent storage
- Analytics dashboard
- Packet capture download
- Auto-grading

---

# 16. Future Enhancements (Post-MVP)

- Scenario variants per student
- Local storage autosave
- Instructor dashboard
- Docx export
- Week 5 AI integration scenario
