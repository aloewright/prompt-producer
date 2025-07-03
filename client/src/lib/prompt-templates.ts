import { PromptElements } from '@shared/schema';

export const subjectOptions = [
  "A person",
  "An animal", 
  "A cityscape",
  "A natural landscape",
  "An object",
  "A vehicle",
  "A building",
  "A creature",
];

export const subjectAgeOptions = [
  "Young",
  "Middle-aged",
  "Elderly",
  "Child",
  "Teenager",
  "Adult",
];

export const subjectGenderOptions = [
  "Male",
  "Female",
  "Non-binary",
];

export const subjectAppearanceOptions = [
  "Athletic",
  "Slender",
  "Tall",
  "Short",
  "Muscular",
  "Elegant",
  "Casual",
  "Professional",
];

export const subjectClothingOptions = [
  "Formal wear",
  "Casual clothes",
  "Sports wear",
  "Traditional outfit",
  "Modern fashion",
  "Vintage style",
  "Work uniform",
  "Evening wear",
];

export const actionOptions = [
  "Walking",
  "Running", 
  "Talking",
  "Flying",
  "Standing still",
  "Interacting with an object",
  "Dancing",
  "Fighting",
  "Sleeping",
  "Working",
];

export const styleOptions = [
  "Cinematic",
  "Animated",
  "Documentary", 
  "Film Noir",
  "Sci-Fi",
  "Fantasy",
  "Abstract",
  "Realistic",
  "Surreal",
  "Vintage",
];

export const cameraMotionOptions = [
  "Wide shot",
  "Close-up",
  "Medium shot", 
  "Tracking shot",
  "Dolly in",
  "Pan left",
  "Pan right",
  "Tilt up",
  "Tilt down",
  "Aerial view",
  "Static shot",
];

export const ambianceOptions = [
  "Calm",
  "Dramatic",
  "Suspenseful",
  "Uplifting", 
  "Mysterious",
  "Joyful",
  "Melancholic",
  "Energetic",
  "Peaceful",
  "Intense",
];

export const audioOptions = [
  "No audio",
  "Soft music",
  "Epic orchestral music",
  "Dialogue",
  "Ambient city sounds",
  "Nature sounds",
  "Electronic music",
  "Classical music",
  "Sound effects only",
];

export const closingOptions = [
  "Fade out",
  "Text overlay",
  "Zoom out to reveal logo",
  "Static shot",
  "Cut to black",
  "Freeze frame",
  "Dissolve",
];

// Enhanced prompt construction with natural language flow
export class PromptBuilder {
  private parts: string[] = [];
  private elements: PromptElements;

  constructor(elements: PromptElements) {
    this.elements = elements;
  }

  build(): string {
    this.addSubject();
    this.addContext();
    this.addAction();
    this.addStyle();
    this.addCameraWork();
    this.addAmbiance();
    this.addAudio();
    this.addClosing();
    
    return this.formatPrompt();
  }

  private addSubject(): void {
    const subject = this.elements.customSubject?.trim() || this.elements.subject;
    if (!subject) return;

    const descriptors: string[] = [];
    
    // Build natural descriptor flow
    if (this.elements.subjectAge) {
      descriptors.push(this.elements.subjectAge.toLowerCase());
    }
    
    if (this.elements.subjectGender) {
      descriptors.push(this.elements.subjectGender.toLowerCase());
    }
    
    if (this.elements.subjectAppearance) {
      descriptors.push(this.elements.subjectAppearance.toLowerCase());
    }

    let subjectPhrase = subject.toLowerCase();
    
    if (descriptors.length > 0) {
      subjectPhrase = `a ${descriptors.join(', ')} ${subjectPhrase}`;
    } else if (!subject.toLowerCase().startsWith('a ') && !subject.toLowerCase().startsWith('an ')) {
      subjectPhrase = `a ${subjectPhrase}`;
    }

    if (this.elements.subjectClothing) {
      subjectPhrase += ` wearing ${this.elements.subjectClothing.toLowerCase()}`;
    }

    this.parts.push(capitalizeFirst(subjectPhrase));
  }

  private addContext(): void {
    if (!this.elements.context?.trim()) return;
    
    const context = this.elements.context.trim();
    const contextLower = context.toLowerCase();
    
    // Add contextual connector based on content
    if (contextLower.includes('standing') || contextLower.includes('sitting') || contextLower.includes('located')) {
      this.parts.push(context);
    } else if (this.parts.length > 0) {
      this.parts.push(`in ${context}`);
    } else {
      this.parts.push(capitalizeFirst(context));
    }
  }

  private addAction(): void {
    const action = this.elements.customAction?.trim() || this.elements.action;
    if (!action) return;

    if (this.parts.length > 0) {
      this.parts.push(`${action.toLowerCase()}`);
    } else {
      this.parts.push(capitalizeFirst(action));
    }
  }

  private addStyle(): void {
    if (!this.elements.style || this.elements.style.length === 0) return;

    const styles = this.elements.style;
    if (styles.length === 1) {
      this.parts.push(`Shot in ${styles[0].toLowerCase()} style`);
    } else if (styles.length === 2) {
      this.parts.push(`Shot in ${styles[0].toLowerCase()} and ${styles[1].toLowerCase()} style`);
    } else {
      const lastStyle = styles[styles.length - 1];
      const otherStyles = styles.slice(0, -1).join(', ').toLowerCase();
      this.parts.push(`Shot in ${otherStyles}, and ${lastStyle.toLowerCase()} style`);
    }
  }

