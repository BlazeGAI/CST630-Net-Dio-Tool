'use client';

import { useMemo, useState } from 'react';
import ClipboardButton from './ClipboardButton';

const template = `Symptoms observed\n\nEvidence and citations\n\nOSI layer mapping\n\nRoot cause hypothesis\n\nAlternative hypothesis\n\nValidation steps\n\nArchitectural recommendation\n\nPerformance-security tradeoff statement\n`;

type Props = {
  scenarioId: string;
  title: string;
};

export default function NotesExport({ scenarioId, title }: Props) {
  const [notes, setNotes] = useState(template);
  const textFile = useMemo(() => {
    const timestamp = new Date().toLocaleString();
    return `Scenario ID: ${scenarioId}\nScenario title: ${title}\nLocal timestamp: ${timestamp}\n\n${notes}`;
  }, [notes, scenarioId, title]);

  function downloadTxt() {
    const blob = new Blob([textFile], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${scenarioId}-notes.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section>
      <label htmlFor="notes-area">Editable notes template</label>
      <textarea
        id="notes-area"
        rows={16}
        style={{ width: '100%', marginTop: '0.5rem' }}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
        <ClipboardButton label="Copy all notes" text={textFile} />
        <button type="button" className="secondary" onClick={downloadTxt} aria-label="Download notes as txt">
          Download .txt
        </button>
      </div>
    </section>
  );
}
