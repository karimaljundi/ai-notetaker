import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FlashcardProps {
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isFlipped: boolean;
  onFlip: () => void;
}

const Flashcard: React.FC<FlashcardProps> = ({ 
  front, 
  back, 
  difficulty,
  isFlipped,
  onFlip
}) => {
  const getDifficultyColor = (difficulty: string) => {
    console.log("Difficulty:", difficulty);
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto relative">
      <Badge 
        className={`absolute top-3 right-3 text-xs sm:text-sm px-2 py-1 ${getDifficultyColor(difficulty)}`}
      >
        {difficulty}
      </Badge>
      <CardHeader className="pb-2 p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl font-bold leading-tight break-words min-h-[4rem]">
          {isFlipped ? back : front}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <Button
          onClick={onFlip}
          variant="outline"
          className="w-full mt-2 sm:mt-4 text-sm sm:text-base py-2 sm:py-3"
        >
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Flashcard;