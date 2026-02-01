import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);
const CLI_PATH = path.resolve(__dirname, '../dist/index.js');

describe('CLI Integration Tests', () => {

    it('should display help', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} --help`);
        if (!stdout.includes('CLI for automata Protocol on Aptos')) {
            throw new Error("CLI help not displayed correctly");
        }
    });

    it('should have wallet command', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} wallet --help`);
        if (!stdout.includes('create') || !stdout.includes('balance')) {
            throw new Error("Wallet subcommands missing");
        }
    });

    it('should have policy command', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} policy --help`);
        if (!stdout.includes('attach')) {
            throw new Error("Policy subcommands missing");
        }
    });

    it('should have publish command', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} publish --help`);
        if (!stdout.includes('price') || !stdout.includes('name')) {
            throw new Error("Publish subcommands missing arguments");
        }
    });

    it('should have search command', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} search --help`);
        if (!stdout.includes('max-price') || !stdout.includes('query')) {
            throw new Error("Search command missing arguments");
        }
    });

    it('should have call command', async () => {
        const { stdout } = await execAsync(`node ${CLI_PATH} call --help`);
        if (!stdout.includes('api') || !stdout.includes('path') || !stdout.includes('wallet')) {
            throw new Error("Call command missing arguments");
        }
    });

    // NOTE: Real integration tests requiring network (create wallet, etc)
    // require a private key in environment or mocked environment, avoiding for this basic suite
    // to prevent CI failures without proper secrets.
});
