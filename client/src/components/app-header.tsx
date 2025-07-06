import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Home, TestTube, BookOpen, Wand2, Settings } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import type { User as UserType } from '@shared/schema';

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

  const typedUser = user as UserType | undefined;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wand2 className="h-5 w-5" />
          </div>
          <span className="hidden font-bold sm:inline-block">Prompt Producer</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center space-x-2 ${
                    isActive 
                      ? "bg-primary text-primary-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          {typedUser && (
            <Link href="/settings">
              <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={typedUser.profileImageUrl || undefined} />
                  <AvatarFallback>
                    {typedUser.firstName?.[0] || typedUser.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block">
                  {typedUser.firstName || 'User'}
                </span>
              </Button>
            </Link>
          )}

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-8">
                {/* User Info */}
                {typedUser && (
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={typedUser.profileImageUrl || undefined} />
                      <AvatarFallback>
                        {typedUser.firstName?.[0] || typedUser.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {typedUser.firstName && typedUser.lastName 
                          ? `${typedUser.firstName} ${typedUser.lastName}`
                          : typedUser.firstName || 'User'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">{typedUser.email}</p>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  );
                })}

                {/* Settings */}
                <Link href="/settings">
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setIsOpen(false)}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}