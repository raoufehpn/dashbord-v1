
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Legend } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
} from "@/components/ui/chart"
import { useTasks } from "@/providers/tasks-provider"
import { Skeleton } from "./ui/skeleton"

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export function CategoryBreakdownChart() {
    const { filteredTasks, isLoading } = useTasks()

    const chartData = React.useMemo(() => {
        if (isLoading || filteredTasks.length === 0) return [];

        const activeTasks = filteredTasks.filter(task => !task.deletedAt);
        const tagsCount: { [key: string]: number } = {};

        activeTasks.forEach(task => {
            if (task.tags && task.tags.length > 0) {
                task.tags.forEach(tag => {
                    tagsCount[tag] = (tagsCount[tag] || 0) + 1;
                });
            } else {
                tagsCount['Uncategorized'] = (tagsCount['Uncategorized'] || 0) + 1;
            }
        });

        return Object.keys(tagsCount).map(tag => ({
            name: tag,
            value: tagsCount[tag],
        }));

    }, [filteredTasks, isLoading]);

    const chartConfig = chartData.reduce((acc, entry, index) => {
        acc[entry.name] = {
            label: entry.name,
            color: COLORS[index % COLORS.length]
        };
        return acc;
    }, {} as any);


    if (isLoading) {
        return <Skeleton className="h-full w-full col-span-1" />
    }

    return (
        <Card className="flex flex-col col-span-1 h-full">
            <CardHeader className="pb-0">
                <CardTitle className="text-lg">Category Breakdown</CardTitle>
                <CardDescription className="text-xs">Distribution of tasks by tag.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0 pt-2">
                {chartData.length > 0 ? (
                    <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[150px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="45%"
                                    labelLine={false}
                                    outerRadius={50}
                                    innerRadius={35}
                                    fill="#8884d8"
                                    dataKey="value"
                                    nameKey="name"
                                    paddingAngle={5}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend verticalAlign="bottom" wrapperStyle={{fontSize: '0.8rem', paddingTop: '10px'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartContainer>
                ) : (
                    <div className="flex h-[150px] items-center justify-center text-muted-foreground">
                        No tags found in tasks.
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
