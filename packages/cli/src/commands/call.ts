import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const callCommand = new Command('call');

callCommand
    .argument('<api>', 'API Name (e.g., sentiment-api)')
    .argument('<path>', 'Endpoint path (e.g., /analyze)')
    .option('--wallet <address>', 'Usage Wallet Address (defaults to signer)')
    .option('--data <json>', 'JSON Body', '{}')
    .description('Call a service API and pay automatically')
    .action(async (api, path, options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            console.log(`Invoking ${api}${path}...`);
            const result = await client.call({
                api,
                path,
                body: JSON.parse(options.data),
                walletOwner: options.wallet
            });

            console.log("Result:");
            console.log(JSON.stringify(result, null, 2));
        } catch (e: any) {
            console.error("Call failed:", e.message);
        }
    });
