import { tool } from 'ai';
import { z } from 'zod';
import { parseUnits } from 'viem';
import { FACTORY_ABI } from './factory-contract/abi';
import { getWalletClient, chain } from '@/lib/services/wallet';


export const createMarketTool = tool({
    description: 'Creates a new prediction market',
    parameters: z.object({
        question: z.string().describe('The market question/description'),
        endTime: z.number().describe('When trading period ends (timestamp in seconds)'),
        collateralToken: z.string().describe('Address of token used for trading (MODE, ETH, etc)'),
        initialLiquidity: z.string().describe('Amount of collateral to seed market'),
        protocolFee: z.number().default(1).describe('Protocol fee percentage'),
        outcomeDescriptions: z.array(z.string()).default(['Yes', 'No']).describe('Descriptions for each outcome')
    }),
    execute: async ({ question, endTime, collateralToken, initialLiquidity, protocolFee, outcomeDescriptions }) => {
        try {
            console.log('Creating market with params:', {
                question,
                endTime,
                collateralToken,
                initialLiquidity,
                protocolFee,
                outcomeDescriptions
            });

            const factoryAddress = process.env.PREDICTION_MARKET_FACTORY as `0x${string}`;
            if (!factoryAddress) throw new Error('Factory address not configured');

            const walletClient = getWalletClient();
            const account = walletClient.account;

            if (!account) {
                throw new Error('Account is not initialized');
            }

            const hash = await walletClient.writeContract({
                address: factoryAddress,
                abi: FACTORY_ABI,
                functionName: 'createMarket',
                args: [
                    question,
                    BigInt(endTime),
                    collateralToken as `0x${string}`,
                    parseUnits(initialLiquidity, 18),
                    protocolFee,
                    outcomeDescriptions
                ],
                chain: chain,
                account: account
            });

            return {
                success: true,
                message: `Market created successfully with question: ${question}`,
                hash: hash,
            };
        } catch (error) {
            console.error('Error creating market:', error);
            throw error;
        }
    }
});