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
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-3">
            <h1 className="text-4xl font-bold mb-2">BullScan</h1>
            <p className="text-gray-400 mb-6">SUI ekosistemindeki en iyi coin analiz platformu</p>
          </div>
          
          {/* Aktif Coinler */}
          <div className="bg-[#111] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">En Aktif Coinler</h2>
              <Link href="/active-coins" className="text-blue-400 text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-3">
              {topActiveCoins.map(coin => (
                <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`} className="block">
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium">{coin.name || 'İsimsiz Coin'}</div>
                      <div className="text-sm text-gray-400">{coin.symbol || '???'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${formatPrice(coin.price)}</div>
                      <div className={`text-sm ${coin.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(coin.priceChange24h, 2)}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* En Çok Yükselenler */}
          <div className="bg-[#111] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">En Çok Yükselenler</h2>
              <Link href="/trending" className="text-blue-400 text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-3">
              {topGainers.map(coin => (
                <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`} className="block">
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium">{coin.name || 'İsimsiz Coin'}</div>
                      <div className="text-sm text-gray-400">{coin.symbol || '???'}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${formatPrice(coin.price)}</div>
                      <div className="text-sm text-green-500">
                        +{formatNumber(coin.priceChange24h, 2)}%
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* En İyi Holder Kalitesi */}
          <div className="bg-[#111] rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">En İyi Holder Kalitesi</h2>
              <Link href="/holder-quality" className="text-blue-400 text-sm hover:underline">
                Tümünü Gör
              </Link>
            </div>
            
            <div className="space-y-3">
              {topQualityCoins.map(holder => (
                <Link key={holder._id} href={`/coins/${encodeURIComponent(holder.coin)}`} className="block">
                  <div className="flex justify-between items-center p-3 rounded-lg hover:bg-[#222]">
                    <div>
                      <div className="font-medium">{holder.coin.split('::').pop() || holder.coin}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-purple-400">
                        {formatNumber(holder.holderQualityScore, 2)} puan
                      </div>
                      <div className="text-sm text-gray-400">
                        {holder.holdersWithProminentNft} NFT sahibi
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-8">
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
