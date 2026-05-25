export interface Tool {
  id: string
  name: string
  description: string
  endpoint: string
  method: 'GET' | 'POST'
  icon: string
  tags: string[]
  status: 'online' | 'beta' | 'deprecated'
  parameters: Array<{ name: string; type: string; required: boolean; placeholder?: string }>
}

export const toolsData: Tool[] = [
  {
    id: 'fake-gopay',
    name: 'Fake GoPay',
    description: 'Generate fake GoPay balance image with customizable amount, coins, and usage period',
    endpoint: '/api/fake-gopay',
    method: 'GET',
    icon: 'Wallet',
    tags: ['payment', 'e-wallet'],
    status: 'online',
    parameters: [
      { name: 'saldo', type: 'number', required: false, placeholder: '500000' },
      { name: 'koin', type: 'number', required: false, placeholder: '159' },
      { name: 'bulan', type: 'string', required: false, placeholder: 'Mei' },
    ],
  },
  {
    id: 'fake-dana',
    name: 'Fake Dana',
    description: 'Generate fake DANA balance image with custom nominal value',
    endpoint: '/api/fake-dana',
    method: 'GET',
    icon: 'CreditCard',
    tags: ['payment', 'e-wallet'],
    status: 'online',
    parameters: [
      { name: 'saldo', type: 'number', required: true, placeholder: '150000' },
    ],
  },
  {
    id: 'fake-call',
    name: 'Fake Call',
    description: 'Generate fake incoming call screen image with custom contact info',
    endpoint: '/api/fake-call',
    method: 'GET',
    icon: 'Phone',
    tags: ['communication', 'call'],
    status: 'online',
    parameters: [
      { name: 'name', type: 'string', required: false, placeholder: 'Ditzzx' },
      { name: 'duration', type: 'string', required: false, placeholder: '19.45' },
      { name: 'avatar', type: 'url', required: false, placeholder: 'https://...' },
    ],
  },
  {
    id: 'fake-ig',
    name: 'Fake Instagram',
    description: 'Generate fake Instagram story image with custom text highlighting using [brackets] for red color',
    endpoint: '/api/fake-ig',
    method: 'GET',
    icon: 'Instagram',
    tags: ['social', 'instagram'],
    status: 'online',
    parameters: [
      { name: 'text', type: 'string', required: true, placeholder: 'Hello [World]' },
      { name: 'name', type: 'string', required: false, placeholder: 'Someone' },
      { name: 'avatar', type: 'url', required: false, placeholder: 'https://...' },
    ],
  },
  {
    id: 'quote-nokia',
    name: 'Quote Nokia',
    description: 'Generate vintage Nokia-style quote image with classic monochrome aesthetic',
    endpoint: '/api/quote-nokia',
    method: 'GET',
    icon: 'Quote',
    tags: ['quote', 'vintage', 'retro'],
    status: 'online',
    parameters: [
      { name: 'text', type: 'string', required: true, placeholder: 'Your inspirational quote here...' },
      { name: 'sender', type: 'string', required: false, placeholder: 'Jhon' },
    ],
  },
  {
    id: 'reminder',
    name: 'Reminder',
    description: 'Generate elegant reminder image with beautiful typography and highlighted text using [brackets]',
    endpoint: '/api/reminder',
    method: 'GET',
    icon: 'Bell',
    tags: ['productivity', 'reminder'],
    status: 'beta',
    parameters: [
      { name: 'text', type: 'string', required: true, placeholder: '[Meeting] at 3PM tomorrow' },
      { name: 'author', type: 'string', required: false, placeholder: 'Someone' },
    ],
  },
]

export const categories = [
  { value: 'all', label: 'All' },
  { value: 'payment', label: 'Payment' },
  { value: 'e-wallet', label: 'E-Wallet' },
  { value: 'social', label: 'Social' },
  { value: 'quote', label: 'Quotes' },
  { value: 'productivity', label: 'Productivity' },
  { value: 'retro', label: 'Retro' },
]