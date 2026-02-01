import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const searchCommand = new Command('search');

searchCommand
    .argument('<query>', 'Search term')
    .option('--max-price <amount>', 'Maximum price in APT')
    .description('Search for available services in the marketplace')
    .action(async (query, options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            console.log(`Searching for '${query}'...`);
            const services = await client.getServices();

            const results = services.filter(s =>
                s.name.toLowerCase().includes(query.toLowerCase()) &&
                (!options.maxPrice || s.base_price <= Number(options.maxPrice))
            );

            if (results.length === 0) {
                console.log("No services found.");
                return;
            }

            console.table(results.map(s => ({
                Name: s.name,
                Price: `${s.base_price} APT`,
                Provider: s.provider.slice(0, 8) + '...',
                URL: s.metadata_url
            })));
        } catch (e: any) {
            console.error("Search failed:", e.message);
        }
    });
