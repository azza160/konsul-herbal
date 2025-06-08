"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Header } from "../../layout/header"
import { Footer } from "../../layout/footer"
import { Send, Search, ArrowLeft } from "lucide-react"
import { Head } from "@inertiajs/react"


export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [showChatList, setShowChatList] = useState(true)
  const messagesEndRef = useRef(null)

  const chatList = [
    {
      id: 1,
      expertName: "Dr. Sari Herbal",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Baik, coba konsumsi teh jahe 2x sehari",
      time: "10:30",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      expertName: "Dr. Budi Tanaman",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Untuk masalah pencernaan, saya rekomendasikan...",
      time: "09:15",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      expertName: "Dr. Maya Alami",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Terima kasih atas konsultasinya",
      time: "Kemarin",
      unread: 1,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "user",
      content: "Selamat pagi dok, saya ingin konsultasi tentang masalah pencernaan",
      time: "09:00",
    },
    {
      id: 2,
      sender: "expert",
      content: "Selamat pagi! Saya Dr. Sari. Bisa ceritakan lebih detail keluhan yang Anda rasakan?",
      time: "09:02",
    },
    {
      id: 3,
      sender: "user",
      content: "Saya sering merasa mual dan perut kembung setelah makan. Sudah berlangsung sekitar 2 minggu",
      time: "09:05",
    },
    {
      id: 4,
      sender: "expert",
      content:
        "Untuk mengatasi mual dan kembung, saya merekomendasikan teh jahe. Jahe memiliki sifat anti-mual dan dapat membantu pencernaan.",
      time: "09:08",
    },
    {
      id: 5,
      sender: "expert",
      content:
        "Cara membuatnya: iris tipis jahe segar, seduh dengan air panas selama 5-10 menit. Minum 2-3 kali sehari sebelum makan.",
      time: "09:10",
    },
    {
      id: 6,
      sender: "user",
      content: "Baik dok, apakah ada pantangan makanan yang harus saya hindari?",
      time: "09:15",
    },
    {
      id: 7,
      sender: "expert",
      content:
        "Hindari makanan pedas, berlemak, dan berkafein sementara waktu. Perbanyak makan buah dan sayur. Jika dalam 1 minggu belum membaik, konsultasi lagi ya.",
      time: "09:18",
    },
  ]

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, showChatList])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId)
    if (isMobileView) {
      setShowChatList(false)
    }
  }

  const handleBackToList = () => {
    setShowChatList(true)
  }

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat)

  return (
    <>
    <Head title="pesan" />
        <html lang="en">
        
        <body className="flex flex-col min-h-screen bg-background">
            <Header />

            <div className="flex-1 container mx-auto px-4 py-6 flex flex-col">
            <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* Chat List */}
                {(!isMobileView || showChatList) && (
                    <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:col-span-1 h-full"
                    >
                    <Card className="h-full flex flex-col">
                        <CardHeader className="border-b pb-3">
                        <CardTitle>Pesan</CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input placeholder="Cari percakapan..." className="pl-10" />
                        </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                        <div className="divide-y">
                            {chatList.map((chat) => (
                            <motion.div
                                key={chat.id}
                                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                                className={`p-4 cursor-pointer transition-colors ${
                                selectedChat === chat.id ? "bg-muted" : ""
                                }`}
                                onClick={() => handleChatSelect(chat.id)}
                            >
                                <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <Avatar>
                                    <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                                    <AvatarFallback>{chat.expertName[0]}</AvatarFallback>
                                    </Avatar>
                                    {chat.online && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                    <p className="font-medium truncate">{chat.expertName}</p>
                                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <Badge variant="destructive" className="text-xs">
                                    {chat.unread}
                                    </Badge>
                                )}
                                </div>
                            </motion.div>
                            ))}
                        </div>
                        </CardContent>
                    </Card>
                    </motion.div>
                )}

                {/* Chat Window */}
                {(!isMobileView || !showChatList) && (
                    <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 h-full"
                    >
                    <Card className="h-full flex flex-col">
                        {/* Chat Header */}
                        <CardHeader className="border-b py-3 px-4">
                        <div className="flex items-center space-x-3">
                            {isMobileView && (
                            <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            )}
                            <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>DS</AvatarFallback>
                            </Avatar>
                            <div>
                            <CardTitle className="text-lg">{selectedChatData?.expertName || "Dr. Sari Herbal"}</CardTitle>
                            <p className="text-sm text-muted-foreground">Online</p>
                            </div>
                        </div>
                        </CardHeader>

                        {/* Messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg, index) => (
                            <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                            <div
                                className={`max-w-xs lg:max-w-md ${
                                msg.sender === "user" ? "chat-bubble-sent" : "chat-bubble-received"
                                }`}
                            >
                                <p className="text-sm">{msg.content}</p>
                                <p
                                className={`text-xs mt-1 ${
                                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                }`}
                                >
                                {msg.time}
                                </p>
                            </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Message Input */}
                        <div className="border-t p-4">
                        <form onSubmit={handleSendMessage} className="flex space-x-2">
                            <Input
                            placeholder="Ketik pesan..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="flex-1"
                            />
                            <Button type="submit" disabled={!message.trim()}>
                            <Send className="h-4 w-4" />
                            </Button>
                        </form>
                        </div>
                    </Card>
                    </motion.div>
                )}
                </div>
            </div>
            </div>

            <Footer />
        </body>
        </html>
    </>
  )
}
