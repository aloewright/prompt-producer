import { PromptElements } from '@shared/schema';
import { QUALITY_THRESHOLDS } from './constants';

export interface PromptQualityScore {
  overall: number;
  clarity: number;
  specificity: number;
  creativity: number;
  completeness: number;
  suggestions: string[];
}

export interface QualityMetrics {
  hasSubject: boolean;
  hasAction: boolean;
  hasContext: boolean;
  hasStyle: boolean;
  wordCount: number;
  characterCount: number;
  hasDescriptiveDetails: boolean;
  hasCameraDirection: boolean;
}

export function analyzePromptQuality(prompt: string, elements: PromptElements): PromptQualityScore {
  const metrics = calculateMetrics(prompt, elements);
  
  const clarity = calculateClarityScore(prompt, metrics);
  const specificity = calculateSpecificityScore(elements, metrics);
  const creativity = calculateCreativityScore(elements);
  const completeness = calculateCompletenessScore(metrics);
  
  const overall = Math.round((clarity + specificity + creativity + completeness) / 4);
  const suggestions = generateSuggestions(metrics, elements);
  
  return {
    overall,
    clarity,
    specificity,
    creativity,
    completeness,
    suggestions,
  };
}

function calculateMetrics(prompt: string, elements: PromptElements): QualityMetrics {
  const words = prompt.split(/\s+/).filter(word => word.length > 0);
  
  return {
    hasSubject: !!(elements.subject || elements.customSubject),
    hasAction: !!(elements.action || elements.customAction),
    hasContext: !!elements.context,
    hasStyle: !!(elements.style && elements.style.length > 0),
    wordCount: words.length,
    characterCount: prompt.length,
    hasDescriptiveDetails: !!(elements.subjectAge || elements.subjectGender || elements.subjectAppearance || elements.subjectClothing),
    hasCameraDirection: !!elements.cameraMotion,
  };
}

function calculateClarityScore(prompt: string, metrics: QualityMetrics): number {
  let score = 100;
  
  // Penalize if too short or too long
  if (metrics.wordCount < 10) score -= 30;
  else if (metrics.wordCount > 100) score -= 20;
  
  // Check for sentence structure
  const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length === 0) score -= 20;
  
  // Check for redundancy
  const words = prompt.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const redundancyRatio = words.length / uniqueWords.size;
  if (redundancyRatio > 1.5) score -= 15;
  
  return Math.max(0, score);
}

function calculateSpecificityScore(elements: PromptElements, metrics: QualityMetrics): number {
  let score = 0;
  
  // Base points for essential elements
  if (metrics.hasSubject) score += 25;
  if (metrics.hasAction) score += 25;
  if (metrics.hasContext) score += 20;
  
  // Bonus for descriptive details
  if (metrics.hasDescriptiveDetails) score += 15;
  if (metrics.hasCameraDirection) score += 10;
  if (elements.ambiance) score += 5;
  
  return Math.min(100, score);
}

function calculateCreativityScore(elements: PromptElements): number {
  let score = 60; // Base score
  
  // Reward custom inputs
  if (elements.customSubject) score += 10;
  if (elements.customAction) score += 10;
  
  // Reward multiple styles
  if (elements.style && elements.style.length > 1) {
    score += Math.min(20, elements.style.length * 5);
  }
  
  // Reward unique combinations
  if (elements.ambiance && elements.audio) score += 10;
  
  return Math.min(100, score);
}

function calculateCompletenessScore(metrics: QualityMetrics): number {
  let filledFields = 0;
  const totalFields = 8; // Adjust based on important fields
  
  if (metrics.hasSubject) filledFields++;
  if (metrics.hasAction) filledFields++;
  if (metrics.hasContext) filledFields++;
  if (metrics.hasStyle) filledFields++;
  if (metrics.hasDescriptiveDetails) filledFields++;
  if (metrics.hasCameraDirection) filledFields++;
  
  return Math.round((filledFields / totalFields) * 100);
}

function generateSuggestions(metrics: QualityMetrics, elements: PromptElements): string[] {
  const suggestions: string[] = [];
  
  if (!metrics.hasSubject) {
    suggestions.push('Add a subject to give your video a clear focus');
  }
  
  if (!metrics.hasAction) {
    suggestions.push('Specify an action to make your scene dynamic');
  }
  
  if (!metrics.hasContext) {
    suggestions.push('Add context or setting to ground your scene');
  }
  
  if (!metrics.hasStyle) {
    suggestions.push('Choose a visual style to define the aesthetic');
  }
  
  if (metrics.wordCount < 15) {
    suggestions.push('Add more descriptive details for better results');
  }
  
  if (!metrics.hasCameraDirection) {
    suggestions.push('Consider adding camera motion for cinematic effect');
  }
  
  if (!elements.ambiance) {
    suggestions.push('Set the mood with an ambiance selection');
  }
  
  return suggestions.slice(0, 3); // Return top 3 suggestions
}

export function getQualityLabel(score: number): string {
  if (score >= QUALITY_THRESHOLDS.EXCELLENT) return 'Excellent';
  if (score >= QUALITY_THRESHOLDS.GOOD) return 'Good';
  if (score >= QUALITY_THRESHOLDS.FAIR) return 'Fair';
  return 'Needs Improvement';
}

export function getQualityColor(score: number): string {
  if (score >= QUALITY_THRESHOLDS.EXCELLENT) return 'text-green-600';
  if (score >= QUALITY_THRESHOLDS.GOOD) return 'text-blue-600';
  if (score >= QUALITY_THRESHOLDS.FAIR) return 'text-yellow-600';
  return 'text-red-600';
}