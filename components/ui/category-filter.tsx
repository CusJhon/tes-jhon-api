'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import * as Icons from 'lucide-react'

export interface Category {
  value: string
  label: string
  icon?: string
  count?: number
}

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onSelect: (category: string) => void
  variant?: 'pills' | 'buttons' | 'tabs'
  className?: string
}

const iconMap: Record<string, any> = {
  all: Icons.Grid3x3,
  payment: Icons.CreditCard,
  'e-wallet': Icons.Wallet,
  social: Icons.Instagram,
  quote: Icons.Quote,
  productivity: Icons.Bell,
  retro: Icons.Clock,
}

export function CategoryFilter({ categories, selectedCategory, onSelect, variant = 'pills', className }: CategoryFilterProps) {
  const variants = {
    pills: {
      container: 'flex flex-wrap gap-2',
      button: (isSelected: boolean) => cn(
        'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all duration-200 text-sm sm:text-base',
        isSelected ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-lg shadow-cyan-500/20' : 'glass text-gray-400 hover:text-white hover:bg-white/5'
      ),
    },
    buttons: {
      container: 'flex gap-1 p-1 rounded-xl glass overflow-x-auto hide-scrollbar',
      button: (isSelected: boolean) => cn(
        'px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg whitespace-nowrap transition-all duration-200 text-sm sm:text-base',
        isSelected ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white' : 'text-gray-400 hover:text-white'
      ),
    },
    tabs: {
      container: 'flex border-b border-white/10 overflow-x-auto hide-scrollbar',
      button: (isSelected: boolean) => cn(
        'px-3 sm:px-4 py-2 whitespace-nowrap transition-all duration-200 relative text-sm sm:text-base',
        isSelected ? 'text-cyan-400' : 'text-gray-400 hover:text-white',
        isSelected && 'after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-cyan-500 after:to-purple-600'
      ),
    },
  }

  const currentVariant = variants[variant]

  return (
    <div className={cn(currentVariant.container, className)}>
      {categories.map((category, index) => {
        const isSelected = selectedCategory === category.value
        const Icon = category.icon ? iconMap[category.icon] : null
        return (
          <motion.button
            key={category.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelect(category.value)}
            className={currentVariant.button(isSelected)}
          >
            <div className="flex items-center gap-1 sm:gap-2">
              {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
              <span>{category.label}</span>
              {category.count !== undefined && (
                <span className={cn('text-xs px-1.5 py-0.5 rounded-full', isSelected ? 'bg-white/20' : 'bg-white/10')}>
                  {category.count}
                </span>
              )}
            </div>
          </motion.button>
        )
      })}
    </div>
  )
}