
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownRight, ArrowUpRight, DollarSign, Briefcase, Clock, Users } from "lucide-react"

const stats = [
    {
        title: "Total revenue",
        value: "$53,009.89",
        change: "+2.5%",
        changeType: "increase",
        icon: <DollarSign className="h-6 w-6 text-muted-foreground" />
    },
    {
        title: "Projects",
        value: "95/100",
        change: "-10%",
        changeType: "decrease",
        icon: <Briefcase className="h-6 w-6 text-muted-foreground" />
    },
    {
        title: "Time spent",
        value: "1022/1300 Hrs",
        change: "+8%",
        changeType: "increase",
        icon: <Clock className="h-6 w-6 text-muted-foreground" />
    },
    {
        title: "Resources",
        value: "101/120",
        change: "+2%",
        changeType: "increase",
        icon: <Users className="h-6 w-6 text-muted-foreground" />
    }
]

export function Overview() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground flex items-center">
                            {stat.changeType === 'increase' ? (
                                <ArrowUpRight className="h-4 w-4 mr-1 text-green-500" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1 text-red-500" />
                            )}
                            <span className={stat.changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
                                {stat.change}
                            </span>
                            <span className="ml-1">from last month</span>
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
