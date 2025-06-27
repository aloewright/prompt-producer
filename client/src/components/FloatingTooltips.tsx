import { useState, useEffect } from "react";
import { X, Lightbulb, Sparkles, Zap, Star, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Tip {
  id: string;
  text: string;
  position: { x: number; y: number };
  icon: React.ReactNode;
  delay: number;
}

const aiTips: Tip[] = [
  {
    id: "1",
    text: "✨ AI Secret: Lighting sets the mood! Try 'golden hour glow' or 'neon-lit rain' for cinematic magic.",
    position: { x: 85, y: 20 },
    icon: <Lightbulb className="h-4 w-4 text-yellow-500" />,
    delay: 3000,
  },
  {
    id: "2", 
    text: "🎭 Pro move: Combine emotions with actions! 'Nervously adjusting glasses' tells a story in seconds.",
    position: { x: 15, y: 65 },
    icon: <Sparkles className="h-4 w-4 text-purple-500" />,
    delay: 7000,
  },
  {
    id: "3",
    text: "🎬 Director's cut: Camera motion = emotion! 'Slow dolly zoom' creates that Hitchcock thriller vibe.",
    position: { x: 75, y: 80 },
    icon: <Zap className="h-4 w-4 text-blue-500" />,
    delay: 11000,
  },
  {
    id: "4",
    text: "🔍 Detail wizard: Layer your descriptions! 'Person' → 'Artist' → 'Paint-splattered sculptor' = compelling character.",
    position: { x: 20, y: 30 },
    icon: <Star className="h-4 w-4 text-green-500" />,
    delay: 15000,
  },
  {
    id: "5",
    text: "🌍 World builder: 'Cozy café' vs 'Steam-filled coffee shop with vintage jazz playing' - which draws you in?",
    position: { x: 60, y: 45 },
    icon: <Lightbulb className="h-4 w-4 text-orange-500" />,
    delay: 19000,
  },
  {
    id: "6",
    text: "🎨 Style hack: Mix unexpected elements! 'Cyberpunk meets cottagecore' creates unique visuals.",
    position: { x: 40, y: 70 },
    icon: <Sparkles className="h-4 w-4 text-pink-500" />,
    delay: 23000,
  },
  {
    id: "7",
    text: "🎵 Sound matters too! 'Distant thunder rumbling' adds tension even to peaceful scenes.",
    position: { x: 80, y: 50 },
    icon: <Zap className="h-4 w-4 text-indigo-500" />,
    delay: 27000,
  },
];

interface FloatingTooltipsProps {
  isActive?: boolean;
}

export default function FloatingTooltips({ isActive = true }: FloatingTooltipsProps) {
  const [visibleTips, setVisibleTips] = useState<Set<string>>(new Set());
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isActive) return;

    const timers: NodeJS.Timeout[] = [];

    aiTips.forEach((tip) => {
      if (dismissedTips.has(tip.id)) return;

      const timer = setTimeout(() => {
        setVisibleTips(prev => new Set(Array.from(prev).concat(tip.id)));
        
        // Auto-hide after 8 seconds if not dismissed
        const hideTimer = setTimeout(() => {
          setVisibleTips(prev => {
            const newArray = Array.from(prev).filter(id => id !== tip.id);
            return new Set(newArray);
          });
        }, 8000);
        
        timers.push(hideTimer);
      }, tip.delay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isActive, dismissedTips]);

  const dismissTip = (tipId: string) => {
    setVisibleTips(prev => {
      const newArray = Array.from(prev).filter(id => id !== tipId);
      return new Set(newArray);
    });
    setDismissedTips(prev => {
      const currentArray = Array.from(prev);
      return new Set(currentArray.concat(tipId));
    });
  };

  const dismissAllTips = () => {
    const allVisibleIds = Array.from(visibleTips);
    setVisibleTips(new Set());
    setDismissedTips(prev => {
      const currentArray = Array.from(prev);
      return new Set(currentArray.concat(allVisibleIds));
    });
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {/* Dismiss All Button - appears when there are visible tips */}
      {visibleTips.size > 1 && (
        <div className="absolute top-4 right-4 pointer-events-auto">
          <Button
            variant="outline"
            size="sm"
            className="bg-card/95 backdrop-blur-sm hover:bg-muted/80 transition-all duration-200"
            onClick={dismissAllTips}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Dismiss All Tips
          </Button>
        </div>
      )}
      
      {aiTips.map((tip) => (
        visibleTips.has(tip.id) && !dismissedTips.has(tip.id) && (
          <div
            key={tip.id}
            className="absolute tooltip-enter tooltip-float pointer-events-auto"
            style={{
              left: `${tip.position.x}%`,
              top: `${tip.position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Card className="max-w-xs bg-card/95 backdrop-blur-sm border-border shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 group">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200">
                    {tip.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-relaxed">
                      {tip.text}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0 h-6 w-6 p-0 hover:bg-muted hover:scale-110 transition-all duration-200"
                    onClick={() => dismissTip(tip.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Floating animation indicator */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse group-hover:bg-primary/80"></div>
                
                {/* Subtle glow effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </CardContent>
            </Card>
          </div>
        )
      ))}
    </div>
  );
}