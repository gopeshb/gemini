"use client"

import { AuthProvider, useAuth } from "./contexts/auth-context"
import { ThemeProvider } from "./contexts/theme-context"
import LoginPage from "./components/login-page"
import GeminiChat from "./components/gemini-chat"

function AppContent() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return user ? <GeminiChat /> : <LoginPage />
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gemini-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}
