import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Sparkles, BookOpen, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Veo Prompt Builder
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Create professional AI video prompts with our intuitive builder. Craft detailed prompts for stunning video generation.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <PlayCircle className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Professional Prompts</CardTitle>
              <CardDescription>
                Build detailed video prompts with subject details, actions, styles, and camera movements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <Sparkles className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Real-time Preview</CardTitle>
              <CardDescription>
                See your prompt update instantly as you make selections and customize elements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border/50 hover:border-border transition-colors">
            <CardHeader>
              <BookOpen className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Save & Manage</CardTitle>
              <CardDescription>
                Save your prompts for later use and organize your creative library
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold">Choose Elements</h3>
              <p className="text-muted-foreground">
                Select subjects, actions, styles, and camera movements from our comprehensive options
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold">Real-time Build</h3>
              <p className="text-muted-foreground">
                Watch your prompt come together automatically as you make selections
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold">Copy & Create</h3>
              <p className="text-muted-foreground">
                Copy your finished prompt and use it with your favorite AI video generator
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-primary/20">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Create?</CardTitle>
              <CardDescription className="text-lg">
                Sign in to start building professional video prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}