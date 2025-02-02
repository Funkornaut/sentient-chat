import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { modeTestnet } from 'viem/chains';

export { modeTestnet as chain };

let walletClient: ReturnType<typeof createWalletClient> | null = null;

export const initializeWalletClient = () => {
    if (walletClient) return walletClient;

    const account = privateKeyToAccount(process.env.WALLET_PRIVATE_KEY as `0x${string}`);

    walletClient = createWalletClient({
        account,
        transport: http(process.env.MODE_RPC_URL),
        chain: modeTestnet
    });

    return walletClient;
};

export const getWalletClient = () => {
    if (!walletClient) {
        return initializeWalletClient();
    }
    return walletClient;
}; 