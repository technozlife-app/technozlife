"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const toastConfig: Record<
  ToastType,
  { icon: typeof CheckCircle2; gradient: string; glow: string }
> = {
  success: {
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  error: {
    icon: XCircle,
    gradient: "from-red-500 to-rose-500",
    glow: "shadow-red-500/20",
  },
  warning: {
    icon: AlertCircle,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
  info: {
    icon: Info,
    gradient: "from-blue-500 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback(
    (type: ToastType, title: string, message?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, type, title, message }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className='fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none'>
        <AnimatePresence mode='popLayout'>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type];
            const Icon = config.icon;

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                className={`pointer-events-auto relative bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 pr-12 min-w-[320px] max-w-[400px] shadow-2xl ${config.glow}`}
              >
                {/* Gradient accent bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl bg-gradient-to-b ${config.gradient}`}
                />

                <div className='flex items-start gap-3'>
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full bg-linear-to-br ${config.gradient} flex items-center justify-center`}
                  >
                    <Icon className='w-4 h-4 text-white' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-white text-sm'>
                      {toast.title}
                    </p>
                    {toast.message && (
                      <p className='text-sm text-slate-400 mt-0.5 line-clamp-2'>
                        {toast.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className='absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-colors'
                >
                  <X className='w-4 h-4' />
                </button>

                {/* Progress bar */}
                <motion.div
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5, ease: "linear" }}
                  className={`absolute bottom-0 left-1 right-0 h-0.5 origin-left bg-linear-to-r ${config.gradient} rounded-b-2xl opacity-50`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
