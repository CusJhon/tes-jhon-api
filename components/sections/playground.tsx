'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Copy, Check, Download, Loader2, ChevronDown, Eye, Code2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { toolsData, Tool } from '@/lib/tools-data'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardBody } from '@/components/ui/card'

export function Playground() {
  const [selectedTool, setSelectedTool] = useState<Tool>(toolsData[0])
  const [params, setParams] = useState<Record<string, string>>({})
  const [response, setResponse] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const buildEndpointUrl = () => {
    const url = new URL(selectedTool.endpoint, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.append(key, value)
    })
    return url.toString()
  }

  const handleExecute = async () => {
    setLoading(true)
    setResponse(null)
    setImageUrl(null)
    const startTime = Date.now()
    
    try {
      const url = buildEndpointUrl()
      const res = await fetch(url)
      
      if (res.ok) {
        const blob = await res.blob()
        const objectUrl = URL.createObjectURL(blob)
        setImageUrl(objectUrl)
        setResponse({
          success: true,
          data: {
            url: objectUrl,
            contentType: blob.type,
            size: `${(blob.size / 1024).toFixed(2)} KB`,
          },
          metadata: {
            request_id: 'req_' + Math.random().toString(36).substring(2, 11),
            processing_time: ((Date.now() - startTime) / 1000).toFixed(2) + 's',
          },
        })
        toast.success('Request completed successfully!')
      } else {
        const error = await res.json()
        throw new Error(error.error || 'Request failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to generate image')
      setResponse({
        success: false,
        error: error.message || 'Failed to generate image',
      })
    }
    setLoading(false)
  }

  const handleCopyResponse = () => {
    const textToCopy = imageUrl || JSON.stringify(response, null, 2)
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    toast.success('Copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (imageUrl) {
      const a = document.createElement('a')
      a.href = imageUrl
      a.download = `${selectedTool.id}_generated.${imageUrl.includes('jpeg') ? 'jpg' : 'png'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setParams({})
    setResponse(null)
    setImageUrl(null)
    toast.info('Form reset')
  }

  if (!mounted) {
    return (
      <div className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-6 animate-pulse h-96" />
            <div className="glass-card rounded-2xl p-6 animate-pulse h-96" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="playground" className="py-20 relative">
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
              Playground
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Test API endpoints in real-time with our interactive playground
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 px-4">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Play className="w-5 h-5 text-cyan-400" />
                Request Configuration
              </h3>
            </CardHeader>
            <CardBody>
              <div className="mb-4">
                <label className="block text-sm text-gray-400 mb-2">Select Endpoint</label>
                <div className="relative">
                  <select
                    value={selectedTool.id}
                    onChange={(e) => {
                      const tool = toolsData.find(t => t.id === e.target.value)
                      if (tool) {
                        setSelectedTool(tool)
                        setParams({})
                        setResponse(null)
                        setImageUrl(null)
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl glass border border-white/10 focus:border-cyan-400 focus:outline-none appearance-none cursor-pointer bg-background"
                  >
                    {toolsData.map(tool => (
                      <option key={tool.id} value={tool.id}>{tool.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="mb-4 p-3 rounded-xl bg-black/50">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-1 rounded text-xs font-mono font-bold ${
                    selectedTool.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedTool.method}
                  </span>
                  <code className="text-sm font-mono text-gray-300 break-all">{selectedTool.endpoint}</code>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm text-gray-400">Parameters</label>
                {selectedTool.parameters.map(param => (
                  <div key={param.name} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder={param.placeholder || param.name}
                      value={params[param.name] || ''}
                      onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                      className="flex-1 px-3 py-2 rounded-lg glass border border-white/10 focus:border-cyan-400 focus:outline-none text-sm bg-background"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{param.type}</span>
                      {param.required && (
                        <span className="text-xs text-red-400">required</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleExecute} loading={loading} className="flex-1">
                  <Play className="w-4 h-4" />
                  Execute Request
                </Button>
                <Button variant="outline" onClick={handleReset} disabled={loading}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Code2 className="w-5 h-5 text-purple-400" />
                Response
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'preview' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white'
                  }`}
                  aria-label="Preview mode"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'code' ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-500 hover:text-white'
                  }`}
                  aria-label="Code mode"
                >
                  <Code2 className="w-4 h-4" />
                </button>
                {response && (
                  <>
                    <button onClick={handleCopyResponse} className="p-2 rounded-lg hover:bg-white/10 transition-all">
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    {imageUrl && (
                      <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-white/10 transition-all">
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </CardHeader>

            <CardBody>
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <Loader2 className="w-12 h-12 animate-spin text-cyan-400 mb-4" />
                    <p className="text-gray-400">Generating image...</p>
                    <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
                  </motion.div>
                ) : response ? (
                  <motion.div
                    key="response"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {viewMode === 'preview' && imageUrl ? (
                      <div className="space-y-4">
                        <div className="rounded-xl overflow-hidden bg-black/50 p-4 flex justify-center">
                          <img
                            src={imageUrl}
                            alt="Generated preview"
                            className="max-w-full rounded-lg shadow-lg"
                          />
                        </div>
                        {response.metadata && (
                          <div className="text-sm text-gray-400 space-y-1 p-3 rounded-lg bg-black/30">
                            <p>Request ID: {response.metadata.request_id}</p>
                            <p>Processing Time: {response.metadata.processing_time}</p>
                            <p>File Size: {response.data?.size}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-sm font-mono text-gray-300 max-h-96 overflow-y-auto">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <Code2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500">Click "Execute Request" to see response</p>
                    <p className="text-sm text-gray-600 mt-2">Try the Fake GoPay API with saldo=500000</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  )
}