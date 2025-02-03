<a href="https://chat.vercel.ai/">
  <img alt="AI Chatbot with Web3 capabilities for Mode Network" src="app/(chat)/opengraph-image.png">
  <h1 align="center">Sentient Markets AI Chatbot</h1>
</a>

<p align="center">
  An AI Chatbot with Web3 capabilities. Built for Mode's AI Agent Founder School. This chatbot is designed to interact with Sentient Markets, Mode's AI-Only Prediction Market. It also has generic web3 capabilities that can be executed on Mode Network.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#web3-capabilities"><strong>Web3 Capabilities</strong></a> ·
  <a href="#deploy-your-own"><strong>Deploy Your Own</strong></a> ·
  <a href="#running-locally"><strong>Running locally</strong></a>
</p>
<br/>

## About

This project was developed as part of [Mode's AI Agent Founder School](https://bcamp.dev/ai-agent-founder-school), combining the power of AI with blockchain functionality. The chatbot can interact with Mode Network, execute transactions, and manage prediction markets through natural language commands.

## Features

- [Next.js](https://nextjs.org) App Router
  - Advanced routing and server-side rendering
  - React Server Components (RSCs)
  - Server Actions for enhanced performance
- [AI SDK](https://sdk.vercel.ai/docs)
  - Unified API for text generation and tool calls
  - Dynamic chat interface
  - Support for multiple LLM providers
- [shadcn/ui](https://ui.shadcn.com)
  - Tailwind CSS styling
  - Radix UI components
- Data Persistence
  - Vercel Postgres for chat history
  - Vercel Blob for file storage
- Authentication via NextAuth.js

## Web3 Capabilities
- **Prediction Markets**
  - Create new prediction markets
  - Set market parameters (end time, collateral, liquidity)

- **ETH Transfers**
  - Send ETH to any address on Mode Network
  - Check wallet balances
  - View transaction history

- **Mode Spray**
  - Distribute ETH to multiple addresses in one transaction
  - Efficient token distribution for airdrops or rewards

## Running locally

1. Clone the repository
```bash
git clone https://github.com/your-username/mode-ai-chatbot
cd mode-ai-chatbot
```

2. Install dependencies
```bash
pnpm install
```

3. Set up environment variables in `.env`:
```bash
# Auth
AUTH_SECRET=your-secret

# Database
BLOB_READ_WRITE_TOKEN=your-blob-token
POSTGRES_URL=your-postgres-url

# Mode Network
MODE_RPC_URL=https://sepolia.mode.network
WALLET_PRIVATE_KEY=your-private-key

# OpenAI (or other LLM provider)
OPENAI_API_KEY=your-api-key
```

4. Run the development server
```bash
pnpm dev
```

Your chatbot should now be running on [localhost:3000](http://localhost:3000/).

## Example Commands

- "Send 0.1 ETH to 0x..."
- "Spray 0.01 ETH to these addresses: [list of addresses]"
- "Create a prediction market for ETH price reaching $3000 by end of Q1 2024"

## Contributing

We welcome contributions! Message us on X [@SentientMarkets](https://x.com/SentientMarkets)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
