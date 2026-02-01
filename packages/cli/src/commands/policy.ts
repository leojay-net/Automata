import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const policyCommand = new Command('policy');

policyCommand
    .command('attach')
    .description('Attach a spending policy to authorize an agent/spender')
    .requiredOption('--spender <address>', 'Spender/Agent Address')
    .option('--wallet <address>', 'Usage Wallet address (defaults to signer)')
    .option('--max-daily <amount>', 'Max daily spend in APT', '1.0')
    .option('--allowed-tags <tags>', 'Comma-separated allowed service tags (e.g., ai,data)')
    .action(async (options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            const walletAddr = options.wallet || account.accountAddress.toString();
            const tags = options.allowedTags ? options.allowedTags.split(',').map((t: string) => t.trim()) : [];

            console.log(`Attaching policy to wallet: ${walletAddr}`);
            console.log(`  Spender: ${options.spender}`);
            console.log(`  Max Daily: ${options.maxDaily} APT`);
            if (tags.length > 0) {
                console.log(`  Allowed Tags: ${tags.join(', ')}`);
            }

            const tx = await client.authorizeSpender(options.spender, Number(options.maxDaily));
            console.log("Policy attached! Tx:", tx);

            if (tags.length > 0) {
                console.log("\nNote: Tag-based filtering is enforced client-side via SDK plugins.");
                console.log("Use the 'selectorPlugin' in your SDK config to filter by tags.");
            }
        } catch (e: any) {
            console.error("Error attaching policy:", e.message);
        }
    });

policyCommand
    .command('list')
    .description('List all policies for a wallet')
    .option('--wallet <address>', 'Usage Wallet address (defaults to signer)')
    .action(async (options) => {
        try {
            const account = getAccount();
            const walletAddr = options.wallet || account.accountAddress.toString();

            console.log(`Fetching policies for wallet: ${walletAddr}`);
            console.log("\nNote: On-chain policy lookup requires indexer integration.");
            console.log("Visit the marketplace Console to view your policies.");
        } catch (e: any) {
            console.error("Error listing policies:", e.message);
        }
    });

