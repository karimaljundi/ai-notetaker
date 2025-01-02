"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from 'ai/react'
import { Brain, Send } from "lucide-react"
import { cn } from "@/lib/utils"
import axios from 'axios'
import { useSession } from 'next-auth/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AIChatPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [selectedNote, setSelectedNote] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const {data: session} = useSession();
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/chat',
    body: {
      noteId: selectedNote
    }
  })
console.log("user", typeof session?.user?.email)
console.log("id", session?.user?.email)
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('/api/notes', {params: {email: session?.user?.email}})
        const data = await response.data
        setNotes(data)
      } catch (error) {
        console.error('Error fetching notes:', error)
      }
    }
    fetchNotes()
  }, [])

  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">AI Assistant</h2>
      </div>
      <div className="grid gap-4">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Chat with AI about your notes</CardTitle>
            <CardDescription>
              Select a note and start asking questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          <Select
              value={selectedNote}
              onValueChange={setSelectedNote}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a note" />
              </SelectTrigger>
              <SelectContent>
                {notes.map((note) => (
                  <SelectItem key={note.id} value={note.id}>
                    {note.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card className="border-2 relative z-10">
              <ScrollArea className="h-[500px] p-4">
                <div className="space-y-4 flex flex-col">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                        message.role === "user"
                          ? "ml-auto bg-primary text-primary-foreground self-end max-w-[80%]"
                          : "bg-muted self-start max-w-[80%]",
                        "break-words whitespace-pre-wrap"
                      )}
                    >
                      <div className="prose prose-sm">
                        {message.content.split('\n').map((line, i) => (
                          <div key={i} className="min-w-[45px]">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            <form 
              onSubmit={handleSubmit}
              className="flex items-center gap-x-2"
            >
              <Input
                disabled={!selectedNote}
                placeholder={selectedNote ? "Ask a question..." : "Select a note first"}
                value={input}
                onChange={handleInputChange}
              />
              <Button 
                type="submit" 
                disabled={!selectedNote || !input || loading}
              >
                {loading ? (
                  <Brain className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )

}