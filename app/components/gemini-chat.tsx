"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Sparkles, Copy, ThumbsUp, ThumbsDown, Menu, Plus, Settings, MoreVertical, Share, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../contexts/auth-context"
import SettingsPage from "./settings-page"
import { ThemeToggle } from "./theme-toggle"
import { useTheme } from "../contexts/theme-context"
import HelpPage from "./help-page"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

export default function GeminiChat() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const [showSettings, setShowSettings] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const currentChat = chats.find((chat) => chat.id === currentChatId)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [currentChat?.messages])

  useEffect(() => {
    // Load chats from localStorage
    const savedChats = localStorage.getItem("gemini-chats")
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats).map((chat: any) => ({
        ...chat,
        createdAt: new Date(chat.createdAt),
        messages: chat.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        })),
      }))
      setChats(parsedChats)
    }
  }, [])

  useEffect(() => {
    // Save chats to localStorage
    if (chats.length > 0) {
      localStorage.setItem("gemini-chats", JSON.stringify(chats))
    }
  }, [chats])

  if (showSettings) {
    return <SettingsPage onBack={() => setShowSettings(false)} />
  }

  if (showHelp) {
    return <HelpPage onBack={() => setShowHelp(false)} />
  }

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
  }

  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Simple response simulation based on user input
    const responses = [
      `I understand you're asking about "${userMessage}". Here's what I can help you with:

This is a comprehensive response that addresses your question. I can provide detailed explanations, code examples, and step-by-step guidance on various topics.

**Key points:**
• Detailed analysis of your request
• Practical solutions and recommendations  
• Additional resources and next steps

Would you like me to elaborate on any specific aspect of this topic?`,

      `Great question about "${userMessage}"! Let me break this down for you:

## Overview
This topic involves several important considerations that I'll walk you through systematically.

## Detailed Explanation
Here's a thorough explanation with examples and best practices:

\`\`\`javascript
// Example code snippet
function example() {
  return "This demonstrates the concept";
}
\`\`\`

## Next Steps
1. Consider the implications
2. Implement the solution
3. Test and iterate

Is there anything specific you'd like me to clarify or expand upon?`,

      `Excellent question! Based on your input about "${userMessage}", here's my analysis:

### Understanding the Context
Your question touches on several important areas that are worth exploring in detail.

### Comprehensive Answer
I can provide you with a detailed response that covers:
- The fundamental concepts
- Practical applications
- Common challenges and solutions
- Best practices and recommendations

### Additional Insights
This topic also relates to broader themes that might interest you, such as emerging trends and future developments in this area.

Would you like me to dive deeper into any particular aspect?`,
    ]

    return responses[Math.floor(Math.random() * responses.length)]
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    let chatId = currentChatId

    // Create new chat if none exists
    if (!chatId) {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: input.slice(0, 50) + (input.length > 50 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
      }
      setChats((prev) => [newChat, ...prev])
      chatId = newChat.id
      setCurrentChatId(chatId)
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Add user message
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const isFirstUserMessage = chat.messages.length === 0;
          let newTitle = chat.title;
          if (isFirstUserMessage || chat.title === "New Chat") {
            newTitle = input.slice(0, 50) + (input.length > 50 ? "..." : "");
          }
          return {
            ...chat,
            title: newTitle,
            messages: [...chat.messages, userMessage],
          };
        }
        return chat;
      })
    )

    setInput("")
    setIsLoading(true)

    try {
      const aiResponse = await simulateAIResponse(input)

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) => (chat.id === chatId ? { ...chat, messages: [...chat.messages, assistantMessage] } : chat)),
      )
    } catch (error) {
      console.error("Error getting AI response:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(
        /```([\s\S]*?)```/g,
        '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"><code class="text-sm">$1</code></pre>',
      )
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-900 dark:text-gray-100">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-gray-100">$1</h1>')
      .replace(/^• (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
  }

  const ChatSidebar = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => (
    <div className={`${collapsed ? "w-16" : "w-72"} border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col h-full transition-all duration-300`}>
      <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700 justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="mr-2"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </Button>
        {!collapsed && (
          <Button
            onClick={createNewChat}
            className="flex-1 justify-start gap-3 h-12 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            New chat
          </Button>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        {!collapsed && (
          <ScrollArea className="flex-1 p-2">
            <div className="space-y-1">
              {chats.map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    currentChatId === chat.id ? "bg-gray-100 dark:bg-gray-800" : ""
                  }`}
                  onClick={() => setCurrentChatId(chat.id)}
                >
                  <div className="flex-1 truncate">
                    <div className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm">{chat.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {chat.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </ScrollArea>
        )}
        {/* Settings button at the bottom */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700 mt-auto flex justify-center">
          <Button
            variant="ghost"
            size={collapsed ? "icon" : undefined}
            onClick={() => setShowSettings(true)}
            aria-label="Open settings"
            className={`w-10 h-10 flex items-center justify-center ${!collapsed ? "w-full justify-start gap-2 px-3" : ""}`}
          >
            <Settings className="w-5 h-5" />
            {!collapsed && (
              <span className="font-medium text-gray-700 dark:text-gray-200">Settings</span>
            )}
            {/* Optionally add a logo here if desired */}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <ChatSidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-800 shadow-md rounded-full"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          <ChatSidebar collapsed={false} onToggle={() => {}} />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-medium text-gray-900 dark:text-gray-100">Gemini</h1>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-blue-500 text-white text-sm font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={() => setShowSettings(true)} className="text-gray-700 dark:text-gray-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowHelp(true)} className="text-gray-700 dark:text-gray-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Help & Support
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                  <DropdownMenuItem onClick={logout} className="text-gray-700 dark:text-gray-200">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Messages Area */}
        <ScrollArea className="flex-1">
          {!currentChat || currentChat.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center max-w-3xl mx-auto px-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center mb-8">
                <Sparkles className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-4xl font-light text-gray-900 dark:text-gray-100 mb-4">
                Hello, {user?.name?.split(" ")[0]}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">How can I help you today?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl"
                  onClick={() => setInput("Explain quantum computing in simple terms")}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Explain concepts</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Break down complex topics into easy-to-understand explanations
                  </p>
                </Card>
                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl"
                  onClick={() => setInput("Write a Python function to sort a list")}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Code assistance</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Help with programming, debugging, and code optimization
                  </p>
                </Card>
                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl"
                  onClick={() => setInput("Plan a 7-day trip to Japan")}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Creative planning</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Assist with trip planning, project organization, and creative tasks
                  </p>
                </Card>
                <Card
                  className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl"
                  onClick={() => setInput("Analyze the latest trends in AI")}
                >
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Research & analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Provide insights, analysis, and research on various topics
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-2 sm:px-6 py-8">
              <div className="space-y-2">
                {currentChat.messages.map((message, idx) => {
                  const isUser = message.role === "user";
                  const isAssistant = message.role === "assistant";
                  // Group consecutive messages from the same sender
                  const prev = currentChat.messages[idx - 1];
                  const isFirstOfGroup = !prev || prev.role !== message.role;
                  return (
                    <div key={message.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group w-full`}>
                      {isAssistant && isFirstOfGroup && (
                        <div className="flex flex-col items-end mr-2 pt-1">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                              <Sparkles className="w-4 h-4" />
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`px-4 py-2 rounded-2xl text-base shadow-sm transition-colors whitespace-pre-line break-words ${
                            isUser
                              ? 'bg-blue-600 text-white rounded-br-md' // Google Chat blue
                              : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md'
                          } ${isFirstOfGroup ? '' : 'mt-0.5'}`}
                          style={{ boxShadow: isUser ? '0 1px 2px rgba(30,64,175,0.08)' : '0 1px 2px rgba(0,0,0,0.04)' }}
                          dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-400 dark:text-gray-500">
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {isAssistant && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => copyToClipboard(message.content)}
                                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                              >
                                <Copy className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                              >
                                <Share className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 p-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-200"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      {isUser && isFirstOfGroup && (
                        <div className="flex flex-col items-end ml-2 pt-1">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="bg-blue-600 text-white text-sm font-medium">
                              {user?.name?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
                  );
                })}
                {isLoading && (
                  <div className="flex justify-start gap-3 items-end">
                    <div className="flex flex-col items-end mr-2 pt-1">
                      <Avatar className="w-7 h-7">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white">
                          <Sparkles className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 shadow-sm flex items-center min-h-[40px]">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a prompt here"
                className="min-h-[56px] max-h-32 resize-none border-0 bg-transparent px-6 py-4 pr-14 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-3xl"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="absolute right-3 bottom-3 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
              Gemini may display inaccurate info, including about people, so double-check its responses.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
