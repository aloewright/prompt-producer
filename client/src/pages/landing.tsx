
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Sparkles, BookOpen, Users } from "lucide-react";
import { Link } from "wouter";
import NewsTicker from "@/components/NewsTicker";

export default function Landing() {

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6 text-foreground">
            Veo Prompt Builder
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Create professional AI video prompts with our intuitive builder. Craft detailed prompts for stunning video generation.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          <Card className="border-border hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="text-center">
              <PlayCircle className="h-10 w-10 mb-3 mx-auto text-primary" />
              <CardTitle className="font-heading text-xl">Professional Prompts</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Build detailed video prompts with subject details, actions, styles, and camera movements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:border-primary/20 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="text-center">
              <Sparkles className="h-10 w-10 mb-3 mx-auto text-primary" />
              <CardTitle className="font-heading text-xl">Real-time Preview</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                See your prompt update instantly as you make selections and customize elements
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-border hover:border-primary/20 transition-all duration-200 hover:shadow-lg md:col-span-2 lg:col-span-1">
            <CardHeader className="text-center">
              <BookOpen className="h-10 w-10 mb-3 mx-auto text-primary" />
              <CardTitle className="font-heading text-xl">Save & Manage</CardTitle>
              <CardDescription className="text-muted-foreground leading-relaxed">
                Save your prompts for later use and organize your creative library
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* How it works */}
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-12">How It Works</h2>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">Choose Elements</h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                Select subjects, actions, styles, and camera movements from our comprehensive options
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">Real-time Build</h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                Watch your prompt come together automatically as you make selections
              </p>
            </div>
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-heading text-xl font-semibold">Copy & Create</h3>
              <p className="text-muted-foreground leading-relaxed px-4">
                Copy your finished prompt and use it with your favorite AI video generator
              </p>
            </div>
          </div>
        </div>

        {/* News Ticker */}
        <div className="mb-16">
          <NewsTicker />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>Veo and Flow are trademarks of Google Inc. This is an independent tool.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}