"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Upload, Save, Route } from "lucide-react";
import { ExpertSidebar } from "../../layout/ahli-sidebar";
import { AdminHeader } from "../../layout/admin-header";
import { Breadcrumb } from "../../components/breadcrump";
import { useAlert } from "../../components/myalert";
import { usePage, router, Head } from "@inertiajs/react";
import { route } from "ziggy-js";
export default function EditProfilePage() {
    const { user, flash, spesialisasi } = usePage().props;

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nama: user.nama || "",
        email: user.email || "",
        telp: user.telp || "",
        tgl_lahir: user.tgl_lahir ? user.tgl_lahir.substring(0, 10) : "",
        jk: user.jk || "",
        pengalaman: user.pengalaman || "",
        foto: user.foto || null, // URL foto atau null
        fotoFile: null, // file asli untuk upload
        id_ahli: user.id_ahli || "", // tambah ini
    });

    const { showSuccess, AlertContainer } = useAlert();
    useEffect(() => {
        if (flash.success) {
            showSuccess("Berhasil", flash.success);
        }
    }, [flash.success]);

    const breadcrumbItems = [
        { label: "Ahli Dashboard", href: route("ahli-dashboard-acount") },
        { label: "Profile", href: route("ahli-profile") },
        { label: "Edit Profile", href: route("ahli-profile-edit-acount") },
    ];

    // Handle input text change (nama, email, telp, tgl_lahir)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle radio change untuk jenis kelamin
    const handleRadioChange = (value) => {
        setFormData((prev) => ({
            ...prev,
            jk: value,
        }));
    };

    // Handle perubahan file gambar
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData((prev) => ({
                ...prev,
                foto: previewUrl,
                fotoFile: file,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Contoh: buat FormData untuk dikirim ke server via axios/fetch
        const data = new FormData();
        data.append("nama", formData.nama);
        data.append("email", formData.email);
        data.append("telp", formData.telp);
        data.append("tgl_lahir", formData.tgl_lahir);
        data.append("jk", formData.jk);
        data.append("pengalaman", formData.pengalaman);
        data.append("id_ahli", formData.id_ahli);

        if (formData.fotoFile) {
            data.append("foto", formData.fotoFile);
        }

        router.post(route('ahli-profile-update-acount'), data);
    };

    const goBack = () => {
        console.log("test");
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

    return (
        <>
            <div className="fixed z-[500]">
                <AlertContainer />
            </div>
            <Head title="edit-profile-ahli" />
            <div className="flex flex-col min-h-screen bg-background">
                <AdminHeader />
                <div className="flex flex-1 overflow-hidden">
                    <ExpertSidebar activeLink={route("ahli-profile")} />
                    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-0">
                        <div className="container bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50  mx-auto px-4 py-6">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                        <motion.div
                            className="w-full max-w-3xl"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <Card className="shadow-xl border-0">
                                <CardHeader className="bg-green-600 text-white rounded-t-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute left-2 top-2 text-white hover:bg-green-700"
                                        onClick={goBack}
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </Button>
                                    <CardTitle className="text-center text-2xl">
                                        Edit Profil
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSubmit}>
                                        <motion.div
                                            variants={itemVariants}
                                            className="flex justify-center mb-6"
                                        >
                                            <div className="relative w-max mx-auto">
                                                <Avatar
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                    className="h-24 w-24 border-4 border-green-500 cursor-pointer"
                                                >
                                                    <AvatarImage
                                                        src={
                                                            formData.foto ||
                                                            "/placeholder.svg"
                                                        }
                                                        alt={formData.nama}
                                                    />
                                                    <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                                                        {formData.nama
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    className="absolute bottom-0 right-0 rounded-full bg-green-600 hover:bg-green-700 h-8 w-8"
                                                    onClick={() =>
                                                        fileInputRef.current?.click()
                                                    }
                                                >
                                                    <Upload className="h-4 w-4 text-white" />
                                                </Button>

                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </div>
                                        </motion.div>

                                        <div className="space-y-4">
                                            <motion.div variants={itemVariants}>
                                                <Label
                                                    htmlFor="nama"
                                                    className="text-green-700"
                                                >
                                                    Nama
                                                </Label>
                                                {/* Input Fields */}
                                                <Input
                                                    id="nama"
                                                    name="nama"
                                                    value={formData.nama}
                                                    onChange={handleChange}
                                                    placeholder="Nama lengkap"
                                                    className="border-green-200 focus-visible:ring-green-500"
                                                    required
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <Label
                                                    htmlFor="email"
                                                    className="text-green-700"
                                                >
                                                    Email
                                                </Label>
                                                <Input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="Email"
                                                    className="border-green-200 focus-visible:ring-green-500"
                                                    required
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <Label
                                                    htmlFor="telp"
                                                    className="text-green-700"
                                                >
                                                    Telepon
                                                </Label>
                                                <Input
                                                    id="telp"
                                                    name="telp"
                                                    type="tel"
                                                    value={formData.telp}
                                                    onChange={handleChange}
                                                    placeholder="Nomor telepon"
                                                    className="border-green-200 focus-visible:ring-green-500"
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <Label
                                                    htmlFor="tgl_lahir"
                                                    className="text-green-700"
                                                >
                                                    Tanggal Lahir
                                                </Label>
                                                <Input
                                                    id="tgl_lahir"
                                                    name="tgl_lahir"
                                                    type="date"
                                                    value={formData.tgl_lahir}
                                                    onChange={handleChange}
                                                    className="border-green-200 focus-visible:ring-green-500"
                                                />
                                            </motion.div>

                                            {/* Pengalaman */}
                                            <motion.div variants={itemVariants}>
                                                <Label
                                                    htmlFor="pengalaman"
                                                    className="text-green-700"
                                                >
                                                    Pengalaman
                                                </Label>
                                                <Textarea
                                                    name="pengalaman"
                                                    placeholder="Tulis pengalaman ahli herbal"
                                                    rows={6}
                                                    value={formData.pengalaman}
                                                    onChange={handleChange}
                                                    className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                                                />
                                            </motion.div>

                                            <motion.div variants={itemVariants}>
                                                <Label className="text-green-700 mb-2 block">
                                                    Jenis Kelamin
                                                </Label>

                                                <RadioGroup
                                                    value={formData.jk}
                                                    onValueChange={
                                                        handleRadioChange
                                                    }
                                                    className="flex gap-6"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="laki-laki"
                                                            id="laki-laki"
                                                            className="border-green-500 text-green-600"
                                                        />
                                                        <Label htmlFor="laki-laki">
                                                            Laki-laki
                                                        </Label>
                                                    </div>

                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem
                                                            value="perempuan"
                                                            id="perempuan"
                                                            className="border-green-500 text-green-600"
                                                        />
                                                        <Label htmlFor="perempuan">
                                                            Perempuan
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </motion.div>
                                            <motion.div variants={itemVariants}>
                                                <Label className="text-green-700 mb-2 block">
                                                    Spesialisasi
                                                </Label>
                                                <select
                                                    name="id_ahli"
                                                    value={formData.id_ahli}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-green-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-transparent"
                                                >
                                                    <option value="">
                                                        Pilih Spesialisasi
                                                    </option>
                                                    {spesialisasi.map((sp) => (
                                                        <option
                                                            key={sp.id}
                                                            value={sp.id}
                                                        >
                                                            {
                                                                sp.nama_spesialisasi
                                                            }
                                                        </option>
                                                    ))}
                                                </select>
                                            </motion.div>
                                        </div>

                                        <motion.div variants={itemVariants}>
                                            <CardFooter className="px-0 pt-6">
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-green-600 hover:bg-green-700"
                                                >
                                                    <Save className="mr-2 h-4 w-4" />{" "}
                                                    Simpan Perubahan
                                                </Button>
                                            </CardFooter>
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
