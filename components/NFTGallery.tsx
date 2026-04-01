



















'use client';

import { useEffect, useState } from 'react';
import Moralis from 'moralis';
import { EvmNft } from '@moralisweb3/common-evm-utils';

interface Props {
  address: string;
}

export default function NFTGallery({ address }: Props) {
  const [nfts, setNfts] = useState<EvmNft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchNFTs() {
      setLoading(true);
      setError('');

      try {
        // Initialize Moralis (do this once in layout or _app)
        if (!Moralis.Core.isStarted) {
          await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
        }

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          address,
          chain: 'base', // Base mainnet
          limit: 100,
        });

        setNfts(response.result || []);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch NFTs. Make sure the address is correct and has activity on Base.');
      } finally {
        setLoading(false);
      }
    }

    fetchNFTs();
  }, [address]);

  if (loading) return <div className="text-center py-20">Loading NFTs from Base...</div>;
  if (error) return <div className="text-red-400 text-center py-20">{error}</div>;
  if (nfts.length === 0) return <div className="text-center py-20 text-zinc-400">No NFTs found for this address on Base.</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold">
          NFT Portfolio <span className="text-zinc-500 text-xl">({nfts.length} items)</span>
        </h2>
        <p className="text-sm text-zinc-500">Chain: Base • Standard: ERC-721 / ERC-1155</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {nfts.map((nft, index) => {
          const metadata = nft.metadata ? JSON.parse(JSON.stringify(nft.metadata)) : {};
          const image = metadata.image || metadata.image_url || nft.tokenUri || '';

          return (
            <div key={`${nft.tokenAddress}-${nft.tokenId}-${index}`} className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-blue-500 transition group">
              <div className="aspect-square bg-zinc-950 relative">
                {image ? (
                  <img
                    src={image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
                    alt={nft.name || 'NFT'}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-nft.png'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600">No image</div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-medium truncate">{nft.name || `Token #${nft.tokenId}`}</h3>
                <p className="text-xs text-zinc-500 mt-1 truncate">{nft.contractType} • {nft.symbol}</p>
                {metadata.description && (
                  <p className="text-sm text-zinc-400 line-clamp-2 mt-3">{metadata.description}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
