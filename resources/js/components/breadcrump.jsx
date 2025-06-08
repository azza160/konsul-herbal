"use client"

import { motion } from "framer-motion"
import { ChevronRight, Home } from "lucide-react"
import { Link } from "@inertiajs/react"
import { cn } from "@/lib/utils"

export function Breadcrumb({ items, className }) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("flex items-center space-x-1 text-sm text-muted-foreground mb-6", className)}
    >
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href="/" className="flex items-center hover:text-primary transition-colors duration-200">
          <Home className="h-4 w-4" />
        </Link>
      </motion.div>

      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          className="flex items-center space-x-1"
        >
          <ChevronRight className="h-4 w-4" />
          {item.href ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href={item.href} className="hover:text-primary transition-colors duration-200 font-medium">
                {item.label}
              </Link>
            </motion.div>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </motion.div>
      ))}
    </motion.nav>
  )
}
