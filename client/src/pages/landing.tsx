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

        {/* Animated Laptop Mockup */}
        <div className="relative mb-24 overflow-hidden h-96 flex items-center justify-center">
          <div 
            className="relative mx-auto max-w-4xl"
            style={{ 
              transform: `translateY(${scrollY * 0.2}px) scale(${Math.max(0.3, 1 - scrollY * 0.001)})`,
              opacity: Math.max(0, 1 - scrollY * 0.002),
            }}
          >
            {/* Laptop Container */}
            <div className="relative perspective-1000">
              {/* Laptop Base */}
              <div className="relative bg-gray-800 rounded-lg p-3 shadow-2xl">
                <div className="h-6 bg-gray-700 rounded-lg relative">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-1 bg-gray-600 rounded"></div>
                </div>
              </div>
              
              {/* Laptop Lid with Opening Animation */}
              <div 
                className="absolute top-0 left-0 right-0 bg-gray-800 rounded-t-lg p-3 origin-bottom transform transition-transform duration-1000 ease-out"
                style={{
                  transform: `rotateX(${Math.min(Math.max(scrollY * 0.3, 0), 90)}deg)`,
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Screen */}
                <div className="bg-gray-900 rounded-md overflow-hidden aspect-video relative">
                  {/* VS Code-like Interface */}
                  <div className="absolute inset-0 bg-gray-900 text-green-400 font-mono text-xs p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-gray-400 text-xs">veo-prompt-builder.tsx</div>
                    </div>
                    
                    {/* Code Content */}
                    <div className="space-y-1 text-xs">
                      <div className="text-purple-400">
                        <span className="text-blue-400">import</span> {`{ useState }`} <span className="text-blue-400">from</span> <span className="text-yellow-300">'react'</span>;
                      </div>
                      <div className="text-purple-400">
                        <span className="text-blue-400">import</span> {`{ Button }`} <span className="text-blue-400">from</span> <span className="text-yellow-300">'@/components/ui/button'</span>;
                      </div>
                      <div className="mt-2">
                        <span className="text-blue-400">export default function</span> <span className="text-yellow-300">VeoPromptBuilder</span>() {`{`}
                      </div>
                      <div className="ml-4">
                        <span className="text-blue-400">const</span> [<span className="text-red-300">prompt</span>, <span className="text-red-300">setPrompt</span>] = <span className="text-yellow-300">useState</span>(<span className="text-yellow-300">''</span>);
                      </div>
                      <div className="ml-4 mt-2">
                        <span className="text-blue-400">return</span> (
                      </div>
                      <div className="ml-8 text-green-300">
                        &lt;<span className="text-red-400">div</span> <span className="text-blue-400">className</span>=<span className="text-yellow-300">"prompt-builder"</span>&gt;
                      </div>
                      <div className="ml-12 text-green-300">
                        &lt;<span className="text-red-400">Button</span> <span className="text-blue-400">onClick</span>={`{handleCopy}`}&gt;
                      </div>
                      <div className="ml-16 text-white">
                        Copy Prompt
                      </div>
                      <div className="ml-12 text-green-300">
                        &lt;/<span className="text-red-400">Button</span>&gt;
                      </div>
                      <div className="ml-8 text-green-300">
                        &lt;/<span className="text-red-400">div</span>&gt;
                      </div>
                      <div className="ml-4">
                        );
                      </div>
                      <div>
                        {`}`}
                      </div>
                    </div>
                    
                    {/* Cursor Blink */}
                    <div 
                      className="inline-block w-2 h-4 bg-green-400 animate-pulse"
                      style={{ animationDuration: '1s' }}
                    ></div>
                  </div>
                  
                  {/* Screen Reflection */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
              
              {/* Floating Code Elements */}
              <div 
                className="absolute -top-8 -right-8 opacity-30"
                style={{ 
                  transform: `translateY(${scrollY * 0.1}px) rotate(${scrollY * 0.1}deg)`,
                }}
              >
                <div className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                  {`{ prompt }`}
                </div>
              </div>
              <div 
                className="absolute -bottom-8 -left-8 opacity-30"
                style={{ 
                  transform: `translateY(${-scrollY * 0.15}px) rotate(${-scrollY * 0.05}deg)`,
                }}
              >
                <div className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">
                  useState()
                </div>
              </div>
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
                Start building professional video prompts with our intuitive interface
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}