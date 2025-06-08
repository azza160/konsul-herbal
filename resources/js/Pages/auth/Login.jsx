"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Head, Link,router } from "@inertiajs/react"
import { LogIn, Mail, Lock, Eye, EyeOff, Leaf, Users, BookOpen, MessageCircle } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password } = formData;
  
    if (!email || !password) {
      alert("Email dan password wajib diisi.");
      return;
    }
  
    setIsLoading(true);
  
    router.post('/login', formData, {
      onSuccess: () => {
        setIsLoading(false);
        // Akan redirect dari backend
      },
      onError: (errors) => {
        setIsLoading(false);
        console.error('Login error:', errors);
        alert('Login gagal. Periksa kembali email dan password Anda.');
      },
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      <Head title="Login"/>
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
        {/* Left side - Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:w-1/2 lg:w-2/5 bg-primary relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[10%] left-[10%] w-20 h-20 border border-white rounded-full"></div>
            <div className="absolute top-[30%] right-[15%] w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute bottom-[20%] left-[15%] w-24 h-24 border border-white rounded-full"></div>
            <div className="absolute bottom-[30%] right-[10%] w-12 h-12 border border-white rounded-full"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-8"
            >
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white">HerbalCare</h1>
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 leading-tight text-white">
                Selamat Datang
                <br />
                Kembali
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-md">
                Lanjutkan perjalanan kesehatan herbal Anda bersama para ahli terpercaya
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-5"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Konsultasi Ahli</h3>
                  <p className="text-sm text-white/80">Konsultasi langsung dengan ahli herbal</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Artikel Terpercaya</h3>
                  <p className="text-sm text-white/80">Akses artikel kesehatan herbal terbaru</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Komunitas Sehat</h3>
                  <p className="text-sm text-white/80">Bergabung dengan komunitas kesehatan</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-primary">HerbalCare</h1>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-center">Masuk</CardTitle>
                <CardDescription className="text-center">Masukkan email dan password Anda</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email
                    </Label>
                    <div className="relative z-[10]">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 z-[50] w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="nama@email.com"
                        className="pl-10 h-11"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                    </div>
                    <div className="relative z-[10]">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 z-[50] w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 h-11"
                        required
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>


                  {/* Submit Button */}
                  <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        <span>Masuk...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="mr-2 h-4 w-4" />
                        <span>Masuk</span>
                      </>
                    )}
                  </Button>

                  {/* Register Link */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-muted-foreground">
                      Belum punya akun?{" "}
                      <Link href="/register" className="text-primary hover:underline font-medium">
                        Daftar sekarang
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  )
}
