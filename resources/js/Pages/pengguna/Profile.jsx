"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Phone, Mail, Pencil, KeyRound } from "lucide-react"
import { Header } from "../../layout/header";
import { Footer } from "../../layout/footer";
import { Breadcrumb } from "../../components/breadcrump";
import { Link,router,usePage } from "@inertiajs/react"
import { route } from "ziggy-js"

export default function ProfilePage() {

 const {userMe} = usePage().props

  const goToEditProfile = () => {
    router.get(route('edit-profile'));
  }

  const breadcrumbItems = [
    { label: "Profile", href: route('profile') },
];


  const goToChangePassword = () => {
    router.get(route('edit-password-profile'));


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
    <Header />
    <div className="container bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50  mx-auto px-4 py-6">
                    <Breadcrumb items={breadcrumbItems} />
                </div>
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
                

      <motion.div className="w-full max-w-3xl" variants={containerVariants} initial="hidden" animate="visible">
        <Card className="shadow-md border-0">
          <CardHeader className="bg-green-400 text-white rounded-t-lg">
            <CardTitle className="text-center text-2xl">Profil Pengguna</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-4 px-6">
            <div className="flex flex-col items-center mb-6">
              <motion.div variants={itemVariants} className="mb-4">
                <Avatar className="h-24 w-24 border-4 border-green-500">
                  <AvatarImage src={userMe.photo || "/placeholder.svg"} alt={userMe.name} />
                  <AvatarFallback className="bg-green-100 text-green-800 text-xl">
                    {userMe.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-green-800">
                {userMe.name}
              </motion.h2>
              <motion.div variants={itemVariants}>
                <Badge variant="outline" className="bg-green-100 text-green-800 mt-1">
                  {userMe.gender}
                </Badge>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <Mail className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Email</p>
                  <p className="text-gray-700">{userMe.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <Phone className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Telepon</p>
                  <p className="text-gray-700">{userMe.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50">
                <CalendarIcon className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-700 font-medium">Tanggal Lahir</p>
                  <p className="text-gray-700">
                    {new Date(userMe.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={goToEditProfile}>
                <Pencil className="mr-2 h-4 w-4" /> Edit Profil
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-green-600 text-green-600 hover:bg-green-50"
                onClick={goToChangePassword}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Ubah Password
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    <Footer />

    </>
  )
}
