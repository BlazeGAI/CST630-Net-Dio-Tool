'use client';

import { useMemo, useState, KeyboardEvent } from 'react';
import type { Artifact, Scenario } from '@/lib/scenarios';
import TextLogViewer from './TextLogViewer';
import TableViewer from './TableViewer';
import TimeSeriesViewer from './TimeSeriesViewer';
import NotesExport from './NotesExport';

const TAB_ORDER = ['Overview', 'Ping', 'Traceroute', 'DNS logs', 'Firewall logs', 'Flow summary', 'Notes and export'];

type Props = { scenario: Scenario };

export default function ScenarioTabs({ scenario }: Props) {
  const availableTabs = useMemo(() => {
    const fromArtifacts = new Set(scenario.artifacts.map((artifact) => artifact.tab));
    return TAB_ORDER.filter((tab) => tab === 'Overview' || tab === 'Notes and export' || fromArtifacts.has(tab));
  }, [scenario.artifacts]);

  const [activeTab, setActiveTab] = useState(availableTabs[0] ?? 'Overview');

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const total = availableTabs.length;
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % total;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + total) % total;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = total - 1;
    setActiveTab(availableTabs[nextIndex]);
    const nextTab = document.getElementById(`tab-${availableTabs[nextIndex]}`);
    nextTab?.focus();
  }

  function renderArtifact(artifact: Artifact) {
    if (artifact.format === 'text') {
      return <TextLogViewer scenarioId={scenario.id} artifactId={artifact.id} content={artifact.content} />;
    }
    if (artifact.format === 'table') {
      return <TableViewer scenarioId={scenario.id} artifactId={artifact.id} columns={artifact.columns} rows={artifact.rows} />;
    }
    return (
      <TimeSeriesViewer
        scenarioId={scenario.id}
        artifactId={artifact.id}
        summary={artifact.summary}
        metric={artifact.metric}
        points={artifact.points}
      />
    );
  }

  return (
    <div>
      <div className="card" role="note" aria-label="How to cite evidence">
        <strong>How to cite evidence</strong>
        <p>Use generated tokens like <code>W3-S1:TRACEROUTE-HQ01:LINE:12-18</code> directly in your analysis.</p>
      </div>
      <div className="tablist" role="tablist" aria-label="Scenario artifact tabs">
        {availableTabs.map((tab, index) => (
          <button
            id={`tab-${tab}`}
            key={tab}
            role="tab"
            type="button"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {availableTabs.map((tab) => (
        <section
          key={tab}
          role="tabpanel"
          id={`panel-${tab}`}
          aria-labelledby={`tab-${tab}`}
          hidden={activeTab !== tab}
          className="panel"
        >
          {tab === 'Overview' && (
            <article className="card">
              <h2>{scenario.title}</h2>
              <p>{scenario.context}</p>
            </article>
          )}
          {tab === 'Notes and export' && <NotesExport scenarioId={scenario.id} title={scenario.title} />}
          {tab !== 'Overview' &&
            tab !== 'Notes and export' &&
            scenario.artifacts
              .filter((artifact) => artifact.tab === tab)
              .map((artifact) => (
                <article className="card" key={artifact.id}>
                  <h3>{artifact.label}</h3>
                  {renderArtifact(artifact)}
                </article>
              ))}
        </section>
      ))}
    </div>
  );
}
