import Link from 'next/link';
import { getScenarioById } from '@/lib/scenarios';
import ScenarioTabs from '@/components/ScenarioTabs';

export default async function ScenarioPage({ params }: { params: { id: string } }) {
  const loaded = await getScenarioById(params.id);

  if (!loaded.scenario) {
    return (
      <main>
        <h1>Scenario unavailable</h1>
        <p role="alert">{loaded.error ?? 'Scenario not found.'}</p>
        <Link href="/scenarios">Return to scenarios</Link>
      </main>
    );
  }

  return (
    <main>
      <p>
        <Link href="/scenarios">← Back to scenarios</Link>
      </p>
      <h1>
        {loaded.scenario.id}: {loaded.scenario.title}
      </h1>
      <ScenarioTabs scenario={loaded.scenario} />
    </main>
  );
}
