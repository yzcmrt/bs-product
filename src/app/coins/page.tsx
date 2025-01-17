import { getAllCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';

export default async function CoinsPage() {
  const coins = await getAllCoins();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tüm Coinler</h1>
      
      <div className="bg-[#111] rounded-lg overflow-hidden">
        <div className="hidden md:grid grid-cols-6 p-4 font-semibold border-b border-gray-700">
          <div>Coin</div>
          <div className="text-right">Fiyat</div>
          <div className="text-right">24s Değişim</div>
          <div className="text-right">Hacim (24s)</div>
          <div className="text-right">Market Değeri</div>
          <div className="text-right">Likidite</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {coins.map((coin) => (
            <Link 
              key={coin.coin} 
              href={`/coins/${encodeURIComponent(coin.coin)}`}
              className="block hover:bg-[#222] transition-colors"
            >
              <div className="md:hidden p-4">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-gray-400">{coin.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${formatPrice(coin.price)}</div>
                    <div className={`text-sm ${coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatNumber(coin.priceChange24h, 2)}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm text-gray-400">
                  <div>
                    <div className="text-xs mb-1">Hacim (24s)</div>
                    <div>${formatNumber(coin.volume24h)}</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Market Değeri</div>
                    <div>${formatNumber(coin.marketCap)}</div>
                  </div>
                  <div>
                    <div className="text-xs mb-1">Likidite</div>
                    <div>${formatNumber(coin.totalLiquidity)}</div>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-6 p-4 items-center">
                <div>
                  <div className="font-medium">{coin.name}</div>
                  <div className="text-sm text-gray-400">{coin.symbol}</div>
                </div>
                <div className="text-right">${formatPrice(coin.price)}</div>
                <div className={`text-right ${coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatNumber(coin.priceChange24h, 2)}%
                </div>
                <div className="text-right">${formatNumber(coin.volume24h)}</div>
                <div className="text-right">${formatNumber(coin.marketCap)}</div>
                <div className="text-right">${formatNumber(coin.totalLiquidity)}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 