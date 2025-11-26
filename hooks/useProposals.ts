import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

import { NETWORK } from "@/constants/governorConfig";
import { getProposals } from "@/lib/governance";

export function useProposals() {
  const client = usePublicClient({ chainId: NETWORK.id });

  return useQuery({
    queryKey: ["governor-proposals", client?.chain?.id],
    queryFn: async () => {
      if (!client) throw new Error("Public client not ready");
      return getProposals(client);
    },
    enabled: Boolean(client),
    refetchInterval: 45_000,
  });
}


