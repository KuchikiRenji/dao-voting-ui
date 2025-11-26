import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { usePublicClient } from "wagmi";

import { NETWORK } from "@/constants/governorConfig";
import { getProposal } from "@/lib/governance";

export function useProposal(id?: string | bigint) {
  const client = usePublicClient({ chainId: NETWORK.id });
  const proposalId = useMemo(() => {
    if (!id && id !== 0n) return undefined;
    try {
      return typeof id === "bigint" ? id : BigInt(id);
    } catch {
      return undefined;
    }
  }, [id]);

  return useQuery({
    queryKey: ["governor-proposal", client?.chain?.id, proposalId?.toString()],
    queryFn: async () => {
      if (!client || proposalId === undefined) throw new Error("Missing data");
      const proposal = await getProposal(client, proposalId);
      if (!proposal) throw new Error("Proposal not found");
      return proposal;
    },
    enabled: Boolean(client && proposalId !== undefined),
    staleTime: 15_000,
  });
}


