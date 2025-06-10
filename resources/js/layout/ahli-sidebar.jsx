"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Link } from "@inertiajs/react"
import { ChevronLeft, Menu, X, MessageSquare, CheckCircle, Calendar, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { route } from "ziggy-js"

export function ExpertSidebar({ activeLink = "/ahli/dashboard" }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
      badge:null
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
                            <div>
                              <div className="truncate">{item.label}</div>
                              <div className="text-xs opacity-70 truncate">{item.description}</div>
                            </div>
                            {item.badge && (
                              <Badge
                                variant={isActive ? "secondary" : "destructive"}
                                className="text-xs h-5 min-w-[20px] flex items-center justify-center"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Badge for collapsed state */}
                    {collapsed && item.badge && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge > 9 ? "9+" : item.badge}
                      </div>
                    )}

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicatorExpert"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Tooltip for collapsed state */}
                    {collapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        <div>{item.label}</div>
                        {item.badge && <div className="text-red-500 font-medium">{item.badge} pending</div>}
                      </div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </nav>

        {/* Status Indicator */}
        <div className="border-t p-4">
          <AnimatePresence>
            {!collapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  )
}
