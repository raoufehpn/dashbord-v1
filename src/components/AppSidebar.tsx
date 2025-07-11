
"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, ClipboardList, Calendar, Trash2, Pilcrow, Activity, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { useAuth } from '@/providers/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/activity', label: 'Activity', icon: Activity },
  { href: '/trash', label: 'Trash', icon: Trash2 },
  { href: '/about', label: 'About', icon: Pilcrow },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();
  const { state: sidebarState } = useSidebar();
  const avatarFallback = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  
  const isExpanded = sidebarState === 'expanded';

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <div className="flex flex-col h-full">
        <SidebarContent className="p-2 flex-1 flex flex-col">
          <div className={cn("p-4 flex items-center gap-3", isExpanded ? "justify-start" : "justify-center")}>
            <div className="p-1 bg-primary rounded-lg flex items-center justify-center">
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg" alt="App Logo" />
                    <AvatarFallback>TP</AvatarFallback>
                </Avatar>
            </div>
            {isExpanded && <span className="text-xl font-bold font-headline">TaskPilot</span>}
          </div>

          <SidebarMenu className="flex-1 mt-6">
            <SidebarGroup>
                <SidebarGroupLabel>MENU</SidebarGroupLabel>
                {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                    asChild
                    variant="default"
                    size="lg"
                    className="w-full justify-start"
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    >
                    <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                    </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                ))}
            </SidebarGroup>
          </SidebarMenu>

        </SidebarContent>

        <SidebarFooter className="p-2">
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg" alt="User Avatar" />
                    <AvatarFallback>{avatarFallback}</AvatarFallback>
                </Avatar>
                {isExpanded && (
                    <div className="overflow-hidden flex-1">
                        <p className="font-semibold text-sm truncate">{user?.email}</p>
                        <p className="text-xs text-muted-foreground truncate">Free Plan</p>
                    </div>
                )}
                <Button variant="ghost" size="icon" onClick={logOut} className={cn(!isExpanded && "flex-1 w-full")}>
                  <LogOut className="h-5 w-5"/>
                  <span className="sr-only">Log Out</span>
                </Button>
            </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
