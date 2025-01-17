import { getTrendingCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';

export default async function TrendingPage() {
  const trendingCoins = await getTrendingCoins();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Trend Coinler</h1>
      
      <div className="bg-[#111] rounded-lg overflow-hidden">
        <div className="grid grid-cols-6 gap-4 p-4 font-semibold border-b border-gray-700">
          <div>Coin</div>
          <div className="text-right">Fiyat</div>
          <div className="text-right">24s Değişim</div>
          <div className="text-right">Hacim (24s)</div>
          <div className="text-right">Market Değeri</div>
          <div className="text-right">Likidite</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {trendingCoins.map((coin) => (
            <div key={coin.coin} className="grid grid-cols-6 gap-4 p-4 hover:bg-[#222]">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium">{coin.coinMetadata.name}</div>
                  <div className="text-sm text-gray-400">{coin.coinMetadata.symbol}</div>
                </div>
              </div>
              
              <div className="text-right">
                ${formatPrice(coin.coinPrice)}
              </div>
              
              <div className={`text-right ${coin.percentagePriceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatNumber(coin.percentagePriceChange24h, 2)}%
              </div>
              
              <div className="text-right">
                ${formatNumber(coin.volume24h)}
              </div>
              
              <div className="text-right">
                ${formatNumber(coin.marketCap)}
              </div>
              
              <div className="text-right">
                ${formatNumber(coin.totalLiquidityUsd)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 