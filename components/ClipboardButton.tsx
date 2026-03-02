'use client';

type Props = {
  label: string;
  text: string;
  className?: string;
};

export default function ClipboardButton({ label, text, className }: Props) {
  async function copy() {
    await navigator.clipboard.writeText(text);
  }

  return (
    <button type="button" className={className} onClick={copy} aria-label={label}>
      {label}
    </button>
  );
}
