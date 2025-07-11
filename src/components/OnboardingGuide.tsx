
"use client"

import { useOnboarding } from "@/providers/onboarding-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Pilcrow, Sparkles, LayoutGrid, PlusCircle } from 'lucide-react';

const steps = [
    {
        icon: <Pilcrow className="h-8 w-8 text-primary-foreground" />,
        title: "Welcome to TaskPilot!",
        description: "Let's take a quick tour of the key features to get you started."
    },
    {
        icon: <LayoutGrid className="h-8 w-8 text-primary" />,
        title: "Your Dashboard",
        description: "This is your command center. Get a quick overview of your tasks, stats, and recent activity."
    },
    {
        icon: <PlusCircle className="h-8 w-8 text-primary" />,
        title: "Create Your First Task",
        description: "Click the 'New Task' button in the header to add your first to-do item. You can add details, subtasks, due dates, and more."
    },
    {
        icon: <Sparkles className="h-8 w-8 text-primary" />,
        title: "Get AI Suggestions",
        description: "Stuck on what to do next? Use the 'AI Suggest' feature in the 'Actions' menu to get task ideas for any topic."
    }
];

export function OnboardingGuide() {
    const { showOnboarding, currentStep, nextStep, completeOnboarding } = useOnboarding();

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            nextStep();
        } else {
            completeOnboarding();
        }
    };
    
    if (!showOnboarding) {
        return null;
    }

    const step = steps[currentStep];

    return (
        <Dialog open={showOnboarding} onOpenChange={(isOpen) => !isOpen && completeOnboarding()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="items-center text-center">
                    <div className={`p-3 rounded-lg mb-4 ${currentStep === 0 ? 'bg-primary' : 'bg-primary/10'}`}>
                        {step.icon}
                    </div>
                    <DialogTitle className="text-2xl font-headline">{step.title}</DialogTitle>
                    <DialogDescription>{step.description}</DialogDescription>
                </DialogHeader>
                <DialogFooter className="justify-center pt-4">
                    <Button onClick={handleNext}>
                        {currentStep < steps.length - 1 ? "Next" : "Get Started"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
