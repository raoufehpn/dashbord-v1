
import { Task } from "@/lib/types";
import { format, parseISO } from "date-fns";

export const hours = Array.from({ length: 24 }, (_, i) => {
    const date = new Date();
    date.setHours(i);
    return format(date, "ha"); // e.g., 12AM, 1AM...11PM
});

const HOUR_HEIGHT_IN_PX = 48;

export function getEventPosition(task: Task) {
    if (!task.dueDate) return { top: 0, height: HOUR_HEIGHT_IN_PX };
    
    const date = parseISO(task.dueDate);
    const startHour = date.getHours() + date.getMinutes() / 60;
    
    // Default to 1 hour duration if no end time
    const durationInHours = 1;

    return {
        top: startHour * HOUR_HEIGHT_IN_PX,
        height: durationInHours * HOUR_HEIGHT_IN_PX,
    };
}

export function getHourKey(date: Date, hour: string) {
    return `${format(date, 'yyyy-MM-dd')}-${hour}`;
}
