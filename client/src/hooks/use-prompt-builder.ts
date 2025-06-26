import { useState, useEffect, useCallback } from "react";
import { PromptElements, SavedPrompt } from "@shared/schema";
import { constructPrompt } from "@/lib/prompt-templates";
import { 
  savePromptToStorage, 
  getSavedPrompts, 
  deletePromptFromStorage, 
  clearAllPrompts,
  copyToClipboard 
} from "@/lib/local-storage";

export const usePromptBuilder = () => {
  const [elements, setElements] = useState<PromptElements>({});
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [generatedPrompt, setGeneratedPrompt] = useState("");

  // Load saved prompts on mount
  useEffect(() => {
    setSavedPrompts(getSavedPrompts());
  }, []);

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
    
    const saved = savePromptToStorage(generatedPrompt, elements);
    setSavedPrompts(getSavedPrompts());
    return saved;
  }, [generatedPrompt, elements]);

  const loadPrompt = useCallback((prompt: SavedPrompt) => {
    setElements(prompt.elements);
  }, []);

  const deletePrompt = useCallback((id: string) => {
    deletePromptFromStorage(id);
    setSavedPrompts(getSavedPrompts());
  }, []);

  const clearAllSavedPrompts = useCallback(() => {
    clearAllPrompts();
    setSavedPrompts([]);
  }, []);

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
  };
};
