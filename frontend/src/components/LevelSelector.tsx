import { Button } from "@/components/ui/button";
import { Lock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  currentLevel: number;
  totalLevels: number;
  onLevelSelect: (level: number) => void;
  completedLevels?: number[];
}

export function LevelSelector({ 
  currentLevel, 
  totalLevels, 
  onLevelSelect,
  completedLevels = [] 
}: LevelSelectorProps) {
  return (
    <div className="flex flex-row gap-3 bg-slate-200/60 rounded-md px-3 py-2 shadow-sm">
      {Array.from({ length: totalLevels }, (_, i) => i + 1).map((level) => {
        const isCompleted = completedLevels.includes(level);
        const isCurrent = currentLevel === level;
        const isLocked = level > Math.max(...completedLevels, 0) + 1;
        return (
          <Button
            key={level}
            variant={isCurrent ? "default" : "outline"}
            size="default"
            onClick={() => !isLocked && onLevelSelect(level)}
            className={cn(
              "relative h-10 w-10 p-0 text-base font-bold flex items-center justify-center border border-slate-400 transition-all duration-150",
              isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-slate-200",
              isLocked && "opacity-60 cursor-not-allowed",
              isCompleted && !isCurrent && "bg-green-500/20 hover:bg-green-500/30"
            )}
            disabled={isLocked}
            tabIndex={0}
            aria-label={`Go to level ${level}`}
          >
            <span className="flex items-center justify-center gap-1">
              {isLocked ? (
                <Lock className="w-4 h-4 -mt-0.5 text-slate-400" />
              ) : isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : null}
              <span className={isLocked ? "text-slate-400" : undefined}>{level}</span>
            </span>
          </Button>
        );
      })}
    </div>
  );
} 