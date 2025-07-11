
"use client"

import { useActivityLog } from "@/providers/activity-log-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineTitle, TimelineDescription, TimelineTime } from "@/components/ui/timeline"
import { FilePlus, Edit, Trash, CheckCircle, RotateCcw } from "lucide-react"

const activityIcons = {
    CREATE: <FilePlus className="h-4 w-4" />,
    UPDATE: <Edit className="h-4 w-4" />,
    DELETE: <Trash className="h-4 w-4" />,
    RESTORE: <RotateCcw className="h-4 w-4" />,
    COMPLETE: <CheckCircle className="h-4 w-4" />
}

const activityTitles = {
    CREATE: "Task Created",
    UPDATE: "Task Updated",
    DELETE: "Task Deleted",
    RESTORE: "Task Restored",
    COMPLETE: "Task Completed"
}

export default function ActivityPage() {
    const { activities } = useActivityLog();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>A log of all actions taken within your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
                {activities.length > 0 ? (
                    <Timeline>
                        {activities.map(activity => (
                            <TimelineItem key={activity.id}>
                                <TimelineConnector />
                                <TimelineHeader>
                                    <TimelineIcon>{activityIcons[activity.type]}</TimelineIcon>
                                    <TimelineTitle>{activityTitles[activity.type]}</TimelineTitle>
                                    <TimelineTime>{new Date(activity.timestamp).toLocaleString()}</TimelineTime>
                                </TimelineHeader>
                                <TimelineDescription>
                                    <span className="font-semibold">{activity.taskTitle}</span>
                                    {activity.details && <span className="text-muted-foreground"> - {activity.details}</span>}
                                </TimelineDescription>
                            </TimelineItem>
                        ))}
                    </Timeline>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No activity yet. Start working on some tasks!</p>
                )}
            </CardContent>
        </Card>
    )
}
