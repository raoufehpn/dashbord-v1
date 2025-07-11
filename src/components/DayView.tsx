
"use client"

import * as React from "react"
import { useTasks } from "@/providers/tasks-provider"
import { Skeleton } from "./ui/skeleton"
import { Task } from "@/lib/types"
import { format, isSameDay, parseISO } from 'date-fns'
import { CalendarEvent } from "./CalendarEvent"
import { cn } from "@/lib/utils"
import { hours, getEventPosition, getHourKey } from "@/lib/calendar-utils"

interface DayViewProps {
    date: Date;
}

export function DayView({ date }: DayViewProps) {
    const { filteredTasks, isLoading } = useTasks()

    const dayTasks = React.useMemo(() => {
        return filteredTasks.filter(task => {
            if (!task.dueDate || task.deletedAt) return false;
            return isSameDay(parseISO(task.dueDate), date);
        });
    }, [filteredTasks, date]);

    if (isLoading) {
        return <Skeleton className="h-full w-full" />
    }
    
    const isCurrentDate = isSameDay(date, new Date());

    return (
        <div className="flex flex-col h-full border-t">
            <div className="grid grid-cols-[auto_1fr] h-full">
                {/* Time column */}
                <div className="w-16 border-r text-center">
                    <div className="h-20 sticky top-0 bg-background z-20" />
                    {hours.map(hour => (
                        <div key={hour} className="h-12 relative -top-3">
                            <span className="text-xs text-muted-foreground">{hour}</span>
                        </div>
                    ))}
                </div>

                {/* Day content */}
                <div className="border-r relative">
                     <div className={cn("text-center p-2 border-b sticky top-0 bg-background z-20", isCurrentDate && "text-primary")}>
                        <div className="text-sm font-medium">{format(date, 'EEEE')}</div>
                        <div className={cn("text-2xl font-bold", isCurrentDate && "bg-primary text-primary-foreground rounded-full w-10 h-10 mx-auto flex items-center justify-center")}>
                            {format(date, 'd')}
                        </div>
                    </div>
                    <div className="relative">
                        {/* Hour lines */}
                        {hours.map(hour => <div key={getHourKey(date, hour)} className="h-12 border-b" />)}
                        
                        {/* Events */}
                        {dayTasks.map(task => {
                            const { top, height } = getEventPosition(task);
                            return (
                                <div key={task.id} className="absolute w-full px-1 z-10" style={{ top, height }}>
                                    <CalendarEvent task={task} />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
