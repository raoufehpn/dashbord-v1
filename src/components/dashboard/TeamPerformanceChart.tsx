
"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"

const chartData = [
  { name: "US", value: 310 },
  { name: "Canada", value: 250 },
  { name: "Mexico", value: 180 },
  { name: "China", value: 290 },
  { name: "Japan", value: 210 },
  { name: "Australia", value: 150 },
]

export function TeamPerformanceChart() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Team Performance Chart</CardTitle>
                 <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{}} className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                            <XAxis dataKey="name" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--accent))', radius: 8 }} />
                            <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[8, 8, 8, 8]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
