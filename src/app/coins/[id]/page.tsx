import { getCoinDetails, searchCoin } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import { Metadata } from 'next';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic'; // Her zaman taze veriler kullan

export default async function CoinPage({ params }: Props) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const decodedId = decodeURIComponent(id);
  
  try {
    // Direkt coin ID ile detayları ara
    let data = await getCoinDetails(decodedId);
    
    // Eğer coin bulunamadıysa ve ID kısa bir string ise, sembol olarak arama yapabiliriz
    if (!data && decodedId.length < 15 && !decodedId.includes('::')) {
      // Coin sembolü veya ismi ile arama yapalım
      const searchResults = await searchCoin(decodedId);
      
      // Eğer arama sonucu bulunduysa, ilk sonuç için detayları getir
      if (searchResults && searchResults.length > 0) {
        data = await getCoinDetails(searchResults[0].coinType);
      }
    }
    
    if (!data) {
      return (
        <ApiErrorDisplay 
          title="Coin bulunamadı" 
          message={`'${decodedId}' coini sistemde mevcut değil veya şu an API'den erişilemiyor.`}
          backLink="/coins"
          backText="Tüm Coinlere Dön"
        />
      );
    }

    // Kısmi veri durumunu kontrol et
    const hasPartialData = data.hasPartialData;

    return (
      <div className="max-w-7xl mx-auto p-2 sm:p-4 space-y-4 sm:space-y-6">
        {hasPartialData && (
          <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-300 p-3 rounded-lg">
            <p>Bu coin için sadece temel bilgiler mevcut. Detaylı bilgiler henüz API'de bulunmamaktadır.</p>
          </div>
        )}
        
        {/* Üst Bilgi Kartı */}
        <div className="bg-[#111] rounded-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{data.name || 'İsimsiz Coin'}</h1>
              <p className="text-gray-400">{data.symbol || 'Sembol Yok'}</p>
            </div>
            <div className="sm:ml-auto text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold">${formatPrice(data.price)}</div>
              <div className={`text-sm ${data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatNumber(data.priceChange24h, 2)}%
              </div>
            </div>
          </div>

          {/* Ana Metrikler */}
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div className="bg-[#222] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Market Değeri</div>
              <div className="text-lg font-medium">${formatNumber(data.marketCap)}</div>
            </div>
            <div className="bg-[#222] p-4 rounded-lg">
              <div className="text-sm text-gray-400">24s Hacim</div>
              <div className="text-lg font-medium">${formatNumber(data.volume24h)}</div>
            </div>
            <div className="bg-[#222] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Toplam Likidite</div>
              <div className="text-lg font-medium">${formatNumber(data.totalLiquidity)}</div>
            </div>
            <div className="bg-[#222] p-4 rounded-lg">
              <div className="text-sm text-gray-400">Toplam Arz</div>
              <div className="text-lg font-medium">{formatNumber(data.coinSupply)}</div>
            </div>
          </div>
        </div>

        {/* Detay bilgileri, sadece kısmi veri yoksa göster */}
        {!hasPartialData && (
          <>
            {/* Güvenlik Analizi */}
            <div className="bg-[#111] rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Güvenlik Analizi</h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">HoneyPot Riski</div>
                  <div className={`text-lg font-medium ${data.isCoinHoneyPot ? 'text-red-500' : 'text-green-500'}`}>
                    {data.isCoinHoneyPot ? 'VAR' : 'YOK'}
                  </div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Top 10 Holder</div>
                  <div className="text-lg font-medium">{formatNumber(data.top10HolderPercentage)}%</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Top 20 Holder</div>
                  <div className="text-lg font-medium">{formatNumber(data.top20HolderPercentage)}%</div>
                </div>
                <div className="bg-[#222] p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Geliştirici Cüzdanı</div>
                  <div className="text-lg font-medium truncate">{data.coinDev || '-'}</div>
                  <div className="text-sm text-gray-400">
                    {formatNumber(data.coinDevHoldingsPercentage, 2)}% ({formatNumber(data.coinDevHoldings)})
                  </div>
                </div>
              </div>
            </div>

            {/* Detaylı İstatistikler */}
            <div className="bg-[#111] rounded-lg p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Detaylı İstatistikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fiyat Değişimleri */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Fiyat Değişimleri</h3>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">5 Dakika</div>
                      <div className={`text-lg font-medium ${data.priceChange5m >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(data.priceChange5m, 2)}%
                      </div>
                    </div>
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">1 Saat</div>
                      <div className={`text-lg font-medium ${data.priceChange1h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(data.priceChange1h, 2)}%
                      </div>
                    </div>
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">6 Saat</div>
                      <div className={`text-lg font-medium ${data.priceChange6h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(data.priceChange6h, 2)}%
                      </div>
                    </div>
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">24 Saat</div>
                      <div className={`text-lg font-medium ${data.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(data.priceChange24h, 2)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hacim Analizi */}
                <div className="space-y-3 sm:space-y-4">
                  <h3 className="text-base sm:text-lg font-medium">Hacim Analizi</h3>
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Son 5 Dakika</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Alım</div>
                          <div className="text-sm text-green-500">${formatNumber(data.buyVolume5m)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Satım</div>
                          <div className="text-sm text-red-500">${formatNumber(data.sellVolume5m)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Toplam</div>
                          <div className="text-sm">${formatNumber(data.volume5m)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Son 1 Saat</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Alım</div>
                          <div className="text-sm text-green-500">${formatNumber(data.buyVolume1h)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Satım</div>
                          <div className="text-sm text-red-500">${formatNumber(data.sellVolume1h)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Toplam</div>
                          <div className="text-sm">${formatNumber(data.volume1h)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-[#222] p-4 rounded-lg">
                      <div className="text-sm text-gray-400">Son 6 Saat</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <div className="text-xs text-gray-400">Alım</div>
                          <div className="text-sm text-green-500">${formatNumber(data.buyVolume6h)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Satım</div>
                          <div className="text-sm text-red-500">${formatNumber(data.sellVolume6h)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Toplam</div>
                          <div className="text-sm">${formatNumber(data.volume6h)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Son Güncelleme Bilgisi */}
        <div className="text-right text-xs text-gray-500">
          Son güncelleme: {data.lastUpdated ? new Date(data.lastUpdated).toLocaleString('tr-TR') : 'Bilinmiyor'}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Coin detayları yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Coin bilgileri yüklenemedi" 
        message="Coin bilgileri getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/coins"
        backText="Tüm Coinlere Dön"
      />
    );
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  
  return {
    title: `${id} Details - BullScan`,
    description: `Detailed information about ${id} cryptocurrency`,
  };
} 