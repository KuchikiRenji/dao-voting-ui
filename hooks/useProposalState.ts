import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";

import {
  GOVERNOR_ABI,
  GOVERNOR_ADDRESS,
  NETWORK,
} from "@/constants/governorConfig";
import { decodeState } from "@/lib/governance";

export function useProposalState(id?: string | bigint) {
  const client = usePublicClient({ chainId: NETWORK.id });
  const proposalId = useMemo(() => {
    if (id === undefined) return undefined;
    try {
      return typeof id === "bigint" ? id : BigInt(id);
    } catch {
      return undefined;
    }
  }, [id]);

  return useQuery({
    queryKey: ["proposal-state", client?.chain?.id, proposalId?.toString()],
    queryFn: async () => {
      if (!client || proposalId === undefined) throw new Error("Missing data");
      const state = await client.readContract({
        abi: GOVERNOR_ABI,
        address: GOVERNOR_ADDRESS,
        functionName: "state",
        args: [proposalId],
      });
      return decodeState(BigInt(state));
    },
    enabled: Boolean(client && proposalId !== undefined),
    refetchInterval: 20_000,
  });
}


