import { createConfig, http } from 'wagmi';
import { mainnet, bsc } from 'wagmi/chains';
import { injected, metaMask } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [mainnet, bsc],
  connectors: [metaMask(), injected()],
  transports: {
    [mainnet.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true,
});
