import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { QuizQuestion, InsertQuizResult } from "@shared/schema";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const { data: questions, isLoading } = useQuery<QuizQuestion[]>({
    queryKey: ["/api/quiz/questions"],
  });

  const submitResultMutation = useMutation({
    mutationFn: async (result: InsertQuizResult) => {
      return apiRequest("POST", "/api/quiz/results", result);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/quiz/results"] });
    },
  });

  const handleAnswerSelect = (value: string) => {
    setSelectedAnswer(value);
  };

  const handleNext = () => {
    if (!selectedAnswer) {
      toast({
        title: "Please select an answer",
        description: "You must choose an answer before proceeding.",
        variant: "destructive",
      });
      return;
    }

    const newAnswers = { ...answers, [currentQuestion]: selectedAnswer };
    setAnswers(newAnswers);
    setSelectedAnswer("");

    if (currentQuestion < (questions?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Quiz completed - calculate score
      const correctAnswers = questions?.reduce((count, question, index) => {
        return count + (newAnswers[index] === question.correctAnswer ? 1 : 0);
      }, 0) || 0;
      
      setScore(correctAnswers);
      setQuizCompleted(true);

      // Submit results
      submitResultMutation.mutate({
        score: correctAnswers,
        totalQuestions: questions?.length || 0,
        answers: Object.values(newAnswers),
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(answers[currentQuestion - 1] || "");
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setSelectedAnswer("");
    setQuizCompleted(false);
    setScore(0);
  };

  const getScoreLevel = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Advanced Detector";
    if (percentage >= 60) return "Good Detector";
    if (percentage >= 40) return "Developing Skills";
    return "Needs Practice";
  };

  if (isLoading) {
    return (
      <section id="quiz" className="py-20 bg-background-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </section>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <section id="quiz" className="py-20 bg-background-light-custom">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Unavailable</h2>
          <p className="text-gray-600">No quiz questions are currently available.</p>
        </div>
      </section>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <section id="quiz" className="py-20 bg-background-light-custom">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">AI Detection Quiz</h2>
          <p className="text-xl text-gray-600">
            Test your ability to identify AI-generated content and improve your detection skills.
          </p>
        </div>
        
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {!quizCompleted ? (
              <div className="quiz-container">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                {/* Quiz Question */}
                <div className="quiz-question mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    {currentQuestionData.question}
                  </h3>
                  
                  {/* Sample quiz image */}
                  {currentQuestionData.imageUrl && (
                    <div className="bg-gray-100 rounded-lg p-4 mb-6">
                      <img 
                        src={currentQuestionData.imageUrl} 
                        alt="Quiz content for analysis" 
                        className="rounded-lg shadow w-full max-w-md mx-auto" 
                      />
                    </div>
                  )}
                  
                  {/* Answer Options */}
                  <RadioGroup value={selectedAnswer} onValueChange={handleAnswerSelect}>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value="real" id="real" />
                        <Label htmlFor="real" className="flex-1 cursor-pointer">
                          Real person - This appears to be a genuine photograph
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value="ai" id="ai" />
                        <Label htmlFor="ai" className="flex-1 cursor-pointer">
                          AI-generated - This shows signs of artificial generation
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <RadioGroupItem value="unsure" id="unsure" />
                        <Label htmlFor="unsure" className="flex-1 cursor-pointer">
                          I'm not sure - Need more information to decide
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button 
                    onClick={handleNext}
                    className="bg-primary-custom text-white hover:bg-blue-700"
                  >
                    {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              /* Quiz Results */
              <div className="quiz-results text-center">
                <div className="w-20 h-20 bg-success-custom bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="text-success-custom text-3xl" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Quiz Complete!</h3>
                <p className="text-xl text-gray-600 mb-6">
                  You scored {score} out of {questions.length} questions correctly
                </p>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Your Detection Level</h4>
                  <p className="text-gray-700">
                    {getScoreLevel(score, questions.length)} - {
                      score >= questions.length * 0.8 ? "You have excellent skills at identifying AI-generated content!" :
                      score >= questions.length * 0.6 ? "You have good detection skills with room for improvement." :
                      score >= questions.length * 0.4 ? "You're developing your detection abilities. Keep practicing!" :
                      "Consider reviewing the educational materials to improve your detection skills."
                    }
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={handleRetake}
                    className="bg-primary-custom text-white hover:bg-blue-700"
                  >
                    Retake Quiz
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: 'AI Detection Quiz Results',
                          text: `I scored ${score}/${questions.length} on the AI Detection Quiz!`,
                        });
                      }
                    }}
                    className="bg-secondary-custom text-white hover:bg-orange-600"
                  >
                    Share Results
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
