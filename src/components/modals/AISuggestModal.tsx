
"use client"

import { useState } from 'react';
import { useTasks } from '@/providers/tasks-provider';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Sparkles, Wand2 } from 'lucide-react';
import { suggestTasks } from '@/ai/flows/suggest-tasks-flow';
import { toast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function AISuggestModal() {
  const { isAISuggestModalOpen, setIsAISuggestModalOpen, addTask } = useTasks();
  const [topic, setTopic] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsLoading(true);
    setSuggestions([]);
    setError(null);
    try {
      const result = await suggestTasks({ topic });
      if (result && result.tasks) {
        setSuggestions(result.tasks);
      } else {
        throw new Error("Invalid response format from AI.");
      }
    } catch (err) {
      console.error('Failed to get AI suggestions:', err);
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        if (err.message.includes('503') || err.message.includes('overloaded')) {
            errorMessage = "The AI service is currently busy. Please try again in a moment.";
        } else {
            errorMessage = "Could not fetch AI suggestions.";
        }
      }
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = (title: string) => {
    addTask({
      title,
      status: 'todo',
      priority: 'medium',
      subtasks: [],
    });
    setSuggestions(prev => prev.filter(s => s !== title));
    toast({
        title: "Task Added",
        description: `"${title}" was added to your to-do list.`
    })
  };

  const handleClose = () => {
    setIsAISuggestModalOpen(false);
    setTopic('');
    setSuggestions([]);
    setIsLoading(false);
    setError(null);
  }

  return (
    <Dialog open={isAISuggestModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto bg-primary/10 rounded-lg p-3 w-fit mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle>Get AI Suggestions</DialogTitle>
          <DialogDescription>
            Enter a topic and let AI suggest a list of tasks for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., Plan a vacation, Learn a new skill"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            />
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !topic} className="w-full">
            {isLoading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2" /> Generate Tasks</>}
          </Button>
        </div>

        {error && (
            <Alert variant="destructive">
                <AlertTitle>Request Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {suggestions.length > 0 && (
          <div className="space-y-3 max-h-60 overflow-y-auto">
             <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Suggestions</AlertTitle>
                <AlertDescription>
                    Click the plus icon to add a task to your list.
                </AlertDescription>
            </Alert>
            <ul className="space-y-2">
                {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm">{suggestion}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleAddTask(suggestion)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </li>
                ))}
            </ul>
          </div>
        )}
        <DialogFooter>
            <Button variant="outline" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
