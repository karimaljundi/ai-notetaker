import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Transform Your Learning with AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Instantly convert lectures to notes, flashcards, and quizzes. Study smarter, not harder.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/sign-in">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary" />
                <CardTitle>Smart Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>AI-powered note-taking that captures every important detail</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary" />
                <CardTitle>Dynamic Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Auto-generated flashcards for effective memorization</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary" />
                <CardTitle>Interactive Quizzes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Test your knowledge with AI-created quizzes</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}