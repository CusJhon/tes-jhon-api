'use client'

import dynamic from 'next/dynamic'
import { Suspense, useEffect, useState } from 'react'
import Loading from './loading'

// Dynamic imports untuk komponen berat - SSR di disable
const HeroSection = dynamic(
  () => import('@/components/sections/hero-section').then(mod => mod.HeroSection),
  { 
    ssr: false,
    loading: () => <div className="min-h-[60vh] flex items-center justify-center"><div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-500 animate-spin" /></div>
  }
)

const ToolsSection = dynamic(
  () => import('@/components/sections/tools-section').then(mod => mod.ToolsSection),
  { 
    ssr: false,
    loading: () => <div className="py-20"><div className="container mx-auto px-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"><div className="glass-card rounded-2xl p-6 animate-pulse"><div className="h-40 bg-white/5 rounded-lg" /></div><div className="glass-card rounded-2xl p-6 animate-pulse"><div className="h-40 bg-white/5 rounded-lg" /></div><div className="glass-card rounded-2xl p-6 animate-pulse"><div className="h-40 bg-white/5 rounded-lg" /></div></div></div></div>
  }
)

const Playground = dynamic(
  () => import('@/components/sections/playground').then(mod => mod.Playground),
  { 
    ssr: false,
    loading: () => <div className="py-20"><div className="container mx-auto px-4"><div className="glass-card rounded-2xl p-6 animate-pulse"><div className="h-96 bg-white/5 rounded-lg" /></div></div></div>
  }
)

const DocsSection = dynamic(
  () => import('@/components/sections/docs-section').then(mod => mod.DocsSection),
  { 
    ssr: false,
    loading: () => <div className="py-20"><div className="container mx-auto px-4"><div className="glass-card rounded-2xl p-6 animate-pulse"><div className="h-64 bg-white/5 rounded-lg" /></div></div></div>
  }
)

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <Loading />
  }

  return (
    <Suspense fallback={<Loading />}>
      <HeroSection />
      <ToolsSection />
      <Playground />
      <DocsSection />
    </Suspense>
  )
}