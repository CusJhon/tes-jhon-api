'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Grid3x3, List } from 'lucide-react'
import { ApiCard } from '@/components/api-card'
import { toolsData, categories } from '@/lib/tools-data'
import { SearchBar } from '@/components/ui/search-bar'
import { CategoryFilter } from '@/components/ui/category-filter'

export function ToolsSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredTools = toolsData.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || tool.tags.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  if (!mounted) {
    return (
      <div className="py-20">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <div className="h-12 w-48 bg-white/5 rounded-lg mx-auto mb-4 animate-pulse" />
            <div className="h-6 w-96 bg-white/5 rounded-lg mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="tools" className="py-20 relative">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            API{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Tools
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Explore our collection of powerful API endpoints for image generation
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 mb-8 px-4">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearchQuery}
              placeholder="Search APIs by name or description..."
              suggestions={toolsData.map(t => t.name)}
              recentSearches={[]}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <CategoryFilter
              categories={categories.map(cat => ({ ...cat, count: toolsData.filter(t => cat.value === 'all' || t.tags.includes(cat.value)).length }))}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
              variant="pills"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-400' : 'glass text-gray-400'
              }`}
              aria-label="Grid view"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-cyan-500/20 text-cyan-400' : 'glass text-gray-400'
              }`}
              aria-label="List view"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-500 px-4">
          Found {filteredTools.length} {filteredTools.length === 1 ? 'API' : 'APIs'}
        </div>

        <div className={`grid gap-6 px-4 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {filteredTools.map((tool, index) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <ApiCard {...tool} />
            </motion.div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400">No APIs found matching your criteria</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-4 px-4 py-2 rounded-lg glass text-cyan-400 hover:text-white transition-colors"
            >
              Clear filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}