import { Localhost, Mainnet, useCall } from "@usedapp/core";
import { useStakeContract } from "../useContract";

export const useAPRPercentage = () => {
  const stakeContract = useStakeContract();

  const { value, error } =
    useCall(
      stakeContract && {
        contract: stakeContract,
        method: "getAPRPercentage",
        args: [1],
      },
      { refresh: "never", isStatic: true, chainId: Mainnet.chainId }
    ) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value;
};
