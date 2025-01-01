import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookText, FilePlus, Brain, GraduationCap, Clock, WalletCards as Cards } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default async function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <Button asChild>
          <Link href="/lecture-to-notes">
            <FilePlus className="mr-2 h-4 w-4" />
            New Note
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <BookText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quizzes Created</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+4 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Flashcards</CardTitle>
            <Cards className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36</div>
            <p className="text-xs text-muted-foreground">+8 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">+0.5h from yesterday</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Notes</CardTitle>
            <CardDescription>Your recently created notes</CardDescription>
          </CardHeader>
          <CardContent>
            {/* If no notes */}
            <div className="flex h-[200px] items-center justify-center rounded-md border border-dashed">
              <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <GraduationCap className="h-10 w-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No notes created</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  You haven't created any notes yet. Start by creating your first note.
                </p>
                <Button asChild>
                  <Link href="/lecture-to-notes">Create your first note</Link>
                </Button>
              </div>
            </div>

            {/* When there are notes */}
            {/* <div className="space-y-4">
              {recentNotes.map((note) => (
                <div key={note.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{note.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              ))}
            </div> */}
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and actions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button asChild variant="outline" className="justify-start">
              <Link href="/lecture-to-notes">
                <BookText className="mr-2 h-4 w-4" />
                Create New Note
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/notes-to-quiz">
                <Brain className="mr-2 h-4 w-4" />
                Generate Quiz
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start">
              <Link href="/notes-to-flashcards">
                <Cards className="mr-2 h-4 w-4" />
                Create Flashcards
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}