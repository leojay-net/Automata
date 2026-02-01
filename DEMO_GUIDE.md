# 🎥 automata Protocol: Full Platform Demo Script

This guide outlines the step-by-step flow for a comprehensive video demo of the automata Protocol. It covers the narrative, visual actions, and technical explanations effectively.

---

## 🎬 Phase 1: The "Hook" & Introduction
**Goal:** Establish the problem (AI agents need a way to transact) and the solution (automata).

*   **Visual:** Start on the **Landing Page** (`http://localhost:3000`).
*   **Action:** Scroll slowly down the hero section.
*   **Narration:**
    > "Welcome to the automata Protocol. As we build autonomous AI agents, we face a major problem: how do we let them buy services, data, or compute power without giving them our main private keys?
    >
    > Today, I'm going to show you automata—a decentralized marketplace where agents can securely discover, verify, and pay for services on-chain."

---

## 🛍 Phase 2: Discovery (The Marketplace)
**Goal:** Show how agents find services (The "App Store" experience).

*   **Visual:** Navigate to **Marketplace** (`/app/services`).
*   **Action:**
    1.  Click on the Search bar. Type "inference" or "gpt".
    2.  Show the results filtering instantly (powered by the Indexer).
    3.  Click on a Service Card to view details (Price, Provider, Trust Score).
*   **Narration:**
    > "First, discovery. Just like humans use an App Store, agents need to find tools.
    >
    > Here on the Marketplace, we see live services registered on the Aptos Testnet. Behind the scenes, our Indexer is watching the blockchain and serving this data instantly. We can see the price per call and the provider's reputation score."

---

## 🆔 Phase 3: Identity & Reputation
**Goal:** Show that participants are real and verified entities.

*   **Visual:** Navigate to **Agents / Identity** (`/app/agents`).
*   **Action:**
    1.  Show your current Agent Profile.
    2.  Point to the "Reputation Score".
*   **Narration:**
    > "Trust is critical. In automata, every provider and agent has an on-chain Identity.
    >
    > This Reputation Score isn't just a number in a database—it's calculated from on-chain transaction history. If a service fails to deliver, their score drops, and agents will automatically stop using them."

---

## 💳 Phase 4: Usage Wallets (The Core Feature)
**Goal:** Demonstrate the security model (segregated funds).

*   **Visual:** Navigate to **Wallets** (`/app/wallets`).
*   **Action:**
    1.  Click "Create Wallet".
    2.  Enter an amount (e.g., 5 APT).
    3.  Confirm the transaction.
    4.  Show the new wallet appearing in the list.
*   **Narration:**
    > "This is the most important part: The Usage Wallet.
    >
    > I don't want to give my AI agent my main bank account. So, I create a 'Usage Wallet'—think of it like a prepaid debit card. I've just funded this wallet with 5 APT. My agent can spend receiving services using this wallet, but it *cannot* withdraw the funds back to a different address. If the agent gets hacked, my main funds are safe."

---

## 🛡 Phase 5: Spend Policies (Control)
**Goal:** Show granular control over agent behavior.

*   **Visual:** Navigate to **Policies** (`/app/policies`).
*   **Action:**
    1.  Select the Wallet you just created.
    2.  Click "Attach Policy".
    3.  Set parameters:
        *   **Max Daily Spend:** 1.0 APT
        *   **Whitelisted Provider:** (Optional)
    4.  Save.
*   **Narration:**
    > "We can go a step further with Spend Policies.
    >
    > I am attaching a policy that says: 'This agent can only spend 1 APT per day.' I can even lock it to specific providers. This is enforced by the Smart Contract. Even if the AI tries to spend 100 APT, the blockchain will reject it."

---

## 🚀 Phase 6: Publishing a Service
**Goal:** Show the "Supply Side" (how developers sell tools).

*   **Visual:** Navigate to **Publish** (`/app/publish`).
*   **Action:**
    1.  Fill in the form:
        *   **Name:** "Llama-3-Turbo"
        *   **Base Price:** 0.05 APT
        *   **Category:** AI Inference
    2.  Click "Publish Service".
*   **Narration:**
    > "Now, let's switch hats. I'm a developer with a powerful GPU running Llama 3. I want to sell access to it.
    >
    > I simply publish my service here. Once the transaction confirms, my API is discoverable by any agent on the network, and I start earning APT immediately for every request processed."

---

## 📊 Phase 7: Analytics & Closing
**Goal:** Show visibility and wrap up.

*   **Visual:** Navigate to **Analytics** (`/app/analytics`).
*   **Action:**
    1.  Show the charts (Requests, Volume, Costs).
    2.  Toggle between "Daily" and "Weekly".
*   **Narration:**
    > "Finally, we have full visibility. The Analytics dashboard tracks every single on-chain interaction, so I know exactly how much my fleet of agents is spending and which services they are using.
    >
    > This is automata: The operating system for the Agent Economy. Secure, transparent, and built on Aptos."

---

## 🛠 Technical Demo (Optional / Advanced)
If the audience is technical, you can show the **CLI** in a split terminal window.

1.  **Run:** `automata search "Llama"` -> Show JSON output.
2.  **Run:** `automata wallet balance` -> Show it matches the UI.
3.  **Explain:** "The web UI is just one interface; agents use this CLI or our SDK to do everything programmatically."
