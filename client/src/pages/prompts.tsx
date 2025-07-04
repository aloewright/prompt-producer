import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Trash2, Calendar, Sparkles, Edit, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/lib/local-storage';
import { apiRequest } from '@/lib/queryClient';
import type { DbSavedPrompt } from '@shared/schema';

export default function Prompts() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editText, setEditText] = useState('');

  const { data: savedPrompts = [], isLoading } = useQuery<DbSavedPrompt[]>({
    queryKey: ['/api/prompts'],
  });

  const updatePromptMutation = useMutation({
    mutationFn: async ({ id, title, text }: { id: number; title: string; text: string }) => {
      return apiRequest(`/api/prompts/${id}`, 'PUT', { title, text });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
      toast({
        title: "Updated!",
        description: "Prompt updated successfully",
      });
      setEditingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update prompt",
        variant: "destructive",
      });
    },
  });

  const handleCopy = async (prompt: DbSavedPrompt) => {
    const success = await copyToClipboard(prompt.text);
    if (success) {
      setCopiedId(prompt.id.toString());
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedId(null), 2000);
    } else {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (promptId: number) => {
    try {
      await apiRequest(`/api/prompts/${promptId}`, 'DELETE');
      
      toast({
        title: "Deleted",
        description: "Prompt removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-white/5 backdrop-blur-sm rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Saved Prompts
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your collection of video prompts
          </p>
        </div>

        {savedPrompts.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
              <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No saved prompts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Create your first prompt in the builder and save it to see it here
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPrompts.map((prompt) => (
              <Card key={prompt.id} className="bg-white/8 backdrop-blur-sm border-white/20 hover:bg-white/12 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      Prompt #{prompt.id}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(prompt)}
                        className={`h-8 w-8 p-0 transition-all duration-200 ${
                          copiedId === prompt.id.toString()
                            ? 'bg-green-500/20 text-green-400'
                            : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                        }`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(prompt.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-4">
                    {prompt.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}