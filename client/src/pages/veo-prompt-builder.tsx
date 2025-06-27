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
import { Copy, Save, Edit, Trash2, CircleCheck, ChevronLeft, ChevronRight, Bookmark } from "lucide-react";

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Veo Prompt Builder
            </h1>
            
            {/* Sticky Arrow Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
              className="fixed top-4 right-4 z-50 shadow-lg bg-card border-border hover:bg-muted"
            >
              <Bookmark className="w-4 h-4 mr-1" />
              {isSidePanelOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Create compelling video prompts for AI video generation
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Prompt Builder Section */}
          <div className="space-y-6">
            <Card className="bg-card border-border shadow-sm">
              <CardHeader>
                <CardTitle className="font-heading text-xl text-foreground">Build Your Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Section */}
                <div>
                  <Label className="text-muted-foreground font-medium">Subject</Label>
                  <div className="space-y-3 mt-2">
                    <Select value={elements.subject || ""} onValueChange={(value) => updateElement('subject', value)}>
                      <SelectTrigger className="bg-input border-border text-foreground">
                        <SelectValue placeholder="Select a subject..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {subjectOptions.map((option) => (
                          <SelectItem key={option} value={option} className="text-foreground">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or describe custom subject..."
                      value={elements.customSubject || ""}
                      onChange={(e) => updateElement('customSubject', e.target.value)}
                      className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                    />
                    
                    {/* Subject Description Dropdowns */}
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={elements.subjectAge || ""} onValueChange={(value) => updateElement('subjectAge', value)}>
                        <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                          <SelectValue placeholder="Age..." />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                          {subjectAgeOptions.map((option) => (
                            <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={elements.subjectGender || ""} onValueChange={(value) => updateElement('subjectGender', value)}>
                        <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                          <SelectValue placeholder="Gender..." />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                          {subjectGenderOptions.map((option) => (
                            <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Select value={elements.subjectAppearance || ""} onValueChange={(value) => updateElement('subjectAppearance', value)}>
                        <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                          <SelectValue placeholder="Appearance..." />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                          {subjectAppearanceOptions.map((option) => (
                            <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={elements.subjectClothing || ""} onValueChange={(value) => updateElement('subjectClothing', value)}>
                        <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                          <SelectValue placeholder="Clothing..." />
                        </SelectTrigger>
                        <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                          {subjectClothingOptions.map((option) => (
                            <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Context Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Context/Setting</Label>
                  <Textarea
                    placeholder="Describe the setting or context..."
                    rows={3}
                    value={elements.context || ""}
                    onChange={(e) => updateElement('context', e.target.value)}
                    className="mt-2 resize-none"
                    style={{ 
                      backgroundColor: 'var(--background-darker)', 
                      borderColor: 'var(--border-color)', 
                      color: 'var(--text-primary)' 
                    }}
                  />
                </div>

                {/* Action Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Action</Label>
                  <div className="space-y-3 mt-2">
                    <Select value={elements.action || ""} onValueChange={(value) => updateElement('action', value)}>
                      <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <SelectValue placeholder="Select an action..." />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                        {actionOptions.map((option) => (
                          <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or describe custom action..."
                      value={elements.customAction || ""}
                      onChange={(e) => updateElement('customAction', e.target.value)}
                      style={{ 
                        backgroundColor: 'var(--background-darker)', 
                        borderColor: 'var(--border-color)', 
                        color: 'var(--text-primary)' 
                      }}
                    />
                  </div>
                </div>

                {/* Style Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Style/Aesthetic</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {styleOptions.map((style) => {
                      const isSelected = elements.style?.includes(style);
                      return (
                        <Button
                          key={style}
                          variant="outline"
                          size="sm"
                          onClick={() => toggleStyle(style)}
                          style={{
                            backgroundColor: isSelected ? 'var(--accent-blue)' : 'var(--background-darker)',
                            borderColor: isSelected ? 'var(--accent-blue)' : 'var(--border-color)',
                            color: isSelected ? 'white' : 'var(--text-primary)',
                          }}
                          className="hover:opacity-80 transition-opacity"
                        >
                          {style}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Camera Motion Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Camera Motion</Label>
                  <Select value={elements.cameraMotion || ""} onValueChange={(value) => updateElement('cameraMotion', value)}>
                    <SelectTrigger className="mt-2" style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <SelectValue placeholder="Select camera motion..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                      {cameraMotionOptions.map((option) => (
                        <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ambiance Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Ambiance/Mood</Label>
                  <Select value={elements.ambiance || ""} onValueChange={(value) => updateElement('ambiance', value)}>
                    <SelectTrigger className="mt-2" style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <SelectValue placeholder="Select ambiance..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                      {ambianceOptions.map((option) => (
                        <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Audio</Label>
                  <Select value={elements.audio || ""} onValueChange={(value) => updateElement('audio', value)}>
                    <SelectTrigger className="mt-2" style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <SelectValue placeholder="Select audio..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                      {audioOptions.map((option) => (
                        <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Closing Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Closing</Label>
                  <Select value={elements.closing || ""} onValueChange={(value) => updateElement('closing', value)}>
                    <SelectTrigger className="mt-2" style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                      <SelectValue placeholder="Select closing..." />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                      {closingOptions.map((option) => (
                        <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Clear All Button */}
                <Button
                  variant="outline"
                  onClick={clearAllFields}
                  className="w-full"
                  style={{ 
                    backgroundColor: 'var(--surface-light)', 
                    borderColor: 'var(--border-color)', 
                    color: 'var(--text-secondary)' 
                  }}
                >
                  Clear All Fields
                </Button>
              </CardContent>
            </Card>
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
      </div>
    </div>
  );
}
