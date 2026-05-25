'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Shield, Zap, Activity, Users, Code, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'

const stats = [
  { label: 'Total Endpoints', value: '6+', icon: Code, color: 'cyan' },
  { label: 'API Status', value: 'Online', icon: Shield, color: 'green' },
  { label: 'Daily Requests', value: '150K+', icon: Activity, color: 'purple' },
  { label: 'Happy Users', value: '10K+', icon: Users, color: 'pink' },
]

const words = ['GoPay', 'Dana', 'Call', 'Instagram', 'Nokia', 'Reminder']

export function HeroSection() {
  const [currentWord, setCurrentWord] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      const newParticles = Array.from({ length: 30 }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }))
      setParticles(newParticles)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    
    let timeout: NodeJS.Timeout
    const fullText = words[currentWord]
    
    if (isDeleting) {
      if (text.length === 0) {
        setIsDeleting(false)
        setCurrentWord((prev) => (prev + 1) % words.length)
        timeout = setTimeout(() => {}, 500)
      } else {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 50)
      }
    } else {
      if (text.length === fullText.length) {
        timeout = setTimeout(() => setIsDeleting(true), 2000)
      } else {
        timeout = setTimeout(() => setText(fullText.slice(0, text.length + 1)), 100)
      }
    }
    return () => clearTimeout(timeout)
  }, [text, isDeleting, currentWord, mounted])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" />
      </div>
    )
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute inset-0">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
              style={{
                left: particle.x,
                top: particle.y,
                animation: `float ${Math.random() * 10 + 5}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto text-center">
        <div>
          <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2" />
            <span className="text-sm">API Status: Operational</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6">
            Generate{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {text}
              <span className="inline-block w-1 h-8 sm:h-12 ml-1 bg-cyan-400 animate-pulse" />
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
            Professional API platform for generating fake images for GoPay, Dana, Instagram, and more.
            Fast, reliable, and easy to integrate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 px-4">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="lg">
              <Server className="w-5 h-5" />
              View Documentation
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto px-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="glass-card rounded-2xl p-4 sm:p-6 text-center">
                  <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 text-${stat.color}-400`} />
                  <div className="text-xl sm:text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                </div>
              )
            })}
          </div>

          <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 px-4">
            <span className="text-sm text-gray-500">Trusted by developers using:</span>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {['Node.js', 'Python', 'PHP', 'Java', 'Go'].map(lang => (
                <span key={lang} className="px-2 sm:px-3 py-1 rounded-full glass text-xs">{lang}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center">
          <div className="w-1 h-3 rounded-full bg-cyan-400 mt-2 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-30px); }
        }
      `}</style>
    </section>
  )
}