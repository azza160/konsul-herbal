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
import { Link, usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const { user } = usePage().props;
    const currentUrl = usePage().url;

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
        </motion.header>
    );
}
