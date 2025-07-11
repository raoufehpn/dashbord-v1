
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/providers/auth-provider';
import { Skeleton } from '@/components/ui/skeleton';
import { OnboardingGuide } from '@/components/OnboardingGuide';
import { TaskFormModal } from '@/components/modals/TaskFormModal';
import { AISuggestModal } from '@/components/modals/AISuggestModal';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
        <div className="flex h-screen w-full bg-muted/30">
            <Skeleton className="h-full w-[18rem]" />
            <div className="flex-1 flex flex-col">
                <Skeleton className="h-16 shrink-0 m-4 rounded-lg" />
                <div className="flex-1 p-4 md:p-6 space-y-6">
                    <div className="grid grid-cols-4 gap-6">
                        <Skeleton className="h-28 rounded-lg" />
                        <Skeleton className="h-28 rounded-lg" />
                        <Skeleton className="h-28 rounded-lg" />
                        <Skeleton className="h-28 rounded-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-6">
                       <Skeleton className="h-64 col-span-2 rounded-lg" />
                       <Skeleton className="h-64 col-span-1 rounded-lg" />
                    </div>
                     <div className="grid grid-cols-2 gap-6">
                       <Skeleton className="h-64 rounded-lg" />
                       <Skeleton className="h-64 rounded-lg" />
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <SidebarInset className="flex flex-col h-screen overflow-y-auto">
            <Header />
            <main className="flex-1 flex flex-col p-4 md:p-6 bg-muted/40 relative">
              {children}
            </main>
        </SidebarInset>
        <TaskFormModal />
        <AISuggestModal />
        <OnboardingGuide />
    </SidebarProvider>
  );
}
