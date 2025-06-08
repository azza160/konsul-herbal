"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExpertSidebar } from "../../layout/ahli-sidebar"
import { AdminHeader } from "../../layout/admin-header"
import { useAlert } from "../../components/myalert"
import { MessageSquare, CheckCircle, Clock, Users, TrendingUp } from "lucide-react"
import { Head,usePage } from "@inertiajs/react"
import { useEffect } from "react"
export default function ExpertDashboard() {

  const stats = [
    {
      title: "Konsultasi Pending",
      value: "8",
      description: "Menunggu konfirmasi",
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      trend: "3 konsultasi baru hari ini",
    },
    {
      title: "Konsultasi Aktif",
      value: "12",
      description: "Sedang berlangsung",
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      trend: "2 pesan belum dibaca",
    },
    {
      title: "Total Pasien",
      value: "156",
      description: "Pasien yang pernah dikonsultasi",
      icon: <Users className="h-8 w-8 text-green-600" />,
      trend: "+5 pasien baru minggu ini",
    },
  ]

  const quickActions = [
    {
      title: "Konfirmasi Konsultasi",
      description: "8 konsultasi menunggu",
      icon: <CheckCircle className="h-8 w-8 text-orange-600" />,
      href: "/expert/consultations",
    },
    {
      title: "Pesan",
      description: "2 pesan belum dibaca",
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      href: "/expert/messages",
    },
  ]

  // Demo alert functions
  const handleAcceptConsultation = () => {
    showSuccess("Konsultasi Diterima!", "Konsultasi dengan pasien telah diterima")
  }

  const handleRejectConsultation = () => {
    showError("Konsultasi Ditolak", "Konsultasi dengan pasien telah ditolak")
  }

  const handleNewMessage = () => {
    showInfo("Pesan Baru", "Anda memiliki pesan baru dari pasien")
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
    <Head title="ahli-dashboard"/>
      <div className="flex flex-col min-h-screen bg-background">
        <AdminHeader />
        <div className="flex flex-1 overflow-hidden">
          <ExpertSidebar activeLink={route('ahli-dashboard')} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-0">
            {/* Welcome Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard Ahli Herbal</h1>
                  <p className="text-muted-foreground">Selamat datang, Dr. Sari Herbal</p>
                </div>

                {/* Demo Alert Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handleAcceptConsultation} className="bg-green-600 hover:bg-green-700">
                    Terima Konsultasi
                  </Button>
                  <Button size="sm" variant="destructive" onClick={handleRejectConsultation}>
                    Tolak Konsultasi
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleNewMessage}>
                    Pesan Baru
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Card className="hover:shadow-md transition-shadow h-full">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      {stat.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-3 w-3 text-blue-600 mr-1" />
                        <p className="text-xs text-blue-600">{stat.trend}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Aksi Cepat</CardTitle>
                  <CardDescription>Akses cepat ke fitur utama</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {quickActions.map((action, index) => (
                      <motion.a
                        key={action.title}
                        href={action.href}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors flex items-center space-x-4"
                      >
                        {action.icon}
                        <div>
                          <p className="font-medium">{action.title}</p>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
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
