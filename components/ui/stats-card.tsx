'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

export interface StatsCardProps {
  label: string
  value: string | number
  icon: string
  trend?: number
  color?: 'cyan' | 'purple' | 'green' | 'pink' | 'yellow'
  className?: string
}

const colorMap = {
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20',
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20',
  green: 'from-green-500/20 to-green-600/10 border-green-500/20',
  pink: 'from-pink-500/20 to-pink-600/10 border-pink-500/20',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20',
}

const iconColorMap = {
  cyan: 'text-cyan-400',
  purple: 'text-purple-400',
  green: 'text-green-400',
  pink: 'text-pink-400',
  yellow: 'text-yellow-400',
}

export function StatsCard({ label, value, icon, trend, color = 'cyan', className }: StatsCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Zap
  const isPositiveTrend = trend && trend > 0

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 border backdrop-blur-sm',
        colorMap[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-400 mb-1">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <span className={cn('text-xs', isPositiveTrend ? 'text-green-400' : 'text-red-400')}>
                {isPositiveTrend ? '+' : ''}{trend}%
              </span>
              <span className="text-xs text-gray-500">from last month</span>
            </div>
          )}
        </div>
        <div className={cn('p-3 rounded-xl bg-white/5', iconColorMap[color])}>
          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shimmer" />
    </motion.div>
  )
}