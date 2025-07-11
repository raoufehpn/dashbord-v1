
"use client"

import { Priority, Task } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash2, GripVertical } from "lucide-react"
import { useTasks } from "@/providers/tasks-provider"
import { format, parseISO } from 'date-fns';
import { Progress } from "./ui/progress"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { cn } from "@/lib/utils"

interface TaskCardProps {
    task: Task
}

export function TaskCard({ task }: TaskCardProps) {
    const { deleteTask, openTaskModal } = useTasks();
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
    
    const priorityVariant: Record<Priority, "destructive" | "default" | "secondary"> = {
        high: "destructive",
        medium: "default",
        low: "secondary"
    }

    const progress = task.subtasks && task.subtasks.length > 0
        ? (task.subtasks.filter(st => st.completed).length / task.subtasks.length) * 100
        : task.status === 'done' ? 100 : 0;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={cn("mb-2 hover:shadow-md transition-shadow", isDragging && "opacity-50 shadow-lg")}
        >
            <CardContent className="p-3 flex items-start gap-4">
                <button {...attributes} {...listeners} className="cursor-grab touch-none mt-1">
                    <GripVertical className="h-5 w-5 text-muted-foreground" />
                </button>
                <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-base">{task.title}</h3>
                        <Badge variant={priorityVariant[task.priority]} className="capitalize h-6 shrink-0">{task.priority}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">{task.description || "No description."}</p>

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                            {task.tags.map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                    )}

                    {(task.subtasks && task.subtasks.length > 0 || task.status === 'done') && (
                        <div className="flex items-center gap-2 pt-1">
                            <Progress value={progress} className="h-1.5 w-full" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{Math.round(progress)}%</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col items-end gap-2">
                    {task.dueDate && <span className="text-xs text-muted-foreground whitespace-nowrap">{format(parseISO(task.dueDate), "MMM d")}</span>}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openTaskModal(task)}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteTask(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardContent>
        </Card>
    )
}
