import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuizQuestionProps {
  question: string;
  answers: string[];
  correctAnswer: string;
  selectedAnswer?: string;
  feedback?: string;
  onAnswer: (isCorrect: boolean) => void;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({ 
  question, 
  answers = [], 
  correctAnswer,
  selectedAnswer = "",
  feedback = "",
  onAnswer 
}) => {
  const handleAnswerClick = (answer: string) => {
    const isCorrect = answer === correctAnswer;
    onAnswer(isCorrect);
  };

  return (
    <div className="flex justify-center items-center">
      <Card className="w-full max-w-2xl">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold leading-tight break-words">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={!!feedback}
                className="min-h-[2.5rem] h-auto whitespace-normal text-left break-words"
                variant={
                  feedback
                    ? answer === correctAnswer
                      ? "success"
                      : answer === selectedAnswer
                      ? "destructive"
                      : "outline"
                    : "outline"
                }
              >
                {answer}
              </Button>
            ))}
          </div>
          {feedback && (
            <p className={`mt-2 text-sm font-medium ${
              feedback.startsWith("Correct") ? "text-green-600" : "text-red-600"
            }`}>
              {feedback}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizQuestion;