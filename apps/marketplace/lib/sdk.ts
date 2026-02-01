'use client';

import { Aptos, AptosConfig, Network, Account, Ed25519PrivateKey } from '@aptos-labs/ts-sdk';

// Types matching SDK
export interface ServiceInfo {
    provider: string;
    name: string;
    base_price: number;
    metadata_url: string;
    tags?: string[];
    reputation_score?: number;
}

// Indexer API URL
const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL || 'http://localhost:3001';
const MODULE_ID = process.env.NEXT_PUBLIC_MODULE_ID || '0x1::automata';

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

/**
 * Deposit funds into Usage Wallet
 */
export async function depositToWallet(params: {
    amount: number;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const payload = {
            data: {
                function: `${MODULE_ID}::usage_wallet::deposit`,
                typeArguments: [],
                functionArguments: [(params.amount * 100_000_000).toString()]
            }
        };

        const response = await params.signAndSubmitTransaction(payload);
        return { success: true, txHash: response.hash };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

/**
 * Fetch Usage Wallet for an account
 */
export async function fetchUsageWallet(address: string, knownSpenders: string[] = []) {
    try {
        const resource = await aptos.getAccountResource({
            accountAddress: address,
            resourceType: `${MODULE_ID}::usage_wallet::UsageWallet`
        });

        let balance = '0';

        // Handle different SDK response structures
        if ((resource as any).balance && (resource as any).balance.value) {
            balance = (Number((resource as any).balance.value) / 100_000_000).toFixed(2);
        } else if ((resource as any).data && (resource as any).data.balance && (resource as any).data.balance.value) {
            balance = (Number((resource as any).data.balance.value) / 100_000_000).toFixed(2);
        }

        // Fetch policies if we have known spenders
        const policies = [];
        if (knownSpenders.length > 0) {
            try {
                const policyRegistry = await aptos.getAccountResource({
                    accountAddress: address,
                    resourceType: `${MODULE_ID}::spend_policy::PolicyRegistry`
                });

                const tableHandle = (policyRegistry as any).policies?.handle || (policyRegistry as any).data?.policies?.handle;

                if (tableHandle) {
                    for (const spender of knownSpenders) {
                        try {
                            const policyItem = await aptos.getTableItem({
                                handle: tableHandle,
                                data: {
                                    key_type: "address",
                                    value_type: `${MODULE_ID}::spend_policy::Policy`,
                                    key: spender
                                }
                            }) as any;

                            if (policyItem) {
                                policies.push({
                                    spender: spender,
                                    dailyLimit: (Number(policyItem.max_daily_spend) / 100_000_000).toFixed(2),
                                    remaining: ((Number(policyItem.max_daily_spend) - Number(policyItem.current_daily_spend)) / 100_000_000).toFixed(2),
                                    lastReset: policyItem.last_reset_timestamp
                                });
                            }
                        } catch (err) {
                            // Policy might not exist for this spender
                        }
                    }
                }
            } catch (e) {
                console.warn("Could not fetch policy registry", e);
            }
        }

        return {
            address: address,
            name: "Primary Usage Wallet",
            balance: balance,
            tags: ["Main"],
            policies: policies
        };
    } catch (e) {
        return null;
    }
}

/**
 * Fetch services from the Indexer API
 */
export async function fetchServices(options?: {
    query?: string;
    tags?: string[];
    maxPrice?: number;
    minReputation?: number;
}): Promise<ServiceInfo[]> {
    try {
        const params = new URLSearchParams();
        if (options?.query) params.set('q', options.query);
        if (options?.tags?.length) params.set('tags', options.tags.join(','));
        if (options?.maxPrice) params.set('maxPrice', String(options.maxPrice));
        if (options?.minReputation) params.set('minReputation', String(options.minReputation));

        const url = `${INDEXER_URL}/services?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.warn('[SDK] Indexer unavailable, using mock data');
            return [];
        }

        const data = await response.json();
        return data.services || [];
    } catch (e) {
        console.warn('[SDK] Failed to fetch from indexer:', e);
        return [];
    }
}

/**
 * Find cheapest service matching criteria
 */
export async function findCheapestService(tags: string[]): Promise<ServiceInfo | null> {
    try {
        const params = new URLSearchParams();
        if (tags.length) params.set('tags', tags.join(','));

        const url = `${INDEXER_URL}/discover/cheapest?${params.toString()}`;
        const response = await fetch(url);

        if (!response.ok) return null;
        return await response.json();
    } catch {
        return null;
    }
}

/**
 * Execute a paid API call through the SDK
 * This is used when the user clicks "Buy" in the marketplace
 */
export async function executeServiceCall(params: {
    serviceName: string;
    serviceProvider: string;
    amount: number;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        // Build the payment transaction
        const payload = {
            data: {
                function: `${MODULE_ID}::usage_wallet::pay`,
                typeArguments: [],
                functionArguments: [
                    params.serviceProvider,
                    (params.amount * 100_000_000).toString()
                ]
            }
        };

        console.log('[SDK] Submitting payment transaction...', payload);
        const response = await params.signAndSubmitTransaction(payload);

        console.log('[SDK] Transaction submitted:', response.hash);

        return { success: true, txHash: response.hash };
    } catch (e: any) {
        console.error('[SDK] Transaction failed:', e);
        return { success: false, error: e.message || 'Transaction failed' };
    }
}

/**
 * Create a new Usage Wallet
 */
export async function createUsageWallet(params: {
    fundAmount: number;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const payload = {
            data: {
                function: `${MODULE_ID}::usage_wallet::create_wallet`,
                typeArguments: [],
                functionArguments: [(params.fundAmount * 100_000_000).toString()]
            }
        };

        const response = await params.signAndSubmitTransaction(payload);
        return { success: true, txHash: response.hash };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

/**
 * Attach a spending policy to a Usage Wallet
 */
export async function attachPolicy(params: {
    spenderAddress: string;
    maxDaily: number;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const payload = {
            data: {
                function: `${MODULE_ID}::spend_policy::set_policy`,
                typeArguments: [],
                functionArguments: [
                    params.spenderAddress,
                    (params.maxDaily * 100_000_000).toString()
                ]
            }
        };

        const response = await params.signAndSubmitTransaction(payload);
        return { success: true, txHash: response.hash };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}

/**
 * Publish a service to the marketplace
 */
export async function publishService(params: {
    name: string;
    basePrice: number;
    metadataUrl: string;
    signAndSubmitTransaction: (payload: any) => Promise<{ hash: string }>;
}): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
        const payload = {
            data: {
                function: `${MODULE_ID}::market::publish_service`,
                typeArguments: [],
                functionArguments: [
                    params.name,
                    (params.basePrice * 100_000_000).toString(),
                    params.metadataUrl
                ]
            }
        };

        const response = await params.signAndSubmitTransaction(payload);
        return { success: true, txHash: response.hash };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
