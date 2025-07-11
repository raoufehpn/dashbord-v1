
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const projects = [
    {
        name: "Web Revamp",
        status: "In Progress",
        progress: 70,
        avatar: { src: "https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg", hint: "website wireframe" }
    },
    {
        name: "App Launch",
        status: "Completed",
        progress: 100,
        avatar: { src: "https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg", hint: "mobile app" }
    },
    {
        name: "CRM Update",
        status: "On Hold",
        progress: 20,
        avatar: { src: "https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg", hint: "crm dashboard" }
    }
];

export function ProjectsList() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects</CardTitle>
                <p className="text-sm font-medium text-muted-foreground">Progress</p>
            </CardHeader>
            <CardContent className="space-y-6">
                {projects.map((project, index) => (
                    <div key={index} className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src={project.avatar.src} alt={project.name} />
                            <AvatarFallback>{project.name.substring(0,2)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <p className="font-semibold">{project.name}</p>
                            <p className="text-sm text-muted-foreground">{project.status}</p>
                        </div>
                        <div className="w-24 text-right">
                           <p className="font-semibold text-sm">{project.progress}%</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
