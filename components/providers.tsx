"use client";

import { NextUIProvider } from "@nextui-org/react";
import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { baseSepolia } from "viem/chains";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID as string}
        config={{
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
          },
          embeddedWallets: {
            createOnLogin: "all-users",
          },
          defaultChain: baseSepolia,
          supportedChains: [baseSepolia],
        }}
      >
        <SmartWalletsProvider>
          <main className="h-full">{children}</main>
        </SmartWalletsProvider>
      </PrivyProvider>
    </NextUIProvider>
  );
}
