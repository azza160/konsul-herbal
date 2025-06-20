"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Header } from "../../layout/header";
import { Footer } from "../../layout/footer";
import { Breadcrumb } from "../../components/breadcrump";
import {
    Calendar,
    Star,
    Mail,
    ArrowRight,
    Phone,
    Users,
    BookOpen,
    MessageCircle,
    ChevronDown,
    Plus,
    User,
    Briefcase,
    Award,
    MapPin,
    Eye,
    Send,
    GraduationCap,
    Search,
    AlertTriangle
} from "lucide-react";
import { Head, usePage,router } from "@inertiajs/react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { route } from "ziggy-js";
function ConsultationDialog({ expert }) {
    const [topic, setTopic] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post(
            route("pengguna-konsultasi"),
            {
                ahli_id: expert.id,
                keluhan: topic,
            },
            {
                onSuccess: () => {
                    setTopic(""); // reset textarea kalau berhasil
                },
            }
        );
    };

    return (
        <DialogContent className="w-[95vw] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto max-h-[85vh] p-0">
            <div className="max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-4 sm:p-6 text-white sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">
                            Mulai Konsultasi
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
                        <Avatar className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-2 sm:border-4 border-white shadow-xl">
                            <AvatarImage
                                src={expert.image || "/placeholder.svg"}
                                alt={expert.name}
                            />
                            <AvatarFallback className="text-lg sm:text-xl md:text-2xl font-bold bg-white text-gray-800">
                                {expert.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                            </AvatarFallback>
                        </Avatar>

                        <div className="text-center sm:text-left flex-1">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
                                {expert.name}
                            </h3>
                            <Badge
                                variant="secondary"
                                className="text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1 sm:py-2 bg-white/20 text-white border-white/30 mb-2 sm:mb-3"
                            >
                                <GraduationCap className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                                {expert.specialty}
                            </Badge>
                            <p className="text-green-100 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-2">
                                {expert.specialty_description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6 md:p-8">
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-4 sm:space-y-6"
                    >
                        <div>
                            <Label
                                htmlFor="topic"
                                className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 block"
                            >
                                Topik Konsultasi
                            </Label>
                            <Textarea
                                id="topic"
                                placeholder="Jelaskan keluhan atau topik yang ingin Anda konsultasikan..."
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className="min-h-[100px] sm:min-h-[120px] md:min-h-[140px] text-sm sm:text-base resize-none border-2 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg p-3 sm:p-4"
                                required
                            />
                            <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                Berikan detail yang jelas agar ahli dapat
                                memberikan konsultasi yang tepat
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-3 sm:p-4 md:p-6 rounded-xl border border-emerald-200">
                            <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                                Informasi Konsultasi
                            </h4>
                            <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                                <p>
                                    • Konsultasi akan dijadwalkan dalam 24 jam
                                </p>
                                <p>• Durasi konsultasi: 30-60 menit</p>
                                <p>• Tersedia konsultasi online atau offline</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                            <Button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-sm sm:text-base md:text-lg py-2 sm:py-3 md:py-4 font-semibold"
                                disabled={!topic.trim()}
                            >
                                <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Kirim Permintaan Konsultasi
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </DialogContent>
    );
}

function ExpertDetailDialog({ expert }) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const getGenderText = (jk) => {
        return jk === "laki-laki" ? "Laki-laki" : "Perempuan";
    };

    const formatExperience = (experience) => {
        if (!experience) {
            return <p className="text-gray-500 italic">Belum ada pengalaman.</p>;
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
        <DialogContent className="w-[95vw] max-w-4xl mx-auto max-h-[85vh] p-0">
            <div className="max-h-[85vh] overflow-y-auto">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 p-4 sm:p-6 text-white sticky top-0 z-10">
                    <DialogHeader>
                        <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4">
                            Profil Ahli
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
                        <div className="relative flex-shrink-0">
                            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-2 sm:border-4 border-white shadow-2xl">
                                <AvatarImage
                                    src={expert.image || "/placeholder.svg"}
                                    alt={expert.name}
                                />
                                <AvatarFallback className="text-lg sm:text-xl md:text-3xl font-bold bg-white text-gray-800">
                                    {expert.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-white rounded-full p-1 sm:p-2 shadow-lg">
                                <Award className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600" />
                            </div>
                        </div>

                        <div className="text-center lg:text-left flex-1">
                            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                                {expert.name}
                            </h3>
                            <Badge
                                variant="secondary"
                                className="text-sm sm:text-base md:text-lg px-3 sm:px-4 py-1 sm:py-2 bg-white/20 text-white border-white/30 mb-2 sm:mb-3"
                            >
                                <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                {expert.specialty}
                            </Badge>
                            <p className="text-green-100 text-sm sm:text-base md:text-lg leading-relaxed">
                                {expert.specialty_description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6 md:p-8">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Personal Information */}
                        <div>
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <User className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                                </div>
                                Informasi Pribadi
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                                            Jenis Kelamin
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                                        {getGenderText(expert.jk)}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                        <span className="text-xs sm:text-sm font-medium text-gray-600">
                                            Tanggal Lahir
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                                        {formatDate(expert.tgl_lahir)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Contact Information */}
                        <div>
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Mail className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                                </div>
                                Informasi Kontak
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                        <span className="text-xs sm:text-sm font-medium text-emerald-700">
                                            Email
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 break-all">
                                        {expert.email}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                                        <span className="text-xs sm:text-sm font-medium text-emerald-700">
                                            Telepon
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base md:text-lg font-semibold text-gray-900">
                                        {expert.telp}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Experience */}
                        <div>
                            <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                    <Briefcase className="w-3 h-3 sm:w-5 sm:h-5 text-emerald-600" />
                                </div>
                                Pengalaman & Perjalanan Karier
                            </h4>

                            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-6 rounded-xl border border-emerald-200">
                                <div className="prose prose-sm sm:prose-base max-w-none">
                                    {formatExperience(expert.pengalaman)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    );
}

export default function ExpertsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("terbaru");
    const [selectedExpert, setSelectedExpert] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 3;
    const { experts, spesialisasiList } = usePage().props;
    const [selectedSpesialisasi, setSelectedSpesialisasi] = useState("all");

    const breadcrumbItems = [{ label: "Ahli Herbal" }];

    // Filter berdasarkan spesialisasi
    const filteredExperts = experts.filter((expert) => {
      const matchesSearch =
        expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        expert.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    
      const matchesSpesialisasi =
        selectedSpesialisasi === "all" || expert.specialty === selectedSpesialisasi;
    
      return matchesSearch && matchesSpesialisasi;
    });
    

    const totalPages = Math.ceil(filteredExperts.length / perPage);
    const paginatedExperts = filteredExperts.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );
    const handleStartConsultation = (expert) => {
        setSelectedExpert(expert);
        setShowConfirmModal(true);
    };

    const confirmConsultation = () => {
        setShowConfirmModal(false);
        console.log("Starting consultation with", selectedExpert.name);
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
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    // Reset ke halaman 1 saat filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedSpesialisasi]);

    return (
        <>
            <Head title="list-ahli" />
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
                <Header />

                <div className="container mx-auto px-4 py-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="container mx-auto px-4 pb-8"
                >
                    {/* Page Header */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold mb-4">
                            Ahli Herbal
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Konsultasi dengan ahli herbal berpengalaman dan
                            terpercaya
                        </p>
                    </motion.div>

                    {/* Search and Filter */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col md:flex-row gap-4 mb-8"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                placeholder="Cari ahli herbal..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <Select value={selectedSpesialisasi} onValueChange={setSelectedSpesialisasi}>
  <SelectTrigger className="w-full md:w-64">
    <SelectValue placeholder="Filter Spesialisasi" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="all">Semua Spesialisasi</SelectItem>
    {spesialisasiList.map((item) => (
      <SelectItem key={item.id} value={item.nama_spesialisasi}>
        {item.nama_spesialisasi}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                    </motion.div>

                    {/* Experts Grid */}
                    {
                      paginatedExperts.length > 0 ? (
                        <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                        variants={containerVariants}
                    >     {

                          paginatedExperts.map((expert, index) => (
                            <motion.div
                                key={expert.id}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.02,
                                    transition: { duration: 0.3 },
                                }}
                            >
                                <Card className="h-full hover:shadow-2xl transition-all duration-500 group border-0 shadow-lg overflow-hidden bg-white">
                                    {/* Image Section with Padding */}
                                    <div className="p-3 sm:p-4 md:p-5">
                                        <div className="relative overflow-hidden rounded-xl">
                                            <div className="aspect-[4/3] w-full">
                                                <img
                                                    src={
                                                        expert.image ||
                                                        "/placeholder.svg"
                                                    }
                                                    alt={expert.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 rounded-xl"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent rounded-xl" />

                                            {/* Specialty Badge */}
                                            <Badge className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-white/95 text-gray-900 hover:bg-white text-xs sm:text-sm px-2 sm:px-3 py-1 shadow-lg">
                                                <Award className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                                {expert.specialty}
                                            </Badge>

                                            {/* Name overlay */}
                                            <div className="absolute bottom-2 sm:bottom-3 md:bottom-4 left-2 sm:left-3 md:left-4 right-2 sm:right-3 md:right-4">
                                                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1 sm:mb-2 drop-shadow-lg">
                                                    {expert.name}
                                                </h3>
                                                <p className="text-green-100 text-xs sm:text-sm leading-relaxed line-clamp-2">
                                                    {
                                                        expert.specialty_description
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <CardContent className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
                                        <div className="space-y-2 sm:space-y-3">
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                                <Phone className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm truncate">
                                                    {expert.telp}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm truncate">
                                                    {expert.email}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 sm:gap-3 text-gray-600">
                                                <User className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
                                                <span className="text-xs sm:text-sm">
                                                    {expert.jk === "laki-laki"
                                                        ? "Laki-laki"
                                                        : "Perempuan"}{" "}
                                                    •{" "}
                                                    {new Date().getFullYear() -
                                                        new Date(
                                                            expert.tgl_lahir
                                                        ).getFullYear()}{" "}
                                                    tahun
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 sm:gap-3 pt-2 sm:pt-3">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                    >
                                                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 group-hover:shadow-xl transition-all duration-300 text-xs sm:text-sm md:text-base py-2 sm:py-3">
                                                            <Eye className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2" />
                                                            Lihat Detail
                                                        </Button>
                                                    </motion.div>
                                                </DialogTrigger>
                                                <ExpertDetailDialog
                                                    expert={expert}
                                                />
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.02,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.98,
                                                        }}
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            className="w-full border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-300 text-xs sm:text-sm md:text-base py-2 sm:py-3"
                                                        >
                                                            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2" />
                                                            Mulai Konsultasi
                                                        </Button>
                                                    </motion.div>
                                                </DialogTrigger>
                                                <ConsultationDialog
                                                    expert={expert}
                                                />
                                            </Dialog>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))
                    }             
                    </motion.div>

                      ) : (
                        <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        variants={containerVariants}
                        className="text-center py-10 w-full"
                      >
                        <div className="flex justify-center mb-4">
                          <AlertTriangle className="w-10 h-10 text-yellow-500" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-muted-foreground">
                          Tidak ditemukan
                        </h2>
                        <p className="text-sm text-gray-500">
                          Kami tidak menemukan ahli herbal yang sesuai dengan pencarian atau filter Anda.
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                          Coba ubah kata kunci atau pilih spesialisasi lain.
                        </p>
                      </motion.div>
                      )
                    }
                  
                    {/* Pagination */}
                    <div className="flex justify-center gap-2 mt-6">
                        <Button
                            variant="outline"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Previous
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <Button
                                key={i}
                                variant={
                                    currentPage === i + 1
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => setCurrentPage(i + 1)}
                            >
                                {i + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </motion.div>

                {/* Confirmation Modal */}
                {showConfirmModal && (
                    <Dialog
                        open={showConfirmModal}
                        onOpenChange={setShowConfirmModal}
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
                                        Konfirmasi Konsultasi
                                    </DialogTitle>
                                    <DialogDescription>
                                        Anda akan memulai konsultasi dengan{" "}
                                        {selectedExpert?.name}. Jika yakin,
                                        tekan mulai. Jika batal, tekan batal.
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
                                                setShowConfirmModal(false)
                                            }
                                        >
                                            Batal
                                        </Button>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Button onClick={confirmConsultation}>
                                            Mulai
                                        </Button>
                                    </motion.div>
                                </DialogFooter>
                            </motion.div>
                        </DialogContent>
                    </Dialog>
                )}

                <Footer />
            </div>
        </>
    );
}
