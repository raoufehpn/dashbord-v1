
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/providers/auth-provider';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const authSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthFormData = z.infer<typeof authSchema>;

export default function LoginPage() {
  const { logIn, signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('signin');

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  });
  
  const handleAuthAction = async (data: AuthFormData) => {
    setIsLoading(true);
    try {
        if (activeTab === 'signin') {
            await logIn(data.email, data.password);
        } else {
            await signUp(data.email, data.password);
        }
        toast({
            title: 'Preview Mode',
            description: 'Authentication is disabled in preview mode.',
        });
    } catch (error) {
        toast({
            title: 'Preview Mode Error',
            description: 'An unexpected error occurred.',
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-fit mb-4">
            <Avatar className="h-16 w-16">
                <AvatarImage src="https://i.postimg.cc/FKMsD7S4/Karakuzular.jpg" alt="App Logo" />
                <AvatarFallback>TP</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-3xl font-headline">Welcome to TaskPilot</CardTitle>
          <CardDescription>Your modern task dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSubmit(handleAuthAction)} className="space-y-4 pt-4">
                <AuthFormFields register={register} errors={errors} />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : <><LogIn className="mr-2" /> Sign In</>}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
                <form onSubmit={handleSubmit(handleAuthAction)} className="space-y-4 pt-4">
                    <AuthFormFields register={register} errors={errors} />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                         {isLoading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                    </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

function AuthFormFields({ register, errors }: any) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="admin@example.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register('password')} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
        </>
    )
}
