"use client"

import { useState,useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, KeyRound, Eye, EyeOff } from "lucide-react"
import { Header } from "../../layout/header";
import { Footer } from "../../layout/footer";
import { Breadcrumb } from "../../components/breadcrump";
import { useAlert } from "../../components/myalert"
import { usePage,router } from "@inertiajs/react";
import { route } from "ziggy-js"

export default function ChangePasswordPage() {
    const { user,flash } = usePage().props;

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  const { showSuccess, AlertContainer } = useAlert()
  useEffect(() => {
    if (flash.success) {
      showSuccess("Berhasil", flash.success)
    }
  }, [flash.success])

  const breadcrumbItems = [
    { label: "Profile", href: route("profile") },
    { label: "Edit Password", href: route("edit-password-profile") },
];


  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Password lama harus diisi"
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "Password baru harus diisi"
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password minimal 6 karakter"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password harus diisi"
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Password tidak cocok"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  
    if (validateForm()) {
      router.post(route('update-password'), {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
        newPassword_confirmation: formData.confirmPassword,
      }, {
        onError: (errors) => {
          setErrors(errors)
        },
        onSuccess: () => {
          // Reset input setelah sukses
          setFormData({
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
  
          setErrors({})
        },
      })
    }
  }
  

  const goBack = () => {
    router.push("/profile-page")
  }

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
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <>
     <div className="fixed z-[500] ">
    <AlertContainer />
    </div>
    <Header />

        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
        <motion.div className="w-full max-w-3xl" variants={containerVariants} initial="hidden" animate="visible">
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
                <CardTitle className="text-center text-2xl">Ubah Password</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit}>
                <motion.div variants={itemVariants} className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                    <KeyRound className="h-8 w-8 text-green-600" />
                    </div>
                </motion.div>

                <div className="space-y-4">
                    <motion.div variants={itemVariants}>
                    <Label htmlFor="oldPassword" className="text-green-700">
                        Password Lama
                    </Label>
                    <div className="relative">
                        <Input
                        id="oldPassword"
                        name="oldPassword"
                        type={showPasswords.oldPassword ? "text" : "password"}
                        value={formData.oldPassword}
                        onChange={handleChange}
                        className={`border-green-200 focus-visible:ring-green-500 pr-10 ${
                            errors.oldPassword ? "border-red-500" : ""
                        }`}
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility("oldPassword")}
                        >
                        {showPasswords.oldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {errors.oldPassword && <p className="text-red-500 text-sm mt-1">{errors.oldPassword}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                    <Label htmlFor="newPassword" className="text-green-700">
                        Password Baru
                    </Label>
                    <div className="relative">
                        <Input
                        id="newPassword"
                        name="newPassword"
                        type={showPasswords.newPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        className={`border-green-200 focus-visible:ring-green-500 pr-10 ${
                            errors.newPassword ? "border-red-500" : ""
                        }`}
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility("newPassword")}
                        >
                        {showPasswords.newPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                    <Label htmlFor="confirmPassword" className="text-green-700">
                        Konfirmasi Password Baru
                    </Label>
                    <div className="relative">
                        <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showPasswords.confirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`border-green-200 focus-visible:ring-green-500 pr-10 ${
                            errors.confirmPassword ? "border-red-500" : ""
                        }`}
                        />
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                        onClick={() => togglePasswordVisibility("confirmPassword")}
                        >
                        {showPasswords.confirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                    <CardFooter className="px-0 pt-6">
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                        <KeyRound className="mr-2 h-4 w-4" /> Ubah Password
                    </Button>
                    </CardFooter>
                </motion.div>
                </form>
            </CardContent>
            </Card>
        </motion.div>
        </div>
        <Footer />

    </>
  )
}
