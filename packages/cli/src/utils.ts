import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import dotenv from 'dotenv';
dotenv.config();

export const getAccount = (): Account => {
    const key = process.env.Automata_PRIVATE_KEY;
    if (!key) {
        throw new Error("Automata_PRIVATE_KEY environment variable is not set");
    }
    // Remove 0x prefix if present
    const cleanKey = key.startsWith("0x") ? key.slice(2) : key;
    const privateKey = new Ed25519PrivateKey(cleanKey);
    return Account.fromPrivateKey({ privateKey });
};
