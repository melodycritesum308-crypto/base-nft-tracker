









'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import NFTGallery from '@/components/NFTGallery';

export default function Home() {
  const [address, setAddress] = useState('');
  const [searchedAddress, setSearchedAddress] = useState('');
  const { address: connectedAddress, isConnected } = useAccount();
  const { connect } = useConnect({ connector: new InjectedConnector() });
  const { disconnect } = useDisconnect();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (address) setSearchedAddress(address);
  };

  const displayAddress = searchedAddress || connectedAddress || '';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 py-6">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Base NFT Tracker</h1>
            <p className="text-zinc-400 mt-1">Track NFTs on Coinbase Base chain</p>
          </div>
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm font-medium"
            >
              Disconnect {connectedAddress?.slice(0,6)}...{connectedAddress?.slice(-4)}
            </button>
          ) : (
            <button
              onClick={() => connect()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-12">
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Base wallet address (0x...)"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-6 py-4 text-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-10 bg-white text-black font-semibold rounded-2xl hover:bg-zinc-200 transition"
            >
              Track NFTs
            </button>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-3">
            Example: 0x123... or connect your wallet above
          </p>
        </form>

        {displayAddress && (
          <NFTGallery address={displayAddress} />
        )}

        {!displayAddress && (
          <div className="text-center py-20 text-zinc-500">
            <p className="text-2xl">Enter a wallet address to start tracking NFTs on Base</p>
          </div>
        )}
      </main>
    </div>
  );
}
