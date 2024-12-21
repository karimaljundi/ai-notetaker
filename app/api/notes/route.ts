import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        return await POST(req, res);
    } else if (req.method === 'GET') {
        return await GET(req, res);
    } else {
        res.setHeader('Allow', ['POST', 'GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

async function POST(req: NextApiRequest, res: NextApiResponse) {
    const { content } = req.body;
    try {
        const note = await prisma.note.create({ data:  content  });
        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create note' });
    }
}

async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const notes = await prisma.note.findMany();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notes' });
    }
}