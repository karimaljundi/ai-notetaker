import { Button } from '@/components/ui/button'
import Link  from 'next/link'
import React from 'react'
import LoginForm from '@/components/LoginForm'

const LandingPage = () => {
  return (
    <div>LandingPage (unprotected)
        <LoginForm/>
    </div>
  )
}
export default LandingPage
