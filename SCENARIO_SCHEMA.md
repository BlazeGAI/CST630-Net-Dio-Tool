# Scenario Schema (Network Diagnostic Workbench)

This document defines the JSON schema for scenario files stored in `/scenarios-data`.
Each scenario file contains the scenario metadata and a list of diagnostic artifacts.

## File location and naming

- Directory: `/scenarios-data/`
- Filename: `<ScenarioID>.json` (example: `W3-S1.json`)
- Scenario IDs must be stable within a term.

## Scenario object

### Required fields
- `id` (string): Unique scenario ID (example: `W3-S1`)
- `title` (string): Scenario title shown to students
- `weekTag` (string): `Week 2` or `Week 3`
- `context` (object):
  - `environment` (string): short environment description
  - `symptoms` (string[]): list of symptom statements
- `artifacts` (Artifact[]): list of artifacts
- `teachingNotes` (object):
  - `interpretationTips` (string[]): general tips for the scenario
  - `commonMisconceptions` (string[]): general misconceptions to surface

### Optional fields
- `timeEstimateMinutes` (number)
- `updatedAt` (string, ISO 8601 date-time)

## Artifact object

Each artifact represents a diagnostic output or dataset.

### Required fields
- `type` (string): one of
  - `ping`
  - `traceroute`
  - `dns_logs`
  - `firewall_logs`
  - `flow_summary`
- `id` (string): unique within scenario (example: `PING-HQ01`)
- `label` (string): student-facing label
- `format` (string): one of
  - `text`
  - `table`
  - `timeseries`
- `content` (string[]): raw log/output lines for the artifact (even if graphs exist)

### Optional fields (recommended when format is not `text`)
- `data` (object[]):
  - For `timeseries`, each item must include:
    - `t` (string): ISO 8601 date-time
    - additional numeric fields (example: `rtt_ms`, `loss_pct`)
  - For `table`, each item must include:
    - `row_id` (string): stable row identifier for citations
    - additional fields by table type (example: `src`, `dst`, `bytes`, `port`, `protocol`)
- `columns` (object[]): for `table` format, column metadata
  - `key` (string)
  - `label` (string)
- `explanation` (string): what this artifact is and why it matters
- `interpretationTips` (string[]): how to interpret this specific artifact
- `commonMisconceptions` (string[]): misconceptions relevant to this artifact

## Citation tokens

The app must generate stable citation tokens for evidence-based writing.

### Line citations (text artifacts)
Format:
`<ScenarioID>:<ArtifactID>:LINE:<start>-<end>`

Example:
`W3-S1:FIREWALL-EDGE:LINE:44-52`

Rules:
- Lines are 1-indexed based on the `content` array.
- `<start>` and `<end>` are inclusive.

### Row citations (table/timeseries artifacts)
Format:
`<ScenarioID>:<ArtifactID>:ROW:<row_id>`

Example:
`W3-S1:FLOW-SUMMARY:ROW:talker-03`

Rules:
- For `table` and `timeseries` artifacts, each entry in `data` should include a stable `row_id`.
- If `row_id` is omitted in `timeseries`, the app may fall back to 1-indexed row numbers, but `row_id` is preferred for stability.

## Example: Timeseries artifact

```json
{
  "type": "ping",
  "id": "PING-HQ01",
  "label": "Ping from HQ-01 to CloudApp",
  "format": "timeseries",
  "explanation": "ICMP RTT and packet loss from HQ workstation to the cloud application endpoint.",
  "interpretationTips": [
    "Look for sustained RTT elevation vs transient spikes.",
    "Correlate loss with RTT variance to distinguish congestion from path instability."
  ],
  "content": [
    "2026-03-02 09:00 RTT=22ms loss=0%",
    "2026-03-02 09:05 RTT=95ms loss=12%"
  ],
  "data": [
    {"row_id":"t-0900","t":"2026-03-02T09:00:00","rtt_ms":22,"loss_pct":0},
    {"row_id":"t-0905","t":"2026-03-02T09:05:00","rtt_ms":95,"loss_pct":12}
  ]
}
