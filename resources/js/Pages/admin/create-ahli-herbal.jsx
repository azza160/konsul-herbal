"use client";

import { useState, useEffect } from "react";
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
    Eye,
    EyeOff
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useAlert } from "../../components/myalert";
import { route } from "ziggy-js";

export default function CreateArticlePage() {
    const [date, setDate] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nama: "",
        email: "",
        password: "",
        foto: null,
        jk: "",
        tgl_lahir: "",
        telp: "",
        pengalaman: "",
        id_ahli: "", // kalau sudah ada select spesialisasi
    });
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const [preview, setPreview] = useState(null); // buat preview image

    const { flash, spesialisasis } = usePage().props;
    const { showSuccess, AlertContainer } = useAlert();

    useEffect(() => {
        if (flash.success) {
            showSuccess("Berhasil", flash.success);
        }
    }, [flash.success]);

    const breadcrumbItems = [
        { label: "Admin", href: "/admin" },
        { label: "Ahli-Herbal", href: route("ahli-herbal-dashboard") },
        { label: "Tambah Ahli Herbal" },
    ];

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "foto" && files.length > 0) {
            const file = files[0];
            setFormData((prev) => ({ ...prev, foto: file }));
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        // Validasi email dan password wajib isi
        if (!formData.email || !formData.password) {
            alert("Email dan password wajib diisi.");
            setIsLoading(false);
            return;
        }
    
        // Validasi panjang password minimal 6 karakter
        if (formData.password.length < 6) {
            alert("Password minimal 6 karakter.");
            setIsLoading(false);
            return;
        }
    
        const data = new FormData();
        data.append("nama", formData.nama);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("id_ahli", formData.id_ahli);
        if (formData.foto) data.append("foto", formData.foto);
        data.append("jk", formData.jk);
        data.append("tgl_lahir", formData.tgl_lahir);
        data.append("telp", formData.telp);
        data.append("pengalaman", formData.pengalaman);
    
        router.post("/admin/ahli-herbal/store", data, {
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                setFormData({
                    nama: "",
                    email: "",
                    password: "",
                    id_ahli: "",
                    foto: null,
                    jk: "",
                    tgl_lahir: "",
                    telp: "",
                    pengalaman: "",
                });
                setPreview(null);
            },
            onError: (errors) => {
                console.error("Validasi gagal:", errors);
                // tampilkan error kalau mau
                alert("Terjadi kesalahan validasi. Silakan periksa kembali input Anda.");
            },
        });
    };
    
    

    return (
        <>
            <AlertContainer />

            <Head title="tambah-article" />
            <div className="flex flex-col min-h-screen bg-background">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <AdminSidebar activeLink={route("artikel-dashboard")} />

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
                                    Tambah Artikel
                                </h1>
                                <p className="text-muted-foreground">
                                    Buat artikel baru untuk platform
                                </p>
                            </div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button variant="outline" asChild>
                                    <Link href={route("artikel-dashboard")}>
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
                                        Form Ahli Herbal
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
                                                Nama Ahli Herbal
                                            </Label>
                                            <Input
                                                id="nama"
                                                name="nama"
                                                placeholder="Masukkan Nama Ahli Herbal"
                                                required
                                                value={formData.nama}
                                                onChange={handleChange}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>

                                        {/* Email */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.4,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="Masukkan Email Ahli"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>

                                        {/* Password */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.5,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    id="password"
                                                    name="password"
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Masukkan Password"
                                                    required
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    className="pr-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                                    aria-label={
                                                        showPassword
                                                            ? "Sembunyikan password"
                                                            : "Tampilkan password"
                                                    }
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* Spesialisasi */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.7,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="id_ahli">
                                                Spesialisasi
                                            </Label>
                                            <select
                                                id="id_ahli"
                                                name="id_ahli"
                                                value={formData.id_ahli}
                                                onChange={handleChange}
                                                required
                                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="">
                                                    Pilih Spesialisasi
                                                </option>
                                                {spesialisasis?.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.nama}
                                                    </option>
                                                ))}
                                            </select>
                                        </motion.div>

                                        {/* Jenis Kelamin */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.3,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="jk">
                                                Jenis Kelamin
                                            </Label>
                                            <select
                                                id="jk"
                                                name="jk"
                                                value={formData.jk}
                                                onChange={handleChange}
                                                required
                                                className="w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                            >
                                                <option value="">
                                                    Pilih jenis kelamin
                                                </option>
                                                <option value="laki-laki">
                                                    Laki-laki
                                                </option>
                                                <option value="perempuan">
                                                    Perempuan
                                                </option>
                                            </select>
                                        </motion.div>

                                        {/* Tanggal Lahir */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.35,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="tgl_lahir">
                                                Tanggal Lahir
                                            </Label>
                                            <Input
                                                type="date"
                                                name="tgl_lahir"
                                                value={formData.tgl_lahir}
                                                onChange={handleChange}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>

                                        {/* No. Telepon */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.4,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="telp">
                                                Nomor Telepon
                                            </Label>
                                            <Input
                                                type="tel"
                                                name="telp"
                                                placeholder="Contoh: 08123456789"
                                                value={formData.telp}
                                                onChange={handleChange}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>

                                        {/* Pengalaman */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.45,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label htmlFor="pengalaman">
                                                Pengalaman
                                            </Label>
                                            <Textarea
                                                name="pengalaman"
                                                placeholder="Tulis pengalaman ahli herbal"
                                                rows={5}
                                                value={formData.pengalaman}
                                                onChange={handleChange}
                                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                delay: 0.5,
                                                duration: 0.3,
                                            }}
                                            className="space-y-2"
                                        >
                                            <Label>Foto Ahli</Label>
                                            <motion.div
                                                whileHover={{ scale: 1.02 }}
                                                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-all duration-300 cursor-pointer relative"
                                            >
                                                {preview ? (
                                                    <img
                                                        src={preview}
                                                        alt="Preview Foto Ahli"
                                                        className="mx-auto mb-2 max-h-40 object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <>
                                                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            Klik untuk upload
                                                            atau drag & drop
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            PNG, JPG, JPEG, GIF
                                                        </p>
                                                    </>
                                                )}
                                                <input
                                                    type="file"
                                                    name="foto"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    accept="image/png, image/jpg, image/jpeg, image/gif"
                                                    onChange={handleChange}
                                                />
                                            </motion.div>
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
                                                        "Simpan Artikel"
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
