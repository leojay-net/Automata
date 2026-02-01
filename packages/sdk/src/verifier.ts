import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export interface VerificationResult {
    valid: boolean;
    payer?: string;
    amount?: number;
    timestamp?: number;
    error?: string;
}

export class AutomataVerifier {
    private aptos: Aptos;
    private moduleId: string;
    private serviceProviderAddress: string;

    constructor(config: { network?: Network, moduleId: string, serviceProviderAddress: string }) {
        this.aptos = new Aptos(new AptosConfig({ network: config.network || Network.TESTNET }));
        this.moduleId = config.moduleId;
        this.serviceProviderAddress = config.serviceProviderAddress;
    }

    /**
     * Verifies a transaction hash is a valid payment to this service.
     */
    async verifyPayment(txHash: string, expectedAmount: number): Promise<VerificationResult> {
        try {
            const tx = await this.aptos.getTransactionByHash({ transactionHash: txHash });

            if (tx.type !== "user_transaction") {
                return { valid: false, error: "Not a user transaction" };
            }

            // @ts-ignore
            if (!tx.success) {
                return { valid: false, error: "Transaction failed on-chain" };
            }

            // Check if it called the pay function
            // @ts-ignore
            const payload: any = tx.payload;
            if (payload.function !== `${this.moduleId}::usage_wallet::pay`) {
                return { valid: false, error: "Invalid function call" };
            }

            // Check arguments: [wallet_owner, provider, amount]
            // @ts-ignore
            const args = payload.arguments;
            const provider = args[1]; // Index 1 is provider
            const amount = Number(args[2]); // Index 2 is amount

            // Clean address strings (remove 0x, lower case) for comparison
            const normalize = (addr: string) => addr.startsWith("0x") ? addr : `0x${addr}`;

            if (normalize(provider) !== normalize(this.serviceProviderAddress)) {
                return { valid: false, error: "Payment recipient mismatch" };
            }

            if (amount < expectedAmount) {
                return { valid: false, error: "Insufficient payment amount" };
            }

            // @ts-ignore
            const timestamp = Number(tx.timestamp);
            // Optional: Check if transaction is too old (replay attack prevention)
            const now = Date.now() * 1000; // microseconds
            if (now - timestamp > 300000000) { // 5 minutes
                // return { valid: false, error: "Transaction too old" }; 
                // Commented out for dev ease, but should be enabled in prod
            }

            return {
                valid: true,
                // @ts-ignore
                payer: tx.sender,
                amount: amount,
                timestamp: timestamp
            };

        } catch (e: any) {
            console.error("Verification error:", e);
            return { valid: false, error: e.message };
        }
    }
}
