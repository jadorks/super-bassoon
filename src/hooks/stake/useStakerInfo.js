import { Localhost, Mainnet, useCall } from "@usedapp/core";
import { useStakeContract } from "../useContract";

export const useStakerInfo = (userAddress) => {
  const stakeContract = useStakeContract();

  const { value, error } =
    useCall(
      userAddress && {
        contract: stakeContract,
        method: "getStake",
        args: [userAddress],
      }, {chainId: Mainnet.chainId}
    ) ?? {};

  if (error) {
    console.error(error.message);
    return undefined;
  }
  return value?.[0];
};
