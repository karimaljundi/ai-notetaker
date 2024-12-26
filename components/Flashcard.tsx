import React, { useState } from 'react';
import { Card, CardBody } from "@nextui-org/card";
import {Badge} from '@nextui-org/badge'

const Flashcard = ({ front, back, difficulty }) => {
    const [isFlipped, setIsFlipped] = useState(false);
  
    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'success';
            case 'medium': return 'warning';
            case 'hard': return 'danger';
            default: return 'default';
        }
    };

    const getDifficultyTextColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case 'easy': return 'text-green-500';
            case 'medium': return 'text-yellow-500';
            case 'hard': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };
  
    return (
      <Card 
        isPressable
        onPress={() => setIsFlipped(!isFlipped)}
        className="w-64 h-40 relative"
      >
        <Badge
                color={getDifficultyColor(difficulty)}
                placement="top-right"
                className="absolute top-2 right-2 z-10"
            >
                {difficulty}
            </Badge>
            <CardBody className="flex items-center justify-center">
                <span className={`text-xl font-bold ${getDifficultyTextColor(difficulty)}`}>
                    {isFlipped ? back : front}
                </span>
            </CardBody>
      </Card>
    );
  };
  
  export default Flashcard;