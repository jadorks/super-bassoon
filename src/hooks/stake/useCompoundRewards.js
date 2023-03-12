import { useContractFunction } from "@usedapp/core";
import { useStakeContract } from "../useContract";

export const useCompundRewards = () => {
  const contract = useStakeContract();

  const { state, send } = useContractFunction(contract, "compound", {
    transactionName: "Compound Rewards",
  });

  return { state, send };
};
