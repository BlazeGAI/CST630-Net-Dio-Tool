import { promises as fs } from 'fs';
import path from 'path';

export type ArtifactFormat = 'text' | 'table' | 'timeseries';

export type TextArtifact = {
  id: string;
  label: string;
  tab: string;
  format: 'text';
  content: string;
};

export type TableArtifact = {
  id: string;
  label: string;
  tab: string;
  format: 'table';
  columns: string[];
  rows: Array<Record<string, string | number>>;
};

export type TimeSeriesPoint = {
  row_id: string;
  timestamp: string;
  value: number;
};

export type TimeSeriesArtifact = {
  id: string;
  label: string;
  tab: string;
  format: 'timeseries';
  summary: string;
  metric: string;
  points: TimeSeriesPoint[];
};

export type Artifact = TextArtifact | TableArtifact | TimeSeriesArtifact;

export type Scenario = {
  id: string;
  title: string;
  weekTag: 'Week 2' | 'Week 3';
  summary: string;
  timeEstimateMinutes: number;
  context: string;
  artifacts: Artifact[];
};

const DATA_DIR = path.join(process.cwd(), 'scenarios-data');

function isScenario(input: unknown): input is Scenario {
  if (!input || typeof input !== 'object') return false;
  const scenario = input as Scenario;
  return (
    typeof scenario.id === 'string' &&
    typeof scenario.title === 'string' &&
    (scenario.weekTag === 'Week 2' || scenario.weekTag === 'Week 3') &&
    typeof scenario.summary === 'string' &&
    typeof scenario.timeEstimateMinutes === 'number' &&
    typeof scenario.context === 'string' &&
    Array.isArray(scenario.artifacts)
  );
}

export async function getAllScenarios(): Promise<Scenario[]> {
  const files = await fs.readdir(DATA_DIR);
  const jsonFiles = files.filter((file) => file.endsWith('.json'));

  const loaded = await Promise.all(
    jsonFiles.map(async (file) => {
      try {
        const raw = await fs.readFile(path.join(DATA_DIR, file), 'utf-8');
        const parsed = JSON.parse(raw) as unknown;
        if (!isScenario(parsed)) {
          return { error: `Invalid scenario fields in ${file}` };
        }
        return { scenario: parsed };
      } catch (error) {
        return { error: `Failed to parse ${file}: ${(error as Error).message}` };
      }
    })
  );

  return loaded.filter((item): item is { scenario: Scenario } => 'scenario' in item).map((item) => item.scenario);
}

export async function getScenarioById(id: string): Promise<{ scenario?: Scenario; error?: string }> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${id}.json`), 'utf-8');
    const parsed = JSON.parse(raw) as unknown;
    if (!isScenario(parsed)) {
      return { error: 'Scenario JSON is missing required fields.' };
    }
    return { scenario: parsed };
  } catch (error) {
    return { error: `Unable to load scenario: ${(error as Error).message}` };
  }
}
