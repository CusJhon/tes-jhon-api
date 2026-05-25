'use client'

import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering Toaster until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <>
      {children}
      <Toaster 
        position="top-right" 
        richColors 
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.9)',
            border: '1px solid rgba(0, 255, 255, 0.2)',
            color: '#fff',
            borderRadius: '12px',
          },
          className: 'glass',
        }}
      />
    </>
  )
}