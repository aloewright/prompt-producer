import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle, Sparkles, BookOpen, Users } from "lucide-react";

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        {/* Parallax Laptop Mockup */}
        <div className="relative mb-24 overflow-hidden">
          <div 
            className="transform transition-transform duration-300 ease-out"
            style={{ 
              transform: `translateY(${scrollY * 0.3}px)`,
            }}
          >
            <div className="relative mx-auto max-w-4xl">
              {/* Laptop Frame */}
              <div className="relative bg-gray-800 rounded-lg p-3 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                {/* Screen */}
                <div className="bg-gray-900 rounded-md overflow-hidden aspect-video relative">
                  {/* Screen Content */}
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 p-6">
                    <div className="h-full flex flex-col">
                      {/* Mock App Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-8 bg-gray-300 rounded w-48"></div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Mock Content */}
                      <div className="grid grid-cols-2 gap-4 flex-1">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-full"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                        <div className="bg-gray-200 rounded p-4">
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                            <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                            <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                            <div className="h-3 bg-gray-300 rounded w-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Screen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>
                </div>
                
                {/* Laptop Base */}
                <div className="h-6 bg-gray-700 rounded-b-lg relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-600 rounded"></div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-primary/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
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

        {/* CTA */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto border-border hover:border-primary/20 transition-all duration-200 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-2xl md:text-3xl">Ready to Create?</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Sign in to start building professional video prompts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3"
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