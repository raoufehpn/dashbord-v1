
"use client"

import * as React from "react"
import { useTasks } from "@/providers/tasks-provider"
import { Skeleton } from "./ui/skeleton"
import { Task } from "@/lib/types"
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isToday, parseISO, isSameDay } from 'date-fns'
import { CalendarEvent } from "./CalendarEvent"
import { cn } from "@/lib/utils"

const WeekdayHeader = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
        <div className="grid grid-cols-7 sticky top-0 bg-background z-10 border-b border-l">
            {days.map(day => (
                <div key={day} className="p-2 text-sm font-medium text-muted-foreground text-center border-r">
                    {day}
                </div>
            ))}
        </div>
    );
};

interface CalendarViewProps {
    date: Date;
}

export function CalendarView({ date: monthDate }: CalendarViewProps) {
    const { filteredTasks, isLoading } = useTasks()
    
    const tasksByDate = React.useMemo(() => {
        const activeTasks = filteredTasks.filter(task => !task.deletedAt && task.dueDate)
        const groupedTasks: { [key: string]: Task[] } = {}
        
        activeTasks.forEach(task => {
            if (task.dueDate) {
                const dateKey = format(parseISO(task.dueDate), 'yyyy-MM-dd');
                if (!groupedTasks[dateKey]) {
                    groupedTasks[dateKey] = []
                }
                groupedTasks[dateKey].push(task)
            }
        })
        return groupedTasks
    }, [filteredTasks])

    const calendarDays = React.useMemo(() => {
        const monthStart = startOfMonth(monthDate);
        const monthEnd = endOfMonth(monthDate);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);
        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [monthDate]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-7 grid-rows-5 gap-px pt-px flex-1">
                {Array.from({ length: 35 }).map((_, i) => (
                    <Skeleton key={i} className="h-full w-full min-h-[120px]" />
                ))}
            </div>
        )
    }
    
    const numRows = Math.ceil(calendarDays.length / 7);

    return (
        <div className="flex-1 flex flex-col border-t h-full">
            <WeekdayHeader />
            <div 
                className={cn("flex-1 grid grid-cols-7 border-l")}
                style={{ gridTemplateRows: `repeat(${numRows}, minmax(0, 1fr))` }}
            >
                {calendarDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd');
                    const dayTasks = tasksByDate[dateKey] || [];
                    const isCurrentMonth = isSameMonth(day, monthDate);
                    
                    return (
                        <div key={day.toString()} className={cn("relative flex flex-col border-r border-b p-2", !isCurrentMonth && "bg-muted/30 text-muted-foreground/50")}>
                            <span className={cn("self-end text-sm", isToday(day) && "bg-primary text-primary-foreground rounded-full h-6 w-6 flex items-center justify-center")}>
                                {format(day, 'd')}
                            </span>
                            <div className="flex-1 mt-1 -mx-1 overflow-y-auto">
                               <div className="px-1 space-y-1">
                                    {dayTasks.map(task => (
                                        <CalendarEvent key={task.id} task={task} showTime={false} />
                                    ))}
                               </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
