import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, Brain, Lightbulb } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <main className="flex-1 w-full max-w-7xl">
        <section className="space-y-8 pb-12 pt-8 md:pb-16 md:pt-14 lg:py-20">
          <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center mx-auto px-4">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Transform Your Learning with AI
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Instantly convert lectures to notes, flashcards, and quizzes. Study smarter, not harder.
            </p>
            <div className="space-x-4 mt-4">
              <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-primary/20">
                <Link href="/sign-in">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container space-y-10 py-10 md:py-16 lg:py-20 mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card className="flex flex-col items-center text-center border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Smart Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>AI-powered note-taking that captures every important detail</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Brain className="h-12 w-12 text-primary mb-2" />
                <CardTitle>Dynamic Flashcards</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Auto-generated flashcards for effective memorization</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center text-center border-primary/10 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-primary mb-2" />
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