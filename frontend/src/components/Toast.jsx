import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { CheckCircle2, AlertCircle, X } from 'lucide-react'

const ToastContext = createContext(null)
let idSeq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, type = 'success') => {
      const id = ++idSeq
      setToasts((t) => [...t, { id, message, type }])
      return id
    },
    [],
  )

  const toast = {
    success: (m) => push(m, 'success'),
    error: (m) => push(m, 'error'),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const isError = toast.type === 'error'
  const Icon = isError ? AlertCircle : CheckCircle2

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white px-4 py-3 shadow-card transition ${
        isError ? 'border-red-200' : 'border-emerald-200'
      }`}
      style={{ animation: 'toast-in .2s ease-out' }}
    >
      <Icon size={18} className={isError ? 'text-red-500' : 'text-emerald-500'} />
      <p className="max-w-xs text-sm text-ink">{toast.message}</p>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
        <X size={16} />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast должен использоваться внутри <ToastProvider>')
  return ctx
}
