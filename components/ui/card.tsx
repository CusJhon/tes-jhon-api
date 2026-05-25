'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient'
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'glass', ...props }, ref) => {
    const variants = {
      default: 'bg-card border border-white/10',
      glass: 'glass-card',
      gradient: 'bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border border-white/10',
    }
    
    return (
      <div ref={ref} className={cn('rounded-2xl transition-all duration-300', variants[variant], className)} {...props}>
        {children}
      </div>
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-6 border-b border-white/10', className)} {...props} />
  )
)
CardHeader.displayName = 'CardHeader'

export const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-4 sm:p-6', className)} {...props} />
  )
)
CardBody.displayName = 'CardBody'