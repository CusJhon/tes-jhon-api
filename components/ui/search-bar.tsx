'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Command, History, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  suggestions?: string[]
  recentSearches?: string[]
  className?: string
}

export function SearchBar({
  onSearch,
  placeholder = 'Search APIs...',
  suggestions = [],
  recentSearches = [],
  className,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    
    if (typeof window === 'undefined') return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!mounted) {
    return <div className="h-12 rounded-xl glass border border-white/10 animate-pulse" />
  }

  const handleSubmit = (value: string) => {
    setQuery(value)
    onSearch(value)
    setShowSuggestions(false)
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  const filteredSuggestions = suggestions.filter(s => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0)
  const showRecent = recentSearches.length > 0 && query.length === 0 && showSuggestions
  const showFilteredSuggestions = filteredSuggestions.length > 0 && query.length > 0 && showSuggestions

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-xl glass border transition-all duration-200',
        isFocused ? 'border-cyan-400 shadow-lg shadow-cyan-500/10' : 'border-white/10 hover:border-white/20'
      )}>
        <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { setIsFocused(true); setShowSuggestions(true) }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(query) }}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-sm sm:text-base"
        />
        {query && (
          <button onClick={handleClear} className="p-1 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      <AnimatePresence>
        {(showRecent || showFilteredSuggestions) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 glass rounded-xl border border-white/10 overflow-hidden z-50"
          >
            {showRecent && (
              <div>
                <div className="px-4 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <History className="w-3 h-3" />
                    <span>Recent Searches</span>
                  </div>
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubmit(search)}
                    className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <History className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{search}</span>
                  </button>
                ))}
              </div>
            )}
            {showFilteredSuggestions && (
              <div>
                <div className="px-4 py-2 border-b border-white/10">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <TrendingUp className="w-3 h-3" />
                    <span>Suggestions</span>
                  </div>
                </div>
                {filteredSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubmit(suggestion)}
                    className="w-full px-4 py-2 text-left hover:bg-white/5 transition-colors flex items-center gap-2"
                  >
                    <Search className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{suggestion}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}