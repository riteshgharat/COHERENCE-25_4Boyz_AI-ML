import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Minute Resume',
  description: 'AI Resume Screener',
  generator: 'Next.js',
}

import { ResumeProvider } from "@/context/resume-context";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ResumeProvider>
          {children}
        </ResumeProvider>
      </body>
    </html>
  );
}
