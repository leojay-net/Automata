# automata Protocol - Getting Started Guide

This guide explains how to run and test the automata Protocol platform locally.

## Prerequisites

- **Node.js** v18+ 
- **npm** v9+
- **Aptos CLI** (optional, for contract deployment)

## Project Structure

```
automata-protocol/
├── apps/
│   └── marketplace/      # Next.js web application
├── packages/
│   ├── sdk/              # TypeScript SDK
│   └── cli/              # Command-line interface
├── services/
│   └── indexer/          # Discovery service API
└── contracts/            # Move smart contracts
```

---

## 1. Install Dependencies

From the project root, install all workspace dependencies:

```bash
cd automata-protocol
npm install
```

---

## 2. Build All Packages

Build the SDK, CLI, and Indexer:

```bash
# Build SDK
npm run build --workspace=packages/sdk

# Build CLI
npm run build --workspace=packages/cli

# Build Indexer
npm run build --workspace=services/indexer
```

Or build all at once:

```bash
npm run build --workspaces
```

---

## 3. Running the Platform

### 3.1 Start the Indexer Service

The indexer syncs on-chain data and provides a REST API for service discovery.

```bash
cd services/indexer

# Development mode (with hot reload)
npm run dev

# Or production mode
npm run build && npm start
```

The indexer runs on `http://localhost:3001`.

**Test the indexer:**

```bash
# Health check
curl http://localhost:3001/health

# List services
curl http://localhost:3001/services

# Search with filters
curl "http://localhost:3001/services?q=gpt&maxPrice=1000"

# Find cheapest service
curl "http://localhost:3001/discover/cheapest?tags=inference"
```

---

### 3.2 Start the Marketplace Web App

```bash
cd apps/marketplace

# Development mode
npm run dev

# Or build and start production
npm run build && npm start
```

The app runs on `http://localhost:3000`.

**Available Pages:**

| Route            | Description                    |
| ---------------- | ------------------------------ |
| `/`              | Landing page with service grid |
| `/app`           | Dashboard (requires wallet)    |
| `/app/wallets`   | Manage Usage Wallets           |
| `/app/policies`  | Manage Spend Policies          |
| `/app/services`  | Browse Marketplace             |
| `/app/publish`   | Publish a Service              |
| `/app/agents`    | Agent Identity & Reputation    |
| `/app/analytics` | Usage Analytics                |
| `/app/settings`  | Account Settings               |
| `/app/docs`      | In-app CLI Documentation       |
| `/docs`          | Full Documentation             |

---

### 3.3 Using the CLI

After building, you can use the CLI directly:

```bash
cd packages/cli

# Show all commands
node dist/index.js --help

# Wallet commands
node dist/index.js wallet --help
node dist/index.js wallet create --fund 1.0

# Policy commands
node dist/index.js policy --help
node dist/index.js policy attach --wallet 0x123... --spender 0x456... --max-per-call 0.1

# Search for services
node dist/index.js search "gpt" --max-price 0.05

# Call a service
node dist/index.js call openai-gpt4 /v1/chat --wallet 0x123... --data '{"prompt": "Hello"}'

# Agent commands
node dist/index.js agent register --name "My Agent"
node dist/index.js agent init-reputation
node dist/index.js agent info --address 0x123...
```

**Install CLI globally (optional):**

```bash
cd packages/cli
npm link

# Now you can use it as:
automata wallet create --fund 1.0
automata search "image" --max-price 0.1
```

---

## 4. Testing the Platform

### 4.1 Verify All Builds

```bash
# From project root
npm run build --workspace=packages/sdk && echo "✅ SDK OK"
npm run build --workspace=packages/cli && echo "✅ CLI OK"
npm run build --workspace=services/indexer && echo "✅ Indexer OK"
npm run build --workspace=apps/marketplace && echo "✅ Marketplace OK"
```

### 4.2 Test CLI Commands

```bash
cd packages/cli

# Test help commands work
node dist/index.js --help
node dist/index.js wallet --help
node dist/index.js policy --help
node dist/index.js agent --help
node dist/index.js search --help
node dist/index.js call --help
```

### 4.3 Test Indexer API

Start the indexer first, then:

```bash
# Health check
curl http://localhost:3001/health
# Expected: {"status":"ok","lastSync":0,"serviceCount":0}

# List services (empty until contracts deployed)
curl http://localhost:3001/services
# Expected: {"count":0,"lastSync":0,"services":[]}

# Force sync
curl -X POST http://localhost:3001/sync
# Expected: {"status":"synced","count":0,"timestamp":...}
```

### 4.4 Test Marketplace App

1. Start the app: `npm run dev` in `apps/marketplace`
2. Open `http://localhost:3000`
3. Click **"Launch App"** to go to the dashboard
4. Connect an Aptos wallet (Petra, Martian, etc.)
5. Navigate through all pages to verify they load

**Page Checklist:**
- [ ] Landing page loads with service grid
- [ ] Dashboard shows stats and activity
- [ ] Wallets page shows create button
- [ ] Policies page shows table and attach modal
- [ ] Services page shows marketplace grid
- [ ] Publish page shows form
- [ ] Agents page shows identity card
- [ ] Analytics page shows charts
- [ ] Settings page shows form
- [ ] Docs page shows documentation

---

## 5. Development Workflow

### Run Everything in Development Mode

Open 3 terminal tabs:

**Terminal 1 - Indexer:**
```bash
cd services/indexer && npm run dev
```

**Terminal 2 - Marketplace:**
```bash
cd apps/marketplace && npm run dev
```

**Terminal 3 - CLI (for testing):**
```bash
cd packages/cli && npm run build
node dist/index.js search "test"
```

---

## 6. Environment Variables

### Indexer (`services/indexer/.env`)

```env
PORT=3001
APTOS_NETWORK=testnet
Automata_MODULE_ID=0x1::automata
```

### Marketplace (`apps/marketplace/.env.local`)

```env
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_MODULE_ID=0x1::automata
NEXT_PUBLIC_INDEXER_URL=http://localhost:3001
```

---

## 7. Troubleshooting

### "Module not found" errors
```bash
# Rebuild all packages
npm run build --workspaces
```

### Indexer sync failures
This is expected if contracts aren't deployed. The indexer will show:
```
[Indexer] Sync failed: ...GlobalRegistry...
```
The API still works, it just returns empty results.

### Port already in use
```bash
# Kill processes on port 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Wallet not connecting
- Make sure you have an Aptos wallet extension installed (Petra, Martian, Pontem)
- Check you're on the correct network (testnet)

---

## 8. Next Steps

1. **Deploy Contracts** - Deploy Move contracts to testnet for full functionality
2. **Fund Wallet** - Get testnet APT from the [Aptos Faucet](https://aptos.dev/faucet)
3. **Create Usage Wallet** - Use the app or CLI to create a pre-funded wallet
4. **Publish a Service** - List your own AI service on the marketplace
5. **Make API Calls** - Use the SDK or CLI to call paid services

---

## Quick Reference

| Component   | Command              | URL                   |
| ----------- | -------------------- | --------------------- |
| Marketplace | `npm run dev`        | http://localhost:3000 |
| Indexer     | `npm run dev`        | http://localhost:3001 |
| CLI         | `node dist/index.js` | N/A                   |

| CLI Command                                     | Description         |
| ----------------------------------------------- | ------------------- |
| `automata wallet create --fund 1.0`                 | Create usage wallet |
| `automata policy attach --wallet ... --spender ...` | Attach policy       |
| `automata search "gpt"`                             | Search services     |
| `automata call <api> <path>`                        | Call paid API       |
| `automata agent register --name "..."`              | Register agent      |
