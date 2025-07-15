"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Mail, Lock, User, ArrowRight } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { ThemeToggle } from "./theme-toggle"

export default function LoginPage() {
  const { login, signup, sendOTP } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginOTP, setLoginOTP] = useState("")

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupName, setSignupName] = useState("")
  const [signupOTP, setSignupOTP] = useState("")

  const handleSendOTP = async (email: string, isSignup = false) => {
    if (!email) {
      setError("Please enter your email address")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const success = await sendOTP(email)
      if (success) {
        setOtpSent(true)
        setSuccess("OTP sent successfully! Use 123456 to continue.")
      } else {
        setError("Failed to send OTP. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await login(loginEmail, loginOTP)
      if (!success) {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const success = await signup(signupEmail, signupName, signupOTP)
      if (!success) {
        setError("Invalid OTP. Please try again.")
      }
    } catch (err) {
      setError("Signup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-gradient bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md z-10 relative">
        <Card className="border-0 shadow-xl rounded-3xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg">
          <CardContent className="p-8">
            {/* Logo/Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg mb-4">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-1 tracking-tight">Sign in to Gemini</h1>
              <p className="text-gray-600 dark:text-gray-400 text-base">Continue your AI conversations</p>
          </div>
            {/* Google Sign In Button */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 mb-6 flex items-center justify-center gap-3 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium shadow-sm"
              disabled
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
            </Button>
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              <span className="mx-3 text-xs text-gray-400">or</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        </div>
        <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-6">
            <TabsTrigger
              value="login"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          {/* Login Tab */}
          <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-12 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-base"
                        required
                      />
                    </div>
                  </div>
                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={() => handleSendOTP(loginEmail)}
                      disabled={isLoading || !loginEmail}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base shadow-md"
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="login-otp" className="text-gray-700 dark:text-gray-300 font-medium">
                          OTP Code
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="login-otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={loginOTP}
                            onChange={(e) => setLoginOTP(e.target.value)}
                            className="pl-12 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-base"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !loginOTP}
                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base shadow-md"
                      >
                        {isLoading ? "Signing In..." : "Sign In"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setOtpSent(false)
                          setLoginOTP("")
                          setSuccess("")
                        }}
                        className="w-full h-12 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                      >
                        Back to Email
                      </Button>
                    </>
                  )}
                </form>
          </TabsContent>
          {/* Signup Tab */}
          <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-gray-700 dark:text-gray-300 font-medium">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-12 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-base"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-gray-700 dark:text-gray-300 font-medium">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="Enter your email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-12 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-base"
                        required
                      />
                    </div>
                  </div>
                  {!otpSent ? (
                    <Button
                      type="button"
                      onClick={() => handleSendOTP(signupEmail, true)}
                      disabled={isLoading || !signupEmail || !signupName}
                      className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base shadow-md"
                    >
                      {isLoading ? "Sending..." : "Send OTP"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-otp" className="text-gray-700 dark:text-gray-300 font-medium">
                          OTP Code
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="signup-otp"
                            type="text"
                            placeholder="Enter 6-digit OTP"
                            value={signupOTP}
                            onChange={(e) => setSignupOTP(e.target.value)}
                            className="pl-12 h-12 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl text-base"
                            maxLength={6}
                            required
                          />
                        </div>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !signupOTP}
                        className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base shadow-md"
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setOtpSent(false)
                          setSignupOTP("")
                          setSuccess("")
                        }}
                        className="w-full h-12 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                      >
                        Back to Details
                      </Button>
                    </>
                  )}
                </form>
          </TabsContent>
        </Tabs>
        {/* Alerts */}
        {error && (
          <Alert className="mt-4 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-xl">
            <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="mt-4 border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 rounded-xl">
            <AlertDescription className="text-green-800 dark:text-green-200">{success}</AlertDescription>
          </Alert>
        )}
        {/* Demo Info */}
            <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
              Use OTP <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">123456</span> for any email
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
