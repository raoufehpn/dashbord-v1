
"use client";

import React from 'react';
import { useTasks } from '@/providers/tasks-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, Clock } from 'lucide-react';

export function DashboardStats() {
  const { filteredTasks, isLoading } = useTasks();

  if (isLoading) {
    return (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
        </div>
    )
  }

  const activeTasks = filteredTasks.filter(task => !task.deletedAt);
  const completedTasks = activeTasks.filter(task => task.status === 'done').length;
  const inProgressTasks = activeTasks.filter(task => task.status === 'in-progress').length;

  const stats = [
    { title: 'Courses completed', value: completedTasks, icon: <CheckCircle className="h-5 w-5 text-muted-foreground" /> },
    { title: 'Courses in progress', value: inProgressTasks, icon: <Clock className="h-5 w-5 text-muted-foreground" /> },
  ];

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center gap-3">
              {stat.icon}
              <CardTitle className="text-base font-semibold">{stat.title}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
