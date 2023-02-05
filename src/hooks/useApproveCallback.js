import {
  useContractFunction,
  useEthers,
  useTokenAllowance,
} from "@usedapp/core";
import { utils } from "ethers";
import { useMemo } from "react";
import { useStakeContract, useTokenContract } from "./useContract";

export const ApprovalState = {
  UNKNOWN: "UNKNOWN",
  NOT_APPROVED: "NOT_APPROVED",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
};

export function useApproveCallback(amountToApprove, spender) {
  const { account } = useEthers();
  const stakeContract = useStakeContract();
  const tokenContract = useTokenContract();
  const tokenAllowance = useTokenAllowance(
    tokenContract.address,
    account,
    stakeContract.address
  );

  const approvalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (!tokenAllowance) return ApprovalState.UNKNOWN;

    return tokenAllowance.lt(utils.parseUnits(amountToApprove, 9))
      ? ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, tokenAllowance, spender]);

  const { send, state } = useContractFunction(tokenContract, "approve", {
    transactionName: "Approve ERC20 transfer",
  });

  const approve = () => {
    send(spender, utils.parseUnits(amountToApprove, 9));
  };


  return { approvalState, approve, state };
}
