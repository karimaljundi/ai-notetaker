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
    <div className="flex justify-center items-center p-4 w-full">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="pb-2 p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl font-bold leading-tight break-words">
            {question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 sm:p-6">
          <div className="grid gap-2 sm:gap-3">
            {answers.map((answer, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerClick(answer)}
                disabled={!!feedback}
                className="min-h-[3rem] px-3 py-2 h-auto text-sm sm:text-base whitespace-normal text-left break-words"
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
            <p className={`mt-4 text-sm sm:text-base font-medium ${
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