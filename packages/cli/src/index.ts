#!/usr/bin/env node
import { Command } from 'commander';

import { walletCommand } from './commands/wallet';
import { policyCommand } from './commands/policy';
import { publishCommand } from './commands/publish';
import { searchCommand } from './commands/search';
import { callCommand } from './commands/call';
import { agentCommand } from './commands/agent';

const program = new Command();

program
    .name('automata')
    .description('CLI for automata Protocol on Aptos')
    .version('0.1.0');

program.addCommand(walletCommand);
program.addCommand(policyCommand);
program.addCommand(publishCommand);
program.addCommand(searchCommand);
program.addCommand(callCommand);
program.addCommand(agentCommand);

program.parse();
