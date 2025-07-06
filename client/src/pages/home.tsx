import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";
import { PlayCircle, BookOpen, TestTube, Sparkles } from "lucide-react";
import type { User as UserType } from "@shared/schema";

export default function Home() {
  const { user } = useAuth();
  const typedUser = user as UserType;

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12 space-y-4">
          <div className="flex items-center justify-center mb-6">
            <Avatar className="h-16 w-16 border-4 border-primary/20">
              <AvatarImage src={typedUser?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-primary text-primary-foreground font-medium text-2xl">
                {typedUser?.firstName?.[0] || typedUser?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
          <h1 className="text-4xl font-bold text-foreground">
            Welcome{typedUser?.firstName ? `, ${typedUser.firstName}` : ''}!
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create powerful AI video prompts with our intelligent prompt builder. 
            Build, save, and manage your prompts effortlessly.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
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
                  Open Prompt Builder
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/20 transition-all duration-200">
            <CardHeader>
              <BookOpen className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="font-heading text-xl">Your Prompts</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Access and manage all your saved prompts in one convenient location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/prompts">
                <Button variant="outline" size="lg" className="w-full">
                  View Saved Prompts
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-border hover:border-primary/20 transition-all duration-200">
            <CardHeader>
              <TestTube className="h-10 w-10 mb-3 text-primary" />
              <CardTitle className="font-heading text-xl">Test & Preview</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Test your prompts and see how they perform with our integrated testing tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/testing">
                <Button variant="outline" size="lg" className="w-full">
                  Open Testing Lab
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Why Use Prompt Producer?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center space-y-3">
              <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Intelligent Building</h3>
              <p className="text-sm text-muted-foreground">
                Guided prompt creation with smart suggestions and templates
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Organized Storage</h3>
              <p className="text-sm text-muted-foreground">
                Save, categorize, and search through all your prompts easily
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                <TestTube className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Testing Tools</h3>
              <p className="text-sm text-muted-foreground">
                Preview and refine your prompts before putting them to use
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}