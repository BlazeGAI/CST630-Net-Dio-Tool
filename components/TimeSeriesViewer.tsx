import TableViewer from './TableViewer';

type Point = {
  row_id: string;
  timestamp: string;
  value: number;
};

type Props = {
  scenarioId: string;
  artifactId: string;
  metric: string;
  summary: string;
  points: Point[];
};

export default function TimeSeriesViewer({ scenarioId, artifactId, metric, summary, points }: Props) {
  const max = Math.max(...points.map((p) => p.value), 1);
  const polyline = points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * 580 + 10;
      const y = 190 - (point.value / max) * 170;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div>
      <p><strong>Summary:</strong> {summary}</p>
      <figure aria-label={`${metric} graph and alternatives`}>
        <svg role="img" aria-label={`${metric} over time`} viewBox="0 0 600 200" width="100%" height="200">
          <rect x="0" y="0" width="600" height="200" fill="#ffffff" stroke="#ccd8e1" />
          <polyline fill="none" stroke="#0b5394" strokeWidth="3" points={polyline} />
        </svg>
        <figcaption>{metric} graph with high-contrast line. Table and row citations are below.</figcaption>
      </figure>
      <h4>Table view</h4>
      <TableViewer
        scenarioId={scenarioId}
        artifactId={artifactId}
        columns={['row_id', 'timestamp', 'value']}
        rows={points}
      />
    </div>
  );
}
