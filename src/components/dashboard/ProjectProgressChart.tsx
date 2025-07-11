
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
  { name: "Linux", value: 186 },
  { name: "Mac", value: 305 },
  { name: "iOS", value: 237 },
  { name: "Windows", value: 273 },
  { name: "Android", value: 209 },
  { name: "Other", value: 214 },
]

export function ProjectProgressChart() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Project Progress Chart</CardTitle>
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
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 8, 8]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
