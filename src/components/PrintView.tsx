
import { Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Pilcrow } from "lucide-react";
import { Badge } from "./ui/badge";
import { format, parseISO } from "date-fns";

interface PrintViewProps {
    tasks: Task[];
}

export function PrintView({ tasks }: PrintViewProps) {
    
    const tasksByStatus = {
        todo: tasks.filter(task => task.status === 'todo'),
        'in-progress': tasks.filter(task => task.status === 'in-progress'),
        done: tasks.filter(task => task.status === 'done'),
    };

    return (
        <div className="print-container hidden print:block bg-white text-black">
            <div className="flex items-center justify-between mb-8 pb-4 border-b">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary rounded-lg flex items-center justify-center">
                        <Pilcrow className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-2xl font-bold font-headline">TaskPilot - Task List</h1>
                </div>
                <div className="text-sm">
                    {format(new Date(), 'PPP')}
                </div>
            </div>

            <div className="space-y-8">
                {Object.entries(tasksByStatus).map(([status, tasks]) => (
                    tasks.length > 0 && (
                        <div key={status}>
                            <h2 className="text-xl font-bold font-headline capitalize mb-4 pb-2 border-b-2 border-primary">{status.replace('-', ' ')}</h2>
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="p-4 border rounded-lg break-inside-avoid">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-lg">{task.title}</h3>
                                            {task.dueDate && (
                                                <span className="text-sm text-gray-600 shrink-0 ml-4">Due: {format(parseISO(task.dueDate), 'P')}</span>
                                            )}
                                        </div>
                                        <div className="my-2">
                                            <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'} className="capitalize">{task.priority}</Badge>
                                        </div>
                                        {task.description && <p className="text-gray-700 mt-2">{task.description}</p>}
                                        {task.subtasks && task.subtasks.length > 0 && (
                                            <div className="mt-3">
                                                <h4 className="font-semibold text-sm mb-1">Subtasks:</h4>
                                                <ul className="list-disc list-inside space-y-1">
                                                    {task.subtasks.map(subtask => (
                                                        <li key={subtask.id} className={`${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                                                            {subtask.text}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        {task.tags && task.tags.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                 {task.tags.map((tag, index) => (
                                                    <Badge key={index} variant="outline" className="text-xs">{tag}</Badge>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>
        </div>
    );
}
