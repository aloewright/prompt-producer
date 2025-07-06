import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import VeoPromptBuilder from "@/pages/veo-prompt-builder";
import Prompts from "@/pages/prompts";
import Testing from "@/pages/testing";
import Settings from "@/pages/settings";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import AppHeader from "@/components/app-header";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // For Cloudflare Access, we don't show a landing page
  // Users are either authenticated (can access the app) or not (blocked by Cloudflare Access)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <h1 className="text-2xl font-bold text-foreground">Access Required</h1>
          <p className="text-muted-foreground">
            This application requires authentication through Cloudflare Access. 
            Please contact your administrator if you believe you should have access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AppHeader />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/veo-prompt-builder" component={VeoPromptBuilder} />
        <Route path="/prompts" component={Prompts} />
        <Route path="/testing" component={Testing} />
        <Route path="/settings" component={Settings} />
        <Route path="/terms" component={Terms} />
        <Route path="/privacy" component={Privacy} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
