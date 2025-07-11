
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/providers/theme-provider';
import { TasksProvider } from '@/providers/tasks-provider';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from '@/providers/auth-provider';
import { ActivityLogProvider } from '@/providers/activity-log-provider';
import { OnboardingProvider } from '@/providers/onboarding-provider';

export const metadata: Metadata = {
  title: 'TaskPilot',
  description: 'A modern task management dashboard.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <style>
          {`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .print-container {
                padding: 2rem;
              }
              .print-hidden {
                display: none !important;
              }
            }
          `}
        </style>
      </head>
      <body className="font-body antialiased">
        <ThemeProvider defaultTheme="dark" storageKey="taskpilot-theme">
          <AuthProvider>
            <OnboardingProvider>
              <ActivityLogProvider>
                <TasksProvider>
                  {children}
                  <Toaster />
                </TasksProvider>
              </ActivityLogProvider>
            </OnboardingProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
