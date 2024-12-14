import { UserButton } from '@clerk/nextjs'
import React from 'react'

export default function page() {
  return (
    <div>Welcome to focusify dashboard!(protected)
    <UserButton afterSignOutUrl='/'/>
    </div>
  )
}
