
"use client"

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTasks } from "@/providers/tasks-provider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Tag, X } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { PRIORITIES, STATUSES } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { FormControl, FormField, FormItem } from "../ui/form";

const taskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']),
    priority: z.enum(['low', 'medium', 'high']),
    dueDate: z.date().optional(),
    tags: z.array(z.string()).optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function TaskFormModal() {
    const { isTaskModalOpen, closeTaskModal, editingTask, addTask, updateTask } = useTasks();
    const [tagInput, setTagInput] = useState('');

    const form = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: '',
            description: '',
            status: 'todo',
            priority: 'medium',
            tags: [],
        }
    });

    const watchedTags = form.watch("tags", []);

    useEffect(() => {
        if (editingTask) {
            form.reset({
                ...editingTask,
                dueDate: editingTask.dueDate ? new Date(editingTask.dueDate) : undefined,
                tags: editingTask.tags || [],
            });
        } else {
            form.reset({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueDate: undefined,
                tags: [],
            });
        }
    }, [editingTask, form.reset]);

    const onSubmit = (data: TaskFormData) => {
        const taskData = {
            ...data,
            subtasks: editingTask?.subtasks ?? [],
            dueDate: data.dueDate?.toISOString(),
        };

        if (editingTask) {
            updateTask({ ...editingTask, ...taskData });
        } else {
            addTask(taskData);
        }
        closeTaskModal();
    };

    const handleAddTag = () => {
        if (tagInput && !(watchedTags ?? []).includes(tagInput)) {
            form.setValue("tags", [...(watchedTags ?? []), tagInput]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        form.setValue("tags", (watchedTags ?? []).filter(tag => tag !== tagToRemove));
    };

    return (
        <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{editingTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
                    <DialogDescription>
                        {editingTask ? 'Update the details of your task.' : 'Fill in the details for your new task.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...form.register('title')} />
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" {...form.register('description')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Controller
                                name="status"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STATUSES.map(status => (
                                                <SelectItem key={status} value={status} className="capitalize">
                                                    {status.replace('-', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div>
                            <Label htmlFor="priority">Priority</Label>
                            <Controller
                                name="priority"
                                control={form.control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRIORITIES.map(priority => (
                                                <SelectItem key={priority} value={priority} className="capitalize">
                                                    {priority}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Controller
                            name="dueDate"
                            control={form.control}
                            render={({ field }) => (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            )}
                        />
                    </div>
                     <div>
                        <Label htmlFor="tags">Tags</Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                placeholder="Add a tag..."
                            />
                            <Button type="button" onClick={handleAddTag}>Add</Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {(watchedTags ?? []).map(tag => (
                                <Badge key={tag} variant="secondary">
                                    {tag}
                                    <button onClick={() => handleRemoveTag(tag)} className="ml-2 rounded-full hover:bg-destructive/20 p-0.5">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>


                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeTaskModal}>Cancel</Button>
                        <Button type="submit">
                            {editingTask ? 'Save Changes' : 'Create Task'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
