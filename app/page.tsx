import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <h1>Network Diagnostic Workbench</h1>
      <section className="card">
        <h2>Purpose</h2>
        <p>
          This workbench helps CST630 students investigate realistic network scenarios using evidence-based
          troubleshooting artifacts.
        </p>
      </section>
      <section className="card">
        <h2>How to use</h2>
        <ol>
          <li>Select a scenario.</li>
          <li>Review artifact tabs and capture citations.</li>
          <li>Build a hypothesis in the Notes and export tab.</li>
        </ol>
        <Link href="/scenarios">Browse scenarios</Link>
      </section>
      <section className="card" aria-labelledby="accessibility-heading">
        <h2 id="accessibility-heading">Accessibility statement</h2>
        <p>
          The app supports keyboard navigation, ARIA tab semantics, visible focus states, and table/text
          alternatives for all graph views.
        </p>
      </section>
    </main>
  );
}
