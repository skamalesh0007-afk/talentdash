import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/ui/Navbar';

export const metadata: Metadata = {
  title: { default: 'TalentDash — India Salary & Career Intelligence', template: '%s | TalentDash' },
  description: 'Structured, comparable compensation data for software engineers and professionals in India. Research salaries by company, role, level, and location.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://talentdash.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'TalentDash',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
