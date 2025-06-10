"use client";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    CalendarIcon,
    Phone,
    Mail,
    Pencil,
    KeyRound,
    Briefcase,
} from "lucide-react";
import { ExpertSidebar } from "../../layout/ahli-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { useAlert } from "../../components/myalert";
import { Breadcrumb } from "../../components/breadcrump";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function ProfilePage() {
    const { user } = usePage().props;

    const goToEditProfile = () => {
        router.get(route("ahli-profile-edit-acount"));
    };

    const breadcrumbItems = [
        { label: "Ahli Dashboard", href: route("ahli-dashboard-acount") },
        { label: "Profile", href: route("ahli-profile") },
    ];

    const goToChangePassword = () => {
        router.get(route("edit-ahli-password-profile"));
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
    };

    const formatExperience = (experience) => {
        if (!experience) {
            return <p className="text-gray-500 italic">Belum ada pengalaman</p>;
        }

        return experience.split("\n\n").map((paragraph, index) => (
            <p
                key={index}
                className="mb-3 sm:mb-4 text-gray-700 leading-relaxed text-sm sm:text-base"
            >
                {paragraph}
            </p>
        ));
    };

    return (
        <>
            <Head title="profile-ahli" />
            <div className="flex flex-col min-h-screen bg-background">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ExpertSidebar activeLink={route("ahli-profile")} />
                    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-0">
                        <div className="container bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50  mx-auto px-4 py-6">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <motion.div
                            className="w-full"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="shadow-md border-0">
                                <CardHeader className="bg-green-400 text-white rounded-t-lg">
                                    <CardTitle className="text-center text-2xl">
                                        Profil Pengguna
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6 pb-4 px-6">
                                    <div className="flex flex-col items-center mb-6">
                                        <motion.div
                                            variants={itemVariants}
                                            className="mb-4"
                                        >
                                            <Avatar className="h-24 w-24 border-4 border-green-500">
                                                <AvatarImage
                                                    src={
                                                        user.foto ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={user.nama}
                                                />
                                                <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                                                    {user.nama
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                        </motion.div>
                                        <motion.h2
                                            variants={itemVariants}
                                            className="text-2xl font-bold text-green-800"
                                        >
                                            {user.nama}
                                        </motion.h2>
                                        <motion.div variants={itemVariants}>
                                            <Badge
                                                variant="outline"
                                                className="bg-green-100 text-green-800 mt-1"
                                            >
                                                {user.jk}
                                            </Badge>
                                        </motion.div>
                                    </div>

                                    <motion.div
                                        variants={itemVariants}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                                            <Mail className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-green-700 font-medium">
                                                    Email
                                                </p>
                                                <p className="text-gray-700">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                                            <Phone className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-green-700 font-medium">
                                                    Telepon
                                                </p>
                                                <p className="text-gray-700">
                                                    {user.telp}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                                            <CalendarIcon className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-green-700 font-medium">
                                                    Tanggal Lahir
                                                </p>
                                                <p className="text-gray-700">
                                                    {new Date(
                                                        user.tgl_lahir
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        }
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <Briefcase className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                                                </div>
                                                Pengalaman & Perjalanan Karier
                                            </h4>

                                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                                                <div className="prose prose-sm sm:prose-base max-w-none">
                                                    {formatExperience(
                                                        user.pengalaman
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>

                                    <motion.div
                                        variants={itemVariants}
                                        className="flex flex-col sm:flex-row gap-3 mt-6"
                                    >
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={goToEditProfile}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />{" "}
                                            Edit Profil
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                                            onClick={goToChangePassword}
                                        >
                                            <KeyRound className="mr-2 h-4 w-4" />{" "}
                                            Ubah Password
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </main>
                </div>
            </div>
        </>
    );
}
