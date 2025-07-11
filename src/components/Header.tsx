
"use client"

import React from 'react';
import { Bell, Menu, Settings, LogOut } from 'lucide-react';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth } from '@/providers/auth-provider';

export function Header() {
  const { user, logOut } = useAuth();
  const { isMobile } = useSidebar();
  const avatarFallback = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  const displayName = user?.email?.split('@')[0] || 'there';


  return (
    <header className="flex items-center justify-between bg-card/50 backdrop-blur-sm border-b px-4 md:px-6 sticky top-0 z-30 py-3">
      <div className="flex items-center gap-4">
        {isMobile && (
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </SidebarTrigger>
        )}
         <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold font-headline">Hello, {displayName}!</h1>
            <p className="text-sm text-muted-foreground hidden md:block">Welcome to your dashboard</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg" alt="User Avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
             </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
