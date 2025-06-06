import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";

import Header from "./components/layout/header";
import HomePage from "./pages/home";
import NewsPage from "./pages/news";
import TeamPage from "./pages/team";
import GalleryPage from "./pages/gallery";
import StatsPage from "./pages/stats";
import RegistrationPage from "./pages/registration";
import AdminPage from "./pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-800 to-blue-900">
      <Header />
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/news" component={NewsPage} />
        <Route path="/team" component={TeamPage} />
        <Route path="/gallery" component={GalleryPage} />
        <Route path="/stats" component={StatsPage} />
        <Route path="/registration" component={RegistrationPage} />
        <Route path="/admin" component={AdminPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
