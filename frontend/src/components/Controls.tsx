
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";

interface ControlsProps {
  onMove: (direction: string) => void;
  onRestart: () => void;
}

const Controls: React.FC<ControlsProps> = ({ onMove, onRestart }) => {
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="flex justify-center mb-2">
        <Button 
          variant="outline" 
          className="p-2" 
          onClick={() => onMove('up')}
        >
          <ArrowUp className="h-6 w-6" />
        </Button>
      </div>
      <div className="flex justify-center gap-2">
        <Button 
          variant="outline" 
          className="p-2" 
          onClick={() => onMove('left')}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          className="p-2" 
          onClick={() => onMove('down')}
        >
          <ArrowDown className="h-6 w-6" />
        </Button>
        <Button 
          variant="outline" 
          className="p-2" 
          onClick={() => onMove('right')}
        >
          <ArrowRight className="h-6 w-6" />
        </Button>
      </div>
      <div className="mt-4">
        <Button 
          variant="secondary"
          onClick={onRestart}
        >
          Restart Level
        </Button>
      </div>
    </div>
  );
};

export default Controls;
