"use client";

import { useState, useEffect } from "react";
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
import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const { user } = usePage().props;
    const currentUrl = usePage().url;

    // Fetch notifications
    useEffect(() => {
        if (user && (user.role === 'pengguna' || user.role === 'ahli')) {
            const fetchNotifications = () => {
                const routeName = user.role === 'pengguna' ? 'pengguna.notifications.get' : 'ahli.notifications.get';
                console.log('Fetching notifications for user:', user.role, 'using route:', routeName);
                
                axios.get(route(routeName))
                    .then(response => {
                        console.log('Notifications response:', response.data);
                        setNotifications(response.data.notifications);
                        setUnreadCount(response.data.unread_count);
                    })
                    .catch(error => {
                        console.error('Error fetching notifications:', error);
                    });
            };

            // Initial fetch
            fetchNotifications();                                   

            // Set up polling
            const interval = setInterval(fetchNotifications, 5000);

            return () => clearInterval(interval);
        }
    }, [user]);

    // Mark notifications as read when opening dialog
    const handleOpenNotifications = () => {
        setShowNotifications(true);
        if (unreadCount > 0) {
            const routeName = user.role === 'pengguna' ? 'pengguna.notifications.read-all' : 'ahli.notifications.read-all';
            axios.post(route(routeName))
                .then(() => {
                    setUnreadCount(0);
                    setNotifications(prev => 
                        prev.map(n => ({ ...n, is_read: true }))
                    );
                });
        }
    };

    const handleDeleteAllNotifications = () => {
        const routeName = user.role === 'pengguna' ? 'pengguna.notifications.delete-all' : 'ahli.notifications.delete-all';
        axios.delete(route(routeName))
            .then(() => {
                setNotifications([]);
                setUnreadCount(0);
            })
            .catch(error => {
                console.error('Error deleting all notifications:', error);
            });
    };

    const handleDeleteNotification = (notificationId) => {
        const routeName = user.role === 'pengguna' ? 'pengguna.notifications.delete' : 'ahli.notifications.delete';
        axios.delete(route(routeName, notificationId))
            .then(() => {
                setNotifications(prev => prev.filter(n => n.id !== notificationId));
                if (unreadCount > 0) {
                    setUnreadCount(prev => prev - 1);
                }
            })
            .catch(error => {
                console.error('Error deleting notification:', error);
            });
    };

    const menuItems = [
        { label: "Beranda", href: route("beranda"), routeName: "beranda" },
        { label: "Artikel", href: route("list-artikel"), routeName: "list-artikel" },
        { label: "Ahli Herbal", href: route("list-ahli-herbal"), routeName: "list-ahli-herbal" },
        { label: "Pesan", href: route("pengguna-pesan"), routeName: "pengguna-pesan" },
        { label: "Profile", href: route("profile"), routeName: "profile" },
    ];

    const isActive = (routeName) => {
        // Get the current route name from the URL
        const currentRoute = currentUrl.split('/').filter(Boolean)[0] || 'beranda';
        
        // Special case for beranda (home)
        if (routeName === 'beranda') {
            return currentRoute === '' || currentRoute === 'beranda';
        }
        
        // For other routes, check if the current route matches
        return currentRoute === routeName;
    };

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
                        <Link href={route('beranda')} className="flex items-center space-x-2">
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
                                    className={`text-sm font-medium transition-colors hover:text-primary duration-200 ${
                                        isActive(item.routeName) ? "text-green-600" : ""
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notification Button - Only show for users and experts */}
                        {user && (user.role === 'pengguna' || user.role === 'ahli') && (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleOpenNotifications}
                                    className="relative"
                                >
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {unreadCount}
                                        </span>
                                    )}
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
                                    onClick={() => router.post(route("logout"))}
                                    variant="destructive"
                                >
                                    Logout
                                </Button>
                            ) : (
                                <Link href={route("login")}>
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
                                            className={`text-sm font-medium transition-colors hover:text-primary px-2 py-1 block ${
                                                isActive(item.routeName) ? "text-green-600" : ""
                                            }`}
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
                                    {user ? (
                                        <Button
                                            onClick={() =>
                                                router.post(route("logout"))
                                            }
                                            variant="destructive"
                                        >
                                            Logout
                                        </Button>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link href={route("login")}>
                                                Login
                                            </Link>
                                        </Button>
                                    )}
                                </motion.div>
                            </div>
                        </motion.nav>
                    )}
                </AnimatePresence>
            </div>

            {/* Notifications Dialog */}
            <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <DialogTitle>Notifikasi</DialogTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteAllNotifications}
                                className="text-red-600 hover:text-red-700"
                            >
                                Hapus Semua
                            </Button>
                        </div>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="space-y-4">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-3 rounded-lg relative ${
                                            notification.is_read ? 'bg-muted' : 'bg-primary/10'
                                        }`}
                                    >
                                        <button
                                            onClick={() => handleDeleteNotification(notification.id)}
                                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                        <h4 className="font-medium pr-8">{notification.title}</h4>
                                        <p className="text-sm text-muted-foreground pr-8">
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
        </motion.header>
    );
}
