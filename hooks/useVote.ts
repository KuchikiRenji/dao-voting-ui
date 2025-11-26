import { useCallback, useState } from "react";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import {
  GOVERNOR_ABI,
  GOVERNOR_ADDRESS,
  NETWORK,
} from "@/constants/governorConfig";

const SUPPORT = {
  against: 0,
  for: 1,
  abstain: 2,
} as const;

export function useVote(proposalId?: bigint) {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId || NETWORK.id,
  });

  const vote = useCallback(
    async (support: number) => {
      if (!proposalId) throw new Error("Missing proposal id");
      if (!address) throw new Error("Connect your wallet to vote");
      setError(null);

      try {
        const hash = await writeContractAsync({
          address: GOVERNOR_ADDRESS,
          abi: GOVERNOR_ABI,
          functionName: "castVote",
          args: [proposalId, support],
          chainId: NETWORK.id,
        });
        setTxHash(hash);
        return hash;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to submit vote";
        setError(message);
        throw err;
      }
    },
    [address, proposalId, writeContractAsync],
  );

  return {
    voteFor: useCallback(() => vote(SUPPORT.for), [vote]),
    voteAgainst: useCallback(() => vote(SUPPORT.against), [vote]),
    voteAbstain: useCallback(() => vote(SUPPORT.abstain), [vote]),
    isVoting: isPending || isConfirming,
    txHash,
    error,
  };
}


