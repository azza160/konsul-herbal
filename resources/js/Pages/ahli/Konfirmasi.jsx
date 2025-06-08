"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ExpertSidebar } from "../../layout/ahli-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { Breadcrumb } from "../../components/breadcrump";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, CheckCircle, Clock, X, Check,Search } from "lucide-react";
import { Head } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function ConsultationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("terbaru");
    const [confirmModal, setConfirmModal] = useState({
        open: false,
        consultation: null,
        action: null,
    });

    const sidebarItems = [
        {
            label: "Dashboard",
            href: "/expert/dashboard",
            icon: <MessageSquare className="h-4 w-4" />,
        },
        {
            label: "Konfirmasi Konsultasi",
            href: "/expert/consultations",
            icon: <CheckCircle className="h-4 w-4" />,
        },
        {
            label: "Pesan",
            href: "/expert/messages",
            icon: <MessageSquare className="h-4 w-4" />,
        },
    ];

    const breadcrumbItems = [
        { label: "Expert", href: "/expert" },
        { label: "Konfirmasi Konsultasi" },
    ];

    const consultations = [
        {
            id: 1,
            patientName: "Sari Dewi",
            topic: "Masalah Pencernaan",
            status: "pending",
            requestTime: "2024-01-15 10:30",
            description: "Sering merasa mual dan perut kembung setelah makan",
        },
        {
            id: 2,
            patientName: "Budi Santoso",
            topic: "Nyeri Sendi",
            status: "pending",
            requestTime: "2024-01-15 09:15",
            description:
                "Nyeri pada lutut dan siku, terutama saat cuaca dingin",
        },
        {
            id: 3,
            patientName: "Maya Putri",
            topic: "Insomnia",
            status: "pending",
            requestTime: "2024-01-15 08:45",
            description: "Sulit tidur dan sering terbangun di malam hari",
        },
        {
            id: 4,
            patientName: "Ahmad Rahman",
            topic: "Hipertensi",
            status: "pending",
            requestTime: "2024-01-14 16:20",
            description:
                "Tekanan darah tinggi, ingin mencoba pengobatan herbal",
        },
        {
            id: 5,
            patientName: "Rina Sari",
            topic: "Migrain",
            status: "pending",
            requestTime: "2024-01-14 14:10",
            description: "Sering sakit kepala sebelah, terutama saat stress",
        },
    ];

    const handleAction = (consultation, action) => {
        setConfirmModal({ open: true, consultation, action });
    };

    const confirmAction = () => {
        console.log(
            `${confirmModal.action} consultation:`,
            confirmModal.consultation?.id
        );
        setConfirmModal({ open: false, consultation: null, action: null });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        },
    };

    return (
        <>
            <Head title="konfirmasi" />
            <div className="flex flex-col min-h-screen bg-background">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ExpertSidebar activeLink={route("ahli-konfirmasi")} />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {/* Breadcrumb */}
                        <Breadcrumb items={breadcrumbItems} />

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-8"
                        >
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Konfirmasi Konsultasi
                            </h1>
                            <p className="text-muted-foreground">
                                Kelola permintaan konsultasi dari pasien
                            </p>
                        </motion.div>

                        {/* Search and Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex flex-col md:flex-row gap-4 mb-6"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                    placeholder="Cari artikel..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-full md:w-48">
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="terbaru">
                                        Terbaru
                                    </SelectItem>
                                    <SelectItem value="terlama">
                                        Terlama
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </motion.div>

                        {/* Consultations Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center space-x-2">
                                        <Clock className="h-5 w-5" />
                                        <span>
                                            Konsultasi Pending (
                                            {consultations.length})
                                        </span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="overflow-x-auto rounded-md border">
                                        <Table className="w-full text-sm text-left border-collapse">
                                            <TableHeader className="bg-muted/40">
                                                <TableRow>
                                                    <TableHead className="p-4">
                                                        Nama Pasien
                                                    </TableHead>
                                                    <TableHead className="p-4">
                                                        Topik Konsultasi
                                                    </TableHead>
                                                    <TableHead className="p-4">
                                                        Deskripsi
                                                    </TableHead>
                                                    <TableHead className="p-4">
                                                        Waktu Request
                                                    </TableHead>
                                                    <TableHead className="p-4">
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="p-4">
                                                        Aksi
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                <AnimatePresence>
                                                    {consultations.map(
                                                        (
                                                            consultation,
                                                            index
                                                        ) => (
                                                            <motion.tr
                                                                key={
                                                                    consultation.id
                                                                }
                                                                initial={{
                                                                    opacity: 0,
                                                                    x: -20,
                                                                }}
                                                                animate={{
                                                                    opacity: 1,
                                                                    x: 0,
                                                                }}
                                                                exit={{
                                                                    opacity: 0,
                                                                    x: 20,
                                                                }}
                                                                transition={{
                                                                    delay:
                                                                        index *
                                                                        0.1,
                                                                    duration: 0.3,
                                                                }}
                                                                whileHover={{
                                                                    backgroundColor:
                                                                        "hsl(var(--muted))",
                                                                }}
                                                                className="transition-colors duration-200 even:bg-muted/10 hover:bg-muted/20"
                                                            >
                                                                <TableCell className="font-medium p-4">
                                                                    {
                                                                        consultation.patientName
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="p-4">
                                                                    {
                                                                        consultation.topic
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="p-4 text-muted-foreground">
                                                                    <p
                                                                        className="truncate"
                                                                        title={
                                                                            consultation.description
                                                                        }
                                                                    >
                                                                        {
                                                                            consultation.description
                                                                        }
                                                                    </p>
                                                                </TableCell>
                                                                <TableCell className="p-4">
                                                                    {
                                                                        consultation.requestTime
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="p-4">
                                                                    <motion.span
                                                                        initial={{
                                                                            scale: 0,
                                                                        }}
                                                                        animate={{
                                                                            scale: 1,
                                                                        }}
                                                                        transition={{
                                                                            delay:
                                                                                index *
                                                                                    0.1 +
                                                                                0.2,
                                                                            type: "spring",
                                                                        }}
                                                                        className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800"
                                                                    >
                                                                        Pending
                                                                    </motion.span>
                                                                </TableCell>
                                                                <TableCell className="p-4">
                                                                    <div className="flex space-x-2">
                                                                        <motion.div
                                                                            whileHover={{
                                                                                scale: 1.1,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.9,
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="default"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleAction(
                                                                                        consultation,
                                                                                        "accept"
                                                                                    )
                                                                                }
                                                                                className="hover:shadow-md transition-shadow duration-200"
                                                                            >
                                                                                <Check className="h-4 w-4 mr-1" />
                                                                                Terima
                                                                            </Button>
                                                                        </motion.div>
                                                                        <motion.div
                                                                            whileHover={{
                                                                                scale: 1.1,
                                                                            }}
                                                                            whileTap={{
                                                                                scale: 0.9,
                                                                            }}
                                                                        >
                                                                            <Button
                                                                                variant="destructive"
                                                                                size="sm"
                                                                                onClick={() =>
                                                                                    handleAction(
                                                                                        consultation,
                                                                                        "reject"
                                                                                    )
                                                                                }
                                                                                className="hover:shadow-md transition-shadow duration-200"
                                                                            >
                                                                                <X className="h-4 w-4 mr-1" />
                                                                                Tolak
                                                                            </Button>
                                                                        </motion.div>
                                                                    </div>
                                                                </TableCell>
                                                            </motion.tr>
                                                        )
                                                    )}
                                                </AnimatePresence>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Confirmation Modal */}
                        <AnimatePresence>
                            {confirmModal.open && (
                                <Dialog
                                    open={confirmModal.open}
                                    onOpenChange={(open) =>
                                        setConfirmModal({
                                            open,
                                            consultation: null,
                                            action: null,
                                        })
                                    }
                                >
                                    <DialogContent>
                                        <motion.div
                                            initial={{ scale: 0.9, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0.9, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <DialogHeader>
                                                <DialogTitle>
                                                    {confirmModal.action ===
                                                    "accept"
                                                        ? "Terima Konsultasi"
                                                        : "Tolak Konsultasi"}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    {confirmModal.action ===
                                                    "accept"
                                                        ? `Apakah Anda yakin ingin menerima konsultasi dari ${confirmModal.consultation?.patientName}?`
                                                        : `Apakah Anda yakin ingin menolak konsultasi dari ${confirmModal.consultation?.patientName}?`}
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setConfirmModal({
                                                                open: false,
                                                                consultation:
                                                                    null,
                                                                action: null,
                                                            })
                                                        }
                                                    >
                                                        Batal
                                                    </Button>
                                                </motion.div>
                                                <motion.div
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    <Button
                                                        variant={
                                                            confirmModal.action ===
                                                            "accept"
                                                                ? "default"
                                                                : "destructive"
                                                        }
                                                        onClick={confirmAction}
                                                    >
                                                        {confirmModal.action ===
                                                        "accept"
                                                            ? "Terima"
                                                            : "Tolak"}
                                                    </Button>
                                                </motion.div>
                                            </DialogFooter>
                                        </motion.div>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </>
    );
}
