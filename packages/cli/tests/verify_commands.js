const { exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const assert = require('assert');

const execAsync = promisify(exec);
const CLI_PATH = path.resolve(__dirname, '../dist/index.js');

async function runTests() {
    console.log("Running CLI Command Verification...");

    try {
        // Test 1: Help
        console.log("Testing --help...");
        const { stdout: helpOut } = await execAsync(`node ${CLI_PATH} --help`);
        if (!helpOut.includes('CLI for x402 Protocol')) throw new Error("Help missing");
        console.log("✓ Help command works");

        // Test 2: Search Command
        console.log("Testing search command...");
        const { stdout: searchOut } = await execAsync(`node ${CLI_PATH} search --help`);
        if (!searchOut.includes('max-price') || !searchOut.includes('query')) {
            throw new Error("Search command configuration is wrong");
        }
        console.log("✓ Search command registered");

        // Test 3: Call Command
        console.log("Testing call command...");
        const { stdout: callOut } = await execAsync(`node ${CLI_PATH} call --help`);
        if (!callOut.includes('api') || !callOut.includes('path') || !callOut.includes('wallet')) {
            throw new Error("Call command configuration is wrong");
        }
        console.log("✓ Call command registered");

        console.log("\nAll verification tests passed!");
    } catch (e) {
        console.error("\n❌ Test Failed:", e.message);
        process.exit(1);
    }
}

runTests();
