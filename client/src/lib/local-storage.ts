import { SavedPrompt, PromptElements } from "@shared/schema";

const SAVED_PROMPTS_KEY = 'veo-prompt-builder-prompts';

export const savePromptToStorage = (promptText: string, elements: PromptElements): SavedPrompt => {
  const prompt: SavedPrompt = {
    id: Date.now().toString(),
    text: promptText,
    elements,
    createdAt: new Date().toISOString(),
  };
  
  const existingPrompts = getSavedPrompts();
  const updatedPrompts = [prompt, ...existingPrompts];
  
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updatedPrompts));
  return prompt;
};

export const getSavedPrompts = (): SavedPrompt[] => {
  try {
    const stored = localStorage.getItem(SAVED_PROMPTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading saved prompts:', error);
    return [];
  }
};

export const deletePromptFromStorage = (id: string): void => {
  const existingPrompts = getSavedPrompts();
  const updatedPrompts = existingPrompts.filter(prompt => prompt.id !== id);
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(updatedPrompts));
};

export const clearAllPrompts = (): void => {
  localStorage.removeItem(SAVED_PROMPTS_KEY);
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (fallbackError) {
      console.error('Failed to copy to clipboard:', fallbackError);
      return false;
    }
  }
};
