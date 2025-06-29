import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  closingOptions 
} from "@/lib/prompt-templates";
import { 
  Copy, 
  Save, 
  Edit, 
  Trash2, 
  CircleCheck, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
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
  Download
} from "lucide-react";
import FloatingTooltips from "@/components/FloatingTooltips";
import { Link } from "wouter";

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

  const [isOnline] = useState(true); // For demo purposes, assuming always online
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isCopyAnimating, setIsCopyAnimating] = useState(false);

  // Create completion sound
  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Second tone for harmony
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 1000;
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode2.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
      gainNode2.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.2);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.2);
    }, 100);
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

    // Start copy animation
    setIsCopyAnimating(true);

    const success = await copyPromptToClipboard();
    if (success) {
      // Play completion sound
      try {
        playCompletionSound();
      } catch (error) {
        console.log("Audio not supported");
      }
      
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Failed to copy prompt to clipboard",
        variant: "destructive",
      });
    }

    // Reset animation after delay
    setTimeout(() => {
      setIsCopyAnimating(false);
    }, 1000);
  };

  const handleSavePrompt = () => {
    if (!generatedPrompt.trim()) {
      toast({
        title: "No prompt to save",
        description: "Please create a prompt first",
        variant: "destructive",
      });
      return;
    }

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

  return (
    <div className="min-h-screen bg-background">
      <FloatingTooltips isActive={true} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <VideoIcon className="w-8 h-8 text-primary" />
              <h1 className="font-heading text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                Veo Prompt Builder
              </h1>
            </div>
            
            {/* Menu Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="flex items-center gap-2"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-6xl">{/* Content will continue here */}

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Prompt Builder Section */}
          <div className="space-y-6">
            {/* Subject Section */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <User className="w-5 h-5 text-primary" />
                  Subject & Character
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select value={elements.subject || ""} onValueChange={(value) => updateElement('subject', value)}>
                  <SelectTrigger className="bg-white border-border text-foreground">
                    <SelectValue placeholder="Choose a subject type..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-border">
                    {subjectOptions.map((option) => (
                      <SelectItem key={option} value={option} className="text-foreground">
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder="Or describe your own subject..."
                  value={elements.customSubject || ""}
                  onChange={(e) => updateElement('customSubject', e.target.value)}
                  className="bg-white border-border text-foreground placeholder:text-muted-foreground"
                />
                
                {/* Character Details Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Select value={elements.subjectAge || ""} onValueChange={(value) => updateElement('subjectAge', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Age range..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {subjectAgeOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={elements.subjectGender || ""} onValueChange={(value) => updateElement('subjectGender', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Gender..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {subjectGenderOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={elements.subjectAppearance || ""} onValueChange={(value) => updateElement('subjectAppearance', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Appearance..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {subjectAppearanceOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={elements.subjectClothing || ""} onValueChange={(value) => updateElement('subjectClothing', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Clothing..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {subjectClothingOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action & Setting Section */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <VideoIcon className="w-5 h-5 text-primary" />
                  Action & Setting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">What's happening?</Label>
                  <Select value={elements.action || ""} onValueChange={(value) => updateElement('action', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Choose an action..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {actionOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Or describe a custom action..."
                    value={elements.customAction || ""}
                    onChange={(e) => updateElement('customAction', e.target.value)}
                    className="mt-3 bg-white border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Where does it take place?</Label>
                  <Textarea
                    placeholder="Describe the setting, location, or environment..."
                    rows={3}
                    value={elements.context || ""}
                    onChange={(e) => updateElement('context', e.target.value)}
                    className="resize-none bg-white border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Style & Visual Section */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <Palette className="w-5 h-5 text-primary" />
                  Style & Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          className={`text-xs ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'bg-white hover:bg-accent hover:text-accent-foreground'} transition-colors`}
                        >
                          {style}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Camera & Technical Section */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <Camera className="w-5 h-5 text-primary" />
                  Camera & Technical
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Camera Movement</Label>
                  <Select value={elements.cameraMotion || ""} onValueChange={(value) => updateElement('cameraMotion', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Select camera movement..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {cameraMotionOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Mood & Atmosphere</Label>
                  <Select value={elements.ambiance || ""} onValueChange={(value) => updateElement('ambiance', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Select mood..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {ambianceOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Audio & Finishing Section */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                  <Volume2 className="w-5 h-5 text-primary" />
                  Audio & Finishing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Audio Style</Label>
                  <Select value={elements.audio || ""} onValueChange={(value) => updateElement('audio', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Select audio style..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {audioOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground font-medium mb-2 block">Ending Style</Label>
                  <Select value={elements.closing || ""} onValueChange={(value) => updateElement('closing', value)}>
                    <SelectTrigger className="bg-white border-border text-foreground">
                      <SelectValue placeholder="Select ending..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-border">
                      {closingOptions.map((option) => (
                        <SelectItem key={option} value={option} className="text-foreground">
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={clearAllFields}
                className="flex-1 bg-white hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Preview and Actions Section */}
          <div className="space-y-6">
            {/* Generated Prompt Preview */}
            <Card style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Generated Prompt</CardTitle>
                  <div className="flex items-center space-x-2">
                    <span 
                      className="text-xs px-2 py-1 rounded"
                      style={{ 
                        backgroundColor: 'var(--background-darker)', 
                        color: 'var(--text-secondary)' 
                      }}
                    >
                      {generatedPrompt.length} characters
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div 
                  className="rounded-md p-4 border mb-4"
                  style={{ 
                    backgroundColor: 'var(--background-darker)', 
                    borderColor: 'var(--border-color)' 
                  }}
                >
                  <Textarea
                    value={generatedPrompt}
                    onChange={(e) => updateGeneratedPrompt(e.target.value)}
                    placeholder="Your generated prompt will appear here as you fill out the form..."
                    className="w-full bg-transparent resize-none focus:outline-none min-h-[120px] border-none p-0"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCopyPrompt}
                    className={`flex-1 shine-button relative overflow-hidden ${isCopyAnimating ? 'copy-animate' : ''}`}
                  >
                    {isCopyAnimating ? (
                      <>
                        <CircleCheck className="w-4 h-4 mr-2 copy-checkmark" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </>
                    )}
                    {isCopyAnimating && (
                      <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSavePrompt}
                    style={{ 
                      backgroundColor: 'var(--surface-light)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-primary)' 
                    }}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Saved Prompts */}
            <Card style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle style={{ color: 'var(--text-primary)' }}>Saved Prompts</CardTitle>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      backgroundColor: 'var(--background-darker)', 
                      color: 'var(--text-secondary)' 
                    }}
                  >
                    {savedPrompts.length} saved
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {savedPrompts.length === 0 ? (
                    <div className="text-center py-8" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-12 h-12 mx-auto mb-3 opacity-50">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <p className="text-sm">No saved prompts yet</p>
                      <p className="text-xs mt-1">Create and save your first prompt to see it here</p>
                    </div>
                  ) : (
                    savedPrompts.map((prompt) => (
                      <div
                        key={prompt.id}
                        className="rounded-md p-4 border group hover:border-opacity-80 transition-all"
                        style={{ 
                          backgroundColor: 'var(--background-darker)', 
                          borderColor: 'var(--border-color)' 
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
                              {formatDate(prompt.createdAt)}
                            </div>
                            <p 
                              className="text-sm line-clamp-3"
                              style={{ color: 'var(--text-primary)' }}
                            >
                              {prompt.text}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleLoadPrompt(prompt.id)}
                              className="p-1 h-auto"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletePrompt(prompt.id)}
                              className="p-1 h-auto hover:text-red-400"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {savedPrompts.length > 0 && (
                  <Button
                    variant="outline"
                    onClick={clearAllSavedPrompts}
                    className="w-full mt-4"
                    style={{ 
                      backgroundColor: 'var(--background-darker)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-secondary)' 
                    }}
                  >
                    Clear All Saved Prompts
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sliding Side Panel for Saved Prompts */}
        <div 
          className={`fixed top-0 right-0 h-full w-96 z-40 transform transition-transform duration-300 ease-in-out ${
            isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ backgroundColor: 'var(--surface)', borderLeft: '1px solid var(--border-color)' }}
        >
          <div className="h-full flex flex-col">
            {/* Side Panel Header */}
            <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Saved Prompts ({savedPrompts.length})
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSidePanelOpen(false)}
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Saved Prompts List */}
            <div className="flex-1 overflow-y-auto p-4">
              {savedPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <Bookmark className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--text-secondary)' }} />
                  <p style={{ color: 'var(--text-secondary)' }}>
                    No saved prompts yet. Save your first prompt to see it here!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedPrompts.map((prompt: any) => (
                    <Card 
                      key={prompt.id} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {formatDate(prompt.createdAt)}
                          </span>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLoadPrompt(prompt.id);
                              }}
                              className="h-6 w-6 p-0"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePrompt(prompt.id);
                              }}
                              className="h-6 w-6 p-0"
                              style={{ color: 'var(--text-secondary)' }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <p 
                          className="text-sm line-clamp-3 cursor-pointer"
                          style={{ color: 'var(--text-primary)' }}
                          onClick={() => handleLoadPrompt(prompt.id)}
                        >
                          {prompt.text}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Side Panel Actions */}
            {savedPrompts.length > 0 && (
              <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <Button
                  variant="outline"
                  onClick={clearAllSavedPrompts}
                  className="w-full"
                  style={{ 
                    backgroundColor: 'var(--background-darker)', 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Prompts
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay */}
        {isSidePanelOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setIsSidePanelOpen(false)}
          />
        )}

        {/* Mobile Bottom Actions */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
          <div className="flex space-x-3">
            <Button
              onClick={handleCopyPrompt}
              className="flex-1 shine-button"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
            <Button
              variant="outline"
              onClick={handleSavePrompt}
              style={{ 
                backgroundColor: 'var(--surface-light)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              <Save className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              <p>Veo and Flow are trademarks of Google Inc. This is an independent tool.</p>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
