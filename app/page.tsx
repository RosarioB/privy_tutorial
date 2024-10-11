"use client";

import { ERC721_ADDRESS } from "@/lib/constants";
import { Button, Divider, Input } from "@nextui-org/react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";
import { useState } from "react";
import { baseSepolia } from "viem/chains";
import { encodeFunctionData } from "viem";
import { erc721Abi } from "@/lib/erc721Abi";

export default function Home() {
  const { ready, authenticated, logout, user } = usePrivy();
  const { login } = useLogin();
  const { client } = useSmartWallets();
  const [isLoadingNft, setIsLoadingNft] = useState(false);
  const [recipientNftAddress, setRecipientNftAddress] = useState("");
  const [errorMessageNft, setErrorMessageNft] = useState("");
  const [nftTx, setNftTx] = useState("");

  const mintNftTransaction = async () => {
    setIsLoadingNft(true);
    setNftTx("");
    if (!client) {
      console.error("No smart account client found");
      return;
    }

    setErrorMessageNft("");

    try {
      const tx = await client.sendTransaction({
        chain: baseSepolia,
        to: ERC721_ADDRESS,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: erc721Abi,
          functionName: "safeMint",
          args: [recipientNftAddress as `0x${string}`],
        }),
      });
      console.log("tx", tx);
      setNftTx(tx);
    } catch (error) {
      console.error("Transaction failed:", error);
      setErrorMessageNft("Transaction failed. Please try again.");
    }
    setIsLoadingNft(false);
  };

  const handleLogout = () => {
    // Reset all input fields
    setIsLoadingNft(false);
    setRecipientNftAddress("");
    setErrorMessageNft("");
    setNftTx("");

    logout();
  };

  return (
    <div className="min-h-screen min-w-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 h-screen text-black">
        <div className=" col-span-2 bg-gray-50 p-12 h-full flex flex-col lg:flex-row items-center justify-center space-y-2">
          <div className="flex flex-col justify-evenly h-full">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2"></div>
              <div className="text-3xl lg:text-6xl font-black">
                Privy Tutorial
              </div>
              <div className="text-md lg:text-lg">Your Privy Tutorial App</div>
              {ready && !authenticated && (
                <Button
                  radius="sm"
                  color="secondary"
                  className="w-4 text-white"
                  onClick={() => login()}
                >
                  Login
                </Button>
              )}
              {ready && authenticated && (
                <Button
                  radius="sm"
                  color="danger"
                  className="w-4"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-2 bg-white h-full p-12 lg:p-48 flex flex-col lg:flex-row items-center justify-center w-full space-y-4">
          {!user && <div className="lg:w-1/2"></div>}
          {user && (
            <div className="lg:flex lg:flex-row justify-center w-full">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex flex-col gap-2">
                    <div className="text-base font-semibold">Wallets</div>
                    <div className="flex items-center">
                      <Input
                        size="sm"
                        value={user.wallet?.address}
                        label="Embedded Wallet"
                        isReadOnly
                        className="flex-grow"
                      />
                    </div>
                    <div className="flex items-center">
                      <Input
                        size="sm"
                        value={client?.account.address}
                        label="Smart Wallet"
                        isReadOnly
                        className="flex-grow"
                      />
                    </div>
                    <Divider />
                    <div className="flex flex-col gap-2">
                      <div className="text-base font-semibold">Mint NFT</div>
                      <div className="flex items-center">
                        <Input
                          size="sm"
                          value={recipientNftAddress}
                          onChange={(e) =>
                            setRecipientNftAddress(e.target.value)
                          }
                          placeholder="Enter recipient address"
                          label="Recipient Address"
                        />
                      </div>
                      <Button
                        radius="sm"
                        color="secondary"
                        className="w-1/5"
                        onClick={() => mintNftTransaction()}
                        isLoading={isLoadingNft}
                        isDisabled={!recipientNftAddress}
                      >
                        Mint NFT
                      </Button>
                      {errorMessageNft && (
                        <div className="text-red-500 text-xs text-center mt-1">
                          {errorMessageNft}
                        </div>
                      )}
                      {nftTx && (
                        <div className="flex flex-col">
                          <div className="flex items-center">
                            <Input
                              size="sm"
                              value={nftTx}
                              label="NFT Minting Transaction"
                              isReadOnly
                              className="flex-grow"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
