import { http } from 'viem';
import { createWalletClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { modeTestnet } from 'viem/chains'; // Note: If mode isn't in viem chains, we'll define it

import { getOnChainTools } from '@goat-sdk/adapter-vercel-ai';
import { USDC, erc20 } from '@goat-sdk/plugin-erc20';
import { sendETH } from '@goat-sdk/wallet-evm';
import { modespray } from '@goat-sdk/plugin-modespray';
import { viem } from '@goat-sdk/wallet-viem';
import { createMarketTool } from './tools/prediction-market';
import { getWalletClient } from '@/lib/services/wallet';


export const initializeWeb3Tools = async () => {
  const account = privateKeyToAccount(
    process.env.WALLET_PRIVATE_KEY as `0x${string}`,
  );
  console.log('Account:', account.address);

  // const walletClient = createWalletClient({
  //   account,
  //   transport: http(process.env.MODE_RPC_URL || 'https://sepolia.mode.network'),
  //   chain: modeTestnet,
  // });
  const walletClient = getWalletClient();

  console.log('Wallet client created');

  // return await getOnChainTools({
  //   wallet: viem(walletClient),
  //   plugins: [
  //     sendETH(),
  //     erc20({
  //       tokens: [
  //         // Add Mode testnet token addresses here
  //         // Example: { ...USDC, address: "0x..." }
  //       ]
  //     }),
  //   ],
  // });

  try {
    const tools = await getOnChainTools({
      wallet: viem(walletClient),
      plugins: [
        sendETH(),
        erc20({ tokens: [] }),
        modespray(),
      ],
    });
    console.log('Web3 tools initialized:', Object.keys(tools));

    return {
      ...tools,
      createMarket: createMarketTool
    };

  } catch (error) {
    console.error('Error initializing web3 tools:', error);
    throw error;
  }
};
