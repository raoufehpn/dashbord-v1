
export type Status = 'todo' | 'in-progress' | 'done';

export const STATUSES: Status[] = ['todo', 'in-progress', 'done'];

export type Priority = 'low' | 'medium' | 'high';

export const PRIORITIES: Priority[] = ['low', 'medium', 'high'];

export type Subtask = {
  id: string;
  text: string;
  completed: boolean;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  subtasks: Subtask[];
  tags?: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
};

export type Activity = {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'RESTORE' | 'COMPLETE';
  taskTitle: string;
  timestamp: string;
  details?: string;
};
