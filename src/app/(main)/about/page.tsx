import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pilcrow } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto">
        <Card>
            <CardHeader className="items-center">
                <div className="p-3 bg-primary rounded-lg mb-4">
                    <Pilcrow className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-3xl font-headline">TaskPilot</CardTitle>
                <CardDescription>Your Modern Task Management Dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
                <p>
                    TaskPilot is a modern, responsive, and visually appealing Task Management Dashboard designed to streamline your workflow.
                </p>
                <p>
                    Built with Next.js, React, and Tailwind CSS, it offers a seamless experience for adding, editing, and tracking your tasks. Features include a statistical dashboard, interactive charts, a trash bin for soft deletes, and a persistent light/dark mode.
                </p>
                <p className="text-sm text-muted-foreground pt-4">
                    This application was developed by Raouf hpn. All rights reserved. It is not for sale, redistribution, or commercial use without permission.
                </p>
            </CardContent>
        </Card>
    </div>
  );
}
