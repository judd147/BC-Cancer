import { useState } from "react"
import { LoginForm } from "@/components/login-form"

export default function App() {
  const [isSignup, setIsSignup] = useState(true)

  const toggleMode = () => {
    setIsSignup(!isSignup)
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <LoginForm isSignup={isSignup} toggleMode={toggleMode} />
    </div>
  )
}
