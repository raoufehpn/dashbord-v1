
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Task, Status } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { useAuth } from './auth-provider';
import { isToday, isTomorrow, parseISO, addDays, addWeeks, addMonths, subDays } from 'date-fns';
import { saveAs } from 'file-saver';
import { useActivityLog } from './activity-log-provider';

interface TasksContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  getTask: (id: string) => Task | undefined;
  permanentlyDeleteTask: (id: string) => void;
  restoreTask: (id: string) => void;
  moveTask: (id: string, newStatus: Status) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  exportTasks: () => void;
  importTasks: (file: File) => void;
  isAISuggestModalOpen: boolean;
  setIsAISuggestModalOpen: (isOpen: boolean) => void;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  openTaskModal: (task?: Task) => void;
  closeTaskModal: () => void;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

const getTasksStorageKey = (userId: string) => `taskpilot-tasks-${userId}`;
const getNotifiedTasksStorageKey = (userId: string) => `taskpilot-notified-tasks-${userId}`;

const initialTasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[] = [
    {
      title: 'Introduction to Python',
      description: 'Complete the first 3 modules.',
      status: 'done',
      priority: 'high',
      dueDate: subDays(new Date(), 5).toISOString(),
      tags: ['Programming', 'Python'],
      subtasks: [
        { id: 'sub1', text: 'Setup environment', completed: true },
        { id: 'sub2', text: 'Hello World', completed: true },
      ],
    },
    {
      title: 'Advanced React Patterns',
      description: 'Learn about hooks and context.',
      status: 'in-progress',
      priority: 'medium',
      dueDate: addDays(new Date(), 3).toISOString(),
      tags: ['Programming', 'React', 'Frontend'],
      subtasks: [
         { id: 'sub3', text: 'useState vs useReducer', completed: true },
         { id: 'sub4', text: 'useContext for theming', completed: false },
      ],
    },
     {
      title: 'Data Structures in JavaScript',
      description: 'Implement a linked list and a binary tree.',
      status: 'todo',
      priority: 'high',
      dueDate: addWeeks(new Date(), 2).toISOString(),
      tags: ['Programming', 'JavaScript', 'Algorithms'],
      subtasks: [],
    },
    {
      title: 'SQL for Data Science',
      description: 'Practice joins and aggregations.',
      status: 'todo',
      priority: 'medium',
      dueDate: addMonths(new Date(), 1).toISOString(),
      tags: ['Data Science', 'SQL', 'Database'],
      subtasks: [],
    }
];


