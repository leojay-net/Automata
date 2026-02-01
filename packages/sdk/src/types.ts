export interface Plugin {
    name: string;
    beforePay?: (req: { provider: string; amount: number }) => Promise<void>;
    afterPay?: (res: { provider: string; amount: number; txHash: string }) => Promise<void>;
    beforeCall?: (req: { api: string; path: string; body: any }) => Promise<void>;
}

export interface UsageWallet {
    address: string;
    balance: number;
}

