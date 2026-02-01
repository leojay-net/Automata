
export const SERVICES = [
    { id: '1', name: 'GPT-4 Inference', description: 'High availability LLM inference endpoint with strict SLA. Optimized for reasoning tasks and code generation.', price: '0.05', provider: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', reputation: 98, type: 'Inference', status: 'Active' },
    { id: '2', name: 'Stable Diffusion XL', description: 'Fast image generation service optimized for latency. Supports distinct artistic styles and custom LoRAs.', price: '0.02', provider: '0x456...def', reputation: 92, type: 'Generation', status: 'Active' },
    { id: '3', name: 'Llama 3 70B', description: 'Open source LLM hosting with verified compute credentials. Great for general purpose chat.', price: '0.01', provider: '0x789...ghi', reputation: 85, type: 'Inference', status: 'Congested' },
    { id: '4', name: 'Whisper Audio', description: 'Asynchronous audio transcription and translation. Supports 99 languages.', price: '0.03', provider: '0xabc...123', reputation: 95, type: 'Audio', status: 'Active' },
    { id: '5', name: 'Claude 3 Opus', description: 'Premium reasoning model endpoint. Best for complex analysis.', price: '0.10', provider: '0xdef...456', reputation: 99, type: 'Inference', status: 'Active' },
    { id: '6', name: 'Mistral Large', description: 'European sovereign model hosting. GDPR compliant.', price: '0.04', provider: '0xghi...789', reputation: 88, type: 'Inference', status: 'Active' },
];

export const MOCK_USAGE_WALLETS = [
    {
        address: '0x12a...89b',
        name: 'Dev Environment',
        balance: '45.2',
        policies: [
            { id: 'p1', spender: '0xAgent_Alpha', dailyLimit: '10.0', remaining: '8.4' },
            { id: 'p2', spender: '0xCI_Pipeline', dailyLimit: '5.0', remaining: '5.0' }
        ],
        tags: ['inference', 'testing']
    },
    {
        address: '0x78c...44d',
        name: 'Production Inference',
        balance: '1204.5',
        policies: [
            { id: 'p3', spender: '0xOrchestrator_Main', dailyLimit: '100.0', remaining: '42.1' }
        ],
        tags: ['prod', 'high-availability']
    }
];

export const MOCK_ACTIVITY = [
    { id: 'tx1', service: 'GPT-4 Inference', timestamp: '2 mins ago', cost: '0.05 APT', status: 'Success', wallet: 'Dev Environment' },
    { id: 'tx2', service: 'Stable Diffusion XL', timestamp: '15 mins ago', cost: '0.02 APT', status: 'Success', wallet: 'Dev Environment' },
    { id: 'tx3', service: 'Llama 3 70B', timestamp: '1 hour ago', cost: '0.01 APT', status: 'Failed', wallet: 'Production Inference' },
    { id: 'tx4', service: 'Claude 3 Opus', timestamp: '3 hours ago', cost: '0.10 APT', status: 'Success', wallet: 'Dev Environment' },
    { id: 'tx5', service: 'Whisper Audio', timestamp: '1 day ago', cost: '0.03 APT', status: 'Success', wallet: 'Production Inference' },
];

