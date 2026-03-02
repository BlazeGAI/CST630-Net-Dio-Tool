# Network Diagnostic Workbench (Diagnosis App) Design Document

Version 0.2 (MVP with graphs)
Target use: CST630 Week 2 and Week 3 activities
Deployment: Vercel (web-based, no student installs)
Export: .txt (confirmed)

## 1. Purpose

The Network Diagnostic Workbench is a browser-based application that provides realistic diagnostic artifacts (simulated tool outputs) for students to analyze and cite in written assignments. The application exists to make CLO2 explicit and defensible: “Analyze network performance using diagnostic tools.” 

The app supports authentic graduate-level troubleshooting. Students are not guided to a single correct answer. They must interpret evidence, form hypotheses, identify validation steps, and justify architectural recommendations.

## 2. Confirmed Design Decisions

1. Export is plain text (.txt) only for MVP.
2. The app includes graphs in addition to raw text and tables.
3. The scenarios are authentic and open-ended. No built-in answer key or explicit “success criteria” is shown to students.

## 3. Scope

### In scope (MVP)

* Two scenarios:

  * Week 2: segmentation and addressing diagnosis
  * Week 3: multi-site latency and routing tradeoffs diagnosis
* Artifact tabs per scenario:

  * Overview
  * Ping
  * Traceroute
  * DNS logs
  * Firewall logs
  * Flow summary
  * Notes and export
* Evidence citation mechanism (line- and row-based references)
* Graphs for time-series and distributions, with data tables and text summaries as accessible equivalents
* Student notes workspace with structured prompts
* Export notes as `.txt` (download) and copy-to-clipboard

### Out of scope (MVP)

* Accounts, logins, or LMS authentication
* Auto-grading
* Persistent storage of student notes server-side
* Real packet capture files
* Instructor analytics dashboards

## 4. Pedagogical Use and Alignment

### Week 2 usage (segmentation validation)

Students use diagnostic artifacts to validate whether issues arise from:

* addressing or subnet mask logic
* segmentation boundaries
* DNS resolution behavior
* firewall policy side effects
* routing asymmetry

Students must cite at least two artifacts.

### Week 3 usage (performance and routing)

Students diagnose latency degradation and justify:

* routing choice (static vs dynamic)
* congestion vs convergence vs inspection causes
* performance-security tradeoffs

Students must cite at least three artifacts and describe validation steps.

This directly supports CLO2. 

## 5. User Roles

### Student

* Select scenario, view artifacts, interpret evidence
* Cite evidence using stable citations
* Draft diagnosis notes and export to `.txt` for inclusion in Word/PDF assignment

### Instructor

* Assign scenario by name
* Provide link in course Explore section

### Designer/developer

* Author scenario datasets and artifacts
* Maintain accuracy, coherence, accessibility

## 6. Functional Requirements

### FR-1 Scenario selection

* Scenario list with:

  * title
  * week tag (Week 2, Week 3)
  * short context summary
  * time estimate

### FR-2 Artifact viewing

Each scenario includes tabs:

* Overview | Ping | Traceroute | DNS logs | Firewall logs | Flow summary | Notes and export

Each tab includes:

* Explanation: what this artifact represents, how to interpret, common misconceptions
* Artifact content:

  * raw output (text)
  * graph (where applicable)
  * table view (always when a graph exists)

### FR-3 Graph requirements (with accessibility equivalents)

Graphs are informational, not decorative. Every graph must have:

* a table view of the underlying data
* a short text summary that states the main pattern in words

Graph types:

* Ping tab: time-series line chart of RTT, and bar/line of packet loss over time
* Flow tab: bar chart of top talkers by bytes, and distribution by port/protocol
* DNS tab: time-series of query volume and stacked outcomes (success vs NXDOMAIN vs SERVFAIL)
* Traceroute tab: no complex graph required in MVP. Optionally show hop latency sparkline per hop, but only if it remains accessible and clear

### FR-4 Evidence citation system

Students must be able to cite evidence from:

* log lines (text)
* table rows (graph data)
* traceroute hops

Citation token format (stable):

* `ScenarioID:ArtifactID:RefType:RefRange`

Examples:

* `W3-S1:PING-HQ01:ROW:12`
* `W2-S1:FIREWALL-EDGE:LINE:44-52`

Capabilities:

* copy citation for a single line or row
* copy citation for a selected range
* provide a “How to cite evidence” help block with examples

### FR-5 Notes workspace and export

Notes template (pre-filled headings):

* Symptoms observed
* Evidence and citations
* OSI layer mapping
* Root cause hypothesis
* Alternative hypothesis
* Validation steps
* Architectural recommendation
* Performance-security tradeoff statement (Week 3 highlighted)

Export:

* Download `.txt` with:

  * scenario title and ID
  * timestamp (local browser)
  * student session ID (non-PII token)
  * notes content
* Copy-all notes to clipboard

### FR-6 Authenticity design (open-ended troubleshooting)

The app must not:

* reveal the intended root cause
* provide “correct answer” feedback
* score student responses

The app may:

* include prompts that enforce disciplined reasoning
* include optional “interpretation tips” that do not narrow to a single answer
* include common misconceptions as warnings

## 7. Non-Functional Requirements

### NFR-1 Accessibility (WCAG-aligned)

* Keyboard navigation for tabs and interactive elements
* Visible focus state
* Semantic headings and landmarks
* Graphs provide tables and text summaries
* No color-only meaning
* Sufficient contrast
* Logs are selectable, scrollable, and copyable
* Buttons have accessible names (ARIA labels where needed)

