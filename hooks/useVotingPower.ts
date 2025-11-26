import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";

import {
  GOVERNOR_ABI,
  GOVERNOR_ADDRESS,
  NETWORK,
} from "@/constants/governorConfig";

export function useVotingPower() {
  const { address } = useAccount();
  const client = usePublicClient({ chainId: NETWORK.id });

  return useQuery({
    queryKey: ["voting-power", client?.chain?.id, address],
    queryFn: async () => {
      if (!client || !address) throw new Error("Wallet not connected");
      const blockNumber = await client.getBlockNumber();
      const votes = await client.readContract({
        abi: GOVERNOR_ABI,
        address: GOVERNOR_ADDRESS,
        functionName: "getVotes",
        args: [address, blockNumber],
      });
      return votes as bigint;
    },
    enabled: Boolean(client && address),
    refetchInterval: 30_000,
  });
}


