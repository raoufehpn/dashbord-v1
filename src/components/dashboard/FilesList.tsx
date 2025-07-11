
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, FileText, Calendar, Folder } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const files = [
    {
        name: "Wireframe_v2.pdf",
        description: "This file contain layouts for the dashboard, task board, and team page.",
        assignee: { name: "Jacob Jones", avatar: "https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg", hint: "man glasses" },
        date: "Thu, 12 Jul",
        fileCount: 0
    },
    {
        name: "UI_Design.fig",
        description: "This file contain layouts for the dashboard, task board, and team page.",
        assignee: { name: "Sara Bella", avatar: "https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg", hint: "woman smiling" },
        date: "Thu, 12 Jul",
        fileCount: 0
    }
];

export function FilesList() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <CardTitle>Files</CardTitle>
                    <Badge variant="secondary">1</Badge>
                </div>
                <Button variant="ghost" size="icon">
                    <Plus className="h-5 w-5" />
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {files.map((file, index) => (
                    <div key={index}>
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="font-semibold">{file.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1 max-w-md">{file.description}</p>
                            </div>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-5 w-5" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={file.assignee.avatar} alt={file.assignee.name} />
                                    <AvatarFallback>{file.assignee.name.substring(0,2)}</AvatarFallback>
                                </Avatar>
                                <span>{file.assignee.name}</span>
                            </div>
                            <div className="flex items-center gap-4">
                               <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>{file.date}</span>
                               </div>
                               <div className="flex items-center gap-2">
                                  <Folder className="h-4 w-4" />
                                  <span>{file.fileCount} files</span>
                               </div>
                            </div>
                        </div>
                        {index < files.length - 1 && <Separator className="mt-6" />}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
