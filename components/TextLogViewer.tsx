'use client';

import { useMemo, useState } from 'react';
import ClipboardButton from './ClipboardButton';

type Props = {
  scenarioId: string;
  artifactId: string;
  content: string;
};

export default function TextLogViewer({ scenarioId, artifactId, content }: Props) {
  const lines = useMemo(() => content.split('\n'), [content]);
  const [start, setStart] = useState(1);
  const [end, setEnd] = useState(lines.length);

  const citation = `${scenarioId}:${artifactId}:LINE:${Math.min(start, end)}-${Math.max(start, end)}`;
  const selectedText = lines.slice(Math.min(start, end) - 1, Math.max(start, end)).join('\n');

  return (
    <div>
      <p>
        Select line range:{' '}
        <label>
          Start
          <select value={start} onChange={(e) => setStart(Number(e.target.value))}>
            {lines.map((_, i) => (
              <option key={`s-${i + 1}`}>{i + 1}</option>
            ))}
          </select>
        </label>{' '}
        <label>
          End
          <select value={end} onChange={(e) => setEnd(Number(e.target.value))}>
            {lines.map((_, i) => (
              <option key={`e-${i + 1}`}>{i + 1}</option>
            ))}
          </select>
        </label>
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <ClipboardButton label="Copy citation" text={citation} />
        <ClipboardButton label="Copy selected text" text={selectedText} className="secondary" />
      </div>
      <pre aria-label={`${artifactId} log lines`}>
        {lines.map((line, index) => (
          <div key={index}>
            <strong>{String(index + 1).padStart(3, '0')}:</strong> {line}
          </div>
        ))}
      </pre>
    </div>
  );
}
