"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AdminSidebar } from "../../layout/admin-sidebar"
import { AdminHeader } from "../../layout/admin-header"
import { Breadcrumb } from "../../components/breadcrump"
import { Head,usePage } from "@inertiajs/react"

import { useAlert } from "../../components/myalert"
import { Users, FileText, UserCheck, TrendingUp } from "lucide-react"
import { useEffect } from "react"

export default function AdminDashboard() {

  const breadcrumbItems = [{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]

  const stats = [
    {
      title: "Total Artikel",
      value: "156",
      description: "Artikel yang telah dipublikasi",
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      trend: "+12% dari bulan lalu",
      color: "blue",
    },
    {
      title: "Total Ahli Herbal",
      value: "24",
      description: "Ahli herbal aktif",
      icon: <UserCheck className="h-8 w-8 text-green-600" />,
      trend: "+3 ahli baru",
      color: "green",
    },
    {
      title: "Total Pengguna",
      value: "2,847",
      description: "Pengguna terdaftar",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      trend: "+18% dari bulan lalu",
      color: "purple",
    },
  ]

  const quickActions = [
    {
      title: "Tambah Artikel",
      icon: <FileText className="h-8 w-8 text-blue-600" />,
      href: "/admin/articles/create",
      description: "Buat artikel baru",
    },
    {
      title: "Kelola Ahli",
      icon: <UserCheck className="h-8 w-8 text-green-600" />,
      href: "/admin/experts",
      description: "Kelola ahli herbal",
    },
    {
      title: "Kelola User",
      icon: <Users className="h-8 w-8 text-purple-600" />,
      href: "/admin/users",
      description: "Kelola pengguna",
    },
  ]

  // Demo alert functions
  const handleTestAlerts = () => {
    showSuccess("Berhasil!", "Data telah disimpan dengan sukses")
  }

  const handleTestError = () => {
    showError("Gagal!", "Terjadi kesalahan saat menyimpan data")
  }

  const handleTestWarning = () => {
    showWarning("Peringatan!", "Beberapa data mungkin tidak tersimpan")
  }

  const handleTestInfo = () => {
    showInfo("Informasi", "Sistem akan maintenance dalam 30 menit")
  }

  const { flash } = usePage().props
  const { showSuccess, AlertContainer } = useAlert()
  useEffect(() => {
    if (flash.success) {
      showSuccess("Berhasil", flash.success)
    }
  }, [flash.success])

  return (
    <>

<div className="fixed z-[500]">
    <AlertContainer />
    </div>
    <Head title="admin-dashboard"/>
      <div className="flex flex-col min-h-screen bg-background">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <AdminSidebar activeLink={route('admin-dashboard')} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-0">
            {/* Breadcrumb */}
            <Breadcrumb items={breadcrumbItems} />

            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard Admin</h1>
                  <p className="text-muted-foreground">Selamat datang di panel administrasi HerbalCare</p>
                </div>

                {/* Demo Alert Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleTestAlerts} className="bg-green-600 hover:bg-green-700">
                    Test Success
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleTestError}>
                    Test Error
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleTestWarning}>
                    Test Warning
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handleTestInfo}>
                    Test Info
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="hover:shadow-lg transition-all duration-300 h-full  hover:border-l-primary">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                        {stat.icon}
                      </motion.div>
                    </CardHeader>
                    <CardContent>
                      <motion.div
                        className="text-2xl font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
                      >
                        {stat.value}
                      </motion.div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                      <motion.div
                        className="flex items-center mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.6 }}
                      >
                        <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                        <p className="text-xs text-green-600">{stat.trend}</p>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Akses cepat ke fitur utama</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.a
                        key={action.title}
                        href={action.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="p-6 border rounded-lg cursor-pointer hover:bg-muted/50 transition-all duration-300 text-center flex flex-col items-center justify-center gap-3 group"
                      >
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                          {action.icon}
                        </motion.div>
                        <div>
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">{action.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>
        </div>

        {/* Alert Container */}
        <AlertContainer />
      </div>
    </>
  )
}
