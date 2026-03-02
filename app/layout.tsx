import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Network Diagnostic Workbench',
  description: 'CST630 diagnostic simulation workbench'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
