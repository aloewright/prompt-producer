// Prompt builder step configuration
export const PROMPT_STEPS = [
  {
    id: 'subject',
    title: 'Subject & Character',
    description: 'Define who or what is the main focus of your video',
    fields: ['subject', 'customSubject', 'subjectAge', 'subjectGender', 'subjectAppearance', 'subjectClothing'],
    icon: 'User',
    required: true,
  },
  {
    id: 'scene',
    title: 'Scene & Action',
    description: 'Set the context and define what happens',
    fields: ['context', 'action', 'customAction'],
    icon: 'MapPin',
    required: true,
  },
  {
    id: 'style',
    title: 'Visual Style',
    description: 'Choose the aesthetic and camera work',
    fields: ['style', 'cameraMotion', 'ambiance'],
    icon: 'Palette',
    required: false,
  },
  {
    id: 'audio',
    title: 'Audio & Closing',
    description: 'Add sound and define how the video ends',
    fields: ['audio', 'closing'],
    icon: 'Music',
    required: false,
  },
] as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  SAVE: { key: 's', modifier: true, description: 'Save prompt' },
  COPY: { key: 'c', modifier: true, description: 'Copy prompt' },
  NEW: { key: 'n', modifier: true, description: 'New prompt' },
  NEXT_STEP: { key: 'ArrowRight', modifier: true, description: 'Next step' },
  PREV_STEP: { key: 'ArrowLeft', modifier: true, description: 'Previous step' },
  TOGGLE_PREVIEW: { key: 'p', modifier: true, description: 'Toggle preview' },
} as const;

// Prompt quality thresholds
export const QUALITY_THRESHOLDS = {
  EXCELLENT: 80,
  GOOD: 60,
  FAIR: 40,
  POOR: 0,
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  DRAFT_PROMPT: 'veo-draft-prompt',
  USER_PREFERENCES: 'veo-user-preferences',
  RECENT_TEMPLATES: 'veo-recent-templates',
} as const;

// API endpoints
export const API_ENDPOINTS = {
  PROMPTS: '/api/prompts',
  TEMPLATES: '/api/templates',
  AI_SUGGESTIONS: '/api/ai/suggestions',
  AI_IMPROVE: '/api/ai/improve',
  EXPORT: '/api/export',
} as const;