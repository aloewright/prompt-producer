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

  return (
    <>
      {isAuthenticated && <AppHeader />}
      <Switch>
        {isLoading || !isAuthenticated ? (
          <Route path="/" component={Landing} />
        ) : (
          <>
            <Route path="/" component={Home} />
            <Route path="/veo-prompt-builder" component={VeoPromptBuilder} />
            <Route path="/prompts" component={Prompts} />
            <Route path="/testing" component={Testing} />
            <Route path="/settings" component={Settings} />
          </>
        )}
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
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
