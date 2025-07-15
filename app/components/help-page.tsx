"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  HelpCircle,
  MessageSquare,
  Settings,
  Zap,
  Book,
  Mail,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Keyboard,
  Smartphone,
  Monitor,
} from "lucide-react"
import { useAuth } from "../contexts/auth-context"

interface HelpPageProps {
  onBack: () => void
}

export default function HelpPage({ onBack }: HelpPageProps) {
  const { user } = useAuth()
  const [feedbackForm, setFeedbackForm] = useState({
    type: "general",
    subject: "",
    message: "",
    email: user?.email || "",
  })
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setFeedbackSubmitted(true)
    setFeedbackForm({ type: "general", subject: "", message: "", email: user?.email || "" })
  }

  const faqData = [
    {
      question: "How do I start a new conversation?",
      answer:
        "Click the 'New Chat' button in the sidebar or simply start typing in the input field at the bottom of the screen. Each new topic will automatically create a new conversation thread.",
    },
    {
      question: "Can I delete my chat history?",
      answer:
        "Yes! Go to Settings > Data Management and click 'Clear All Data' to remove all your conversations. You can also export your data before clearing it.",
    },
    {
      question: "How do I change the theme?",
      answer:
        "Click the theme toggle button (sun/moon icon) in the header to switch between light, dark, and system themes. You can also change this in Settings > Appearance.",
    },
    {
      question: "What's the OTP for demo mode?",
      answer:
        "For demonstration purposes, use '123456' as the OTP for any email address. In a production environment, you would receive a real OTP via email.",
    },
    {
      question: "How do I copy AI responses?",
      answer: "Click the copy button (clipboard icon) below any AI response to copy the text to your clipboard.",
    },
    {
      question: "Can I use keyboard shortcuts?",
      answer:
        "Yes! Press Enter to send a message, or Shift+Enter to add a new line. You can customize this behavior in Settings > Chat Settings.",
    },
    {
      question: "Is my data saved?",
      answer:
        "Your conversations and settings are saved locally in your browser. Enable 'Auto-save Chats' in settings to ensure your conversations are preserved.",
    },
    {
      question: "How do I export my data?",
      answer:
        "Go to Settings > Data Management and click 'Export Data' to download all your conversations, settings, and profile information as a JSON file.",
    },
  ]

  const shortcuts = [
    { key: "Enter", description: "Send message" },
    { key: "Shift + Enter", description: "New line in message" },
    { key: "Ctrl/Cmd + N", description: "New chat (when implemented)" },
    { key: "Ctrl/Cmd + K", description: "Focus search (when implemented)" },
    { key: "Esc", description: "Close modals/dropdowns" },
  ]

  const tips = [
    {
      icon: <Lightbulb className="w-5 h-5 text-yellow-500" />,
      title: "Be Specific",
      description: "The more specific your questions, the better the AI can help you. Include context and details.",
    },
    {
      icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
      title: "Use Follow-ups",
      description: "Ask follow-up questions to dive deeper into topics or clarify responses.",
    },
    {
      icon: <Book className="w-5 h-5 text-green-500" />,
      title: "Request Examples",
      description: "Ask for code examples, step-by-step guides, or practical demonstrations.",
    },
    {
      icon: <Settings className="w-5 h-5 text-purple-500" />,
      title: "Customize Settings",
      description: "Adjust font size, theme, and notification preferences to optimize your experience.",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-semibold">Help & Support</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="guide">User Guide</TabsTrigger>
            <TabsTrigger value="tips">Tips & Tricks</TabsTrigger>
            <TabsTrigger value="support">Contact Support</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Find quick answers to common questions about using Gemini</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <div className="grid gap-6">
              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>Learn the basics of using Gemini</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        1
                      </div>
                      <div>
                        <h4 className="font-medium">Sign In</h4>
                        <p className="text-sm text-muted-foreground">
                          Use any email and OTP '123456' to access the demo
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        2
                      </div>
                      <div>
                        <h4 className="font-medium">Start Chatting</h4>
                        <p className="text-sm text-muted-foreground">
                          Type your question in the input field and press Enter
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
                        3
                      </div>
                      <div>
                        <h4 className="font-medium">Explore Features</h4>
                        <p className="text-sm text-muted-foreground">
                          Try different prompts, copy responses, and customize settings
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500" />
                    Key Features
                  </CardTitle>
                  <CardDescription>Discover what you can do with Gemini</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Multiple Conversations</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">Manage multiple chat threads simultaneously</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Dark/Light Mode</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">
                        Switch between themes for comfortable viewing
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Export Data</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">Download your conversations and settings</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="font-medium">Responsive Design</span>
                      </div>
                      <p className="text-sm text-muted-foreground ml-6">Works seamlessly on desktop and mobile</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Keyboard Shortcuts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-blue-500" />
                    Keyboard Shortcuts
                  </CardTitle>
                  <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span className="text-sm">{shortcut.description}</span>
                        <Badge variant="outline" className="font-mono text-xs">
                          {shortcut.key}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tips & Tricks Tab */}
          <TabsContent value="tips" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  Tips & Tricks
                </CardTitle>
                <CardDescription>Get the most out of your Gemini experience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                      {tip.icon}
                      <div>
                        <h4 className="font-medium mb-1">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Device-specific Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-blue-500" />
                    Desktop Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm">Use the sidebar to quickly switch between conversations</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm">Right-click on messages for additional options (coming soon)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                    <p className="text-sm">Use keyboard shortcuts for faster navigation</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-green-500" />
                    Mobile Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Tap the menu button to access the sidebar</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Swipe gestures for navigation (coming soon)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-green-500 mt-0.5" />
                    <p className="text-sm">Use voice input for hands-free interaction (coming soon)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="support" className="space-y-6">
            <div className="grid gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    Contact Information
                  </CardTitle>
                  <CardDescription>Get in touch with our support team</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Email Support</h4>
                      <p className="text-sm text-muted-foreground">support@gemini-demo.com</p>
                      <p className="text-xs text-muted-foreground">Response time: 24-48 hours</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Documentation</h4>
                      <Button variant="outline" size="sm" className="w-fit bg-transparent">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Docs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Feedback Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send Feedback</CardTitle>
                  <CardDescription>Help us improve Gemini by sharing your thoughts and suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  {feedbackSubmitted ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        Thank you for your feedback! We'll review it and get back to you if needed.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="feedback-type">Feedback Type</Label>
                          <select
                            id="feedback-type"
                            value={feedbackForm.type}
                            onChange={(e) => setFeedbackForm((prev) => ({ ...prev, type: e.target.value }))}
                            className="w-full h-10 px-3 py-2 text-sm border border-input bg-background rounded-md"
                          >
                            <option value="general">General Feedback</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="question">Question</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="feedback-email">Email</Label>
                          <Input
                            id="feedback-email"
                            type="email"
                            value={feedbackForm.email}
                            onChange={(e) => setFeedbackForm((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-subject">Subject</Label>
                        <Input
                          id="feedback-subject"
                          value={feedbackForm.subject}
                          onChange={(e) => setFeedbackForm((prev) => ({ ...prev, subject: e.target.value }))}
                          placeholder="Brief description of your feedback"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="feedback-message">Message</Label>
                        <Textarea
                          id="feedback-message"
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
                          placeholder="Please provide detailed feedback..."
                          rows={5}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Send Feedback
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>

              {/* Status & Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-500" />
                    System Status
                  </CardTitle>
                  <CardDescription>Current system status and recent updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm">All systems operational</span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Recent Updates</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Added dark mode support</li>
                      <li>• Improved mobile responsiveness</li>
                      <li>• Enhanced chat export functionality</li>
                      <li>• Added comprehensive help system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
