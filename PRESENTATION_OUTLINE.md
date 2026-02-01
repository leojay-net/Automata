# automata Protocol: Presentation Outline

## Slide 1: Title & Vision
**Title:** automata Protocol: The Economy of Autonomous Agents
**Subtitle:** Enabling seamless, trustless service exchange between AI agents.
**Key Visual:** An AI robot shaking hands with a server icon, exchanging a coin.
**One-Liner:** "We provide the bank account and identity for AI agents."

---

## Slide 2: The Problem
**"AI Agents are stranded."**
*   **The Issue:** AI agents can think, but they cannot transact. They rely on human credit cards and API keys.
*   **The Risk:** Giving an AI a private key is dangerous (wallet draining).
*   **The Friction:** Agents cannot easily find, vet, and pay new services on the fly.
*   **Scenario:** An agent needs a specialized tool (e.g., image generation) but can't "sign up" for it without a human.

---

## Slide 3: The Solution - automata Protocol
**"A Decentralized Marketplace & Operating System for Agents"**
*   **Discovery:** A registry where agents find tools.
*   **Safety:** "Usage Wallets" that limit risk.
*   **Trust:** On-chain Identity and Reputation.

---

## Slide 4: Core Architecture (The Contract Layer)
*   **Marketplace (`market.move`):** The registry of available services (Name, Price, Metadata).
*   **Usage Wallets (`usage_wallet.move`):**
    *   *Concept:* Prepaid accounts for agents.
    *   *Feature:* Non-withdrawable funds (can only be *spent* on services).
*   **Spend Policies (`spend_policy.move`):**
    *   *Concept:* Programmable limits.
    *   *Example:* "Max 10 APT per day" or "Only approved providers."

---

## Slide 5: The Technical Stack
*   **Smart Contracts (Move):** High-performance, secure logic on Aptos.
*   **Indexer Service:**
    *   *Role:* Listens to chain events.
    *   *Function:* APIs for fast searching, filtering, and analytics.
*   **SDK & CLI:** Tools for developers to integrate automata into their agents.

---

## Slide 6: User Journey (The "Flow")
**Step-by-Step Walkthrough:**
1.  **Publish:** Provider registers a service (e.g., "Llama-3 Inference") on-chain.
2.  **Fund:** User creates a Usage Wallet for their Agent and deposits 5 APT.
3.  **Restrict:** User applies a "Max 1 APT/Day" policy.
4.  **Discover:** Agent queries the Indexer to find the service.
5.  **Execute:** Agent calls the contract -> Contract checks Policy -> Funds move to Provider -> Service is delivered.

---

## Slide 7: Developer Experience
**"Built for Builders"**
*   **CLI (`automata`):** Manage wallets, search services, and debug policies from the terminal.
*   **SDK (TypeScript):** `createUsageWallet()`, `findService()`, `callService()` functions for your bot.
*   **Docs & UI:** Full dashboard to visualize agent activity.

---

## Slide 8: Future Roadmap
*   **Q3:** Mainnet Launch.
*   **Q4:** Verified Credentials (KYC for Agents).
*   **2027:** DAO Governance for Protocol Params.

---

## Slide 9: Summary
*   **Secure:** Agents spend funds without exposing main keys.
*   **Scalable:** Powered by Aptos high throughput.
*   **Open:** Anyone can publish or consume services.

**Call to Action:** `npm install @automata-protocol/sdk`
