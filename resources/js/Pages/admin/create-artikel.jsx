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



export default function CreateArticlePage() {
    const [date, setDate] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        judul: "",
        deskripsi: "",
        foto: null, // untuk file upload
    });
    const [preview, setPreview] = useState(null); // buat preview image

    const { flash } = usePage().props
    const { showSuccess, AlertContainer } = useAlert()

    useEffect(() => {
      if (flash.success) {
        showSuccess("Berhasil", flash.success)
      }
    }, [flash.success])
    

    const breadcrumbItems = [
        { label: "Admin", href: "/admin" },
        { label: "Artikel", href: "/admin/articles" },
        { label: "Tambah Artikel" },
    ];

    const handleChange = (e) => {
      const { name, value, files } = e.target;
    
      if (name === "foto" && files.length > 0) {
        const file = files[0];
        // Simpan file ke state
        setFormData((prev) => ({ ...prev, foto: file }));
    
        // Tampilkan preview
        setPreview(URL.createObjectURL(file));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append("judul", formData.judul);
        data.append("deskripsi", formData.deskripsi);
        if (formData.foto) data.append("foto", formData.foto);

        router.post("/admin/artikel/store", data, {
            onFinish: () => setIsLoading(false),
            onSuccess: () => {
                setFormData({ judul: "", deskripsi: "", foto: null });
                // Bisa redirect atau kasih notif success jika mau
            },
            onError: () => {
                // Bisa handle error jika perlu
            },
        });
    };

    return (
      <>
                <AlertContainer />

      <Head title="tambah-article"/>
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
                                    Form Artikel
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
                                            Judul Artikel
                                        </Label>
                                        <Input
                                            id="judul"
                                            name="judul"
                                            placeholder="Masukkan judul artikel"
                                            required
                                            value={formData.judul}
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
                                        <Label htmlFor="isi">Isi Artikel</Label>
                                        <Textarea
                                            id="deskripsi"
                                            name="deskripsi"
                                            placeholder="Tulis isi artikel di sini..."
                                            rows={12}
                                            required
                                            value={formData.deskripsi}
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
                                        <Label>Foto Artikel</Label>
                                        <motion.div
  whileHover={{ scale: 1.02 }}
  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-all duration-300 cursor-pointer relative"
>
  {preview ? (
    <img
      src={preview}
      alt="Preview"
      className="mx-auto mb-2 max-h-40 object-cover rounded-md"
    />
  ) : (
    <>
      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
      <p className="text-sm text-muted-foreground mb-2">
        Klik untuk upload atau drag & drop
      </p>
      <p className="text-xs text-muted-foreground">PNG, JPG, JPEG, GIF</p>
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
