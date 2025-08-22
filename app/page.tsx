"use client";

import {
  useMiniKit,
  useAddFrame,
  useOpenUrl,
} from "@coinbase/onchainkit/minikit";
import {
  Name,
  Identity,
  Address,
  Avatar,
  EthBalance,
} from "@coinbase/onchainkit/identity";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Button } from "./components/DemoComponents";
import { Icon } from "./components/DemoComponents";
import { Home } from "./components/DemoComponents";
import { Features } from "./components/DemoComponents";
import { Community } from "./components/Community";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const [frameAdded, setFrameAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "features" | "community" | "goals">("community");

  const addFrame = useAddFrame();
  const openUrl = useOpenUrl();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="text-[var(--app-accent)] p-4"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex items-center space-x-1 text-sm font-medium text-[#0052FF] animate-fade-out">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3 pb-24">
        <header className="flex justify-between items-center mb-3 h-11">
          <div>
            <div className="flex items-center space-x-2">
              <Wallet className="z-10">
                <ConnectWallet>
                  <Name className="text-inherit" />
                </ConnectWallet>
                <WalletDropdown>
                  <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                    <Avatar />
                    <Name />
                    <Address />
                    <EthBalance />
                  </Identity>
                  <WalletDropdownDisconnect />
                </WalletDropdown>
              </Wallet>
            </div>
          </div>
          <div>{saveFrameButton}</div>
        </header>

        <main className="flex-1">
          {activeTab === "home" && <Home setActiveTab={setActiveTab} />}
          {activeTab === "features" && <Features setActiveTab={setActiveTab} />}
          {activeTab === "community" && (
            <Community title="Community" initialTab="all" htmlSrc="/community.html" />
          )}
          {activeTab === "goals" && (
            <Community title="My Goals" initialTab="mine" htmlSrc="/goals.html" />
          )}
        </main>

        <footer className="mt-2 pt-4 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-[var(--ock-text-foreground-muted)] text-xs"
            onClick={() => openUrl("https://base.org/builders/minikit")}
          >
            Built on Base with MiniKit
          </Button>
        </footer>
      </div>

      <nav className="fixed bottom-3 left-0 right-0">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="bg-[var(--app-card-bg)] backdrop-blur-md border border-[var(--app-card-border)] rounded-2xl shadow-lg p-2 flex justify-around">
            <button
              type="button"
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center px-3 py-1 rounded-xl ${activeTab === "home" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
            >
              <Icon name="home" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={`flex flex-col items-center px-3 py-1 rounded-xl ${activeTab === "community" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
            >
              <Icon name="users" />
              <span className="text-xs mt-1">Community</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("goals")}
              className={`flex flex-col items-center px-3 py-1 rounded-xl ${activeTab === "goals" ? "text-[var(--app-accent)]" : "text-[var(--app-foreground-muted)]"}`}
            >
              <Icon name="target" />
              <span className="text-xs mt-1">Goals</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
