
"use client";

import { Task } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format, parseISO } from 'date-fns';
import { Clock } from "lucide-react";

const priorityColors: Record<string, string> = {
    high: "border-l-red-500 bg-red-500/10 text-red-800 dark:text-red-200",
    medium: "border-l-blue-500 bg-blue-500/10 text-blue-800 dark:text-blue-200",
    low: "border-l-green-500 bg-green-500/10 text-green-800 dark:text-green-200",
    default: "border-l-muted-foreground/50 bg-muted/50 text-muted-foreground",
}

interface CalendarEventProps {
    task: Task;
    showTime?: boolean;
}

export function CalendarEvent({ task, showTime = true }: CalendarEventProps) {
    const colorClass = priorityColors[task.priority] || priorityColors.default;

    return (
        <div className={cn("text-xs p-1.5 rounded-md mb-1 border-l-4", colorClass)}>
            <p className="font-semibold truncate">{task.title}</p>
            {task.dueDate && showTime && (
                 <div className="flex items-center gap-1 opacity-80 mt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{format(parseISO(task.dueDate), 'h:mmaa')}</span>
                </div>
            )}
        </div>
    );
}
