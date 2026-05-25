'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Home,
  LayoutGrid,
  Code,
  BookOpen,
  Settings,
  HelpCircle,
  Zap,
  Shield,
  Activity,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Users,
  FileText,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'API Tools', href: '#tools', icon: LayoutGrid },
  { name: 'Playground', href: '#playground', icon: Code },
  { name: 'Documentation', href: '#docs', icon: BookOpen },
]

const secondaryNavItems = [
  { name: 'Analytics', href: '/analytics', icon: BarChart3, badge: 'Pro' },
  { name: 'Community', href: '/community', icon: Users },
  { name: 'Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
]

const footerNavItems = [
  { name: 'API Status', href: '/status', icon: Activity },
  { name: 'Security', href: '/security', icon: Shield },
  { name: 'Changelog', href: '/changelog', icon: FileText },
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [activeSection, setActiveSection] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      const sections = mainNavItems.map(item => item.href.replace('#', ''))
      for (const section of sections) {
        if (section === '/') continue
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
          }
        }
      }
    }
    
    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!mounted) {
    return <div className="fixed left-0 top-16 bottom-0 z-40 hidden lg:block w-[280px]" />
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="fixed left-0 top-16 bottom-0 z-40 hidden lg:block"
    >
      <div className="relative h-full">
        <div className="absolute inset-0 glass border-r border-white/10" />
        
        <div className="relative h-full overflow-y-auto py-6 px-3 hide-scrollbar">
          <div className={cn('mb-8 flex items-center', isCollapsed ? 'justify-center' : 'px-3')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 neon-glow" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-3 font-bold text-lg bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
              >
                API Hub
              </motion.span>
            )}
          </div>

          <div className="mb-8">
            {!isCollapsed && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">Main</p>
            )}
            <div className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                const isActive = activeSection === item.href.replace('#', '') || (item.href === '/' && activeSection === '')
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className={cn('w-5 h-5 flex-shrink-0', isActive && 'neon-glow')} />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="mb-8">
            {!isCollapsed && (
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 px-3">Workspace</p>
            )}
            <div className="space-y-1">
              {secondaryNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                      'text-gray-400 hover:text-white hover:bg-white/5'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="space-y-1">
              {footerNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                      'text-gray-500 hover:text-white hover:bg-white/5'
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>

          {!isCollapsed && (
            <div className="mt-8 mx-3 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-cyan-500/20">
              <Star className="w-8 h-8 text-yellow-400 mb-2" />
              <p className="text-sm font-medium mb-1">Upgrade to Pro</p>
              <p className="text-xs text-gray-400 mb-3">Get unlimited requests</p>
              <button className="w-full py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
                Upgrade
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onToggle}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>
      </div>
    </motion.aside>
  )
}