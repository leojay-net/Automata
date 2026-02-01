import { Plugin } from '../types';

export const budgetPlugin = (options: { dailyMax: number }): Plugin => {
    return {
        name: 'budget-plugin',
        beforePay: async (req) => {
            // Check budget logic
            console.log('Checking budget...', options.dailyMax);
            if (req.amount > options.dailyMax) {
                throw new Error(`Budget exceeded: ${req.amount} > ${options.dailyMax}`);
            }
        },
    };
};
