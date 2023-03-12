import React, { useState, useEffect } from "react";
import styles from "./stake-widget.module.css";
import DisclaimerIcon from "@/assets/images/disclaimer.svg";
import { useDLCDapp } from "@/providers/DLCProvider/DLCDappProvider";
import { formatUnits } from "ethers/lib/utils";
import { Localhost, Mainnet, useEthers, useTokenBalance } from "@usedapp/core";
import { TOKEN_ADDRESS } from "@/constants/address";
import {
  compareNonTokenWithToken,
  genFormatter,
  onInputNumberChange,
  parseDecimals,
} from "@/utils/utils";
import { ApprovalState, useApproveCallback } from "@/hooks/useApproveCallback";
import { useStakeContract } from "@/hooks/useContract";
import Spinner from "@/assets/images/spinner.svg";
import { useStakeTokens } from "@/hooks/stake/useStakeTokens";
import { utils } from "ethers";
import { useRouter } from "next/router";
import { useUnstakeTokens } from "@/hooks/stake/useUnstakeTokens";
import { useClaimRewards } from "@/hooks/stake/useClaimRewards";
import WalletManager from "../WalletManager";
import { useCompundRewards } from "@/hooks/stake/useCompoundRewards";

export default function StakeWidget() {
  const { account } = useEthers();
  const balance = useTokenBalance(TOKEN_ADDRESS[Mainnet.chainId], account);
  const contract = useStakeContract();
  const { userInfo, userRewards } = useDLCDapp();
  const [amount, setAmount] = useState("");
  const stakedTokens = userInfo ? userInfo?.stakedAmount : 0;

  const router = useRouter();
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [isCompounding, setIsCompounding] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { send: stake, state: stakeState } = useStakeTokens();
  const { send: unstakeToken, state: unstakeState } = useUnstakeTokens();
  const { send: claimRewards, state: claimState } = useClaimRewards();
  const { send: compoundRewards, state: compoundState } = useCompundRewards();

  const {
    approvalState,
    approve,
    state: approveState,
  } = useApproveCallback(amount, contract?.address);

  const handleApprove = () => {
    try {
      setIsApproving(true);
      approve();
    } catch (e) {
      console.error("Exception Thrown: ", e);
      setIsApproving(false);
    }
  };

  const handleClaimRewards = () => {
    setIsClaiming(true);
    try {
      void claimRewards();
    } catch (e) {
      console.error("Exception Thrown: ", e);
      setIsClaiming(false);
    }
  };

  const stakeTokens = () => {
    try {
      setIsStaking(true);
      void stake(utils.parseUnits(amount, 9));
    } catch (e) {
      setIsStaking(false);
      console.error(e);
    }
  };

  const handleCompoundRewards = () => {
    try {
      setIsCompounding(true);
      void compoundRewards();
    } catch (e) {
      setIsCompounding(false);
      console.error(e);
    }
  };

  const handleUnstakeToken = () => {
    setIsUnstaking(true);
    try {
      void unstakeToken(utils.parseUnits(amount, 9));
    } catch (e) {
      console.error("Exception Thrown: ", e);
      setIsUnstaking(false);
    }
  };

  useEffect(() => {
    if (account) {
      if (
        balance != undefined &&
        compareNonTokenWithToken(balance, amount, 9) == -1 &&
        stakedTokens != undefined &&
        compareNonTokenWithToken(stakedTokens, amount, 9) == -1
      ) {
        setErrorMessage("Insufficient balance");
      } else {
        setErrorMessage("");
      }
    }
  }, [amount]);

  useEffect(() => {
    if (approvalState == ApprovalState.APPROVED) {
      setIsApproved(true);
    } else {
      setIsApproved(false);
    }
  }, [approvalState]);

  useEffect(() => {
    if (isApproving && approveState.status == "Success") {
      alert("Tokens approved successfully");
      setIsApproved(true);
      setIsApproving(false);
    } else if (
      isApproving &&
      (approveState.status == "Fail" || approveState.status == "Exception")
    ) {
      alert("Approval failed");
      setIsApproved(false);
      setIsApproving(false);
    }
  }, [approveState]);

  const handleStakeAmountChange = (value) => {
    setAmount(value);
  };

  useEffect(() => {
    if (isStaking && stakeState.status == "Success") {
      alert("Successfully Staked");
      setIsStaking(false);
      router.reload();
    } else if (
      isStaking &&
      (stakeState.status == "Fail" || stakeState.status == "Exception")
    ) {
      alert(
        `Failed to stake tokens: ${
          stakeState.errorMessage.charAt(0).toUpperCase() +
          stakeState.errorMessage.slice(1)
        }`
      );
      setIsStaking(false);
    }
  }, [stakeState]);

  useEffect(() => {
    if (isUnstaking && unstakeState.status == "Success") {
      alert("Successfully unstaked");
      setIsUnstaking(false);
      router.reload();
    } else if (
      isUnstaking &&
      (unstakeState.status == "Fail" || unstakeState.status == "Exception")
    ) {
      alert(
        `Failed to unstake tokens: ${
          unstakeState.errorMessage.charAt(0).toUpperCase() +
          unstakeState.errorMessage.slice(1)
        }`
      );
      setIsUnstaking(false);
    }
  }, [unstakeState]);

  useEffect(() => {
    if (isClaiming && claimState.status == "Success") {
      alert("Rewards claimed successfully");
      setIsClaiming(false);
      router.reload();
    } else if (
      isClaiming &&
      (claimState.status == "Fail" || claimState.status == "Exception")
    ) {
      alert(
        `Failed to claim: ${
          claimState.errorMessage.charAt(0).toUpperCase() +
          claimState.errorMessage.slice(1)
        }`
      );
      setIsClaiming(false);
    }
  }, [claimState]);

  useEffect(() => {
    if (isCompounding && compoundState.status == "Success") {
      alert("Compounded successfully");
      setIsCompounding(false);
      router.reload();
    } else if (
      isCompounding &&
      (compoundState.status == "Fail" || compoundState.status == "Exception")
    ) {
      alert(
        `Failed to compound: ${
          compoundState.errorMessage.charAt(0).toUpperCase() +
          compoundState.errorMessage.slice(1)
        }`
      );
      setIsCompounding(false);
    }
  }, [compoundState]);

  const closeWalletModal = () => {
    setWalletModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.content__header}>
          <h3 className="alien-22 text-white">Stake</h3>
          <div className="alien-16 text-white text-right">
            <p>
              Balance:{" "}
              {account
                ? balance
                  ? genFormatter.format(formatUnits(balance, 9))
                  : "-"
                : 0}
            </p>
            <p>
              Staked:{" "}
              {stakedTokens
                ? parseDecimals(formatUnits(stakedTokens, 9), 4)
                : 0}
            </p>
            <p>
              Rewards:{" "}
              {userRewards ? parseDecimals(formatUnits(userRewards, 9), 4) : 0}
            </p>
          </div>
        </div>
        <div className={styles.content__body}>
          <input
            type="text"
            placeholder="0.00"
            className={styles.stake__input}
            value={amount}
            onChange={(e) => {
              onInputNumberChange(e, handleStakeAmountChange);
            }}
          />
          <p>{errorMessage}</p>
          {account && (
            <div className={styles.stake__buttons}>
              {!isApproved ? (
                <button
                  onClick={handleApprove}
                  className="flex justify-center items-center gap-1"
                  disabled={
                    isApproved ||
                    isApproving ||
                    isClaiming ||
                    isUnstaking ||
                    amount <= 0 ||
                    compareNonTokenWithToken(balance, amount, 9) == -1
                  }
                >
                  Approve
                  {isApproving && (
                    <img className="w-6" src={Spinner.src} alt="" />
                  )}
                </button>
              ) : (
                <button
                  disabled={
                    amount <= 0 ||
                    compareNonTokenWithToken(balance, amount, 9) == -1 ||
                    isUnstaking ||
                    isStaking ||
                    isClaiming
                  }
                  className="flex justify-center items-center gap-1"
                  onClick={stakeTokens}
                >
                  Stake
                  {isStaking && (
                    <img className="w-6" src={Spinner.src} alt="" />
                  )}
                </button>
              )}
              <button
                className="flex justify-center items-center gap-1"
                disabled={
                  amount <= 0 ||
                  compareNonTokenWithToken(stakedTokens, amount, 9) == -1 ||
                  isUnstaking ||
                  isClaiming ||
                  isStaking ||
                  isApproving
                }
                onClick={handleUnstakeToken}
              >
                Unstake
                {isUnstaking && (
                  <img className="w-6" src={Spinner.src} alt="" />
                )}
              </button>
            </div>
          )}
          {account && (
            <div className={styles.stake__buttons}>
              <button
                disabled={
                  userRewards <= 0 ||
                  isStaking ||
                  isClaiming ||
                  isUnstaking ||
                  isApproving
                }
                className="flex justify-center items-center gap-1"
                onClick={handleClaimRewards}
              >
                Claim Rewards
                {isClaiming && <img className="w-6" src={Spinner.src} alt="" />}
              </button>
              <button
                disabled={
                  userRewards <= 0 ||
                  isStaking ||
                  isClaiming ||
                  isUnstaking ||
                  isApproving
                }
                className="flex justify-center items-center gap-1"
                onClick={handleCompoundRewards}
              >
                Compound
                {isCompounding && (
                  <img className="w-6" src={Spinner.src} alt="" />
                )}
              </button>
            </div>
          )}
          {account == undefined && (
            <div className={styles.stake__buttons}>
              <button
                className="flex justify-center items-center gap-1"
                onClick={() => {
                  setWalletModalOpen(true);
                }}
              >
                Connect Wallet
              </button>
            </div>
          )}
          <div className={styles.disclaimer}>
            <div className="flex items-center gap-1">
              <img src={DisclaimerIcon.src} alt="" />
              <h3 className="alien-16">Reward Distribution</h3>
            </div>
            <ul className="inter-reg-14">
              <li>APR: 36.0%</li>
            </ul>
          </div>
        </div>
      </div>
      <WalletManager isOpen={walletModalOpen} onCloseModal={closeWalletModal} />
    </div>
  );
}
