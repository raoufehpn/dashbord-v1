
"use client";

import { useTasks } from "@/providers/tasks-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Circle, ListTodo } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Priority } from "@/lib/types";
import { format, parseISO } from "date-fns";
import { Skeleton } from "../ui/skeleton";

export function TasksList() {
    const { tasks, isLoading } = useTasks();

    const recentTasks = tasks
        .filter(task => task.status !== 'done' && !task.deletedAt)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

    const priorityVariant: Record<Priority, "destructive" | "default" | "secondary"> = {
        high: "destructive",
        medium: "default",
        low: "secondary"
    }

    if (isLoading) {
        return (
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-1" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>A quick look at your most recent tasks.</CardDescription>
            </CardHeader>
            <CardContent>
                {recentTasks.length > 0 ? (
                    <div className="space-y-4">
                        {recentTasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                                <div className="flex items-center gap-4">
                                     {task.status === 'in-progress' ? <ListTodo className="h-5 w-5 text-primary" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
                                    <div>
                                        <p className="font-medium">{task.title}</p>
                                        {task.dueDate && <p className="text-sm text-muted-foreground">Due: {format(parseISO(task.dueDate), 'MMM d')}</p>}
                                    </div>
                                </div>
                                <Badge variant={priorityVariant[task.priority || 'low']} className="capitalize h-6 shrink-0">{task.priority || 'low'}</Badge>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No active tasks. Good job!</p>
                )}
                 <div className="mt-6 flex justify-end">
                    <Button variant="ghost" asChild>
                        <Link href="/tasks">
                            View All Tasks
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
