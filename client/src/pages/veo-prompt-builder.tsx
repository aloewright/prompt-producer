import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { usePromptBuilder } from "@/hooks/use-prompt-builder";
import { 
  subjectOptions, 
  subjectAgeOptions,
  subjectGenderOptions,
  subjectAppearanceOptions,
  subjectClothingOptions,
  actionOptions, 
  styleOptions, 
  cameraMotionOptions, 
  ambianceOptions, 
  audioOptions, 
  closingOptions,
  constructPrompt 
} from "@/lib/prompt-templates";
import { 
  Copy, 
  Save, 
  Edit, 
  Trash2, 
  ChevronDown,
  ChevronUp,
  Home,
  User, 
  Camera, 
  Palette, 
  VideoIcon, 
  Volume2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  RefreshCw,
  Shuffle,
  Sparkles
} from "lucide-react";
import FloatingTooltips from "@/components/FloatingTooltips";
import FloatingOrbs from "@/components/FloatingOrbs";
import { Link } from "wouter";

type Section = 'intro' | 'subject' | 'action' | 'style' | 'camera' | 'audio' | 'result';

const sectionOrder: Section[] = ['intro', 'subject', 'action', 'style', 'camera', 'audio', 'result'];

export default function VeoPromptBuilder() {
  const { toast } = useToast();
  const {
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
  } = usePromptBuilder();

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isCopyAnimating, setIsCopyAnimating] = useState(false);
  const [currentSection, setCurrentSection] = useState<Section>('intro');
  const [complexity, setComplexity] = useState([2]); // 1-3 scale
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiTipsEnabled, setAiTipsEnabled] = useState(
    localStorage.getItem('disableTooltips') !== 'true'
  );
  const [scrollY, setScrollY] = useState(0);
  const sectionRefs = useRef<{ [key in Section]?: HTMLDivElement }>({});

  useEffect(() => {
    // Set up intersection observer for auto-scrolling sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.getAttribute('data-section') as Section;
            if (section) {
              setCurrentSection(section);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    
    // Set up scroll-based fade animation observer
    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.remove('scroll-fade-out');
            target.classList.add('scroll-fade-in');
          } else {
            target.classList.remove('scroll-fade-in');
            target.classList.add('scroll-fade-out');
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '-10% 0px -10% 0px' 
      }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) {
        observer.observe(ref);
        fadeObserver.observe(ref);
      }
    });

    return () => {
      observer.disconnect();
      fadeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // Track scroll position for camera icon scaling
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: Section) => {
    sectionRefs.current[section]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const nextSection = () => {
    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex < sectionOrder.length - 1) {
      scrollToSection(sectionOrder[currentIndex + 1]);
    }
  };

  const prevSection = () => {
    const currentIndex = sectionOrder.indexOf(currentSection);
    if (currentIndex > 0) {
      scrollToSection(sectionOrder[currentIndex - 1]);
    }
  };

  const generateRandomPrompt = () => {
    setIsGenerating(true);
    clearAllFields();
    
    // Simulate generation animation
    setTimeout(() => {
      const complexityLevel = complexity[0];
      
      // Always include subject and action
      const randomSubject = subjectOptions[Math.floor(Math.random() * subjectOptions.length)];
      const randomAction = actionOptions[Math.floor(Math.random() * actionOptions.length)];
      
      updateElement('subject', randomSubject);
      updateElement('action', randomAction);
      
      if (complexityLevel >= 2) {
        // Add subject details
        updateElement('subjectAge', subjectAgeOptions[Math.floor(Math.random() * subjectAgeOptions.length)]);
        updateElement('subjectGender', subjectGenderOptions[Math.floor(Math.random() * subjectGenderOptions.length)]);
        updateElement('subjectAppearance', subjectAppearanceOptions[Math.floor(Math.random() * subjectAppearanceOptions.length)]);
        
        // Add style
        const numStyles = Math.floor(Math.random() * 3) + 1;
        const randomStyles = [...styleOptions].sort(() => 0.5 - Math.random()).slice(0, numStyles);
        randomStyles.forEach(style => toggleStyle(style));
        
        // Add camera motion
        updateElement('cameraMotion', cameraMotionOptions[Math.floor(Math.random() * cameraMotionOptions.length)]);
      }
      
      if (complexityLevel >= 3) {
        // Add all details
        updateElement('subjectClothing', subjectClothingOptions[Math.floor(Math.random() * subjectClothingOptions.length)]);
        updateElement('context', `In a ${['bustling', 'serene', 'mysterious', 'futuristic', 'vintage'][Math.floor(Math.random() * 5)]} ${['city', 'forest', 'desert', 'mountain', 'ocean'][Math.floor(Math.random() * 5)]} setting`);
        updateElement('ambiance', ambianceOptions[Math.floor(Math.random() * ambianceOptions.length)]);
        updateElement('audio', audioOptions[Math.floor(Math.random() * audioOptions.length)]);
        updateElement('closing', closingOptions[Math.floor(Math.random() * closingOptions.length)]);
      }
      
      setIsGenerating(false);
      scrollToSection('result');
      
      toast({
        title: "Generated!",
        description: `Created a ${['simple', 'detailed', 'comprehensive'][complexityLevel - 1]} prompt for you`,
      });
    }, 1500);
  };

  const handleCopyPrompt = async () => {
    if (!generatedPrompt.trim()) {
      toast({
        title: "No prompt to copy",
        description: "Please create a prompt first",
        variant: "destructive",
      });
      return;
    }

    setIsCopyAnimating(true);
    const success = await copyPromptToClipboard();
    
    if (success) {
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    }

    setTimeout(() => setIsCopyAnimating(false), 1500);
  };

  const handleSavePrompt = () => {
    const saved = savePrompt();
    if (saved) {
      toast({
        title: "Saved!",
        description: "Prompt saved successfully",
      });
    }
  };

  const handleLoadPrompt = (promptId: string) => {
    const prompt = savedPrompts.find(p => p.id === promptId);
    if (prompt) {
      loadPrompt(prompt);
      toast({
        title: "Loaded!",
        description: "Prompt loaded into builder",
      });
    }
  };

  const handleDeletePrompt = (promptId: string) => {
    deletePrompt(promptId);
    toast({
      title: "Deleted",
      description: "Prompt deleted successfully",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Common styles for inputs with Apple glassmorphism
  const inputStyle = "glass-input text-foreground placeholder:text-foreground/40 rounded-xl";
  const selectStyle = "glass-input text-foreground rounded-xl";

  const renderSection = (section: Section) => {
    switch (section) {
      case 'intro':
        return (
          <div 
            ref={el => { if (el) sectionRefs.current.intro = el; }}
            data-section="intro"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <div className="max-w-2xl text-center space-y-8 animate-fade-in-up">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto glass-button rounded-3xl flex items-center justify-center">
                  <VideoIcon className="w-12 h-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  Prompt Producer
                </h1>
                <p className="text-lg text-muted-foreground">
                  Create stunning AI video prompts with ease
                </p>
              </div>
              
              <Card className="glass-card rounded-2xl">
                <CardContent className="p-8 space-y-8">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-muted-foreground">How would you like to start?</Label>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => scrollToSection('subject')}
                        className="flex-1 glass-button rounded-xl h-12 font-medium"
                        variant="outline"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Build Step by Step
                      </Button>
                      <Button 
                        onClick={generateRandomPrompt}
                        className="flex-1 h-12 font-medium rounded-xl"
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Shuffle className="w-4 h-4 mr-2" />
                        )}
                        Generate Random
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-muted-foreground">Prompt Complexity</Label>
                    <div className="glass rounded-xl p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground">Simple</span>
                        <Slider
                          value={complexity}
                          onValueChange={setComplexity}
                          min={1}
                          max={3}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-xs text-muted-foreground">Detailed</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        {complexity[0] === 1 && "Basic prompt with essential elements"}
                        {complexity[0] === 2 && "Balanced prompt with good detail"}
                        {complexity[0] === 3 && "Comprehensive prompt with all elements"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Button
                variant="ghost"
                onClick={nextSection}
                className="glass-button rounded-full p-3 animate-bounce"
              >
                <ChevronDown className="w-6 h-6" />
              </Button>
            </div>
          </div>
        );

      case 'subject':
        return (
          <div 
            ref={el => { if (el) sectionRefs.current.subject = el; }}
            data-section="subject"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-slide-in-left">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <User className="w-5 h-5 text-primary opacity-80" />
                  Subject & Character
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Select value={elements.subject || ""} onValueChange={(value) => updateElement('subject', value)}>
                  <SelectTrigger className={selectStyle}>
                    <SelectValue placeholder="Choose a subject type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Or describe your own subject..."
                  value={elements.customSubject || ""}
                  onChange={(e) => updateElement('customSubject', e.target.value)}
                  className={inputStyle}
                />
                
                {complexity[0] >= 2 && (
                  <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                    <Select value={elements.subjectAge || ""} onValueChange={(value) => updateElement('subjectAge', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Age range..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjectAgeOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={elements.subjectGender || ""} onValueChange={(value) => updateElement('subjectGender', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Gender..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjectGenderOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {complexity[0] >= 3 && (
                  <div className="grid grid-cols-2 gap-3 animate-fade-in-up animation-delay-100">
                    <Select value={elements.subjectAppearance || ""} onValueChange={(value) => updateElement('subjectAppearance', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Appearance..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjectAppearanceOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={elements.subjectClothing || ""} onValueChange={(value) => updateElement('subjectClothing', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Clothing..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjectClothingOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={prevSection}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="ghost" onClick={nextSection}>
                    Next
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'action':
        return (
          <div 
            ref={el => { if (el) sectionRefs.current.action = el; }}
            data-section="action"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-slide-in-right">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <VideoIcon className="w-5 h-5 text-primary opacity-80" />
                  Action & Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">What's happening?</Label>
                  <Select value={elements.action || ""} onValueChange={(value) => updateElement('action', value)}>
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder="Choose an action..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {actionOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or describe a custom action..."
                    value={elements.customAction || ""}
                    onChange={(e) => updateElement('customAction', e.target.value)}
                    className={`mt-3 ${inputStyle}`}
                  />
                </div>
                
                {complexity[0] >= 3 && (
                  <div className="animate-fade-in-up">
                    <Label className="text-sm text-muted-foreground font-medium mb-2 block">Where does it take place?</Label>
                    <Textarea
                      placeholder="Describe the setting, location, or environment..."
                      rows={3}
                      value={elements.context || ""}
                      onChange={(e) => updateElement('context', e.target.value)}
                      className={`resize-none ${inputStyle}`}
                    />
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={prevSection}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="ghost" onClick={nextSection}>
                    Next
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'style':
        return complexity[0] >= 2 ? (
          <div 
            ref={el => { if (el) sectionRefs.current.style = el; }}
            data-section="style"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-slide-in-left">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <Palette className="w-5 h-5 text-primary opacity-80" />
                  Style & Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-3 block">Visual Style (select multiple)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {styleOptions.map((style) => {
                      const isSelected = elements.style?.includes(style);
                      return (
                        <Button
                          key={style}
                          variant={isSelected ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleStyle(style)}
                          className={`text-xs transition-all duration-300 ${
                            isSelected 
                              ? 'bg-primary text-primary-foreground border-primary' 
                              : 'glass-hover border-white/10 text-foreground'
                          }`}
                        >
                          {style}
                        </Button>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={prevSection}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="ghost" onClick={nextSection}>
                    Next
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null;

      case 'camera':
        return complexity[0] >= 2 ? (
          <div 
            ref={el => { if (el) sectionRefs.current.camera = el; }}
            data-section="camera"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-slide-in-right rounded-2xl">
              <CardHeader className="pb-6 border-b border-white/5">
                <CardTitle className="flex items-center gap-3 font-heading text-xl text-foreground">
                  <div className="p-2 glass-button rounded-xl">
                    <Camera className="w-5 h-5 text-primary" />
                  </div>
                  Camera & Technical
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Camera Movement</Label>
                  <Select value={elements.cameraMotion || ""} onValueChange={(value) => updateElement('cameraMotion', value)}>
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder="Select camera movement..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {cameraMotionOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {complexity[0] >= 3 && (
                  <div className="animate-fade-in-up">
                    <Label className="text-sm text-muted-foreground font-medium mb-2 block">Mood & Atmosphere</Label>
                    <Select value={elements.ambiance || ""} onValueChange={(value) => updateElement('ambiance', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Select mood..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {ambianceOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={prevSection}
                    className="glass-button rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button 
                    onClick={nextSection}
                    className="rounded-xl font-medium hover:scale-105 transition-transform"
                  >
                    Next
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null;

      case 'audio':
        return complexity[0] >= 3 ? (
          <div 
            ref={el => { if (el) sectionRefs.current.audio = el; }}
            data-section="audio"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-slide-in-left">
              <CardHeader className="pb-4 border-b border-white/10">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <Volume2 className="w-5 h-5 text-primary opacity-80" />
                  Audio & Finishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Audio Style</Label>
                  <Select value={elements.audio || ""} onValueChange={(value) => updateElement('audio', value)}>
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder="Select audio style..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {audioOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Ending Style</Label>
                  <Select value={elements.closing || ""} onValueChange={(value) => updateElement('closing', value)}>
                    <SelectTrigger className={selectStyle}>
                      <SelectValue placeholder="Select ending..." />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {closingOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-popover-foreground hover:bg-primary/20">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={prevSection}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button variant="ghost" onClick={nextSection}>
                    View Result
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null;

      case 'result':
        return (
          <div 
            ref={el => { if (el) sectionRefs.current.result = el; }}
            data-section="result"
            className="min-h-screen flex items-center justify-center p-4 scroll-fade-element"
          >
            <Card className="glass-card w-full max-w-2xl animate-fade-in-up rounded-2xl">
              <CardHeader className="pb-6 border-b border-white/5">
                <CardTitle className="font-heading text-xl text-foreground flex items-center gap-3">
                  <div className="p-2 glass-button rounded-xl">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  Generated Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <Button
                  onClick={() => {
                    if (generatedPrompt.trim()) {
                      const veoEnhancements = [
                        "Shot in 4K resolution with cinematic depth of field",
                        "Professional camera movement with smooth stabilization",
                        "Natural lighting with realistic shadows and highlights",
                        "High-quality textures and materials for photorealistic output",
                        "Temporal consistency for seamless motion between frames",
                        "Optimized for Google Veo's advanced video generation capabilities"
                      ];
                      
                      const enhanced = `${generatedPrompt}\n\nGoogle Veo Enhancement Instructions:\n${veoEnhancements.join(', ')}.`;
                      updateGeneratedPrompt(enhanced);
                      toast({
                        title: "Enhanced for Google Veo!",
                        description: "Added technical specifications optimized for Veo's video generation",
                      });
                    }
                  }}
                  disabled={!generatedPrompt.trim()}
                  className="w-full h-12 rounded-xl font-medium glass-button"
                  variant="outline"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Enhance for Google Veo Generation
                </Button>
                
                <div className="relative">
                  <Textarea
                    value={generatedPrompt}
                    onChange={(e) => updateGeneratedPrompt(e.target.value)}
                    placeholder="Your prompt will appear here as you make selections..."
                    rows={12}
                    className={`resize-none font-mono text-sm leading-relaxed ${inputStyle} pr-12`}
                  />
                  {generatedPrompt.trim() && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateGeneratedPrompt('')}
                      className="absolute top-2 right-2 h-8 w-8 p-0 text-muted-foreground hover:text-destructive bg-background/80 backdrop-blur-sm rounded-md"
                      title="Clear prompt"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <Button
                    onClick={handleCopyPrompt}
                    disabled={!generatedPrompt.trim()}
                    className={`flex-1 transition-all duration-500 ${
                      isCopyAnimating ? 'bg-green-500 text-white' : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {isCopyAnimating ? 'Copied!' : 'Copy Prompt'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleSavePrompt}
                    disabled={!generatedPrompt.trim()}
                    className="glass-button rounded-xl font-medium"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>

                {/* Google Veo/Flow Links */}
                {generatedPrompt.trim() && (
                  <div className={`mt-6 p-4 glass rounded-lg animate-fade-in-up animation-delay-200`}>
                    <p className="text-sm text-muted-foreground mb-3">Ready to create your video? Use your prompt with:</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href="https://deepmind.google/technologies/veo/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full glass-hover border-white/10 text-foreground">
                          <VideoIcon className="w-4 h-4 mr-2" />
                          Google Veo
                        </Button>
                      </a>
                      <a
                        href="https://flow.google/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full glass-hover border-white/10 text-foreground">
                          <VideoIcon className="w-4 h-4 mr-2" />
                          Google Flow
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button variant="ghost" onClick={() => scrollToSection('intro')}>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={clearAllFields}
                    className="glass-hover border-white/10 text-foreground"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-16">
      <FloatingOrbs />
      <FloatingTooltips isActive={aiTipsEnabled} />

      {/* Main Content - Scrollable Sections */}
      <div className="relative">
        {/* Vertical Progress Indicator - Center Right */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block">
          <div className="relative h-96 w-1 bg-white/10 rounded-full">
            {/* Progress line segments */}
            {sectionOrder.map((section, index) => {
              const isCompleted = sectionOrder.indexOf(currentSection) > index;
              const isCurrent = sectionOrder.indexOf(currentSection) === index;
              const segmentHeight = (96 * 4) / (sectionOrder.length - 1); // Increased spacing
              
              return (
                <div key={`segment-${index}`}>
                  {index < sectionOrder.length - 1 && (
                    <div
                      className={`absolute left-0 w-full transition-all duration-1000 ease-out ${
                        isCompleted ? 'bg-primary' : 'bg-white/10'
                      }`}
                      style={{
                        height: `${segmentHeight - 20}px`, // Reduced to create gaps
                        top: `${(index * segmentHeight) + 20}px`,
                      }}
                    />
                  )}
                </div>
              );
            })}
            
            {/* Section circles with final checkmark only */}
            {sectionOrder.map((section, index) => {
              const isCompleted = sectionOrder.indexOf(currentSection) > index;
              const isCurrent = sectionOrder.indexOf(currentSection) === index;
              const isLastSection = index === sectionOrder.length - 1;
              const isPromptComplete = currentSection === 'result' && generatedPrompt.trim().length > 0;
              const segmentHeight = (96 * 4) / (sectionOrder.length - 1);
              
              return (
                <div
                  key={`circle-${index}`}
                  className={`absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                    isLastSection && isPromptComplete
                      ? 'bg-green-500 border-green-500 scale-110'
                      : isCompleted
                        ? 'bg-primary border-primary'
                        : isCurrent
                          ? 'bg-primary border-primary animate-pulse'
                          : 'bg-background border-white/20'
                  }`}
                  style={{
                    top: `${(index * segmentHeight) + 12}px`,
                  }}
                >
                  {isLastSection && isPromptComplete && (
                    <svg
                      className="w-2.5 h-2.5 text-white animate-fade-in"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                  {isCurrent && (
                    <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Section labels */}
          <div className="absolute -left-16 top-0 h-full flex flex-col justify-between py-3">
            {sectionOrder.map((section, index) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className={`text-xs font-medium capitalize transition-colors duration-300 whitespace-nowrap text-right ${
                  sectionOrder.indexOf(currentSection) >= index
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                style={{
                  marginTop: index === 0 ? '8px' : '0px'
                }}
              >
                {section === 'intro' ? 'start' : section}
              </button>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div className="pt-20 lg:pr-20">
          {sectionOrder.map((section) => (
            <div key={section}>
              {renderSection(section)}
            </div>
          ))}
        </div>
      </div>

      {/* Right Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-card border-l border-border shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="font-heading text-lg font-semibold text-foreground">Menu</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidePanelOpen(false)}
              className="text-foreground hover:bg-primary/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Navigation */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Navigation</h3>
              <Link href="/">
                <Button variant="ghost" className="w-full justify-start text-foreground hover:bg-primary/10">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="w-full justify-start text-foreground hover:bg-primary/10"
                onClick={() => window.location.href = '/api/logout'}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>

            {/* Settings */}
            <div className="space-y-2 mb-6">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Settings</h3>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-foreground">AI Tips</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const isDisabled = localStorage.getItem('disableTooltips') === 'true';
                    if (isDisabled) {
                      localStorage.removeItem('disableTooltips');
                      window.location.reload();
                    } else {
                      localStorage.setItem('disableTooltips', 'true');
                      window.location.reload();
                    }
                  }}
                  className="border-border text-foreground hover:bg-primary/10"
                >
                  {localStorage.getItem('disableTooltips') === 'true' ? 'Enable' : 'Disable'}
                </Button>
              </div>
            </div>

            {/* Saved Prompts */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Saved Prompts ({savedPrompts.length})</h3>
              
              {savedPrompts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No saved prompts yet.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {savedPrompts.map((prompt) => (
                    <Card key={prompt.id} className="p-3 bg-primary/5 border-border">
                      <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">
                          {formatDate(prompt.createdAt)}
                        </div>
                        <div className="text-sm line-clamp-3 text-foreground">
                          {prompt.text.substring(0, 100)}...
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleLoadPrompt(prompt.id)}
                            className="flex-1 border-border text-foreground hover:bg-primary/10"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            Load
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="border-border text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {savedPrompts.length > 0 && (
                <Button
                  variant="outline"
                  onClick={clearAllSavedPrompts}
                  className="w-full mt-4 border-border text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Saved
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isSidePanelOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidePanelOpen(false)}
        />
      )}
    </div>
  );
}