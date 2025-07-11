
"use client"

import { useTasks } from "@/providers/tasks-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw, Trash2, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format, parseISO } from 'date-fns';

export default function TrashPage() {
    const { filteredTasks, isLoading, restoreTask, permanentlyDeleteTask } = useTasks()

    const deletedTasks = filteredTasks.filter(task => task.deletedAt);

    if (isLoading) {
        return <Skeleton className="h-96 w-full" />
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trash Bin</CardTitle>
                <CardDescription>Tasks in the trash can be restored or permanently deleted.</CardDescription>
            </CardHeader>
            <CardContent>
                {deletedTasks.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead className="hidden md:table-cell">Date Deleted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deletedTasks.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell className="font-medium">{task.title}</TableCell>
                                    <TableCell className="hidden md:table-cell">
                                        {task.deletedAt ? format(parseISO(task.deletedAt), 'PPpp') : ''}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => restoreTask(task.id)}>
                                            <RotateCcw className="h-4 w-4" />
                                            <span className="sr-only">Restore</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => permanentlyDeleteTask(task.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete Permanently</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Empty Trash</AlertTitle>
                        <AlertDescription>
                            Your trash bin is currently empty. Deleted tasks will appear here.
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}
