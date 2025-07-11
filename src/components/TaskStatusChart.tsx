
"use client"

import * as React from "react"
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { format, subDays, parseISO } from 'date-fns'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useTasks } from "@/providers/tasks-provider"
import { Skeleton } from "./ui/skeleton"

export function TaskStatusChart() {
  const { filteredTasks, isLoading } = useTasks()

  const chartData = React.useMemo(() => {
    if (isLoading) return [];
    
    // Use dummy data if no tasks to match design
    const dummyData = [
      { date: 'mon', tasks: 0 },
      { date: 'tue', tasks: 1.5 },
      { date: 'wed', tasks: 1 },
      { date: 'thu', tasks: 2.5 },
      { date: 'fri', tasks: 4 },
      { date: 'sat', tasks: 3 },
      { date: 'sun', tasks: 2 },
    ];

    if (filteredTasks.length === 0) return dummyData;
    
    const activeTasks = filteredTasks.filter(task => !task.deletedAt);
    const tasksByDate: { [key: string]: number } = {};
    const today = new Date();
    
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
        const d = subDays(today, 6 - i);
        return format(d, 'eee').toLowerCase();
    });

    last7Days.forEach(day => {
        tasksByDate[day] = 0;
    });

    activeTasks.forEach(task => {
        const taskDate = parseISO(task.createdAt);
        const dayOfWeek = format(taskDate, 'eee').toLowerCase();
        if (tasksByDate.hasOwnProperty(dayOfWeek)) {
            tasksByDate[dayOfWeek]++;
        }
    });

    return Object.keys(tasksByDate).map(date => ({
        date,
        tasks: tasksByDate[date],
    }));

  }, [filteredTasks, isLoading]);

  const chartConfig = {
    tasks: {
      label: "Tasks",
      color: "hsl(var(--chart-1))",
    },
  }

  if (isLoading) {
    return <Skeleton className="h-[250px] w-full" />
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-lg">Your statistics</CardTitle>
        <CardDescription className="text-xs">Learning Hours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
              >
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `${value}h`}
                  domain={[0, 'dataMax + 1']}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<ChartTooltipContent formatter={(value) => `${value}h`} hideIndicator />}
                  cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 2, strokeDasharray: '3 3' }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No task data to display.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
