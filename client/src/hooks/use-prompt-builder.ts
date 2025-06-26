import { useState, useEffect, useCallback } from "react";
import { PromptElements, SavedPrompt } from "@shared/schema";
import { constructPrompt } from "@/lib/prompt-templates";
import { copyToClipboard } from "@/lib/local-storage";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export const usePromptBuilder = () => {
  const [elements, setElements] = useState<PromptElements>({});
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const queryClient = useQueryClient();

  // Fetch saved prompts from database
  const { data: savedPrompts = [], refetch } = useQuery({
    queryKey: ['/api/prompts'],
    queryFn: ({ queryKey }) => fetch(queryKey[0]).then(res => res.json()),
  });

  // Save prompt mutation
  const savePromptMutation = useMutation({
    mutationFn: async ({ text, elements }: { text: string; elements: PromptElements }) => {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        body: JSON.stringify({ text, elements }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to save prompt');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
    },
  });

  // Delete prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete prompt');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/prompts'] });
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