### NFR-2 Performance and reliability

* Static scenario data bundled at build time
* Fast initial load
* No reliance on fragile external services

### NFR-3 Privacy

* No student names or emails collected
* No server-side storage of notes
* Optional privacy-preserving analytics without identifiers

## 8. Information Architecture

### Pages

1. Landing

   * purpose
   * how to use
   * accessibility statement
2. Scenario list

   * filter by week
3. Scenario view

   * tabs for artifacts
   * notes and export

## 9. Scenario Design (MVP)

### Scenario W2-S1 (Week 2): Intermittent connectivity in segmented network

Context: 200-user enterprise segmented into Admin, Operations, IT, Guest, plus cloud portal access.

Observed symptoms:

* intermittent portal access failures for one segment
* inconsistent DNS resolution behavior for a subset of clients
* sporadic packet loss between specific segments

Artifacts:

* Ping series from two segments to portal endpoint (one shows loss spikes)
* Traceroute from two segments showing different paths or hop behavior
* DNS logs showing increased NXDOMAIN/SERVFAIL in a time window
* Firewall logs showing denies tied to UDP/53 or portal subnet
* Flow summaries showing unusual east-west traffic from one segment

Authenticity: more than one plausible explanation. Students must justify.

### Scenario W3-S1 (Week 3): Latency escalation across multi-site enterprise

Context: HQ + 2 branches + cloud app, encrypted tunnels, firewall inspection enabled.

Observed symptoms:

* latency increases during business hours
* route variability across sites
* some packet loss during peak windows

Artifacts:

* Ping series showing RTT variance, periodic spikes, and correlated loss
* Traceroute showing hop count changes or different upstream paths
* Firewall logs showing inspection queue pressure or policy hits at peak times
* Flow summaries showing top talkers and port distributions indicating congestion
* DNS logs largely normal to support differential diagnosis

Authenticity: congestion, convergence, and inspection are all viable hypotheses.

## 10. Data Model

Scenario JSON schema supports:

* artifacts with:

  * `format: "text" | "table" | "timeseries"`
  * `content` arrays for text/logs
  * `data` arrays for graph/table values (timestamped where needed)
  * `explanation` and `interpretationTips`

Example (timeseries artifact):

```json
{
  "type": "ping",
  "id": "PING-HQ01",
  "label": "Ping from HQ-01 to CloudApp",
  "format": "timeseries",
  "data": [
    {"t":"2026-03-02T09:00:00", "rtt_ms": 22, "loss_pct": 0},
    {"t":"2026-03-02T09:05:00", "rtt_ms": 95, "loss_pct": 12}
  ],
  "content": [
    "09:00 RTT=22ms loss=0%",
    "09:05 RTT=95ms loss=12%"
  ]
}
```

## 11. Graph Implementation

Implementation guidance (developer-facing):

* Use a simple charting library that supports accessibility patterns. Recharts is acceptable in Next.js, but ensure:

  * charts are not the only representation
  * underlying data table always displayed
* Provide a toggle:

  * “Graph view” and “Table view”
* Provide a generated text summary above each chart:

  * example: “RTT remains between 18–30ms until 10:15, then spikes above 90ms with intermittent loss.”

## 12. Technical Architecture

* Next.js + TypeScript
* Static scenario JSON files bundled at build
* Routes:

  * `/scenarios`
  * `/scenario/[id]`
* Notes stored in browser memory. Optional localStorage save could be added, but default is ephemeral to avoid privacy concerns.
* Export: create text blob client-side and trigger download

## 13. Deployment

* Vercel deployment via GitHub integration
* Preview deployments for QA
* Production URL added to the course Explore section
* Version pinning:

  * Do not change scenario datasets mid-term
  * If changes are required, clone to new scenario ID with version suffix

## 14. Accessibility Acceptance Criteria

* Full keyboard navigation passes
* Screen reader announces tab labels and selected state
* Each chart has:

  * a table
  * a text summary
* Copy citation buttons are accessible and descriptive
* No color-only cues

## 15. MVP Acceptance Criteria Checklist

* Two scenarios available and filterable by Week
* Artifact tabs render with:

  * text output
  * graphs where specified
  * table equivalents
  * citation copying
* Notes template works, copy works, `.txt` download works
* No login required
* Runs reliably on modern browsers and mobile-responsively

## 16. Developer Ticket Breakdown (MVP)

### Epic A: Scenario engine

* Load scenario JSON
* Render tabs
* Route per scenario

### Epic B: Artifact renderers

* Text log renderer with line numbering and range copy
* Table renderer with row IDs and citation
* Timeseries renderer with chart + table + summary

### Epic C: Citation utilities

* Citation token generator
* Copy controls
* Help block examples

### Epic D: Notes and export

* Structured notes template
* Copy all
* Download `.txt`

### Epic E: Accessibility QA

* Keyboard navigation
* ARIA for tabs
* Contrast and focus
* Chart alternatives

## 17. Open Items (non-blocking)

* Decide whether to allow localStorage persistence of notes (default off)
* Decide whether to include optional hop-latency visualization in traceroute tab (safe to defer)

If you want, I can now produce the complete scenario datasets for W2-S1 and W3-S1, including realistic ping series, traceroute outputs, DNS logs, firewall logs, and flow summaries, formatted to the JSON schema above so a developer can drop them directly into the repository.