  private addCameraWork(): void {
    if (!this.elements.cameraMotion) return;
    this.parts.push(`Camera: ${this.elements.cameraMotion}`);
  }

  private addAmbiance(): void {
    if (!this.elements.ambiance) return;
    this.parts.push(`${this.elements.ambiance} ambiance`);
  }

  private addAudio(): void {
    if (!this.elements.audio || this.elements.audio === 'No audio') return;
    this.parts.push(`Audio: ${this.elements.audio}`);
  }

  private addClosing(): void {
    if (!this.elements.closing) return;
    this.parts.push(`Ending with ${this.elements.closing.toLowerCase()}`);
  }

  private formatPrompt(): string {
    if (this.parts.length === 0) return '';
    
    // Join parts with appropriate punctuation
    const prompt = this.parts.map((part, index) => {
      if (index === 0) return part;
      
      // Check if previous part ended with punctuation
      const prevPart = this.parts[index - 1];
      if (prevPart.endsWith('.') || prevPart.endsWith('!') || prevPart.endsWith('?')) {
        return ` ${part}`;
      }
      
      // Add comma for natural flow
      return `, ${part}`;
    }).join('');
    
    // Ensure prompt ends with period
    return prompt.endsWith('.') ? prompt : `${prompt}.`;
  }
}

function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Legacy function for backward compatibility
export const constructPrompt = (elements: PromptElements): string => {
  const builder = new PromptBuilder(elements);
  return builder.build();
};

// Prompt templates
export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  elements: PromptElements;
  thumbnail?: string;
  tags: string[];
  popularity?: number;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: 'action-hero',
    name: 'Action Hero Introduction',
    category: 'Action',
    description: 'Dynamic introduction scene for an action protagonist',
    elements: {
      subject: 'A person',
      subjectAge: 'Adult',
      subjectGender: 'Male',
      subjectAppearance: 'Athletic',
      subjectClothing: 'Tactical gear',
      context: 'a destroyed cityscape with smoke in the background',
      action: 'Walking slowly towards the camera',
      style: ['Cinematic', 'Dramatic'],
      cameraMotion: 'Tracking shot',
      ambiance: 'Intense',
      audio: 'Epic orchestral music',
      closing: 'Freeze frame',
    },
    tags: ['action', 'hero', 'cinematic', 'dramatic'],
    popularity: 95,
  },
  {
    id: 'nature-documentary',
    name: 'Wildlife Documentary',
    category: 'Documentary',
    description: 'Serene nature scene with wildlife',
    elements: {
      subject: 'An animal',
      customSubject: 'A majestic eagle',
      context: 'soaring above mountain peaks at sunrise',
      action: 'Flying',
      style: ['Documentary', 'Realistic'],
      cameraMotion: 'Aerial view',
      ambiance: 'Peaceful',
      audio: 'Nature sounds',
      closing: 'Fade out',
    },
    tags: ['nature', 'wildlife', 'documentary', 'peaceful'],
    popularity: 88,
  },
  {
    id: 'sci-fi-landscape',
    name: 'Futuristic City',
    category: 'Sci-Fi',
    description: 'Establishing shot of a futuristic metropolis',
    elements: {
      subject: 'A cityscape',
      context: 'with flying vehicles and neon lights reflecting on wet streets',
      action: 'Standing still',
      style: ['Sci-Fi', 'Cinematic'],
      cameraMotion: 'Wide shot',
      ambiance: 'Mysterious',
      audio: 'Electronic music',
      closing: 'Dissolve',
    },
    tags: ['sci-fi', 'future', 'city', 'cyberpunk'],
    popularity: 92,
  },
  {
    id: 'romantic-scene',
    name: 'Romantic Moment',
    category: 'Romance',
    description: 'Intimate scene between two people',
    elements: {
      subject: 'A person',
      customSubject: 'A couple',
      context: 'on a beach at sunset',
      action: 'Walking',
      customAction: 'Walking hand in hand along the shoreline',
      style: ['Cinematic', 'Realistic'],
      cameraMotion: 'Medium shot',
      ambiance: 'Peaceful',
      audio: 'Soft music',
      closing: 'Fade out',
    },
    tags: ['romance', 'beach', 'sunset', 'couple'],
    popularity: 85,
  },
  {
    id: 'horror-atmosphere',
    name: 'Horror Scene',
    category: 'Horror',
    description: 'Creepy atmospheric scene',
    elements: {
      subject: 'A building',
      customSubject: 'An abandoned mansion',
      context: 'shrouded in fog on a moonless night',
      action: 'Standing still',
      style: ['Film Noir', 'Cinematic'],
      cameraMotion: 'Dolly in',
      ambiance: 'Suspenseful',
      audio: 'No audio',
      closing: 'Cut to black',
    },
    tags: ['horror', 'scary', 'atmospheric', 'suspense'],
    popularity: 78,
  },
];

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return PROMPT_TEMPLATES.filter(template => template.category === category);
}

export function getPopularTemplates(limit: number = 5): PromptTemplate[] {
  return [...PROMPT_TEMPLATES]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
}

export function searchTemplates(query: string): PromptTemplate[] {
  const searchLower = query.toLowerCase();
  return PROMPT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchLower) ||
    template.description.toLowerCase().includes(searchLower) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
}
