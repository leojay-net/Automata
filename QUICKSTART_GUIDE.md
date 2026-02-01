# automata Protocol: Quickstart & FAQ

This guide answers common questions about using the automata Protocol playground.

## 1. How do I attach a Policy to an Agent?

**Does not require creating a new account.** You just need the *address* of the wallet (agent) you want to authorize.

### Steps:
1.  **Identify the Agent's Address**:
    *   If you are testing with a friend or a secondary wallet, ask for their address.
    *   If you want to simulate an agent yourself, you can create a new account in your Petra wallet or use the CLI to generate one.
    *   *Tip:* You can use `0x1` or any random address for testing if you just want to see the UI update, but real transactions will fail if that agent doesn't try to spend.

2.  **Copy the Address**:
    *   Copy the 64-character hex string (e.g., `0x123...abc`).

3.  **Attach Policy**:
    *   Go to **Policies** in the app.
    *   Click **Attach Policy**.
    *   Paste the address into the **Spender Address** field.
    *   Set a **Max Daily Spend** (e.g., 10 APT).
    *   Click **Attach Policy** and approve the transaction.

Once attached, this "Agent" is now authorized to spend up to 10 APT/day from your Usage Wallet on your behalf.

---

## 2. How do I create an agent as a seller? (Provider)

In automata, "Sellers" are called **Providers**. Any address can register a service to become a provider.

### Steps:
1.  **Switch to the Provider Account**:
    *   In your wallet (e.g., Petra), switch to the account you want to receive payments.

2.  **Publish Service**:
    *   Go to the **Publish** page (`/app/publish`).
    *   Fill in the details:
        *   **Service Name**: e.g., "Llama-3-Inference"
        *   **Price**: Cost per call (e.g., 0.01 APT).
        *   **Endpoint**: The URL where your agent/API lives (optional for on-chain listing).
    *   Click **Publish Service**.

3.  **Verification**:
    *   Once the transaction confirms, your service is listed in the global registry.
    *   Buyers can now find it on the **Services** page.

---

## 3. How do buyers get to use it programmatically?

Buyers (Agents) interact with the protocol via the **automata SDK** or **CLI**. They do not use the UI website to buy services; they use code.

### Option A: Using the CLI (Easiest for testing)
Use the CLI to simulate an agent exploring and buying a service.

```bash
# 1. Search for a service
automata search --query "Llama"

# 2. Call the service (paying from your Usage Wallet)
automata call --service "Llama-3-Inference" --wallet <USAGE_WALLET_ADDR> --input '{"prompt": "Hello world"}'
```

### Option B: Using the SDK (For building actual bots)
If you are building a Python or Node.js bot, use the client library.

**TypeScript Example:**
```typescript
import { AutomataClient } from '@automata-protocol/sdk';

// 1. Initialize Client
const client = new AutomataClient({
    network: 'testnet',
    account: agentAccount // Your private key signer
});

// 2. Find a service
const service = await client.discovery.find('Llama-3-Inference');

// 3. Execute Payment & Call
// This automatically checks policies and pays the provider
const response = await client.executeService({
    provider: service.provider_address,
    amount: service.price,
    payload: { prompt: "Explain quantum computing" }
});

console.log(response);
```

### Summary of Flow
1.  **Human** funds Usage Wallet & sets Policy (UI).
2.  **Provider** publishes Service (UI/CLI).
3.  **Agent (Bot)** runs code (SDK) to find Provider and spend funds from Usage Wallet.
