"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Header } from "../../layout/header"
import { Footer } from "../../layout/footer"
import { Breadcrumb } from "../../components/breadcrump"
import { Calendar, User, Send } from "lucide-react"
import { Head,usePage,router } from "@inertiajs/react"
import { route } from "ziggy-js"
import axios from "axios"
export default function ArticleDetailPage() {
  const [comment, setComment] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const {article,comments} = usePage().props
  const breadcrumbItems = [{ label: "Artikel", href: route('list-artikel') }, { label: article.title }]

  

  const handleSubmitComment = (e) => {
    e.preventDefault()
  
    if (!comment.trim()) return
  
    router.post(route('komentar.store'), {
      article_id: article.id,
      komentar: comment,
    }, {
      replace: true, // efek seperti refresh inertia
    })
  }
  

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  return (
    <>
    {successMessage && (
  <div className="p-2 text-green-600 bg-green-100 rounded mb-4">
    {successMessage}
  </div>
)}

{errorMessage && (
  <div className="p-2 text-red-600 bg-red-100 rounded mb-4">
    {errorMessage}
  </div>
)}
    <Head title="Detail"/>
        <div className="min-h-screen bg-background">
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
            <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4 w-full">
                <Calendar className="h-4 w-4" />
                <span>{article.date}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
                <div className="aspect-video w-full rounded-t-lg overflow-hidden p-3">
                     <img src={article.image} className="rounded-t-lg w-full"></img>
                    </div>
            </motion.div>

            {/* Article Content */}
            <motion.div variants={itemVariants} className="prose prose-lg max-w-none mb-12">
                <div className="text-foreground leading-relaxed whitespace-pre-line">{article.content}</div>
            </motion.div>

            {/* Comments Section */}
            <motion.div variants={itemVariants}>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Komentar ({comments.length})</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Comment Form */}
                    <motion.form
                    onSubmit={handleSubmitComment}
                    className="space-y-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    >
                    <Textarea
                        placeholder="Tulis komentar Anda..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button type="submit" disabled={!comment.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Kirim Komentar
                        </Button>
                    </motion.div>
                    </motion.form>

                    {/* Comments List */}
                    <div className="space-y-4">
                    {comments.map((comment, index) => (
                        <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1, duration: 0.3 }}
                        whileHover={{ scale: 1.01 }}
                        className="flex space-x-4 p-4 bg-muted/50 rounded-lg transition-all duration-200"
                        >
                        <Avatar>
                            <AvatarImage src={comment.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{comment.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                            <span className="font-medium">{comment.user}</span>
                            <span className="text-sm text-muted-foreground">{comment.date}</span>
                            </div>
                            <p className="text-foreground">{comment.content}</p>
                        </div>
                        </motion.div>
                    ))}
                    </div>
                </CardContent>
                </Card>
            </motion.div>
            </div>
        </motion.div>

        <Footer />
        </div>
    </>
  )
}
