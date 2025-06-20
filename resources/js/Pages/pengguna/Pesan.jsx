"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Header } from "../../layout/header"
import { Footer } from "../../layout/footer"
import { Send, Search, ArrowLeft, Image as ImageIcon, X, Loader2, MoreVertical, Trash2, Bell } from "lucide-react"
import { Head, router, usePage } from "@inertiajs/react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { route } from "ziggy-js"
import axios from 'axios'

export default function ChatPage() {
  const [selectedChat, setSelectedChat] = useState(null)
  const [message, setMessage] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)
  const [showChatList, setShowChatList] = useState(true)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const {chatList,chatMessages,user} = usePage().props
  const [chatMessagesState, setChatMessagesState] = useState(chatMessages || {});
  const [currentMessages, setCurrentMessages] = useState([]);
  const pollingIntervalRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const chatContainerRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const hasNewMessagesRef = useRef(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const fileInputRef = useRef(null);
  const [loadingImages, setLoadingImages] = useState({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [deletingMessage, setDeletingMessage] = useState(null);

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

  // Polling effect
  useEffect(() => {
    if (selectedChat) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }

      pollingIntervalRef.current = setInterval(() => {
        axios.get(route('pesan.latest'), {
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

  // Add polling for unread counts
  useEffect(() => {
    const fetchUnreadCounts = () => {
      axios.get(route('pengguna.notifications.get'))
        .then(response => {
          console.log('Notifications response:', response.data); // Debug
          const counts = {};
          response.data.notifications
            .filter(n => n.type === 'new_message' && !n.is_read)
            .forEach(n => {
              counts[n.related_id] = (counts[n.related_id] || 0) + 1;
            });
          console.log('Unread counts:', counts); // Debug
          setUnreadCounts(counts);
        })
        .catch(error => {
          console.error('Error fetching unread counts:', error);
        });
    };

    // Initial fetch
    fetchUnreadCounts();

    // Set up polling
    const interval = setInterval(fetchUnreadCounts, 5000);

    return () => clearInterval(interval);
  }, []); // Remove selectedChat dependency to keep polling active

  // Mark notifications as read when chat is opened
  useEffect(() => {
    if (selectedChat) {
      axios.post(route('pengguna.notifications.read-all'))
        .then(() => {
          setUnreadCounts(prev => ({
            ...prev,
            [selectedChat]: 0
          }));
        })
        .catch(error => {
          console.error('Error marking notifications as read:', error);
        });
    }
  }, [selectedChat]);

  // Filter chat list based on search query
  const filteredChatList = chatList.filter(chat => 
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
  
    if (!message.trim() && !selectedImage) return;
  
    const formData = new FormData();
    formData.append('consultation_id', selectedChat);
    if (message.trim()) {
      formData.append('message', message.trim());
    }
    if (selectedImage) {
      formData.append('image', selectedImage);
    }
  
    router.post(route('pesan.kirim'), formData, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setMessage("");
        setSelectedImage(null);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
        }
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(e);
    }
  }

  const handleChatSelect = (chatId) => {
    setSelectedChat(chatId);
    lastMessageCountRef.current = 0;
    setIsLoadingMessages(true);
  
    const messages = chatMessagesState[chatId] || chatMessages[chatId] || [];
    setCurrentMessages(messages);
  
    if (isMobileView) {
      setShowChatList(false);
    }

    // Scroll to bottom when selecting a new chat
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoadingMessages(false);
    }, 100);
  };

  const handleBackToList = () => {
    setShowChatList(true)
  }

  const selectedChatData = chatList.find((chat) => chat.id === selectedChat)

  const handleImageLoad = (messageId) => {
    setLoadingImages(prev => ({
      ...prev,
      [messageId]: false
    }));
  };

  // Handle delete message
  const handleDeleteMessage = (message) => {
    setDeletingMessage(message);
  };

  const confirmDeleteMessage = () => {
    axios.delete(route('pesan.delete'), {
      data: { message_id: deletingMessage.id }
    })
    .then(response => {
      // Update current messages state
      setCurrentMessages(prev => 
        prev.filter(msg => msg.id !== deletingMessage.id)
      );
      
      // Update chat messages state
      setChatMessagesState(prev => ({
        ...prev,
        [selectedChat]: (prev[selectedChat] || []).filter(msg => msg.id !== deletingMessage.id)
      }));
      
      setDeletingMessage(null);
    })
    .catch(error => {
      console.error('Error deleting message:', error);
      setDeletingMessage(null);
    });
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <>
      <Head title="pesan" />

          <main className="flex flex-col min-h-screen bg-background">
            <Header />

          <div className="flex-1 container mx-auto px-2 sm:px-4 py-4 sm:py-6 flex flex-col">
            <div className="flex-1 flex flex-col h-[calc(100vh-200px)]">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 h-full">
                {/* Chat List */}
                {(!isMobileView || showChatList) && (
                  <motion.div
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:col-span-1 h-full"
                  >
                    <Card className="h-full flex flex-col">
                      <CardHeader className="border-b pb-3">
                        <CardTitle className="text-lg">Pesan</CardTitle>
                        <div className="relative mt-2">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            placeholder="Cari berdasarkan topik konsultasi..." 
                            className="pl-10 w-full"
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
                              className={`p-3 sm:p-4 cursor-pointer transition-colors ${
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
                                  {unreadCounts[chat.id] > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                      {unreadCounts[chat.id]}
                                    </span>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <p className="font-medium truncate text-sm sm:text-base">{chat.expertName}</p>
                                    <span className="text-xs text-muted-foreground">{chat.time}</span>
                                  </div>
                                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
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
                          <CardHeader className="border-b py-3 px-3 sm:px-4">
                            <div className="flex items-center space-x-3">
                              {isMobileView && (
                                <Button variant="ghost" size="icon" onClick={handleBackToList} className="mr-1">
                                  <ArrowLeft className="h-5 w-5" />
                                </Button>
                              )}
                              <Avatar>
                                <AvatarImage src={selectedChatData?.avatar || "/placeholder.svg"} />
                                <AvatarFallback>{selectedChatData?.expertName?.[0] || "U"}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base sm:text-lg truncate">
                                  {selectedChatData?.expertName}
                                </CardTitle>
                              </div>
                            </div>
                          </CardHeader>

                          {/* Messages */}
                          <CardContent 
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 max-h-[calc(100vh-300px)]"
                          >
                            {isLoadingMessages ? (
                              <div className="flex justify-center items-center h-full">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              </div>
                            ) : (
                              currentMessages.map((msg, index) => (
                                <motion.div
                                  key={msg.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                  <div className="relative">
                                    <div
                                      className={`max-w-[280px] sm:max-w-xs lg:max-w-md p-3 rounded-lg break-words ${
                                        msg.sender === "user"
                                          ? "bg-primary text-primary-foreground ml-auto"
                                          : "bg-muted text-foreground"
                                      }`}
                                    >
                                      {msg.image && (
                                        <div className="mb-2 relative">
                                          {loadingImages[msg.id] !== false && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                                              <Loader2 className="h-8 w-8 animate-spin text-white" />
                                            </div>
                                          )}
                                          <img
                                            src={msg.image}
                                            alt="Shared image"
                                            className="max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                            style={{ maxHeight: '200px' }}
                                            onClick={() => setFullscreenImage(msg.image)}
                                            onLoad={() => handleImageLoad(msg.id)}
                                          />
                                        </div>
                                      )}
                                      {msg.content && (
                                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                      )}
                                      <p
                                        className={`text-xs mt-1 ${
                                          msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                                        }`}
                                      >
                                        {msg.time}
                                      </p>
                                    </div>
                                    
                                    {/* Message actions for user's own messages only - Always visible */}
                                    {msg.sender_id === user.id && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteMessage(msg)}
                                        className="absolute -top-2 -right-2 h-6 w-6 bg-background border shadow-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </motion.div>
                              ))
                            )}
                            <div ref={messagesEndRef} />
                          </CardContent>

                          {/* Fullscreen Image Modal */}
                          <AnimatePresence>
                            {fullscreenImage && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                                onClick={() => setFullscreenImage(null)}
                              >
                                <button
                                  className="absolute top-4 right-4 text-white hover:text-gray-300"
                                  onClick={() => setFullscreenImage(null)}
                                >
                                  <X className="h-6 w-6" />
                                </button>
                                <img
                                  src={fullscreenImage}
                                  alt="Fullscreen"
                                  className="max-h-[90vh] max-w-[90vw] object-contain"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Message Input */}
                          <div className="border-t p-3 sm:p-4 bg-background w-full">
                            <form onSubmit={handleSendMessage} className="flex items-end space-x-2 w-full">
                              <Textarea
                                ref={textareaRef}
                                placeholder="Ketik pesan..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1 min-w-0 resize-none overflow-y-hidden"
                                rows={1}
                              />
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className="h-10 w-10 flex-shrink-0"
                              >
                                <ImageIcon className="h-5 w-5" />
                              </Button>
                              <Button type="submit" disabled={!message.trim() && !selectedImage} className="h-10 px-4 flex-shrink-0">
                                <Send className="h-4 w-4" />
                              </Button>
                            </form>
                            {selectedImage && (
                              <div className="mt-2 relative inline-block">
                                <img
                                  src={URL.createObjectURL(selectedImage)}
                                  alt="Selected"
                                  className="h-20 w-20 object-cover rounded"
                                />
                                <button
                                  onClick={() => setSelectedImage(null)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  ×
                                </button>
                              </div>
                            )}
                          </div>
                          </>
                        ) : (
                          <div className="flex flex-col justify-center items-center h-full text-muted-foreground py-5 px-4 text-center">
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

            <Footer />

        {/* Delete Message Confirmation */}
        <AlertDialog open={!!deletingMessage} onOpenChange={() => setDeletingMessage(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Hapus Pesan</AlertDialogTitle>
              <AlertDialogDescription>
                Apakah Anda yakin ingin menghapus pesan ini? Tindakan ini tidak dapat dibatalkan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setDeletingMessage(null)}>
                Batal
              </Button>
              <Button variant="destructive" onClick={confirmDeleteMessage}>
                Hapus
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </>
  )
}
