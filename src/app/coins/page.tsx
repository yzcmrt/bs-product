import { getAllCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';

interface PageProps {
  searchParams: Promise<{ page?: string; limit?: string; search?: string }>;
}

export default async function CoinsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams.page) || 1;
  const limit = Number(resolvedParams.limit) || 50;
  const searchQuery = resolvedParams.search || '';
  
  const allCoins = await getAllCoins();
  
  // Arama filtrelemesi
  const filteredCoins = searchQuery 
    ? allCoins.filter(coin => 
        coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coin.coin.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allCoins;

  console.log(`Toplam coin sayısı: ${filteredCoins.length}`);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Arama kutusu */}
      <div className="mb-6">
        <form className="flex gap-2">
          <input
            type="text"
            name="search"
            defaultValue={searchQuery}
            placeholder="Coin ara..."
            className="flex-1 px-4 py-2 bg-[#222] rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Ara
          </button>
        </form>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        {searchQuery 
          ? `Arama Sonuçları (${filteredCoins.length})` 
          : `Tüm Coinler (${filteredCoins.length})`}
      </h1>
      
      <div className="grid gap-4">
        {filteredCoins
          .slice((page - 1) * limit, page * limit)
          .map((coin) => (
            <Link href={`/coins/${encodeURIComponent(coin.coin)}`} key={coin.coin}>
              <div className="rounded-lg p-4 shadow hover:shadow-md transition-shadow border border-gray-800">
                <div className="flex justify-between mb-2">
                  <div>
                    <div className="font-medium flex items-center gap-2">
                      {coin.name}
                      {coin.verified && (
                        <span className="text-blue-500 text-sm">(Doğrulanmış)</span>
                      )}
                    </div>
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
            </Link>
          ))}
      </div>

      {/* Sayfalama */}
      {filteredCoins.length > limit && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/coins?page=${page - 1}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
              className="px-4 py-2 bg-[#222] rounded-lg hover:bg-[#333]"
            >
              Önceki
            </Link>
          )}
          {page * limit < filteredCoins.length && (
            <Link
              href={`/coins?page=${page + 1}&limit=${limit}${searchQuery ? `&search=${searchQuery}` : ''}`}
              className="px-4 py-2 bg-[#222] rounded-lg hover:bg-[#333]"
            >
              Sonraki
            </Link>
          )}
        </div>
      )}
    </div>
  );
} 