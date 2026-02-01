import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const walletCommand = new Command('wallet');

// automata wallet create --fund 1000
walletCommand
    .command('create')
    .option('--fund <amount>', 'Amount to fund (in Octas)')
    .action(async (options) => {
        try {
            const account = getAccount();
            console.log(`Using account: ${account.accountAddress.toString()}`);

            const client = new AutomataClient({
                account,
                network: Network.TESTNET, // Default to testnet
                moduleId: process.env.Automata_MODULE_ID
            });

            console.log(`Creating wallet with defined funding: ${options.fund}`);
            const txHash = await client.createWallet(Number(options.fund));
            console.log(`Wallet created! Tx: ${txHash}`);
        } catch (e: any) {
            console.error("Error creating wallet:", e.message);
        }
    });

// automata wallet balance <address>
walletCommand
    .command('balance')
    .argument('[address]', 'Wallet address (defaults to current user)')
    .action(async (address) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            const target = address || account.accountAddress.toString();
            const bal = await client.getBalance(target);
            console.log(`Balance for ${target}: ${bal}`);
        } catch (e: any) {
            console.error("Error fetching balance:", e.message);
        }
    });

