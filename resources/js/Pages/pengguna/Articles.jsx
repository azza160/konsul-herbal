"use client";

import { useState,useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Header } from "../../layout/header";
import { Footer } from "../../layout/footer";
import { Breadcrumb } from "../../components/breadcrump";
import { Calendar, Search } from "lucide-react";
import { Head, Link, usePage } from "@inertiajs/react";
import { route } from "ziggy-js";

export default function ArticlesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("terbaru");

    const breadcrumbItems = [{ label: "Artikel" }];
    const { articles } = usePage().props;
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 2; // jumlah artikel per halaman

    // Filter berdasarkan pencarian
    const filteredArticles = articles.filter((article) =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort (jika kamu punya sorting)
    const sortedArticles = [...filteredArticles].sort((a, b) => {
        if (sortBy === "terbaru") {
            return new Date(b.date) - new Date(a.date);
        } else if (sortBy === "terlama") {
            return new Date(a.date) - new Date(b.date);
        } else {
            return 0;
        }
    });

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

    // Paginasi hasil filter & sort
    const totalItems = sortedArticles.length;
    const totalPages = Math.ceil(totalItems / perPage);
    const paginatedArticles = sortedArticles.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, sortBy]);

    return (
        <>
            <Head title="list-artikel" />
            <div className="min-h-screen bg-background bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
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
                            Artikel Herbal
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Pelajari lebih lanjut tentang pengobatan herbal dan
                            kesehatan alami
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
                                placeholder="Cari artikel..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Urutkan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="terbaru">Terbaru</SelectItem>
                                <SelectItem value="terlama">Terlama</SelectItem>
                            </SelectContent>
                        </Select>
                    </motion.div>

                    {/* Articles Grid */}
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
                        variants={containerVariants}
                    >
                        {paginatedArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                variants={itemVariants}
                                whileHover={{
                                    scale: 1.03,
                                    transition: { duration: 0.2 },
                                }}
                            >
                                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                                    <div className="aspect-video w-full rounded-t-lg overflow-hidden p-3">
                                        <img
                                            src={article.image}
                                            className="rounded-t-lg w-full"
                                        ></img>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                                            <Calendar className="h-4 w-4" />
                                            <span>{article.date}</span>
                                        </div>
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors duration-200">
                                            {article.title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-4 line-clamp-3">
                                            {article.excerpt}
                                        </p>
                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                variant="outline"
                                                asChild
                                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200"
                                            >
                                                <Link href={route("detail-artikel", { id: article.id })}>
  Baca Artikel
</Link>
                                            </Button>
                                        </motion.div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>

                    {totalPages > 1 && (
                                <div className="flex justify-center items-center mt-4 px-2 md:px-4">
                                  

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

                <Footer />
            </div>
        </>
    );
}
