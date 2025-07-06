import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Mail, Calendar, Shield, ExternalLink } from 'lucide-react';
import type { User as UserType } from '@shared/schema';

export default function Settings() {
  const { user, canManageAuth } = useAuth();
  const typedUser = user as UserType;

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto border-4 border-primary/20">
              <AvatarImage src={typedUser?.profileImageUrl || undefined} />
              <AvatarFallback className="bg-muted text-muted-foreground font-medium text-2xl">
                {typedUser?.firstName?.[0] || typedUser?.email?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {typedUser?.firstName && typedUser?.lastName 
                  ? `${typedUser.firstName} ${typedUser.lastName}`
                  : 'User Settings'
                }
              </h1>
              <p className="text-muted-foreground">Manage your account preferences</p>
            </div>
          </div>

          {/* Profile Information */}
          <Card className="glass-card parallax-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details from Cloudflare Access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {typedUser?.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{typedUser.email}</div>
                  </div>
                </div>
              )}
              
              {typedUser?.firstName && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Name</div>
                    <div className="text-sm text-muted-foreground">
                      {typedUser.firstName} {typedUser.lastName || ''}
                    </div>
                  </div>
                </div>
              )}

              {typedUser?.createdAt && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Member Since</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(typedUser.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Authentication Info */}
          <Card className="glass-card parallax-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication
              </CardTitle>
              <CardDescription>
                Your account is secured by Cloudflare Access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Shield className="h-4 w-4 text-green-600" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Authentication Provider</div>
                  <div className="text-sm text-muted-foreground">
                    Cloudflare Access - Enterprise-grade security
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <p>
                  <strong>Note:</strong> Authentication is managed by your organization's Cloudflare Access policies. 
                  To modify your profile or access settings, contact your administrator.
                </p>
              </div>

              {canManageAuth && (
                <Button variant="outline" className="w-full" asChild>
                  <a href="/logout" className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Manage Access Settings
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card className="glass-card parallax-card">
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>
                Customize your Prompt Producer experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Application-specific settings and preferences will be available here in future updates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}