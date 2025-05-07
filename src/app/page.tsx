import { getActiveCoins, getTrendingCoins, getTopHolderQualityScore } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function Home() {
  try {
    // Paralel olarak gerçek zamanlı verileri getir
    const [activeCoins, trendingCoins, topHolders] = await Promise.all([
      getActiveCoins(),
      getTrendingCoins(),
      getTopHolderQualityScore()
    ]);

    // En aktif 5 coini hacme göre sırala
    const topActiveCoins = [...activeCoins]
      .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
      .slice(0, 5);
    
    // En çok yükselen 5 coini fiyat değişimine göre sırala
    const topGainers = [...activeCoins]
      .sort((a, b) => (b.priceChange24h || 0) - (a.priceChange24h || 0))
      .slice(0, 5);
    
    // En iyi kaliteye sahip 5 holder
    const topQualityCoins = topHolders.slice(0, 5);

    return (
      <div className="w-full mx-auto">
        <div className="mb-6 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">BullScan</h1>
          <p className="text-sm sm:text-base text-gray-400 mb-4">SUI ekosistemindeki en iyi coin analiz platformu</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {/* Aktif Coinler */}
          <div className="bg-[#111] rounded-lg p-3 sm:p-4 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">En Aktif Coinler</h2>
              <Link href="/active-coins" className="text-blue-400 text-xs sm:text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {topActiveCoins.map(coin => (
                <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`} className="block">
                  <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium text-sm sm:text-base">{coin.name || 'İsimsiz Coin'}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{coin.symbol || '???'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm sm:text-base">${formatPrice(coin.price)}</div>
                      <div className={`text-xs sm:text-sm ${coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(coin.priceChange24h, 2)}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* En Çok Yükselenler */}
          <div className="bg-[#111] rounded-lg p-3 sm:p-4 md:p-6 shadow-lg">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">En Çok Yükselenler</h2>
              <Link href="/trending" className="text-blue-400 text-xs sm:text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {topGainers.map(coin => (
                <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`} className="block">
                  <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium text-sm sm:text-base">{coin.name || 'İsimsiz Coin'}</div>
                      <div className="text-xs sm:text-sm text-gray-400">{coin.symbol || '???'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm sm:text-base">${formatPrice(coin.price)}</div>
                      <div className="text-xs sm:text-sm text-green-500">
                        +{formatNumber(coin.priceChange24h, 2)}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* En İyi Holder Kalitesi */}
          <div className="bg-[#111] rounded-lg p-3 sm:p-4 md:p-6 shadow-lg sm:col-span-2 lg:col-span-1">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-bold">En İyi Holder Kalitesi</h2>
              <Link href="/holder-quality" className="text-blue-400 text-xs sm:text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {topQualityCoins.map(holder => (
                <Link key={holder._id} href={`/coins/${encodeURIComponent(holder.coin)}`} className="block">
                  <div className="flex justify-between items-center p-2 sm:p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium text-sm sm:text-base">{holder.coin.split('::').pop() || holder.coin}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-sm sm:text-base text-purple-400">
                        {formatNumber(holder.holderQualityScore, 2)} puan
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        {holder.holdersWithProminentNft} NFT sahibi
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-6">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Ana sayfa yüklenirken hata:', error);
    return (
      <ApiErrorDisplay
        title="Ana sayfa verileri yüklenemedi"
        message="Veriler getirilirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin."
      />
    );
  }
}
