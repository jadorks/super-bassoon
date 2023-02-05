import { useContractFunction, useEthers } from "@usedapp/core";
import { useStakeContract } from "../useContract";

export const useStakeTokens = () => {
  const contract = useStakeContract();

  const { state, send } = useContractFunction(contract, "stake", {
    transactionName: "Stake Tokens",
  });

  return {state, send};
};
