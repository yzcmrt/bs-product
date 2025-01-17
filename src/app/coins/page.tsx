import { getAllCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';

export default async function CoinsPage() {
  const coins = await getAllCoins();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tüm Coinler</h1>
      <div className="grid gap-4">
        {coins.map((coin) => {
          const priceChange = coin.priceChange24h ?? 0;
          const price = coin.price ?? 0;

          return (
            <Link href={`/coins/${coin.coin}`} key={coin.coin}>
              <div className="rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-800">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-medium">{coin.name}</div>
                    <div className="text-sm text-gray-400">{coin.symbol}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${formatPrice(price)}</div>
                    <div className={`text-sm ${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatNumber(priceChange, 2)}%
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
            </Link>
          );
        })}
      </div>
    </div>
  );
} 