"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Link, usePage } from "@inertiajs/react"
import { ChevronLeft, Menu, X, MessageSquare, CheckCircle, Calendar, User, Settings, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { route } from "ziggy-js"
import axios from "axios"

export function ExpertSidebar({ activeLink = "/ahli/dashboard" }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  const { user } = usePage().props

  // Fetch notifications
  useEffect(() => {
    if (user && user.role === 'ahli') {
      const fetchNotifications = () => {
        axios.get(route('ahli.notifications.get'))
          .then(response => {
            setNotifications(response.data.notifications)
            setUnreadCount(response.data.unread_count)
          })
          .catch(error => {
            console.error('Error fetching notifications:', error)
          })
      }

      // Initial fetch
      fetchNotifications()

      // Set up polling
      const interval = setInterval(fetchNotifications, 5000)

      return () => clearInterval(interval)
    }
  }, [user])

  // Mark notifications as read when opening dialog
  const handleOpenNotifications = () => {
    setShowNotifications(true)
    if (unreadCount > 0) {
      axios.post(route('ahli.notifications.read-all'))
        .then(() => {
          setUnreadCount(0)
          setNotifications(prev => 
            prev.map(n => ({ ...n, is_read: true }))
          )
        })
    }
  }

  const sidebarItems = [
    {
      label: "Dashboard",
      href: route('ahli-dashboard-acount'),
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Overview konsultasi",
      badge: null,
    },
    {
      label: "Profile",
      href: route('ahli-profile'),
      icon: <User className="h-4 w-4" />,
      description: "Profile Akun",
      badge: null,
    },
    {
      label: "Konfirmasi",
      href: route('ahli-konfirmasi'),
      icon: <CheckCircle className="h-4 w-4" />,
      description: "Permintaan konsultasi",
      badge: null,
    },
    {
      label: "Pesan",
      href: route('ahli-pesan'),
      icon: <MessageSquare className="h-4 w-4" />,
      description: "Chat dengan pasien",
      badge: null
    },
  ]

  const toggleCollapsed = () => {
    setCollapsed(!collapsed)
  }

  const toggleMobile = () => {
    setMobileOpen(!mobileOpen)
  }

  const closeMobile = () => {
    setMobileOpen(false)
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-20 left-4 z-50 md:hidden bg-background shadow-lg"
        onClick={toggleMobile}
      >
        <AnimatePresence mode="wait">
          {mobileOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden "
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 z-50 h-screen bg-card border-r shadow-lg flex flex-col",
          "md:relative md:z-0",
          // Mobile: hidden by default, show when mobileOpen is true
          mobileOpen ? "translate-x-0 top-16" : "-translate-x-full top-16",
          // Desktop: always visible
          "md:translate-x-0 md:top-0 md:sticky md:top-0",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <AnimatePresence mode="wait">
            {!collapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-lg font-bold text-emerald-600">Expert Panel</span>
                  <p className="text-xs text-muted-foreground">Dr. Sari Herbal</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center w-full"
              >
                <div className="h-8 w-8 rounded-full bg-emerald-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Toggle Button */}
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={toggleCollapsed}>
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => {
              const isActive = activeLink === item.href

              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    onClick={closeMobile}
                    className={cn(
                      "flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-emerald-600 text-white shadow-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                      {item.icon}
                    </motion.div>

                    <AnimatePresence>
                      {!collapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 min-w-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{item.label}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="ml-auto">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
              )
            })}

            {/* Notification Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sidebarItems.length * 0.1, duration: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={handleOpenNotifications}
                className={cn(
                  "w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative",
                  "text-muted-foreground hover:text-foreground hover:bg-muted",
                  collapsed && "justify-center px-2",
                )}
              >
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0 relative">
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </motion.div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">Notifikasi</span>
                        {unreadCount > 0 && (
                          <Badge variant="destructive" className="ml-auto">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">Pesan dan pemberitahuan</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </nav>
      </motion.aside>

      {/* Notifications Dialog */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Notifikasi</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.is_read ? 'bg-muted' : 'bg-primary/10'
                    }`}
                  >
                    <h4 className="font-medium">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Tidak ada notifikasi
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
