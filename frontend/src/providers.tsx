'use client';

import { ThirdwebProvider, metamaskWallet, coinbaseWallet, walletConnect } from "@thirdweb-dev/react";
import { ReactNode } from "react";
import { Polygon } from "@thirdweb-dev/chains";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // This is the chain your dApp will work on.
  const activeChain = Polygon;

  return (
    <ThirdwebProvider
      activeChain={activeChain}
      clientId="f5408bfc2c3cfab3ae25f88b7ffe1f25"
      supportedWallets={[
        metamaskWallet(),
        coinbaseWallet(),
        walletConnect(),
      ]}
    >
      {children}
    </ThirdwebProvider>
  );
}

export default Providers;
