import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { PlayCircle, User, LogOut } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const typedUser = user as UserType;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={typedUser?.profileImageUrl || undefined} />
              <AvatarFallback>
                {typedUser?.firstName?.[0] || typedUser?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">
                Welcome back{typedUser?.firstName ? `, ${typedUser.firstName}` : ''}!
              </h1>
              <p className="text-muted-foreground">
                Ready to create amazing video prompts?
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/api/logout'}
            className="flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <PlayCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Start Creating</CardTitle>
              <CardDescription>
                Use our prompt builder to create detailed video prompts with subjects, actions, styles, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/veo-prompt-builder">
                <Button size="lg" className="w-full">
                  Open Prompt Builder
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <User className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Your Account</CardTitle>
              <CardDescription>
                Manage your saved prompts and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                {typedUser?.email && (
                  <p><span className="font-medium">Email:</span> {typedUser.email}</p>
                )}
                {typedUser?.firstName && typedUser?.lastName && (
                  <p><span className="font-medium">Name:</span> {typedUser.firstName} {typedUser.lastName}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Quick Start Guide</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <h3 className="font-semibold">Choose Your Subject</h3>
              <p className="text-sm text-muted-foreground">
                Select a subject and customize appearance, age, gender, and clothing
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <h3 className="font-semibold">Add Actions & Style</h3>
              <p className="text-sm text-muted-foreground">
                Define what's happening and choose visual styles and camera movements
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <h3 className="font-semibold">Save & Use</h3>
              <p className="text-sm text-muted-foreground">
                Save your prompts and copy them for use in your video generation tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}