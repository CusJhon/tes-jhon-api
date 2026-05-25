'use client'

import Link from 'next/link'
import { Github, Twitter, Linkedin, Mail, Heart, Activity, Zap, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="border-t border-white/10 pt-12 pb-8 mt-20" />
  }

  return (
    <footer className="relative border-t border-white/10 pt-12 pb-8 mt-20">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600" />
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                API Hub
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Professional API platform for generating fake images. Fast, reliable, and easy to integrate.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><Github className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><Linkedin className="w-5 h-5" /></Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors"><Mail className="w-5 h-5" /></Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-cyan-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="#home" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Home</Link></li>
              <li><Link href="#tools" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">API Tools</Link></li>
              <li><Link href="#playground" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Playground</Link></li>
              <li><Link href="#docs" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Documentation</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-purple-400">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">API Status</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Changelog</Link></li>
              <li><Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors text-sm">Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-cyan-400">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-gray-400">API Status:</span>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="text-gray-400">Uptime:</span>
                <span className="text-white">99.99%</span>
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-gray-400">Response Time:</span>
                <span className="text-white">&lt;500ms</span>
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="text-gray-400">Security:</span>
                <span className="text-white">SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">© {currentYear} API Hub. All rights reserved.</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by API Hub Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}