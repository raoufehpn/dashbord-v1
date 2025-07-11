
"use client"

import { WelcomeBanner } from "@/components/WelcomeBanner";
import { DashboardStats } from "@/components/DashboardStats";
import { TaskStatusChart } from "@/components/TaskStatusChart";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, FileDown, FileUp } from "lucide-react";
import { useTasks } from "@/providers/tasks-provider";
import { useRef } from "react";
import { TasksList } from "@/components/dashboard/TasksList";

export default function DashboardPage() {
    const { openTaskModal, setIsAISuggestModalOpen, exportTasks, importTasks } = useTasks();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            importTasks(file);
        }
    };
    
    return (
        <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
                <div className="flex items-center gap-2 flex-wrap">
                    <Button onClick={() => openTaskModal()}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        New Task
                    </Button>
                    <Button variant="outline" onClick={() => setIsAISuggestModalOpen(true)}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Suggest
                    </Button>
                     <Button variant="outline" onClick={exportTasks}>
                        <FileDown className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Button variant="outline" onClick={handleImportClick}>
                        <FileUp className="mr-2 h-4 w-4" />
                        Import
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".json"
                    />
                </div>
            </div>

            <div className="block lg:hidden">
                <WelcomeBanner />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <div className="space-y-6">
                    <TaskStatusChart />
                    <TasksList />
                </div>
                <div className="space-y-6">
                    <div className="hidden lg:block">
                        <WelcomeBanner />
                    </div>
                    <DashboardStats />
                    <CategoryBreakdownChart />
                </div>
            </div>
        </div>
    )
}
