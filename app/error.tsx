'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <html className="dark">
      <body>
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
            <p className="text-gray-400 mb-6 text-sm">
              {error.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={reset} variant="primary">
                Try again
              </Button>
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Go home
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-6 p-4 bg-black/50 rounded-lg text-left text-xs overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
          </div>
        </div>
      </body>
    </html>
  )
}