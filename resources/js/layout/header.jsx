"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Menu, X, Check, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Link,usePage,router } from "@inertiajs/react";
import { route } from "ziggy-js";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const {user} = usePage().props ;

    const menuItems = [
        { label: "Beranda", href: route("beranda") },
        { label: "Artikel", href: route("list-artikel") },
        { label: "Ahli Herbal", href: route("list-ahli-herbal") },
        { label: "Pesan", href: route("pesan") },
        { label: "Profile", href: route("profile") },

    ];

    const notifications = [
        {
            id: 1,
            title: "Konsultasi Baru",
            message: "Dr. Sari Herbal telah merespons konsultasi Anda",
            time: "5 menit yang lalu",
            read: false,
            type: "consultation",
        },
        {
            id: 2,
            title: "Artikel Baru",
            message:
                "Artikel 'Manfaat Kunyit untuk Kesehatan' telah dipublikasi",
            time: "1 jam yang lalu",
            read: false,
            type: "article",
        },
        {
            id: 3,
            title: "Reminder",
            message: "Jangan lupa minum teh jahe sesuai anjuran dokter",
            time: "2 jam yang lalu",
            read: true,
            type: "reminder",
        },
        {
            id: 4,
            title: "Konsultasi Selesai",
            message: "Konsultasi dengan Dr. Maya Alami telah selesai",
            time: "1 hari yang lalu",
            read: true,
            type: "consultation",
        },
    ];

    const unreadCount = notifications.filter((n) => !n.read).length;

    const menuVariants = {
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
        open: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.3,
                ease: "easeInOut",
            },
        },
    };

    const itemVariants = {
        closed: { opacity: 0, x: -20 },
        open: { opacity: 1, x: 0 },
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "consultation":
                return <User className="h-4 w-4 text-blue-600" />;
            case "article":
                return <Bell className="h-4 w-4 text-green-600" />;
            case "reminder":
                return <Clock className="h-4 w-4 text-orange-600" />;
            default:
                return <Bell className="h-4 w-4 text-gray-600" />;
        }
    };

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                className="h-8 w-8 rounded-full bg-primary"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                            <span className="text-xl font-bold text-primary">
                                HerbalCare
                            </span>
                        </Link>
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {menuItems.map((item, index) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: index * 0.1,
                                    duration: 0.3,
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    href={item.href}
                                    className="text-sm font-medium transition-colors hover:text-primary duration-200"
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Enhanced Notification */}
                        {user && (
                            <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="relative"
                                    onClick={() => setShowNotifications(true)}
                                >
                                    <motion.div
                                        whileHover={{ rotate: 15 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <Bell className="h-5 w-5" />
                                    </motion.div>
                                    <AnimatePresence>
                                        {unreadCount > 0 && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 500,
                                                    damping: 30,
                                                }}
                                                className="absolute -top-1 -right-1"
                                            >
                                                <Badge className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center bg-red-500 text-white border-2 border-background">
                                                    {unreadCount > 9
                                                        ? "9+"
                                                        : unreadCount}
                                                </Badge>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </Button>
                            </motion.div>
                        )}

                        {/* Login Button */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="hidden md:inline-flex"
                        >
                            {user ? (
    <Button
      onClick={() => router.post(route('logout'))}
      variant="destructive"
    >
      Logout
    </Button>
  ) : (
    <Link href={route('login')}>
      <Button>Login</Button>
    </Link>
  )}
                        </motion.div>

                        {/* Mobile menu button */}
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <AnimatePresence mode="wait">
                                    {isMenuOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{
                                                rotate: -90,
                                                opacity: 0,
                                            }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: 90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <X className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="menu"
                                            initial={{ rotate: 90, opacity: 0 }}
                                            animate={{ rotate: 0, opacity: 1 }}
                                            exit={{ rotate: -90, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Menu className="h-5 w-5" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </Button>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.nav
                            variants={menuVariants}
                            initial="closed"
                            animate="open"
                            exit="closed"
                            className="md:hidden border-t py-4 overflow-hidden"
                        >
                            <div className="flex flex-col space-y-3">
                                {menuItems.map((item, index) => (
                                    <motion.div
                                        key={item.label}
                                        variants={itemVariants}
                                        initial="closed"
                                        animate="open"
                                        transition={{ delay: index * 0.1 }}
                                        whileHover={{ x: 10 }}
                                    >
                                        <Link
                                            href={item.href}
                                            className="text-sm font-medium transition-colors hover:text-primary px-2 py-1 block"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    variants={itemVariants}
                                    initial="closed"
                                    animate="open"
                                    transition={{
                                        delay: menuItems.length * 0.1,
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-4"
                                >
                                  {
                                    user ? (
                                      <Button
                                      onClick={() => router.post(route('logout'))}
                                      variant="destructive"
                                    >
                                      Logout
                                    </Button>
                                    ) :
                                    <Button asChild className="w-full">
                                    <Link href={route('login')}>Login</Link>
                                </Button>
                                  }
                                   
                                </motion.div>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>

            {/* Notifications Modal */}
            <AnimatePresence>
                {showNotifications && (
                    <Dialog
                        open={showNotifications}
                        onOpenChange={setShowNotifications}
                    >
                        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        Notifikasi
                                        {unreadCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="text-xs"
                                            >
                                                {unreadCount} baru
                                            </Badge>
                                        )}
                                    </DialogTitle>
                                </DialogHeader>

                                <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-center py-8 text-muted-foreground"
                                        >
                                            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                            <p>Tidak ada notifikasi</p>
                                        </motion.div>
                                    ) : (
                                        notifications.map(
                                            (notification, index) => (
                                                <motion.div
                                                    key={notification.id}
                                                    initial={{
                                                        opacity: 0,
                                                        x: -20,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        x: 0,
                                                    }}
                                                    transition={{
                                                        delay: index * 0.1,
                                                    }}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                        notification.read
                                                            ? "bg-muted/30 border-muted"
                                                            : "bg-primary/5 border-primary/20 shadow-sm"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {getNotificationIcon(
                                                                notification.type
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2">
                                                                <h4
                                                                    className={`text-sm font-medium ${
                                                                        notification.read
                                                                            ? "text-muted-foreground"
                                                                            : "text-foreground"
                                                                    }`}
                                                                >
                                                                    {
                                                                        notification.title
                                                                    }
                                                                </h4>
                                                                {!notification.read && (
                                                                    <motion.div
                                                                        initial={{
                                                                            scale: 0,
                                                                        }}
                                                                        animate={{
                                                                            scale: 1,
                                                                        }}
                                                                        className="w-2 h-2 bg-primary rounded-full"
                                                                    />
                                                                )}
                                                            </div>
                                                            <p
                                                                className={`text-xs mt-1 ${
                                                                    notification.read
                                                                        ? "text-muted-foreground"
                                                                        : "text-foreground/80"
                                                                }`}
                                                            >
                                                                {
                                                                    notification.message
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {
                                                                    notification.time
                                                                }
                                                            </p>
                                                        </div>
                                                        {notification.read && (
                                                            <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )
                                        )
                                    )}
                                </div>

                                {notifications.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="mt-4 pt-4 border-t"
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => {
                                                console.log("Mark all as read");
                                                setShowNotifications(false);
                                            }}
                                        >
                                            Tandai Semua Sudah Dibaca
                                        </Button>
                                    </motion.div>
                                )}
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}
            </AnimatePresence>
        </motion.header>
    );
}
