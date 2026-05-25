'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, LayoutGrid, Code, BookOpen, Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '#home', icon: Home },
  { name: 'Tools', href: '#tools', icon: LayoutGrid },
  { name: 'Playground', href: '#playground', icon: Code },
  { name: 'Docs', href: '#docs', icon: BookOpen },
]

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return
    
    const handleScroll = () => {
      const sections = navItems.map(item => item.href.slice(1))
      for (const section of sections) {
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

  if (!mounted) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        <div className="glass border-t border-white/10 px-4 py-2 backdrop-blur-xl">
          <div className="flex items-center justify-around">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.href.slice(1)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'text-cyan-400' : 'text-gray-500'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(0,255,255,0.5)]' : ''}`} />
                  <span className="text-xs">{item.name}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-20 right-4 z-50 md:hidden w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        <Menu className="w-6 h-6 text-white" />
      </button>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 md:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-80 glass z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-lg glass"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-4 p-4 rounded-xl glass-card hover:bg-white/5 transition-all"
                      >
                        <Icon className="w-6 h-6 text-cyan-400" />
                        <span className="text-lg">{item.name}</span>
                      </Link>
                    )
                  })}
                  <button className="w-full mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-medium">
                    Get API Key
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}