import { Plugin } from '../types';

export const reputationPlugin = (options: { minScore: number }): Plugin => {
    return {
        name: 'reputation-plugin',
        beforePay: async (req) => {
            // In a production environment, this would query the automata::Reputation module 
            // to fetch the real on-chain score of `req.provider`.

            const mockScore = 950; // High reputation mock
            console.log(`[Reputation] Verifying provider ${req.provider} (Score: ${mockScore})`);

            if (mockScore < options.minScore) {
                throw new Error(`Provider reputation ${mockScore} is below required ${options.minScore}`);
            }
        },
    };
};
