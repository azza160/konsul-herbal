"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ExpertSidebar } from "../../layout/ahli-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { Breadcrumb } from "../../components/breadcrump";
import { Send, Search, ArrowLeft } from "lucide-react"
import { Head, router, usePage } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { route } from "ziggy-js"
import axios from 'axios'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [showChatList, setShowChatList] = useState(true)
  const messagesEndRef = useRef(null)
  const {chatList,chatMessages,user} = usePage().props
  const [chatMessagesState, setChatMessagesState] = useState(chatMessages || {});
  const [currentMessages, setCurrentMessages] = useState([]);
  const pollingIntervalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const hasNewMessagesRef = useRef(false);

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

  const breadcrumbItems = [
    { label: "Ahli", href: route('ahli-dashboard-acount') },
    { label: "Pesan" },
];


  // Polling effect
  useEffect(() => {
    if (selectedChat) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        axios.get(route('ahli-pesan-latest'), {
          params: {
            consultation_id: selectedChat
          }
        })
        .then(response => {
          const newMessages = response.data.messages;
          const previousCount = lastMessageCountRef.current;
          lastMessageCountRef.current = newMessages.length;
          
          // Check if there are new messages
          if (newMessages.length > previousCount) {
            hasNewMessagesRef.current = true;
            setCurrentMessages(newMessages);
            
            // Auto scroll only if we're at the bottom
            const chatContainer = chatContainerRef.current;
            if (chatContainer) {
              const { scrollTop, scrollHeight, clientHeight } = chatContainer;
              const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
              
              if (isAtBottom) {
                setTimeout(() => {
                  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }, 100);
              }
            }
          } else {
            setCurrentMessages(newMessages);
          }
        })
        .catch(error => {
          console.error('Error fetching messages:', error);
        });
      }, 3000);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [selectedChat]);

  // Filter chat list based on search query
  const filteredChatList = chatList.filter(chat => 
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = (e) => {
    e.preventDefault();
  
    if (!message.trim()) return;
  
    router.post(route('ahli-pesan-kirim'), {
      consultation_id: selectedChat,
      message: message.trim(),
    }, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setMessage(""); // Clear input after successful send
        // Scroll to bottom after sending message
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    });
  };

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    lastMessageCountRef.current = 0; // Reset message count when changing chat
  
    const messages = chatMessagesState[chatId] || chatMessages[chatId] || [];
    setCurrentMessages(messages);
  
    if (isMobileView) {
      setShowChatList(false);
    }

    // Scroll to bottom when selecting a new chat
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleBackToList = () => {
    setShowChatList(true)
  }

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat)

  return (
    <>
      <Head title="pesan" />
      <div className="flex flex-col min-h-screen bg-background">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
            <ExpertSidebar activeLink={route("ahli-pesan")} />

            <main  className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />
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
                            <Input 
                                placeholder="Cari berdasarkan topik konsultasi..." 
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-y-auto">
                            <div className="divide-y">
                            {filteredChatList.map((chat) => (
                                <motion.div
                                key={chat.id}
                                whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                                className={`p-4 cursor-pointer transition-colors ${
                                    selectedChat === chat.id ? "bg-muted border-l-4 border-primary" : "hover:bg-muted/50"
                                }`}
                                onClick={() => handleChatSelect(chat.id)}
                                >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                    <Avatar>
                                        <AvatarImage src={chat.avatar || "/placeholder.svg"} />
                                        <AvatarFallback>{chat.expertName[0]}</AvatarFallback>
                                    </Avatar>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium truncate">{chat.expertName}</p>
                                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
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
                        <Card className="h-full flex flex-col max-h-[calc(100vh-200px)]">
                        {/* Chat Header */}
                        {
                            selectedChat ? (
                            <>
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
                                    <CardTitle className="text-lg">
                                    {selectedChatData?.expertName}
                                    </CardTitle>
                                </div>
                                </div>
                            </CardHeader>

                            {/* Messages */}
                            <CardContent 
                                ref={chatContainerRef}
                                className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[calc(100vh-300px)]"
                            >
                                {currentMessages.map((msg, index) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                    className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                                        msg.sender === "user"
                                        ? "bg-primary text-primary-foreground ml-auto"
                                        : "bg-muted text-foreground"
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
                            <div className="border-t p-4 bg-background w-full">
                                <form onSubmit={handleSendMessage} className="flex items-center space-x-2 w-full">
                                <Input
                                    placeholder="Ketik pesan..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className=" h-10 "
                                />
                                <Button type="submit" disabled={!message.trim()} className="h-10 px-4">
                                    <Send className="h-4 w-4" />
                                </Button>
                                </form>
                            </div>
                            </>
                            ) : (
                            <div className="flex flex-col justify-center items-center h-full text-muted-foreground py-5">
                                <p>Pilih percakapan dari daftar untuk mulai mengirim pesan.</p>
                            </div>
                            )
                        }
                        </Card>
                    </motion.div>
                    )}
                </div>
                </div>
            </div>

            </main>
        </div>
      </div>
  
       
    </>
  )
}
