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

export const constructPrompt = (elements: {
  subject?: string;
  customSubject?: string;
  subjectAge?: string;
  subjectGender?: string;
  subjectAppearance?: string;
  subjectClothing?: string;
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
  
  // Subject with descriptors
  const subject = elements.customSubject?.trim() || elements.subject;
  if (subject) {
    let subjectDescription = subject;
    
    // Add subject descriptors if they exist
    const descriptors = [];
    if (elements.subjectAge) descriptors.push(elements.subjectAge.toLowerCase());
    if (elements.subjectGender) descriptors.push(elements.subjectGender.toLowerCase());
    if (elements.subjectAppearance) descriptors.push(elements.subjectAppearance.toLowerCase());
    if (elements.subjectClothing) descriptors.push(`wearing ${elements.subjectClothing.toLowerCase()}`);
    
    if (descriptors.length > 0) {
      subjectDescription = `${descriptors.join(', ')} ${subject.toLowerCase()}`;
    }
    
    parts.push(subjectDescription);
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
