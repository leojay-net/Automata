import { Aptos, AptosConfig, Network, Account, AccountAddress, InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { Plugin } from './types'; // Moved Plugin to types to avoid circular dep if needed, or keep here.

export interface ServiceInfo {
    provider: string;
    name: string;
    base_price: number;
    metadata_url: string;
}

export interface AutomataConfig {

    network?: Network;
    account: Account;
    moduleId?: string; // e.g. "0x123::automata"
}

export class AutomataClient {
    private aptos: Aptos;
    private account: Account;
    private moduleId: string;
    private plugins: Plugin[] = [];

    constructor(config: AutomataConfig) {
        this.aptos = new Aptos(new AptosConfig({ network: config.network || Network.TESTNET }));
        this.account = config.account;
        this.moduleId = config.moduleId || "0x123::automata"; // Default or configured
    }

    use(plugin: Plugin) {
        this.plugins.push(plugin);
    }

    /**
     * Create a Usage Wallet on-chain
     */
    async createWallet(amount: number) {
        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::usage_wallet::create_wallet`,
                functionArguments: [amount]
            }
        });

        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        return committedTxn.hash;
    }

    async authorizeSpender(spender: string, maxDaily: number) {
        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::usage_wallet::authorize_spender`,
                functionArguments: [spender, maxDaily]
            }
        });
        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        return committedTxn.hash;
    }

    /**
     * Pay a provider. This is the core automata function.
     */
    async pay(provider: string, amount: number, walletOwner?: string) {
        // Run plugins "beforeRequest"
        for (const p of this.plugins) {
            if (p.beforePay) await p.beforePay({ provider, amount });
        }

        const owner = walletOwner || this.account.accountAddress.toString();

        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::usage_wallet::pay`,
                functionArguments: [owner, provider, amount]
            }
        });

        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });

        // Run plugins "afterPay"
        for (const p of this.plugins) {
            if (p.afterPay) await p.afterPay({ provider, amount, txHash: committedTxn.hash });
        }

        return committedTxn.hash;
    }

    /**
     * Execute a paid API call
     */
    async call(params: { api: string; path: string; body: any; method?: string; walletOwner?: string }) {
        // 1. Run plugins beforeCall
        for (const p of this.plugins) {
            if (p.beforeCall) await p.beforeCall(params);
        }

        // 2. Resolve Service
        const services = await this.getServices();
        const service = services.find(s => s.name === params.api);
        if (!service) throw new Error(`Service ${params.api} not found`);

        console.log(`[SDK] Found service: ${service.name} (${service.base_price} APT)`);

        // 3. Pay
        // Note: For real-world, we would check if we have a valid subscription or channel first
        console.log(`[SDK] Paying ${service.base_price} APT to ${service.provider}...`);
        const txHash = await this.pay(service.provider, service.base_price, params.walletOwner);
        console.log(`[SDK] Payment successful: ${txHash}`);

        // 4. Execute HTTP
        // For MVP, we treat metadata_url as the text/json content location. 
        // In a real implementation, we would parse the OpenAPI spec at metadata_url to find the real endpoint.
        // Here we just assume metadata_url IS the endpoint for simplicity if it starts with http

        let baseUrl = service.metadata_url;
        // Basic normalization
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

        const path = params.path.startsWith('/') ? params.path : `/${params.path}`;
        const url = `${baseUrl}${path}`;

        console.log(`[SDK] Calling ${url}...`);

        try {
            const response = await fetch(url, {
                method: params.method || 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-402-Payment-Tx': txHash,
                    'X-402-Sender': this.account.accountAddress.toString()
                },
                body: JSON.stringify(params.body)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`API Provider returned ${response.status}: ${text}`);
            }

            return await response.json();
        } catch (e: any) {
            // If fetch fails (e.g. invalid URL), we still paid. 
            // In a real system, the payment would be an escrow that releases on successful response proof.
            throw new Error(`Network Error: ${e.message}`);
        }
    }

    async getBalance(address: string): Promise<number> {
        try {
            const resource = await this.aptos.getAccountResource({
                accountAddress: address,
                resourceType: `${this.moduleId}::usage_wallet::UsageWallet`
            });

            if (!resource) return 0;

            const data = resource as any;
            if (data.balance && data.balance.value) {
                return Number(data.balance.value);
            }
            return 0;
        } catch (e) {
            return 0;
        }
    }

    async publishService(name: string, price: number, metadataUrl: string) {
        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::market::publish_service`,
                functionArguments: [name, price, metadataUrl]
            }
        });

        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        return committedTxn.hash;
    }

    async getServices(): Promise<ServiceInfo[]> {
        try {
            const registryOwner = this.moduleId.split("::")[0];
            const resource = await this.aptos.getAccountResource({
                accountAddress: registryOwner,
                resourceType: `${this.moduleId}::market::GlobalRegistry`
            });

            if (!resource) return [];

            const services = (resource as any).services || [];

            return services.map((s: any) => ({
                provider: s.provider,
                name: s.name,
                base_price: Number(s.base_price),
                metadata_url: s.metadata_url
            }));
        } catch (e) {
            console.warn("Failed to fetch services:", e);
            return [];
        }
    }

    // ==================== AGENT IDENTITY ====================

    /**
     * Register an agent identity on-chain
     */
    async registerAgent(name: string, url: string = ''): Promise<string> {
        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::identity::register_agent`,
                functionArguments: [name, url]
            }
        });

        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        return committedTxn.hash;
    }

    /**
     * Initialize reputation tracking for the current account
     */
    async initializeReputation(): Promise<string> {
        const transaction = await this.aptos.transaction.build.simple({
            sender: this.account.accountAddress,
            data: {
                function: `${this.moduleId}::reputation::initialize`,
                functionArguments: []
            }
        });

        const committedTxn = await this.aptos.signAndSubmitTransaction({ signer: this.account, transaction });
        await this.aptos.waitForTransaction({ transactionHash: committedTxn.hash });
        return committedTxn.hash;
    }

    /**
     * Get agent identity info
     */
    async getAgentInfo(address: string): Promise<{ name: string; url: string; verified: boolean } | null> {
        try {
            const resource = await this.aptos.getAccountResource({
                accountAddress: address,
                resourceType: `${this.moduleId}::identity::AgentIdentity`
            });

            if (!resource) return null;

            const data = resource as any;
            return {
                name: data.name,
                url: data.url,
                verified: data.verified
            };
        } catch {
            return null;
        }
    }

    /**
     * Get reputation score for an address
     */
    async getReputation(address: string): Promise<{ score: number; totalTransactions: number } | null> {
        try {
            const resource = await this.aptos.getAccountResource({
                accountAddress: address,
                resourceType: `${this.moduleId}::reputation::ReputationScore`
            });

            if (!resource) return null;

            const data = resource as any;
            return {
                score: Number(data.score),
                totalTransactions: Number(data.total_transactions)
            };
        } catch {
            return null;
        }
    }
} // End class

