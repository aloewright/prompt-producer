import { useState, useEffect } from "react";
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
  ChevronLeft, 
  ChevronRight, 
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
  Download,
  Home
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

  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [isCopyAnimating, setIsCopyAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Create completion sound
  const playCompletionSound = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // First tone
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
    
    // Second tone
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

    setIsCopyAnimating(true);
    const success = await copyPromptToClipboard();
    
    if (success) {
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

  // Common styles for inputs with glassmorphism
  const inputStyle = "glass-input text-foreground placeholder:text-foreground/40 transition-all duration-300 focus:border-white/20 focus:ring-1 focus:ring-white/10";
  const selectStyle = "glass-input text-foreground transition-all duration-300 focus:border-white/20 focus:ring-1 focus:ring-white/10";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FloatingTooltips isActive={true} />
      
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 animate-fade-in-up">
              <VideoIcon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
              <h1 className="font-heading text-lg md:text-2xl lg:text-3xl font-bold text-foreground">
                Veo Prompt Builder
              </h1>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="flex items-center gap-2 glass-hover border-white/10 text-foreground animate-fade-in-up"
            >
              <Menu className="w-4 h-4" />
              <span className="hidden sm:inline">Menu</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="relative">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Prompt Builder Section */}
            <div className="space-y-6">
              {/* Subject Section */}
              <Card className={`glass-card ${isVisible ? 'animate-slide-in-left' : 'opacity-0'}`}>
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
                  
                  <div className="grid grid-cols-2 gap-3">
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
                      <SelectContent className="bg-black border-white/30">
                        {subjectGenderOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={elements.subjectAppearance || ""} onValueChange={(value) => updateElement('subjectAppearance', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Appearance..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {subjectAppearanceOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={elements.subjectClothing || ""} onValueChange={(value) => updateElement('subjectClothing', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Clothing..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {subjectClothingOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Action & Setting Section */}
              <Card className={`glass-card ${isVisible ? 'animate-slide-in-left animation-delay-100' : 'opacity-0'}`}>
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                    <VideoIcon className="w-5 h-5 text-primary opacity-80" />
                    Action & Setting
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">What's happening?</Label>
                    <Select value={elements.action || ""} onValueChange={(value) => updateElement('action', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Choose an action..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {actionOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
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
                  
                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">Where does it take place?</Label>
                    <Textarea
                      placeholder="Describe the setting, location, or environment..."
                      rows={3}
                      value={elements.context || ""}
                      onChange={(e) => updateElement('context', e.target.value)}
                      className={`resize-none ${inputStyle}`}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Style & Visual Section */}
              <Card className={`glass-card ${isVisible ? 'animate-slide-in-left animation-delay-200' : 'opacity-0'}`}>
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                    <Palette className="w-5 h-5 text-primary opacity-80" />
                    Style & Visual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-3 block">Visual Style (select multiple)</Label>
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
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white'
                            }`}
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
              <Card className={`glass-card ${isVisible ? 'animate-slide-in-left animation-delay-300' : 'opacity-0'}`}>
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 font-heading text-lg text-foreground">
                    <Camera className="w-5 h-5 text-primary opacity-80" />
                    Camera & Technical
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">Camera Movement</Label>
                    <Select value={elements.cameraMotion || ""} onValueChange={(value) => updateElement('cameraMotion', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Select camera movement..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {cameraMotionOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">Mood & Atmosphere</Label>
                    <Select value={elements.ambiance || ""} onValueChange={(value) => updateElement('ambiance', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Select mood..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {ambianceOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Audio & Finishing Section */}
              <Card className={`bg-black/50 border-white/20 shadow-xl ${isVisible ? 'animate-slide-in-left animation-delay-400' : 'opacity-0'}`}>
                <CardHeader className="pb-4 border-b border-white/10">
                  <CardTitle className="flex items-center gap-2 font-heading text-lg text-white">
                    <Volume2 className="w-5 h-5 text-primary" />
                    Audio & Finishing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">Audio Style</Label>
                    <Select value={elements.audio || ""} onValueChange={(value) => updateElement('audio', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Select audio style..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {audioOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm text-white/70 font-medium mb-2 block">Ending Style</Label>
                    <Select value={elements.closing || ""} onValueChange={(value) => updateElement('closing', value)}>
                      <SelectTrigger className={selectStyle}>
                        <SelectValue placeholder="Select ending..." />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/30">
                        {closingOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-white hover:bg-white/10">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className={`flex flex-col sm:flex-row gap-3 ${isVisible ? 'animate-fade-in-up animation-delay-500' : 'opacity-0'}`}>
                <Button
                  variant="outline"
                  onClick={clearAllFields}
                  className="flex-1 bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Generated Prompt Section */}
            <div className="space-y-6">
              <Card className={`bg-black/50 border-white/20 shadow-xl ${isVisible ? 'animate-slide-in-right' : 'opacity-0'}`}>
                <CardHeader className="border-b border-white/10">
                  <CardTitle className="font-heading text-xl text-white">Generated Prompt</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <Textarea
                    value={generatedPrompt}
                    onChange={(e) => updateGeneratedPrompt(e.target.value)}
                    placeholder="Your prompt will appear here as you make selections..."
                    rows={12}
                    className={`resize-none font-mono text-sm leading-relaxed ${inputStyle}`}
                  />
                  
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
                      className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                  </div>

                  {/* Google Veo/Flow Links */}
                  {generatedPrompt.trim() && (
                    <div className={`mt-6 p-4 bg-white/5 rounded-lg border border-white/10 ${isVisible ? 'animate-fade-in-up animation-delay-600' : 'opacity-0'}`}>
                      <p className="text-sm text-white/70 mb-3">Ready to create your video? Use your prompt with:</p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a
                          href="https://deepmind.google/technologies/veo/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" className="w-full bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
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
                          <Button variant="outline" className="w-full bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white transition-all duration-300">
                            <VideoIcon className="w-4 h-4 mr-2" />
                            Google Flow
                          </Button>
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
                    className="w-full mt-4 bg-transparent border-white/50 text-destructive hover:bg-white/10 hover:border-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Saved
                  </Button>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-white/20">
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyPrompt}
                  disabled={!generatedPrompt.trim()}
                  className="flex-1"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSavePrompt}
                  disabled={!generatedPrompt.trim()}
                  className="bg-transparent border-white/50 text-white hover:bg-white/10 hover:border-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
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
    </div>
  );
}