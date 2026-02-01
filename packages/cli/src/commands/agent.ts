import { Command } from 'commander';
import { AutomataClient } from '@automata-protocol/sdk';
import { getAccount } from '../utils';
import { Network } from "@aptos-labs/ts-sdk";

export const agentCommand = new Command('agent');

agentCommand
    .command('register')
    .description('Register an agent identity on-chain')
    .requiredOption('--name <name>', 'Agent display name')
    .option('--url <url>', 'Metadata URL (OpenAPI spec, etc.)', '')
    .action(async (options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            console.log(`Registering agent: ${options.name}`);
            if (options.url) {
                console.log(`  Metadata URL: ${options.url}`);
            }

            const tx = await client.registerAgent(options.name, options.url);
            console.log("Agent registered! Tx:", tx);
            console.log(`\nYour agent address: ${account.accountAddress.toString()}`);
        } catch (e: any) {
            console.error("Error registering agent:", e.message);
        }
    });

agentCommand
    .command('init-reputation')
    .description('Initialize reputation tracking for your agent')
    .action(async () => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            console.log(`Initializing reputation for: ${account.accountAddress.toString()}`);
            const tx = await client.initializeReputation();
            console.log("Reputation initialized! Tx:", tx);
            console.log("\nYour reputation score starts at 100. It will update based on successful transactions.");
        } catch (e: any) {
            console.error("Error initializing reputation:", e.message);
        }
    });

agentCommand
    .command('info')
    .description('Get agent information')
    .option('--address <address>', 'Agent address (defaults to signer)')
    .action(async (options) => {
        try {
            const account = getAccount();
            const client = new AutomataClient({
                account,
                network: Network.TESTNET,
                moduleId: process.env.Automata_MODULE_ID
            });

            const addr = options.address || account.accountAddress.toString();
            console.log(`Fetching agent info for: ${addr}`);

            const info = await client.getAgentInfo(addr);
            if (info) {
                console.log("\nAgent Identity:");
                console.log(`  Name: ${info.name}`);
                console.log(`  URL: ${info.url || '(none)'}`);
                console.log(`  Verified: ${info.verified ? 'Yes' : 'No'}`);
            } else {
                console.log("No agent identity found for this address.");
            }

            const rep = await client.getReputation(addr);
            if (rep) {
                console.log("\nReputation:");
                console.log(`  Score: ${rep.score}`);
                console.log(`  Total Transactions: ${rep.totalTransactions}`);
            }
        } catch (e: any) {
            console.error("Error fetching agent info:", e.message);
        }
    });
