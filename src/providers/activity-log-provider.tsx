
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Activity } from '@/lib/types';
import { useAuth } from './auth-provider';

interface ActivityLogContextType {
  activities: Activity[];
  addActivity: (activityData: Omit<Activity, 'id' | 'timestamp'>) => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

const getActivityLogStorageKey = (userId: string) => `taskpilot-activity-log-${userId}`;

export const ActivityLogProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    if (authLoading) return;
    
    if (user) {
      try {
        const key = getActivityLogStorageKey(user.id);
        const storedActivities = localStorage.getItem(key);
        if (storedActivities) {
          setActivities(JSON.parse(storedActivities));
        } else {
          setActivities([]);
        }
      } catch (error) {
        console.error("Failed to load activity log from localStorage", error);
      }
    } else {
      setActivities([]);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (!authLoading && user) {
        try {
            const key = getActivityLogStorageKey(user.id);
            localStorage.setItem(key, JSON.stringify(activities));
        } catch (error) {
            console.error("Failed to save activity log to localStorage", error);
        }
    }
  }, [activities, authLoading, user]);
  
  const addActivity = (activityData: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...activityData,
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50)); // Keep last 50 activities
  };
  
  return (
    <ActivityLogContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityLogContext.Provider>
  );
};

export const useActivityLog = () => {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
};
