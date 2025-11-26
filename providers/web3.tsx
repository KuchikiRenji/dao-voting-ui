'use client';

import { ReactNode, useMemo } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { coinbaseWallet, injected } from "wagmi/connectors";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { NETWORK } from "@/constants/governorConfig";

export const wagmiConfig = createConfig({
  chains: [NETWORK],
  transports: {
    [NETWORK.id]: http(),
  },
  connectors: [
    injected({ shimDisconnect: true }),
    coinbaseWallet({
      appName: "DAO Voting UI",
      chainId: NETWORK.id,
      preference: "all",
    }),
  ],
  ssr: true,
  multiInjectedProviderDiscovery: true,
  pollingInterval: 12_000,
});

type Props = {
  children: ReactNode;
};

export function Web3Provider({ children }: Props) {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            gcTime: 5 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
    [],
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

