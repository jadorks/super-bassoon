import { useContractFunction } from "@usedapp/core";
import { useStakeContract } from "../useContract";

export const useUnstakeTokens = () => {
  const contract = useStakeContract();

  const { state, send } = useContractFunction(contract, "unstake", {
    transactionName: "Unstake Tokens",
  });

  return { state, send };
};
