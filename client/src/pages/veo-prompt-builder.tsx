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
import { Copy, Save, Edit, Trash2, CircleCheck } from "lucide-react";

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

  const handleCopyPrompt = async () => {
    if (!generatedPrompt.trim()) {
      toast({
        title: "No prompt to copy",
        description: "Please create a prompt first",
        variant: "destructive",
      });
      return;
    }

    const success = await copyPromptToClipboard();
    if (success) {
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background-dark)', color: 'var(--text-primary)' }}>
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Veo Prompt Builder
            </h1>

          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Create compelling video prompts for AI video generation
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Prompt Builder Section */}
          <div className="space-y-6">
            <Card style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
              <CardHeader>
                <CardTitle style={{ color: 'var(--text-primary)' }}>Build Your Prompt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Section */}
                <div>
                  <Label style={{ color: 'var(--text-secondary)' }}>Subject</Label>
                  <div className="space-y-3 mt-2">
                    <Select value={elements.subject || ""} onValueChange={(value) => updateElement('subject', value)}>
                      <SelectTrigger style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}>
                        <SelectValue placeholder="Select a subject..." />
                      </SelectTrigger>
                      <SelectContent style={{ backgroundColor: 'var(--background-darker)', borderColor: 'var(--border-color)' }}>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option} value={option} style={{ color: 'var(--text-primary)' }}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Or describe custom subject..."
                      value={elements.customSubject || ""}
                      onChange={(e) => updateElement('customSubject', e.target.value)}
                      style={{ 
                        backgroundColor: 'var(--background-darker)', 
                        borderColor: 'var(--border-color)', 
                        color: 'var(--text-primary)' 
                      }}
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
                    onChange={(e) => setGeneratedPrompt(e.target.value)}
                    placeholder="Your generated prompt will appear here as you fill out the form..."
                    className="w-full bg-transparent resize-none focus:outline-none min-h-[120px] border-none p-0"
                    style={{ color: 'var(--text-primary)' }}
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleCopyPrompt}
                    className="flex-1"
                    style={{ 
                      backgroundColor: 'var(--accent-blue)', 
                      color: 'white' 
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
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

        {/* Mobile Bottom Actions */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border-color)' }}>
          <div className="flex space-x-3">
            <Button
              onClick={handleCopyPrompt}
              className="flex-1"
              style={{ 
                backgroundColor: 'var(--accent-blue)', 
                color: 'white' 
              }}
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
