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

type CreateProposalArgs = {
  targets: `0x${string}`[];
  values?: bigint[];
  calldatas: `0x${string}`[];
  description: string;
};

export function useCreateProposal() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { writeContractAsync, isPending } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [error, setError] = useState<string | null>(null);

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash,
    chainId: chainId || NETWORK.id,
  });

  const createProposal = useCallback(
    async ({ targets, values, calldatas, description }: CreateProposalArgs) => {
      if (!address) throw new Error("Connect your wallet to create proposals");
      if (!targets.length || !calldatas.length) {
        throw new Error("Provide at least one action");
      }
      if (targets.length !== calldatas.length) {
        throw new Error("Targets and calldatas must be the same length");
      }

      setError(null);

      try {
        const hash = await writeContractAsync({
          address: GOVERNOR_ADDRESS,
          abi: GOVERNOR_ABI,
          functionName: "propose",
          args: [
            targets,
            (values ?? Array(targets.length).fill(0n)) as bigint[],
            calldatas,
            description,
          ],
          chainId: NETWORK.id,
        });
        setTxHash(hash);
        return hash;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to create proposal";
        setError(message);
        throw err;
      }
    },
    [address, writeContractAsync],
  );

  return {
    createProposal,
    isCreating: isPending || isConfirming,
    txHash,
    error,
  };
}

