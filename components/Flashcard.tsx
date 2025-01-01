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
    <Card className="w-full max-w-2xl relative" onClick={onFlip}>
      <Badge 
        className={`absolute top-2 right-2 ${getDifficultyColor(difficulty)}`}
      >
        {difficulty}
      </Badge>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold leading-tight break-words">
          {isFlipped ? back : front}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={onFlip}
          variant="outline"
          className="w-full mt-4"
        >
          {isFlipped ? "Show Question" : "Show Answer"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default Flashcard;