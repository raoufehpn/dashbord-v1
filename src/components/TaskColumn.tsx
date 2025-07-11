
"use client"

import { Status, Task } from "@/lib/types"
import { TaskCard } from "./TaskCard"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { cn } from "@/lib/utils"

interface TaskColumnProps {
    status: Status
    tasks: Task[]
}

const statusMap: Record<Status, string> = {
    'todo': "To Do",
    'in-progress': "In Progress",
    'done': "Done"
}

export function TaskColumn({ status, tasks }: TaskColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: status });

    return (
        <Card ref={setNodeRef} className={cn("flex-1 transition-colors flex flex-col", isOver && "bg-accent")}>
            <CardHeader>
                <CardTitle className="capitalize text-xl font-headline flex items-center gap-2">
                    {statusMap[status]}
                    <span className="text-sm font-normal bg-muted text-muted-foreground rounded-full px-2 py-0.5">{tasks.length}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1 overflow-y-auto">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.length > 0 ? (
                        tasks.map(task => <TaskCard key={task.id} task={task} />)
                    ) : (
                        <p className="text-muted-foreground text-sm p-4 text-center">No tasks in this category.</p>
                    )}
                </SortableContext>
            </CardContent>
        </Card>
    )
}
