import { usePendingRewards } from "@/hooks/stake/usePendingRewards";
import { useStakerInfo } from "@/hooks/stake/useStakerInfo";
import { useEthers, ChainId, Mainnet, useUpdateConfig } from "@usedapp/core";
import React, { useEffect, useState } from "react";
import DLCDappContext from "./context";

function DLCDappProvider({ children }) {
  const { account, chainId, library } = useEthers();
  const updateConfig = useUpdateConfig();
  const [isChainError, setIsChainError] = useState(false);
  const userInfo = useStakerInfo(account);
  const userRewards = usePendingRewards(account);

  useEffect(() => {
    try {
      if (account != undefined && library != undefined) {
        updateConfig({ readOnlyUrls: { [ChainId.Mainnet]: library } });
      } else {
        updateConfig({
          readOnlyUrls: {
            [ChainId.Mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
          },
        });
      }
    } catch (e) {
      console.error("Provider switch failed. Going back to alchemy: ", e);
      updateConfig({
        readOnlyUrls: {
          [ChainId.Mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
        },
      });
    }
  }, [account]);

  useEffect(() => {
    if (account != undefined && chainId != undefined) {
      if (chainId != Mainnet.chainId) {
        setIsChainError(true);
        updateConfig({
          readOnlyUrls: {
            [ChainId.Mainnet]: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
          },
        });
      } else {
        setIsChainError(false);
        updateConfig({
          readOnlyUrls: {
            [ChainId.Mainnet]: library,
          },
        });
      }
    }
  }, [account, chainId]);

  useEffect(() => {
    if (isChainError && account == undefined) {
      setIsChainError(false);
    }
  }, [isChainError, account]);

  return (
    <DLCDappContext.Provider value={{ userInfo, userRewards, isChainError }}>
      {children}
    </DLCDappContext.Provider>
  );
}

function useDLCDapp() {
  const context = React.useContext(DLCDappContext);
  if (context === undefined) {
    throw new Error("useDLCDapp must be used within a YantraDappProvider");
  }
  return context;
}

export { DLCDappProvider, useDLCDapp };
