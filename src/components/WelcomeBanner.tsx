
"use client";

import { useAuth } from "@/providers/auth-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent } from "./ui/card";

export function WelcomeBanner() {
    const { user } = useAuth();
    const displayName = user?.email?.split('@')[0] || 'there';
    const avatarFallback = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

    return (
        <Card>
            <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src="https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg" alt="App Logo" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-2xl font-bold">Hello {displayName}!</h2>
                    <p className="text-muted-foreground">It's good to see you again.</p>
                </div>
            </CardContent>
        </Card>
    )
}
