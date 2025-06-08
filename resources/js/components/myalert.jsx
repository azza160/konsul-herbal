"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const alertVariants = {
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-950",
    borderColor: "border-green-200 dark:border-green-800",
    iconColor: "text-green-600 dark:text-green-400",
    textColor: "text-green-800 dark:text-green-200",
    titleColor: "text-green-900 dark:text-green-100",
  },
  error: {
    icon: AlertCircle,
    bgColor: "bg-red-50 dark:bg-red-950",
    borderColor: "border-red-200 dark:border-red-800",
    iconColor: "text-red-600 dark:text-red-400",
    textColor: "text-red-800 dark:text-red-200",
    titleColor: "text-red-900 dark:text-red-100",
  },
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    iconColor: "text-yellow-600 dark:text-yellow-400",
    textColor: "text-yellow-800 dark:text-yellow-200",
    titleColor: "text-yellow-900 dark:text-yellow-100",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-950",
    borderColor: "border-blue-200 dark:border-blue-800",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-800 dark:text-blue-200",
    titleColor: "text-blue-900 dark:text-blue-100",
  },
}

export function AlertDynamic({
  type = "info",
  title,
  message,
  isVisible = false,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  position = "top-right",
  className,
  showIcon = true,
  closable = true,
  actions = null,
}) {
  const [show, setShow] = useState(isVisible)

  useEffect(() => {
    setShow(isVisible)
  }, [isVisible])

  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(() => {
        handleClose()
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
  }, [show, autoClose, autoCloseDelay])

  const handleClose = () => {
    setShow(false)
    setTimeout(() => {
      onClose?.()
    }, 300) // Wait for animation to complete
  }

  const variant = alertVariants[type]
  const IconComponent = variant.icon

  const positionClasses = {
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4",
    "top-center": "top-4 left-1/2 transform -translate-x-1/2",
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-center": "bottom-4 left-1/2 transform -translate-x-1/2",
    center: "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: position.includes("top") ? -20 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: position.includes("top") ? -20 : 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn("fixed z-[300] w-full max-w-sm mx-4 sm:mx-0 sm:w-96", positionClasses[position], className)}
        >
          <div
            className={cn(
              "relative rounded-lg border p-4 shadow-lg backdrop-blur-sm",
              variant.bgColor,
              variant.borderColor,
            )}
          >
            {/* Progress bar for auto-close */}
            {autoClose && (
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: autoCloseDelay / 1000, ease: "linear" }}
                className="absolute top-0 left-0 h-1 bg-current opacity-20 rounded-t-lg"
              />
            )}

            <div className="flex items-start space-x-3">
              {/* Icon */}
              {showIcon && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                  className="flex-shrink-0"
                >
                  <IconComponent className={cn("h-5 w-5", variant.iconColor)} />
                </motion.div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <motion.h4
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className={cn("text-sm font-semibold", variant.titleColor)}
                  >
                    {title}
                  </motion.h4>
                )}

                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={cn("text-sm", variant.textColor, title ? "mt-1" : "")}
                  >
                    {message}
                  </motion.p>
                )}

                {/* Actions */}
                {actions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="mt-3 flex space-x-2"
                  >
                    {actions}
                  </motion.div>
                )}
              </div>

              {/* Close Button */}
              {closable && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-6 w-6 rounded-full hover:bg-current hover:bg-opacity-20", variant.textColor)}
                    onClick={handleClose}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook untuk menggunakan alert dengan mudah
export function useAlert() {
  const [alerts, setAlerts] = useState([])

  const showAlert = (alertConfig) => {
    const id = Date.now() + Math.random()
    const newAlert = { id, ...alertConfig, isVisible: true }

    setAlerts((prev) => [...prev, newAlert])

    // Auto remove after delay
    setTimeout(() => {
      removeAlert(id)
    }, alertConfig.autoCloseDelay || 5000)

    return id
  }

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const showSuccess = (title, message, options = {}) => {
    return showAlert({ type: "success", title, message, ...options })
  }

  const showError = (title, message, options = {}) => {
    return showAlert({ type: "error", title, message, ...options })
  }

  const showWarning = (title, message, options = {}) => {
    return showAlert({ type: "warning", title, message, ...options })
  }

  const showInfo = (title, message, options = {}) => {
    return showAlert({ type: "info", title, message, ...options })
  }

  const AlertContainer = () => (
    <div className="fixed inset-0 pointer-events-none z-50">
      {alerts.map((alert, index) => (
        <AlertDynamic
          key={alert.id}
          {...alert}
          onClose={() => removeAlert(alert.id)}
          className={`pointer-events-auto ${index > 0 ? "mt-2" : ""}`}
          style={{
            top: alert.position?.includes("top") ? `${4 + index * 6}rem` : undefined,
            bottom: alert.position?.includes("bottom") ? `${4 + index * 6}rem` : undefined,
          }}
        />
      ))}
    </div>
  )

  return {
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeAlert,
    AlertContainer,
    alerts,
  }
}
