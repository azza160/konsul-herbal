"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExpertSidebar } from "../../layout/ahli-sidebar"
import { AdminHeader } from "../../layout/admin-header"
import { useAlert } from "../../components/myalert"
import { MessageSquare,  Clock, Users, TrendingUp,Hourglass,CheckCircle,XCircle } from "lucide-react"
import { Head,usePage } from "@inertiajs/react"
import { useEffect } from "react"
import { route } from "ziggy-js"
export default function ExpertDashboard() {

  const { flash,jumlahKonsulPending,jumlahKonsulAcc,jumlahKonsulTolak } = usePage().props


  const stats = [
    {
      title: "Konsultasi Pending",
      value: jumlahKonsulPending,
      description: "Menunggu konfirmasi",
      icon: <Hourglass className="h-8 w-8 text-orange-600" />,
    },
    {
      title: "Konsultasi Diterima",
      value: jumlahKonsulAcc,
      description: "Konsultasi yang diterima",
      icon: <CheckCircle className="h-8 w-8 text-blue-600" />,
  
    },
    {
      title: "Konsultasi Ditolak",
      value: jumlahKonsulTolak,
      description: "Konsultasi yang ditolak",
      icon: <XCircle className="h-8 w-8 text-red-600" />,
 
    },
  ]
  

  const quickActions = [
    {
      title: "Konfirmasi Konsultasi",
      description: `${jumlahKonsulPending} Konsultasi Menunggu`,
      icon: <CheckCircle className="h-8 w-8 text-orange-600" />,
      href: route('ahli-konfirmasi'),
    },
    {
      title: "Pesan",
      description: "2 pesan belum dibaca",
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      href: route('ahli-pesan'),
    },
  ]

 
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
          <ExpertSidebar activeLink={route('ahli-dashboard-acount')} />

          <main className="flex-1  overflow-y-auto p-4 md:p-6 lg:p-8 md:ml-0">
            {/* Welcome Section */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">Dashboard Ahli Herbal</h1>
                  <p className="text-muted-foreground">Selamat datang, Dr. Sari Herbal</p>
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
