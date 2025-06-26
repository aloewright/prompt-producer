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

export const constructPrompt = (elements: {
  subject?: string;
  customSubject?: string;
  context?: string;
  action?: string;
  customAction?: string;
  style?: string[];
  cameraMotion?: string;
  ambiance?: string;
  audio?: string;
  closing?: string;
}): string => {
  const parts: string[] = [];
  
  // Subject
  const subject = elements.customSubject?.trim() || elements.subject;
  if (subject) {
    parts.push(subject);
  }
  
  // Context
  if (elements.context?.trim()) {
    parts.push(`Context: ${elements.context.trim()}`);
  }
  
  // Action
  const action = elements.customAction?.trim() || elements.action;
  if (action) {
    parts.push(`Action: ${action}`);
  }
  
  // Style
  if (elements.style && elements.style.length > 0) {
    parts.push(`Style: ${elements.style.join(', ')}`);
  }
  
  // Camera Motion
  if (elements.cameraMotion) {
    parts.push(`Camera: ${elements.cameraMotion}`);
  }
  
  // Ambiance
  if (elements.ambiance) {
    parts.push(`Ambiance: ${elements.ambiance}`);
  }
  
  // Audio
  if (elements.audio) {
    parts.push(`Audio: ${elements.audio}`);
  }
  
  // Closing
  if (elements.closing) {
    parts.push(`Closing: ${elements.closing}`);
  }
  
  return parts.join('. ') + (parts.length > 0 ? '.' : '');
};
