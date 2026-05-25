'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Shield, Clock, Key, Server, Code, AlertCircle } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/card'

const sections = [
  { 
    title: 'Authentication', 
    icon: Key, 
    content: `All API requests require an API key for authentication. Include your API key in the request headers:
    
\`\`\`
X-API-Key: your_api_key_here
\`\`\`

Get your API key by signing up on our platform. Free tier includes 1000 requests per day.

**Authentication Flow:**
1. Register for an account
2. Generate API key from dashboard
3. Include key in all requests
4. Monitor usage in dashboard` 
  },
  { 
    title: 'Rate Limits', 
    icon: Clock, 
    content: `To ensure fair usage, we enforce rate limits on all endpoints:

• Free Tier: 100 requests per minute
• Pro Tier: 1000 requests per minute
• Enterprise: Custom limits available

Rate limit headers are included in all responses:
\`\`\`
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1620000000
\`\`\`

Exceeding limits will return a 429 status code.` 
  },
  { 
    title: 'Error Handling', 
    icon: AlertCircle, 
    content: `The API uses standard HTTP response codes:

• **200** - Success
• **400** - Bad Request (invalid parameters)
• **401** - Unauthorized (invalid API key)
• **404** - Not Found (endpoint doesn't exist)
• **429** - Too Many Requests (rate limit exceeded)
• **500** - Internal Server Error

Error responses include a detailed message:
\`\`\`json
{
  "error": "Parameter 'saldo' is required",
  "code": "MISSING_PARAMETER"
}
\`\`\`` 
  },
  { 
    title: 'Response Format', 
    icon: Server, 
    content: `All successful image generation requests return the generated image directly as:

- **JPEG** for GoPay and Reminder endpoints
- **PNG** for Dana, Call, Instagram, and Nokia endpoints

Response headers include:
- \`Content-Type\`: image/jpeg or image/png
- \`Content-Disposition\`: attachment; filename="generated.jpg"
- \`Cache-Control\`: no-cache

Example response headers:
\`\`\`
HTTP/1.1 200 OK
Content-Type: image/jpeg
Content-Disposition: attachment; filename="gopay_500000.jpg"
Content-Length: 123456
\`\`\`` 
  },
]

const codeExamples = {
  curl: `curl -X GET "https://api.example.com/api/fake-gopay?saldo=500000" \\
  -H "X-API-Key: your_api_key_here" \\
  --output gopay_image.jpg`,
  javascript: `// Using fetch in Node.js
const fs = require('fs');

fetch('https://api.example.com/api/fake-gopay?saldo=500000', {
  headers: {
    'X-API-Key': 'your_api_key_here'
  }
})
.then(res => res.arrayBuffer())
.then(buffer => {
  fs.writeFileSync('gopay_image.jpg', Buffer.from(buffer));
  console.log('Image saved!');
});`,
  python: `import requests

response = requests.get(
    'https://api.example.com/api/fake-gopay',
    params={'saldo': 500000},
    headers={'X-API-Key': 'your_api_key_here'}
)

if response.status_code == 200:
    with open('gopay_image.jpg', 'wb') as f:
        f.write(response.content)
    print('Image saved!')`,
}

export function DocsSection() {
  const [activeSection, setActiveSection] = useState(0)
  const [activeLang, setActiveLang] = useState<'curl' | 'javascript' | 'python'>('curl')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="py-20">
        <div className="container px-4 mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-4 animate-pulse h-64" />
            <div className="lg:col-span-2 glass-card rounded-2xl p-6 animate-pulse h-64" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <section id="docs" className="py-20 relative">
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
              Documentation
            </span>
          </h2>
          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto px-4">
            Everything you need to integrate our API into your application
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 px-4">
          <Card>
            <CardBody className="p-4">
              {sections.map((section, index) => {
                const Icon = section.icon
                const isActive = activeSection === index
                return (
                  <button
                    key={section.title}
                    onClick={() => setActiveSection(index)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-all mb-2 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-400'
                        : 'hover:bg-white/5 text-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="text-sm sm:text-base">{section.title}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                  </button>
                )
              })}
            </CardBody>
          </Card>

          <div className="lg:col-span-2">
            <Card>
              <CardBody className="p-4 sm:p-6">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="prose prose-invert max-w-none"
                >
                  <div className="flex items-center gap-3 mb-4">
                    {(() => {
                      const Icon = sections[activeSection].icon
                      return <Icon className="w-6 h-6 text-cyan-400" />
                    })()}
                    <h3 className="text-xl sm:text-2xl font-semibold m-0">{sections[activeSection].title}</h3>
                  </div>
                  <div className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-sm sm:text-base">
                    {sections[activeSection].content}
                  </div>
                </motion.div>
              </CardBody>
            </Card>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 px-4"
        >
          <Card>
            <CardBody>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-semibold">Quick Start Examples</h3>
                </div>
                <div className="flex gap-2">
                  {(['curl', 'javascript', 'python'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`px-3 py-1 rounded-lg text-sm transition-all ${
                        activeLang === lang
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {lang === 'curl' ? 'cURL' : lang === 'javascript' ? 'Node.js' : 'Python'}
                    </button>
                  ))}
                </div>
              </div>
              <pre className="bg-black/50 rounded-xl p-4 overflow-x-auto text-xs sm:text-sm font-mono text-gray-300">
                {codeExamples[activeLang]}
              </pre>
              <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <p className="text-sm text-cyan-400 flex items-center gap-2 flex-wrap">
                  <Shield className="w-4 h-4 flex-shrink-0" />
                  <span>Need help? Check our GitHub repository for more examples and SDKs</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}