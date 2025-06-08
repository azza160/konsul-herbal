"use client"

import { motion } from "framer-motion"
import { Link } from "@inertiajs/react"

export function Footer() {
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
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="border-t bg-muted/50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <motion.div variants={itemVariants} className="space-y-4">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
              <motion.div
                className="h-8 w-8 rounded-full bg-primary"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              ></motion.div>
              <span className="text-xl font-bold text-primary">HerbalCare</span>
            </motion.div>
            <p className="text-sm text-muted-foreground">
              Platform konsultasi herbal terpercaya untuk kesehatan alami Anda.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { href: "/", label: "Beranda" },
                { href: "/about", label: "Tentang Kami" },
                { href: "/articles", label: "Artikel" },
                { href: "/experts", label: "Ahli Herbal" },
              ].map((link, index) => (
                <motion.div key={link.href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              {[
                { href: "/help", label: "Bantuan" },
                { href: "/faq", label: "FAQ" },
                { href: "/contact", label: "Kontak" },
              ].map((link, index) => (
                <motion.div key={link.href} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                  <Link
                    href={link.href}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <motion.p whileHover={{ scale: 1.02 }}>Email: info@herbalcare.com</motion.p>
              <motion.p whileHover={{ scale: 1.02 }}>Phone: +62 123 456 789</motion.p>
              <motion.p whileHover={{ scale: 1.02 }}>Address: Jakarta, Indonesia</motion.p>
            </div>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 HerbalCare. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  )
}
