"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import axios from "axios";

export function AdminHeader() {
    const { user } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    // Fetch notifications
    useEffect(() => {
        if (user && user.role === 'ahli') {
            const fetchNotifications = () => {
                axios.get(route('ahli.notifications.get'))
                    .then(response => {
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
            axios.post(route('ahli.notifications.read-all'))
                .then(() => {
                    setUnreadCount(0);
                    setNotifications(prev => 
                        prev.map(n => ({ ...n, is_read: true }))
                    );
                });
        }
    };

    const handleDeleteAllNotifications = () => {
        axios.delete(route('ahli.notifications.delete-all'))
            .then(() => {
                setNotifications([]);
                setUnreadCount(0);
            })
            .catch(error => {
                console.error('Error deleting all notifications:', error);
            });
    };

    const handleDeleteNotification = (notificationId) => {
        axios.delete(route('ahli.notifications.delete', notificationId))
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

    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        >
            <div className="flex h-16 items-center justify-between px-6">
                <motion.div
                    className="flex items-center  gap-2 lg:gap-4"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="flex items-center space-x-2">
                            <motion.div
                                className="h-8 w-8 rounded-full bg-primary"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            ></motion.div>
                            <span className="text-xl font-bold text-primary hidden md:inline-block">
                                HerbalCare Admin
                            </span>
                            <div className="ml-[50px] md:hidden">
                                <span className="text-xl font-bold text-primary ">
                                    HC
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    className="flex items-center gap-4"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                >
                    {/* Notification Button - Only show for ahli */}
                    {user && user.role === 'ahli' && (
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
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </motion.div>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Button
                                    variant="ghost"
                                    className="flex items-center gap-2 px-2"
                                >
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">
                                            {user.nama}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                    <motion.div
                                        animate={{ rotate: 0 }}
                                        whileHover={{ rotate: 180 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    </motion.div>
                                </Button>
                            </motion.div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <DropdownMenuItem asChild></DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-500 focus:text-red-500 w-full">
                                    <Button
                                        onClick={() =>
                                            router.post(route("logout"))
                                        }
                                        variant="destructive"
                                        className="w-full"
                                    >
                                        Logout
                                    </Button>
                                </DropdownMenuItem>
                            </motion.div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </motion.div>
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
