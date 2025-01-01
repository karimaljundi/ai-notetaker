'use client';
import { Card } from '@/components/ui/card';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react'

function page() {
  const {data: session} = useSession();
  const [notes, setNotes] = React.useState<any[]>([]);
  useEffect(() => {
    if (session?.user?.email) {
        fetchNotes();
    }
},[]);
const fetchNotes = async () => {
    try {
        const response = await axios.get('/api/notes', {
            params: { email: session?.user?.email }
        });
        if (Array.isArray(response.data)) {
            // console.log("You are an array")
            setNotes(response.data); // Ensure response data is an array
        } else {
            console.error("Error: Notes data is not an array");
        }
    } catch (error) {
        console.error("Error fetching notes:", error);
    }
};
  return (
    <div>
      <div className="mt-8">
                    <h2 className="text-xl font-bold">Your Notes</h2>
                    <ul>
                        {notes.map((note) => (
                            <Card key={note.title} className="border p-2 my-2">
                                <a href={`notes-to-quiz/${note.id}`} className="no-underline">
                                    <h3 className="font-bold">{note.title}</h3>
                                    <div className="overflow-hidden max-h-16">
                                        <p className="line-clamp-3">{note.content}</p>
                                    </div>
                                </a>
                            </Card>
                        ))}
                    </ul>
                </div>
    </div>
  )
}

export default page