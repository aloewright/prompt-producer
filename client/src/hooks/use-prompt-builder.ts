import { useState, useEffect, useCallback } from "react";
import { PromptElements, SavedPrompt } from "@shared/schema";
import { constructPrompt } from "@/lib/prompt-templates";
import { copyToClipboard } from "@/lib/local-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export const usePromptBuilder = () => {
  const [elements, setElements] = useState<PromptElements>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch saved prompts from database
  const { data: savedPrompts = [], refetch } = useQuery<SavedPrompt[]>({
    queryKey: ['/api/prompts'],
  });

  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async ({ text, elements }: { text: string; elements: PromptElements }) => {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        body: JSON.stringify({ text, elements }),
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please contact your administrator for access.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save prompt",
        variant: "destructive",
      });
    },
  });

  // Delete prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Authentication Required",
          description: "Please contact your administrator for access.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete prompt",
        variant: "destructive",
      });
    },
  });

  // Update generated prompt when elements change
  useEffect(() => {
    setGeneratedPrompt(constructPrompt(elements));
  }, [elements]);

  const updateElement = useCallback((key: keyof PromptElements, value: any) => {
    setElements(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleStyle = useCallback((style: string) => {
    setElements(prev => {
      const currentStyles = prev.style || [];
      const newStyles = currentStyles.includes(style)
        ? currentStyles.filter(s => s !== style)
        : [...currentStyles, style];
      return { ...prev, style: newStyles };
    });
  }, []);

  const clearAllFields = useCallback(() => {
    setElements({});
  }, []);

  const savePrompt = useCallback(() => {
    if (!generatedPrompt.trim()) return null;
    
    savePromptMutation.mutate({ text: generatedPrompt, elements });
    return { id: Date.now().toString(), text: generatedPrompt, elements, createdAt: new Date().toISOString() };
  }, [generatedPrompt, elements, savePromptMutation]);

  const loadPrompt = useCallback((prompt: SavedPrompt) => {
    setElements(prompt.elements);
  }, []);

  const deletePrompt = useCallback((id: string) => {
    deletePromptMutation.mutate(id);
  }, [deletePromptMutation]);

  const clearAllSavedPrompts = useCallback(async () => {
    // Delete all prompts one by one (could be optimized with a bulk delete endpoint)
    for (const prompt of savedPrompts) {
      await deletePromptMutation.mutateAsync(prompt.id);
    }
  }, [savedPrompts, deletePromptMutation]);

  const copyPromptToClipboard = useCallback(async () => {
    return await copyToClipboard(generatedPrompt);
  }, [generatedPrompt]);

  const updateGeneratedPrompt = useCallback((text: string) => {
    setGeneratedPrompt(text);
  }, []);

  return {
    elements,
    generatedPrompt,
    savedPrompts,
    updateElement,
    toggleStyle,
    clearAllFields,
    savePrompt,
    loadPrompt,
    deletePrompt,
    clearAllSavedPrompts,
    copyPromptToClipboard,
    updateGeneratedPrompt,
    isSaving: savePromptMutation.isPending,
    isDeleting: deletePromptMutation.isPending,
  };
};
