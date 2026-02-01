import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const publishCommand = new Command('publish');

publishCommand
    .argument('<file>', 'OpenAPI file path or ID')
    .requiredOption('--price <amount>', 'Price per call')
    .option('--name <name>', 'Service Name')
    .action(async (file, options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            const name = options.name || file;

            let url = file;
            if (!file.startsWith("http") && !file.startsWith("ipfs://")) {
                // If it's a local file, we expect the user to have uploaded it
                // In a future version, we could integrate automatic IPFS upload here.
                console.warn("Warning: You provided a local file path. Please ensure this is accessible via URL or IPFS for consumers.");
                // We default to assuming it might be a relative path for now, or just use as is.
            }

            console.log(`Publishing service '${name}' at ${options.price} apt`);

            const tx = await client.publishService(name, Number(options.price), url);
            console.log("Service published! Tx:", tx);
        } catch (e: any) {
            console.error("Failed to publish:", e.message);
        }
    });

