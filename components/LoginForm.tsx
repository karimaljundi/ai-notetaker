"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginWithCreds } from "@/app/actions"

export default function LoginForm() {
  return (
    <form action={loginWithCreds} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter your name"
          required
          type="text"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          type="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>
      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  )
}