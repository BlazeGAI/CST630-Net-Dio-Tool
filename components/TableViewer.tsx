import ClipboardButton from './ClipboardButton';

type Props = {
  scenarioId: string;
  artifactId: string;
  columns: string[];
  rows: Array<Record<string, string | number>>;
};

export default function TableViewer({ scenarioId, artifactId, columns, rows }: Props) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => {
          const rowId = String(row.row_id);
          const citation = `${scenarioId}:${artifactId}:ROW:${rowId}`;
          return (
            <tr key={rowId}>
              {columns.map((column) => (
                <td key={`${rowId}-${column}`}>{String(row[column] ?? '')}</td>
              ))}
              <td>
                <ClipboardButton label={`Copy citation for row ${rowId}`} text={citation} className="secondary" />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