export const TasksProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { addActivity } = useActivityLog();
  const [isAISuggestModalOpen, setIsAISuggestModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const checkPermissionsAndNotify = useCallback(() => {
    if (!user) return;
    if (typeof window === 'undefined' || !("Notification" in window)) return;
  
    if (Notification.permission === 'granted') {
      sendNotifications();
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          sendNotifications();
        }
      });
    }
  }, [user, tasks]);

  const sendNotifications = useCallback(() => {
    if (!user) return;
    const NOTIFIED_TASKS_KEY = getNotifiedTasksStorageKey(user.id);
    let notifiedTaskIds: string[] = [];
    try {
      notifiedTaskIds = JSON.parse(localStorage.getItem(NOTIFIED_TASKS_KEY) || '[]');
    } catch(e) {
      console.error("Could not parse notified tasks", e);
      notifiedTaskIds = [];
    }

    const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || task.deletedAt) return false;
        const dueDate = parseISO(task.dueDate);
        return (isToday(dueDate) || isTomorrow(dueDate)) && !notifiedTaskIds.includes(task.id);
    });

    upcomingTasks.forEach(task => {
        new Notification('Task Reminder', {
            body: `Your task "${task.title}" is due soon.`,
            icon: '/logo.png' 
        });
        notifiedTaskIds.push(task.id);
    });
    
    localStorage.setItem(NOTIFIED_TASKS_KEY, JSON.stringify(notifiedTaskIds));
  }, [user, tasks]);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }
    
    if (user) {
      setIsLoading(true);
      try {
        const TASKS_STORAGE_KEY = getTasksStorageKey(user.id);
        const storedTasks = localStorage.getItem(TASKS_STORAGE_KEY);
        if (storedTasks) {
          const loadedTasks = JSON.parse(storedTasks);
          setTasks(loadedTasks);
        } else {
           const formattedInitialTasks = initialTasks.map(task => {
            const now = new Date().toISOString();
            return {
              ...task,
              id: crypto.randomUUID(),
              createdAt: now,
              updatedAt: now,
              deletedAt: null,
            };
          });
          setTasks(formattedInitialTasks);
        }
      } catch (error) {
        console.error("Failed to load tasks from localStorage", error);
        toast({
          title: "Error",
          description: "Could not load tasks from your browser storage.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false);
      }
    } else {
      setTasks([]);
      setIsLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    if(!authLoading && user) {
        try {
            const TASKS_STORAGE_KEY = getTasksStorageKey(user.id);
            localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
            checkPermissionsAndNotify();
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
            toast({
              title: "Error",
              description: "Could not save tasks to your browser storage.",
              variant: "destructive"
            })
        }
    }
  }, [tasks, authLoading, user, checkPermissionsAndNotify]);
  
  const filteredTasks = useMemo(() => {
    if (!searchQuery) return tasks;

    const lowercasedQuery = searchQuery.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(lowercasedQuery) ||
      (task.description && task.description.toLowerCase().includes(lowercasedQuery)) ||
      (task.tags && task.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery)))
    );
  }, [tasks, searchQuery]);


  const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    const now = new Date().toISOString();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    setTasks(prev => [...prev, newTask]);
    addActivity({
      type: 'CREATE',
      taskTitle: newTask.title,
    });
    toast({ title: "Success", description: "Task added successfully." });
  };

  const updateTask = (updatedTask: Task) => {
    const originalTask = tasks.find(t => t.id === updatedTask.id);
    setTasks(prev => prev.map(task => task.id === updatedTask.id ? { ...updatedTask, updatedAt: new Date().toISOString() } : task));
    
    if(originalTask && updatedTask.status === 'done' && originalTask.status !== 'done') {
        addActivity({ type: 'COMPLETE', taskTitle: updatedTask.title });
    } else {
        addActivity({ type: 'UPDATE', taskTitle: updatedTask.title });
    }

    toast({ title: "Success", description: "Task updated successfully." });
  };
  
  const getTask = (id: string) => tasks.find(task => task.id === id);

  const deleteTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if(task) {
        addActivity({ type: 'DELETE', taskTitle: task.title });
        setTasks(prev => prev.map(t => t.id === id ? { ...t, deletedAt: new Date().toISOString() } : t));
        toast({ title: "Task moved to Trash", description: "You can restore it from the trash bin." });
    }
  };

  const permanentlyDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast({ title: "Success", description: "Task permanently deleted." });
  }

  const restoreTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if(task) {
        addActivity({ type: 'RESTORE', taskTitle: task.title });
        setTasks(prev => prev.map(task => task.id === id ? { ...task, deletedAt: null } : task));
        toast({ title: "Success", description: "Task restored." });
    }
  };

  const moveTask = (id: string, newStatus: Status) => {
    const taskToMove = tasks.find(t => t.id === id);
    if (!taskToMove) return;

    const originalStatus = taskToMove.status;
    if (originalStatus === newStatus) return;

    setTasks(prev => {
      return prev.map(t => t.id === id ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t);
    });

    if (newStatus === 'done') {
        addActivity({ type: 'COMPLETE', taskTitle: taskToMove.title });
    } else {
        addActivity({
            type: 'UPDATE',
            taskTitle: taskToMove.title,
            details: `status from ${originalStatus.replace('-', ' ')} to ${newStatus.replace('-', ' ')}`,
        });
    }
  };

  const exportTasks = () => {
    try {
        const jsonString = JSON.stringify(tasks, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        saveAs(blob, `taskpilot-backup-${new Date().toISOString()}.json`);
        toast({ title: "Success", description: "Tasks exported successfully." });
    } catch (error) {
        console.error("Failed to export tasks", error);
        toast({ title: "Error", description: "Could not export tasks.", variant: "destructive" });
    }
  }

  const importTasks = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const jsonString = event.target?.result as string;
            const importedTasks: Task[] = JSON.parse(jsonString);
            
            if (!Array.isArray(importedTasks) || !importedTasks.every(t => t.id && t.title)) {
                throw new Error("Invalid file format.");
            }

            setTasks(prev => {
                const existingIds = new Set(prev.map(t => t.id));
                const newTasks = importedTasks.filter(t => !existingIds.has(t.id));
                return [...prev, ...newTasks];
            });

            toast({ title: "Success", description: "Tasks imported successfully." });

        } catch (error) {
            console.error("Failed to import tasks", error);
            toast({ title: "Error", description: `Could not import tasks. Make sure it's a valid JSON file.`, variant: "destructive" });
        }
    }
    reader.readAsText(file);
  }

  const openTaskModal = (task: Task | undefined = undefined) => {
    setEditingTask(task || null);
    setIsTaskModalOpen(true);
  }

  const closeTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  }


  return (
    <TasksContext.Provider value={{ 
        tasks, 
        filteredTasks,
        isLoading, 
        addTask, 
        updateTask, 
        deleteTask, 
        getTask,
        permanentlyDeleteTask,
        restoreTask,
        moveTask,
        searchQuery,
        setSearchQuery,
        exportTasks,
        importTasks,
        isAISuggestModalOpen,
        setIsAISuggestModalOpen,
        isTaskModalOpen,
        editingTask,
        openTaskModal,
        closeTaskModal
    }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
