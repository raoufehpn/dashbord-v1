
"use client";

import { useState } from 'react';
import { CalendarView } from "@/components/CalendarView";
import { WeekView } from "@/components/WeekView";
import { DayView } from "@/components/DayView";
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, addMonths, subMonths, addDays, subDays, addWeeks, subWeeks } from 'date-fns';
import { useTasks } from '@/providers/tasks-provider';
import { cn } from '@/lib/utils';

type CalendarViewType = 'month' | 'week' | 'day';

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<CalendarViewType>('month');
    const { openTaskModal } = useTasks();

    const handlePrev = () => {
        if (view === 'month') {
            setCurrentDate(prev => subMonths(prev, 1));
        } else if (view === 'week') {
            setCurrentDate(prev => subWeeks(prev, 1));
        } else {
            setCurrentDate(prev => subDays(prev, 1));
        }
    };

    const handleNext = () => {
        if (view === 'month') {
            setCurrentDate(prev => addMonths(prev, 1));
        } else if (view === 'week') {
            setCurrentDate(prev => addWeeks(prev, 1));
        } else {
            setCurrentDate(prev => addDays(prev, 1));
        }
    };

    const handleToday = () => {
        setCurrentDate(new Date());
    }

    const renderView = () => {
        switch (view) {
            case 'month':
                return <CalendarView date={currentDate} />;
            case 'week':
                return <WeekView date={currentDate} />;
            case 'day':
                return <DayView date={currentDate} />;
            default:
                return null;
        }
    };
    
    const headerTitle = () => {
        if (view === 'month') return format(currentDate, "MMMM yyyy");
        if (view === 'week') {
             const startOfWeek = subDays(currentDate, currentDate.getDay());
             const endOfWeek = addDays(startOfWeek, 6);
             const startFormat = format(startOfWeek, 'MMM d');
             const endFormat = format(endOfWeek, 'MMM d, yyyy');
             return `${startFormat} - ${endFormat}`;
        }
        return format(currentDate, "MMMM d, yyyy");
    }


    return (
        <div className="h-full flex flex-col">
            <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b shrink-0">
                <div className="flex items-center gap-4">
                     <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={handleToday}>Today</Button>
                        <Button variant="ghost" size="icon" onClick={handlePrev}>
                            <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <span className="text-lg font-semibold w-40 sm:w-48 text-center">{headerTitle()}</span>
                        <Button variant="ghost" size="icon" onClick={handleNext}>
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                     <div className="flex items-center rounded-md p-1 bg-muted text-muted-foreground">
                        <Button variant={view === 'month' ? 'ghost' : 'ghost'} size="sm" onClick={() => setView('month')} className={cn(view === 'month' && "bg-background text-foreground", "h-8 px-3")}>Month</Button>
                        <Button variant={view === 'week' ? 'ghost' : 'ghost'} size="sm" onClick={() => setView('week')} className={cn(view === 'week' && "bg-background text-foreground", "h-8 px-3")}>Week</Button>
                        <Button variant={view === 'day' ? 'ghost' : 'ghost'} size="sm" onClick={() => setView('day')} className={cn(view === 'day' && "bg-background text-foreground", "h-8 px-3")}>Day</Button>
                    </div>
                    <Button onClick={() => openTaskModal()} className="ml-auto">
                        <Plus className="mr-2 h-4 w-4" />
                        Create
                    </Button>
                </div>
            </header>
            <div className="flex-1 overflow-hidden">
                {renderView()}
            </div>
        </div>
    );
}
