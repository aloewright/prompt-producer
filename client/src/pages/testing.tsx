import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Copy, Download, Clock, CheckCircle, XCircle, AlertCircle, Camera, Upload, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/lib/local-storage';

interface TestResult {
  id: string;
  prompt: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  videoUrl?: string;
  coverImage?: string;
  error?: string;
  createdAt: Date;
}

export default function Testing() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setCoverImage(e.target?.result as string);
          toast({
            title: "Cover Image Added!",
            description: "Image uploaded successfully",
          });
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
      }
    }
  };

  const handleScreenshot = async (testId: string) => {
    const video = videoRefs.current[testId];
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `screenshot-${testId}.png`;
            a.click();
            URL.revokeObjectURL(url);
            
            toast({
              title: "Screenshot Saved!",
              description: "Video frame captured successfully",
            });
          }
        }, 'image/png');
      }
    } catch (error) {
      toast({
        title: "Screenshot Failed",
        description: "Unable to capture video frame",
        variant: "destructive",
      });
    }
  };

  const handleVideoDownload = async (testId: string, videoUrl: string) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `video-${testId}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started!",
        description: "Video download initiated",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Unable to download video",
        variant: "destructive",
      });
    }
  };

  const handleTest = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to test",
        variant: "destructive",
      });
      return;
    }

    const testId = Date.now().toString();
    const newTest: TestResult = {
      id: testId,
      prompt: prompt.trim(),
      status: 'pending',
      progress: 0,
      coverImage: coverImage || undefined,
      createdAt: new Date(),
    };

    setTestResults(prev => [newTest, ...prev]);
    setIsGenerating(true);

    // Simulate Google Veo API call
    try {
      // Update to processing
      setTestResults(prev => 
        prev.map(test => 
          test.id === testId 
            ? { ...test, status: 'processing', progress: 25 }
            : test
        )
      );

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setTestResults(prev => 
          prev.map(test => {
            if (test.id === testId && test.status === 'processing') {
              const newProgress = Math.min(test.progress + 15, 90);
              return { ...test, progress: newProgress };
            }
            return test;
          })
        );
      }, 1000);

      // Simulate completion after 6 seconds
      setTimeout(() => {
        clearInterval(progressInterval);
        setTestResults(prev => 
          prev.map(test => 
            test.id === testId 
              ? { 
                  ...test, 
                  status: 'completed', 
                  progress: 100,
                  videoUrl: 'https://example.com/generated-video.mp4' // This would be real in production
                }
              : test
          )
        );
        setIsGenerating(false);
        setPrompt('');
        setCoverImage(null);
        toast({
          title: "Video Generated!",
          description: "Your Veo video is ready",
        });
      }, 6000);

    } catch (error) {
      setTestResults(prev => 
        prev.map(test => 
          test.id === testId 
            ? { ...test, status: 'failed', error: 'Failed to generate video' }
            : test
        )
      );
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "Unable to generate video with Google Veo",
        variant: "destructive",
      });
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: "Copied!",
        description: "Prompt copied to clipboard",
      });
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <AlertCircle className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-700 dark:text-blue-400';
      case 'completed':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'failed':
        return 'bg-red-500/20 text-red-700 dark:text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Google Veo Testing
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your prompts with Google's Veo video generation model
          </p>
        </div>

        {/* Test Input */}
        <Card className="bg-white/8 backdrop-blur-sm border-white/20 mb-8">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Test Prompt</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Enter your video prompt to test with Google Veo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your video prompt here..."
                className="min-h-32 bg-white/5 border border-black/20 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="cover-image" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Cover Image (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white/5 border-white/20 text-gray-900 dark:text-white hover:bg-white/10"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover Image
                  </Button>
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {coverImage && (
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Image uploaded</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setCoverImage(null)}
                        className="text-red-500 hover:text-red-600 h-6 w-6 p-0"
                      >
                        ×
                      </Button>
                    </div>
                  )}
                </div>
                {coverImage && (
                  <img 
                    src={coverImage} 
                    alt="Cover preview" 
                    className="max-w-32 h-20 object-cover rounded-lg border border-white/20"
                  />
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleTest}
                  disabled={isGenerating || !prompt.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Generating...' : 'Test with Veo'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCopy(prompt)}
                  disabled={!prompt.trim()}
                  className="bg-white/5 border-white/20 text-gray-900 dark:text-white hover:bg-white/10"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Test Results
          </h2>
          
          {testResults.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white/8 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto">
                <Play className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tests yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Test your first prompt with Google Veo to see results here
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {testResults.map((result) => (
                <Card key={result.id} className="bg-white/8 backdrop-blur-sm border-white/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(result.status)}
                        <div>
                          <CardTitle className="text-sm font-medium text-gray-900 dark:text-white">
                            Test #{result.id}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                            {result.createdAt.toLocaleString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
                        {result.prompt}
                      </p>
                    </div>
                    
                    {result.status === 'processing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-gray-900 dark:text-white">{result.progress}%</span>
                        </div>
                        <Progress value={result.progress} className="h-2" />
                      </div>
                    )}
                    
                    {result.status === 'completed' && result.videoUrl && (
                      <div className="space-y-4">
                        {/* Show cover image if available */}
                        {result.coverImage && (
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Cover Image:</p>
                            <img 
                              src={result.coverImage} 
                              alt="Video cover" 
                              className="max-w-48 h-32 object-cover rounded-lg border border-white/20"
                            />
                          </div>
                        )}
                        
                        {/* Video player for screenshot functionality */}
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Generated Video:</p>
                          <video 
                            ref={(el) => { videoRefs.current[result.id] = el; }}
                            src={result.videoUrl} 
                            controls 
                            className="max-w-full h-48 rounded-lg border border-white/20 bg-black/20"
                          />
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            onClick={() => window.open(result.videoUrl, '_blank')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            View Full Screen
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVideoDownload(result.id, result.videoUrl!)}
                            className="bg-white/5 border-white/20 text-gray-900 dark:text-white hover:bg-white/10"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Video
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleScreenshot(result.id)}
                            className="bg-white/5 border-white/20 text-gray-900 dark:text-white hover:bg-white/10"
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Screenshot
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    {result.status === 'failed' && result.error && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        <p className="text-sm text-red-700 dark:text-red-400">
                          {result.error}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}