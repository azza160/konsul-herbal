"use client"

import { useState,useEffect} from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, UserPlus, Mail, User, Phone, Lock, Eye, EyeOff, Leaf, Shield, Heart, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { Head, Link,usePage,router } from "@inertiajs/react"
import { useAlert } from "../../components/myalert"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    telp: "",
    password: "",
    jk: "laki-laki",
    tgl_lahir: "", 
  })

  const { flash } = usePage().props
  const { showSuccess, AlertContainer } = useAlert()


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  useEffect(() => {
    if (flash.success) {
      showSuccess("Berhasil", flash.success)
    }
  }, [flash.success])

 const handleSubmit = async (e) => {
  e.preventDefault();

  const { nama, email, telp, password, jk, tgl_lahir } = formData;

  // Validasi kosong
  if (!nama || !email || !telp || !password || !jk || !tgl_lahir) {
    alert("Harap lengkapi semua data.");
    return;
  }

  // Validasi panjang password
  if (password.length < 6) {
    alert("Password minimal 6 karakter.");
    return;
  }

  setIsLoading(true);

  router.post('/register', formData, {
    onSuccess: () => setIsLoading(false),
    onError: (errors) => {
      console.log('Validation Errors:', errors);
      setIsLoading(false);
    },
  });
};

  
  
  const nextStep = () => {
    setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
          <AlertContainer />

      <Head title="Register"/>
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-emerald-50 via-green-50 to-blue-50">
        {/* Left side - Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex md:w-1/2 lg:w-2/5 bg-emerald-600 relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[10%] left-[10%] w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute top-[30%] right-[15%] w-16 h-16 border border-white rounded-full"></div>
            <div className="absolute bottom-[20%] left-[15%] w-24 h-24 border-2 border-white rounded-full"></div>
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
                Bergabunglah
                <br />
                dengan Kami
              </h2>
              <p className="text-lg text-white/90 mb-8 max-w-md">
                Mulai perjalanan kesehatan herbal Anda bersama komunitas yang peduli
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-5"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Keamanan Terjamin</h3>
                    <p className="text-sm text-white/80">Data pribadi Anda aman dan terlindungi</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Konsultasi Gratis</h3>
                    <p className="text-sm text-white/80">Konsultasi pertama gratis dengan ahli</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white">Ahli Bersertifikat</h3>
                    <p className="text-sm text-white/80">Semua ahli herbal telah tersertifikasi</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right side - Register Form */}
        <div className="w-full md:w-1/2 lg:w-3/5 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            {/* Mobile Logo */}
            <div className="md:hidden flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center mr-3">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-emerald-600">HerbalCare</h1>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
                <CardDescription className="text-center">Buat akun untuk memulai konsultasi</CardDescription>

                {/* Step indicator */}
                <div className="flex items-center justify-center mt-4 space-x-2">
                  <div
                    className={`h-1.5 w-16 rounded-full transition-colors ${
                      step === 1 ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-1.5 w-16 rounded-full transition-colors ${
                      step === 2 ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <p className="text-xs text-center text-muted-foreground mt-1">Langkah {step} dari 2</p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Nama Field */}
                        <div className="space-y-2">
                          <Label htmlFor="nama" className="text-sm font-medium">
                            Nama Lengkap
                          </Label>
                          <div className="relative z-[10]">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-[50]" />
                            <Input
                              id="nama"
                              name="nama"
                              placeholder="Masukkan nama lengkap"
                              className="pl-10 h-11"
                              required
                              value={formData.nama}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-medium">
                            Email
                          </Label>
                          <div className="relative z-[10]">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-[50]" />
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

                        {/* Phone Field */}
                        <div className="space-y-2">
                          <Label htmlFor="telp" className="text-sm font-medium">
                            No. Telepon
                          </Label>
                          <div className="relative z-[10]">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-[50]" />
                            <Input
                              id="telp"
                              name="telp"
                              placeholder="08xxxxxxxxxx"
                              className="pl-10 h-11"
                              required
                              value={formData.telp}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        <Button type="button" className="w-full h-11" onClick={nextStep}>
                          Lanjutkan
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* Password Field */}
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-medium">
                            Password
                          </Label>
                          <div className="relative z-[10]">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground z-[50]" />
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Minimal 6 karakter"
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

                        {/* Date Field */}
                        <div className="space-y-2">
                          <Label htmlFor="tgl_lahir" className="text-sm font-medium">Tanggal Lahir</Label>
                          <div className="relative">
                            <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="tgl_lahir"
                              name="tgl_lahir"
                              type="date"
                              className="pl-10 h-11"
                              required
                              value={formData.tgl_lahir}
                              onChange={handleChange}
                            />
                          </div>
                        </div>

                        {/* Gender Field */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">Jenis Kelamin</Label>
                          <RadioGroup
                            defaultValue="laki-laki"
                            className="flex space-x-4"
                            value={formData.jk}
                            onValueChange={(value) => setFormData((prev) => ({ ...prev, jk: value }))}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="laki-laki" id="laki-laki" />
                              <Label htmlFor="laki-laki" className="text-sm">
                                Laki-laki
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="perempuan" id="perempuan" />
                              <Label htmlFor="perempuan" className="text-sm">
                                Perempuan
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button type="button" variant="outline" className="flex-1 h-11" onClick={prevStep}>
                            Kembali
                          </Button>
                          <Button type="submit" className="flex-1 h-11" disabled={isLoading}>
                            {isLoading ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                                <span>Mendaftar...</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Daftar</span>
                              </>
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Login Link */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-sm text-muted-foreground">
                      Sudah punya akun?{" "}
                      <Link href="/login" className="text-emerald-600 hover:text-emerald-700 font-medium">
                        Masuk di sini
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
