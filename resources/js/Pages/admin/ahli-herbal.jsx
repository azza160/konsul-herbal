"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { route } from "ziggy-js";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
import { AdminSidebar } from "../../layout/admin-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { Breadcrumb } from "../../components/breadcrump";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    FileText,
    UserCheck,
    Users,
    BarChart3,
    MapPin,
} from "lucide-react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useAlert } from "../../components/myalert";

export default function ArticlesManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("terbaru");
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState("");

    const [deleteModal, setDeleteModal] = useState({
        open: false,
        articleId: null,
    });
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5; // jumlah artikel per halaman

    const breadcrumbItems = [
        { label: "Admin", href: "/admin" },
        { label: "Ahli Herbal" },
    ];

    // Ambil data articles dari props Inertia
    const { usersAhlis, flash } = usePage().props;

    const { showSuccess, AlertContainer } = useAlert();

    useEffect(() => {
        if (flash.success) {
            showSuccess("Berhasil", flash.success);
        }
    }, [flash.success]);

    const filteredAhlis = usersAhlis.filter((ahli) => {
        const cocokCari =
          ahli.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ahli.email.toLowerCase().includes(searchTerm.toLowerCase());
      
        const cocokSpesialisasi =
          selectedSpesialisasi === "" || ahli.spesialisasi === selectedSpesialisasi;
      
        return cocokCari && cocokSpesialisasi;
      });
      

    // Sort (jika kamu punya sorting)
    const sortedAhlis = [...filteredAhlis].sort((a, b) => {
        if (sortBy === "terbaru") {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "terlama") {
            return new Date(a.date) - new Date(b.date);
        } else {
            return 0;
        }
    });

    const handleDelete = (ahliId) => {
        setDeleteModal({ open: true, ahliId });
    };

    const confirmDelete = () => {
        const ahliId = deleteModal.ahliId;
        if (!ahliId) return;

        router.delete(`/admin/ahli-herbal/${ahliId}`, {
            onSuccess: () => {
                setDeleteModal({ open: false, ahliId: null });
            },
            onError: (err) => {
                console.error("Gagal hapus:", err);
            },
        });
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

    // Paginasi hasil filter & sort
    const totalItems = sortedAhlis.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const paginatedAhlis = sortedAhlis.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    useEffect(() => {
        setCurrentPage(1);
      }, [searchTerm, sortBy, selectedSpesialisasi]);
      

    return (
        <>
            <div className="fixed z-[500]">
                <AlertContainer />
            </div>

            <Head title="list-ahli-herbal" />
            <div className="flex flex-col min-h-screen bg-background">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar activeLink={route("ahli-herbal-dashboard")} />

                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {/* Breadcrumb */}
                        <Breadcrumb items={breadcrumbItems} />

                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
                        >
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold">
                                    Kelola Ahli Herbal
                                </h1>
                                <p className="text-muted-foreground">
                                    Kelola semua ahli herbal di platform
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button asChild>
                                    <Link
                                        href={route(
                                            "create-ahli-herbal-dashboard"
                                        )}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Tambah Ahli Herbal
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>

                        {/* Search and Filter */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="flex flex-col md:flex-row gap-4 mb-6"
                        >
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-3" />
                                <Input
                                    placeholder="Cari nama herbal..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-8 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="">

  <select
    id="filterSpesialisasi"
    name="filterSpesialisasi"
    value={selectedSpesialisasi}
    onChange={(e) => setSelectedSpesialisasi(e.target.value)}
    className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
  >
    <option value="">Semua Spesialisasi</option>
    {[...new Set(usersAhlis.map((item) => item.spesialisasi))]
      .filter(Boolean)
      .map((spesialisasi, idx) => (
        <option key={idx} value={spesialisasi}>
          {spesialisasi}
        </option>
      ))}
  </select>
</div>

                        </motion.div>

                        {/* Articles Table */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                        >
                            <Card className="hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <FileText className="h-5 w-5" />
                                        Daftar Ahli Herbal (
                                        {filteredAhlis.length})
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <div className="overflow-x-auto rounded-md border">
                                        {filteredAhlis.length === 0 ? (
                                            <div className="p-6 text-center text-muted-foreground">
                                                Tidak ada ahli ditemukan.
                                            </div>
                                        ) : (
                                            <Table className="w-full text-sm text-left border-collapse">
                                                <TableHeader className="bg-muted/40">
                                                    <TableRow>
                                                        <TableHead className="p-4">
                                                            No
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Foto
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Nama
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Email
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            No Telepon
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Spesialisasi
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Jenis Kelamin
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Tanggal Lahir
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Pengalaman
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Lokasi
                                                        </TableHead>
                                                        <TableHead className="p-4">
                                                            Aksi
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    <AnimatePresence>
                                                        {paginatedAhlis.map(
                                                            (ahli, index) => (
                                                                <motion.tr
                                                                    key={
                                                                        ahli.id
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
                                                                            0.05,
                                                                        duration: 0.25,
                                                                    }}
                                                                    className="transition-colors duration-200 even:bg-muted/10 hover:bg-muted/20"
                                                                >
                                                                    {/* no */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {(currentPage - 1) * perPage + index + 1}
                                                                    </TableCell>

                                                                    {/* Foto */}
                                                                    <TableCell className="p-4">
                                                                        {ahli.foto ? (
                                                                            <img
                                                                                src={
                                                                                    ahli.foto
                                                                                }
                                                                                alt={
                                                                                    ahli.nama
                                                                                }
                                                                                className="w-20 h-14 object-cover rounded-md border"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-muted-foreground italic">
                                                                                Tidak
                                                                                ada
                                                                                foto
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* nama */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.nama || (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* email */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.email || (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* no telp */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.telp || (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* spesialisasi */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.spesialisasi || (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* jk */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.jk || (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* tgl lahir */}
                                                                    <TableCell className="p-4 font-medium">
                                                                        {ahli.tgl_lahir ? (
                                                                            new Intl.DateTimeFormat(
                                                                                "id-ID",
                                                                                {
                                                                                    day: "2-digit",
                                                                                    month: "long",
                                                                                    year: "numeric",
                                                                                }
                                                                            ).format(
                                                                                new Date(
                                                                                    ahli.tgl_lahir
                                                                                )
                                                                            )
                                                                        ) : (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* Deskripsi */}
                                                                    <TableCell className="p-4 text-muted-foreground">
                                                                        {ahli.pengalaman ? (
                                                                            ahli
                                                                                .pengalaman
                                                                                .length >
                                                                            80 ? (
                                                                                ahli.pengalaman.slice(
                                                                                    0,
                                                                                    80
                                                                                ) +
                                                                                "..."
                                                                            ) : (
                                                                                ahli.pengalaman
                                                                            )
                                                                        ) : (
                                                                            <span className="italic text-muted-foreground">
                                                                                Tidak
                                                                                ada
                                                                                pengalaman
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* Lokasi */}
                                                                    <TableCell className="p-4 text-muted-foreground">
                                                                        {ahli.lokasi ? (
                                                                            <span>
                                                                                {ahli.lokasi.alamat.length > 50
                                                                                    ? ahli.lokasi.alamat.slice(0, 50) + '...'
                                                                                    : ahli.lokasi.alamat}
                                                                            </span>
                                                                        ) : (
                                                                            <span className="italic text-muted-foreground">
                                                                                -
                                                                            </span>
                                                                        )}
                                                                    </TableCell>

                                                                    {/* Aksi */}
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
                                                                                    variant="outline"
                                                                                    size="sm"
                                                                                    onClick={() =>
                                                                                        handleDelete(
                                                                                            ahli.id
                                                                                        )
                                                                                    }
                                                                                    className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                                                                                >
                                                                                    <Trash2 className="h-4 w-4" />
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
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                            {totalPages > 1 && (
                                <div className="flex justify-between items-center mt-4 px-2 md:px-4">
                                    {/* Info */}
                                    <p className="text-sm text-muted-foreground">
                                        Menampilkan{" "}
                                        {(currentPage - 1) * perPage + 1} -{" "}
                                        {Math.min(
                                            currentPage * perPage,
                                            totalItems
                                        )}{" "}
                                        dari {totalItems} artikel
                                    </p>

                                    {/* Kontrol */}
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.max(prev - 1, 1)
                                                )
                                            }
                                            disabled={currentPage === 1}
                                        >
                                            ← Sebelumnya
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            Halaman {currentPage} / {totalPages}
                                        </span>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        prev + 1,
                                                        totalPages
                                                    )
                                                )
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                        >
                                            Berikutnya →
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Delete Confirmation Modal */}
                        <AnimatePresence>
                            {deleteModal.open && (
                                <Dialog
                                    open={deleteModal.open}
                                    onOpenChange={(open) =>
                                        setDeleteModal({
                                            open,
                                            articleId: null,
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
                                                    Konfirmasi Hapus
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Apakah Anda yakin ingin
                                                    menghapus ahli ini? Tindakan
                                                    ini tidak dapat dibatalkan.
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
                                                            setDeleteModal({
                                                                open: false,
                                                                articleId: null,
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
                                                        variant="destructive"
                                                        onClick={confirmDelete}
                                                    >
                                                        Hapus
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
