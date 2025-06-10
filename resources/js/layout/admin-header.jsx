"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, User, LogOut, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export function AdminHeader() {
    const { user } = usePage().props;

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
        </motion.header>
    );
}
