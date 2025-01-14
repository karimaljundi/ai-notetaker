# 🤖 AI Note Taking Assistant

> Transform lectures into intelligent study materials using AI

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Next.js](https://img.shields.io/badge/next.js-14.0-black)](https://nextjs.org/)

## ✨ Features

- [x] 🔐 Authentication (Google/Credentials)
- [x] 📝 Note Generation from YouTube Lectures
- [x] 🎯 Flashcard Creation
- [x] 📚 Quiz Generation
- [x] 💬 AI Chat Assistant
- [x] 📱 Mobile Responsive Design
- [x] 📊 Usage Analytics
- [ ] 🎙️ Voice Recording (Coming Soon)

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 |
| Database | PostgreSQL |
| ORM | Prisma |
| AI | OpenAI GPT-4 |
| Auth | NextAuth.js |
| Styling | Tailwind + shadcn/ui |
| Testing | Jest + RTL |
| Deploy | Vercel |

## 🚀 API Endpoints

### 📺 YouTube Processing
`POST /api/lecture-to-notes`
- 📥 Input: YouTube URL
- 📤 Output: Structured Notes
- ⚡ Limit: 5 requests/user

### 📋 Flashcard Generation
`POST /api/notes-to-flashcards`
- 📥 Input: Note Content
- 📤 Output: Study Cards
- 🎯 Features: Multi-difficulty

### ❓ Quiz Creation
`POST /api/notes-to-quizzes`
- 📥 Input: Note Content
- 📤 Output: MCQ Quiz
- 🎯 Features: Varied Difficulty

### 💭 AI Chat
`POST /api/chat`
- 📥 Input: User Query
- 📤 Output: AI Response
- 🧠 Context: Note-aware

## 🚀 Quick Start

1. **Clone & Install**
```bash
git clone https://github.com/karimaljundi/ai-notetaker
cd ai-notetaker
npm install
