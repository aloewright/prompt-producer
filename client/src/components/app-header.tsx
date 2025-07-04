import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, Sparkles, TestTube, LogOut, BookOpen, Wand2 } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@shared/schema';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Builder', href: '/veo-prompt-builder', icon: Wand2 },
  { name: 'Prompts', href: '/prompts', icon: BookOpen },
  { name: 'Testing', href: '/testing', icon: TestTube },
];

export default function AppHeader() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-600 backdrop-blur-md border-b border-blue-500/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">Prompt Producer</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                  }`}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/settings">
              <Avatar className="h-8 w-8 border-2 border-blue-300/50 hover:border-blue-200 transition-colors cursor-pointer">
                <AvatarImage src={(user as User)?.profileImageUrl || undefined} />
                <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                  {(user as User)?.firstName?.[0] || (user as User)?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-blue-100 hover:text-white hover:bg-blue-500/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden text-white">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-blue-600 border-blue-500">
              <div className="flex flex-col space-y-4 mt-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-4 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'text-blue-100 hover:text-white hover:bg-blue-500/50'
                      }`}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="whitespace-nowrap">{item.name}</span>
                    </Link>
                  );
                })}
                
                <div className="border-t border-blue-500/20 pt-4">
                  <div className="px-4 py-2 text-sm text-blue-100">
                    {(user as User)?.firstName || (user as User)?.email}
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-blue-100 hover:text-white hover:bg-blue-500/50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}