
"use client";

import { useTasks } from '@/providers/tasks-provider';
import { TaskColumn } from '@/components/TaskColumn';
import { Skeleton } from '@/components/ui/skeleton';
import { STATUSES, Status } from '@/lib/types';
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { PrintView } from '@/components/PrintView';
import { useState } from 'react';

export default function TasksPage() {
  const { filteredTasks, isLoading, moveTask } = useTasks();
  const [isPrinting, setIsPrinting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px]" />
        <Skeleton className="h-[500px]" />
      </div>
    );
  }

  const activeTasks = filteredTasks.filter(task => !task.deletedAt);

  const tasksByStatus = {
    todo: activeTasks.filter(task => task.status === 'todo'),
    'in-progress': activeTasks.filter(task => task.status === 'in-progress'),
    done: activeTasks.filter(task => task.status === 'done'),
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const taskId = active.id as string;
      const newStatus = over.id as Status;
      moveTask(taskId, newStatus);
    }
  };
  
  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
        window.print();
        setIsPrinting(false);
    }, 100);
  }

  return (
    <>
      <div className="flex justify-end mb-4 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print View
        </Button>
      </div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start print:hidden">
          {STATUSES.map(status => (
            <TaskColumn key={status} status={status} tasks={tasksByStatus[status]} />
          ))}
        </div>
      </DndContext>
      {isPrinting && <PrintView tasks={activeTasks} />}
    </>
  );
}
