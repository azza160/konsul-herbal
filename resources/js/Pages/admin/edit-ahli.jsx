"use client";

import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminSidebar } from "../../layout/admin-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { Breadcrumb } from "../../components/breadcrump";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    CalendarIcon,
    Upload,
    FileText,
    UserCheck,
    Users,
    BarChart3,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Head, Link, router,usePage } from "@inertiajs/react";
import { useAlert } from "../../components/myalert"
import { route } from "ziggy-js";



export default function CreateArticlePage() {
    const { flash,ahli } = usePage().props
    const { showSuccess, AlertContainer } = useAlert()
    const [date, setDate] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama_spesialisasi: ahli?.nama_spesialisasi || "",
        deskripsi_spesialisasi: ahli?.deskripsi_spesialisasi || "",
    });

 

    useEffect(() => {
      if (flash.success) {
        showSuccess("Berhasil", flash.success)
      }
    }, [flash.success])
    

    const breadcrumbItems = [
        { label: "Admin", href: "/admin" },
        { label: "Ahli", href: route('ahli-dashboard') },
        { label: "Edit Ahli" },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
      
        // Pastikan hanya field yang ada di state yang diproses
        if (["nama_spesialisasi", "deskripsi_spesialisasi"].includes(name)) {
            setFormData((prev) => ({ ...prev, [name]: value }));
          }
      };
      
      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const data = new FormData();
        data.append("nama_spesialisasi", formData.nama_spesialisasi);
        data.append("deskripsi_spesialisasi", formData.deskripsi_spesialisasi);
        data.append("_method", "PUT"); // untuk spoofing PUT

        router.post(route("ahli.update", ahli.id), data, {
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                // optional redirect atau flash message
            },
        });
    };
    

    return (
      <>
                <AlertContainer />

      <Head title="tambah-ahli"/>
        <div className="flex flex-col min-h-screen bg-background">
            <AdminHeader />
            <div className="flex flex-1 overflow-hidden">
                <AdminSidebar activeLink={route("ahli-dashboard")} />

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
                                Edit Ahli
                            </h1>
                            <p className="text-muted-foreground">
                                Edit Ahli untuk platform
                            </p>
                        </div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Button variant="outline" asChild>
                                <Link href={route("ahli-dashboard")}>
                                    Kembali
                                </Link>
                            </Button>
                        </motion.div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        <Card className="hover:shadow-lg transition-shadow duration-300">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Form Ahli
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.3,
                                            duration: 0.3,
                                        }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="judul">
                                            Nama Ahli
                                        </Label>
                                        <Input
                                            id="nama_spesialisasi"
                                            name="nama_spesialisasi"
                                            placeholder="Masukkan nama ahli"
                                            required
                                            value={formData.nama_spesialisasi}
                                            onChange={handleChange}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{
                                            delay: 0.4,
                                            duration: 0.3,
                                        }}
                                        className="space-y-2"
                                    >
                                        <Label htmlFor="isi">Isi Deskripsi</Label>
                                        <Textarea
                                            id="deskripsi_spesialisasi"
                                            name="deskripsi_spesialisasi"
                                            placeholder="Tulis deskripsi ahli di sini..."
                                            rows={12}
                                            required
                                            value={formData.deskripsi_spesialisasi}
                                            onChange={handleChange}
                                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                        />
                                    </motion.div>
                

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.7,
                                            duration: 0.3,
                                        }}
                                        className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
                                    >
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="flex-1"
                                        >
                                            <Button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="animate-spin mr-2">
                                                            ◌
                                                        </span>
                                                        Menyimpan...
                                                    </>
                                                ) : (
                                                    "Simpan Ahli"
                                                )}
                                            </Button>
                                        </motion.div>
                                    </motion.div>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </main>
            </div>
        </div>
      </>
    );
}
