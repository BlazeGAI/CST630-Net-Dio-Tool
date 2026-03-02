import Link from 'next/link';
import { getAllScenarios } from '@/lib/scenarios';

export default async function ScenariosPage({
  searchParams
}: {
  searchParams: { week?: 'Week 2' | 'Week 3' };
}) {
  const scenarios = await getAllScenarios();
  const week = searchParams.week;
  const filtered = week ? scenarios.filter((scenario) => scenario.weekTag === week) : scenarios;

  return (
    <main>
      <h1>Scenario Library</h1>
      <div className="card">
        <p>Filter by week tag:</p>
        <p>
          <Link href="/scenarios">All</Link> | <Link href="/scenarios?week=Week%202">Week 2</Link> |{' '}
          <Link href="/scenarios?week=Week%203">Week 3</Link>
        </p>
      </div>
      {filtered.map((scenario) => (
        <article key={scenario.id} className="card">
          <h2>
            <Link href={`/scenario/${scenario.id}`}>{scenario.title}</Link>
          </h2>
          <p>
            <strong>{scenario.weekTag}</strong> • {scenario.timeEstimateMinutes} minutes
          </p>
          <p>{scenario.summary}</p>
        </article>
      ))}
      {filtered.length === 0 && <p role="status">No scenarios matched the selected week tag.</p>}
    </main>
  );
}
