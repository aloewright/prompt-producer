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
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container mx-auto px-4 py-8">


        {/* Main Content */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2">
          <Card className="border-border hover:border-primary/20 transition-all duration-200">
            <CardHeader>
              <PlayCircle className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="font-heading text-xl">Start Creating</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Use our prompt builder to create detailed video prompts with subjects, actions, styles, and more
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/veo-prompt-builder">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  Open Prompt Producer
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/20 transition-all duration-200">
            <CardHeader>
              <User className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="font-heading text-xl">Your Account</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Manage your saved prompts and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                {typedUser?.email && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-foreground">Email:</span> 
                    <span className="text-muted-foreground">{typedUser.email}</span>
                  </div>
                )}
                {typedUser?.firstName && typedUser?.lastName && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                    <span className="font-medium text-foreground">Name:</span> 
                    <span className="text-muted-foreground">{typedUser.firstName} {typedUser.lastName}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12">
          <h2 className="font-heading text-2xl md:text-3xl font-bold mb-8 text-center">Quick Start Guide</h2>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto">
                1
              </div>
              <h3 className="font-heading font-semibold text-lg">Choose Your Subject</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                Select a subject and customize appearance, age, gender, and clothing
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto">
                2
              </div>
              <h3 className="font-heading font-semibold text-lg">Add Actions & Style</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                Define what's happening and choose visual styles and camera movements
              </p>
            </div>
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto">
                3
              </div>
              <h3 className="font-heading font-semibold text-lg">Save & Use</h3>
              <p className="text-sm text-muted-foreground leading-relaxed px-2">
                Save your prompts and copy them for use in your video generation tools
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}