
"use client"

import * as React from "react"
import { useTasks } from "@/providers/tasks-provider"
import { Skeleton } from "./ui/skeleton"
import { Task } from "@/lib/types"
import { format, startOfWeek, addDays, isSameDay, parseISO } from 'date-fns'
import { CalendarEvent } from "./CalendarEvent"
import { getEventPosition, getHourKey, hours } from "@/lib/calendar-utils"
import { cn } from "@/lib/utils"

interface WeekViewProps {
    date: Date;
}

export function WeekView({ date }: WeekViewProps) {
    const { filteredTasks, isLoading } = useTasks()

    const weekStartDate = startOfWeek(date, { weekStartsOn: 0 });

    const weekTasks = React.useMemo(() => {
        const start = weekStartDate;
        const end = addDays(start, 6);
        return filteredTasks.filter(task => {
            if (!task.dueDate || task.deletedAt) return false;
            const taskDate = parseISO(task.dueDate);
            return taskDate >= start && taskDate <= end;
        });
    }, [filteredTasks, weekStartDate]);

    if (isLoading) {
        return <Skeleton className="h-full w-full" />
    }

    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStartDate, i));
    const isCurrentDate = (day: Date) => isSameDay(day, new Date());

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

                {/* Day columns */}
                <div className="grid grid-cols-7 flex-1">
                    {weekDays.map(day => (
                        <div key={day.toISOString()} className="border-r relative">
                            <div className={cn("text-center p-2 border-b sticky top-0 bg-background z-20", isCurrentDate(day) && "text-primary")}>
                                <div className="text-sm font-medium">{format(day, 'EEE')}</div>
                                <div className={cn("text-2xl font-bold", isCurrentDate(day) && "bg-primary text-primary-foreground rounded-full w-10 h-10 mx-auto flex items-center justify-center")}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                            <div className="relative">
                                {/* Hour lines */}
                                {hours.map(hour => <div key={getHourKey(day, hour)} className="h-12 border-b" />)}
                                
                                {/* Events */}
                                {weekTasks
                                    .filter(task => isSameDay(parseISO(task.dueDate!), day))
                                    .map(task => {
                                        const { top, height } = getEventPosition(task);
                                        return (
                                            <div key={task.id} className="absolute w-full px-1 z-10" style={{ top, height }}>
                                                <CalendarEvent task={task} />
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
