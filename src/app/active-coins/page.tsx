import { getActiveCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Verilerin her zaman taze olması için

export default async function ActiveCoinsPage() {
  try {
    const activeCoins = await getActiveCoins();
    
    // İşlem hacmine göre sırala
    const sortedCoins = [...activeCoins].sort((a, b) => 
      (b.volume24h || 0) - (a.volume24h || 0)
    );

    return (
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">Aktif Coinler</h1>
        
        {sortedCoins.length === 0 ? (
          <div className="bg-[#111] rounded-lg p-4 sm:p-6 text-center shadow-lg">
            <p className="text-gray-400">Şu anda aktif coin bulunamadı. Lütfen daha sonra tekrar kontrol edin.</p>
          </div>
        ) : (
          <>
            {/* Masaüstü Tablosu */}
            <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                <div>Coin</div>
                <div className="text-right">Fiyat</div>
                <div className="text-right">24s Değişim</div>
                <div className="text-right">Hacim (24s)</div>
                <div className="text-right">Market Değeri</div>
                <div className="text-right">Likidite</div>
                <div className="text-right">Durum</div>
              </div>
              
              <div className="divide-y divide-gray-700">
                {sortedCoins.map((coin) => (
                  <Link 
                    href={`/coins/${encodeURIComponent(coin.coin)}`} 
                    key={coin.coin} 
                    className="grid grid-cols-7 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-[#222] block text-sm md:text-base"
                  >
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div>
                        <div className="font-medium">
                          {coin.name || 'İsimsiz Coin'}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          {coin.symbol || '???'}
                        </div>
                        {coin.verified && (
                          <span className="inline-flex items-center rounded-full bg-green-100/10 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 mt-1">
                            Doğrulanmış
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {coin.price ? `$${formatPrice(coin.price)}` : '-'}
                    </div>
                    
                    <div className={`text-right ${(coin.priceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {coin.priceChange24h !== undefined ? `${formatNumber(coin.priceChange24h, 2)}%` : '-'}
                    </div>
                    
                    <div className="text-right">
                      {coin.volume24h ? `$${formatNumber(coin.volume24h)}` : '-'}
                    </div>
                    
                    <div className="text-right">
                      {coin.marketCap ? `$${formatNumber(coin.marketCap)}` : '-'}
                    </div>
                    
                    <div className="text-right">
                      {coin.totalLiquidity ? `$${formatNumber(coin.totalLiquidity)}` : '-'}
                    </div>
                    
                    <div className="text-right">
                      <div className="flex flex-wrap justify-end gap-1">
                        {coin.isTrending && (
                          <span className="inline-flex items-center rounded-full bg-blue-100/10 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                            Trend
                          </span>
                        )}
                        {coin.isTraded && (
                          <span className="inline-flex items-center rounded-full bg-purple-100/10 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                            İşlem
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Mobil Kartları */}
            <div className="sm:hidden space-y-3">
              {sortedCoins.map((coin) => (
                <Link
                  key={coin.coin}
                  href={`/coins/${encodeURIComponent(coin.coin)}`}
                  className="block"
                >
                  <div className="bg-[#111] rounded-lg p-3 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-bold mb-0.5">
                          {coin.name || 'İsimsiz Coin'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {coin.symbol || '???'}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {coin.verified && (
                            <span className="inline-flex items-center rounded-full bg-green-100/10 px-2 py-0.5 text-[10px] font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                              Doğrulanmış
                            </span>
                          )}
                          {coin.isTrending && (
                            <span className="inline-flex items-center rounded-full bg-blue-100/10 px-2 py-0.5 text-[10px] font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                              Trend
                            </span>
                          )}
                          {coin.isTraded && (
                            <span className="inline-flex items-center rounded-full bg-purple-100/10 px-2 py-0.5 text-[10px] font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                              İşlem
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">
                          {coin.price ? `$${formatPrice(coin.price)}` : '-'}
                        </div>
                        <div className={`text-xs font-medium ${(coin.priceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {coin.priceChange24h !== undefined ? `${(coin.priceChange24h || 0) >= 0 ? '+' : ''}${formatNumber(coin.priceChange24h, 2)}%` : '-'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#1a1a1a] p-2.5 rounded">
                        <div className="text-xs text-gray-400 mb-1">Hacim (24s)</div>
                        <div className="font-medium">
                          {coin.volume24h ? `$${formatNumber(coin.volume24h)}` : '-'}
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1a] p-2.5 rounded">
                        <div className="text-xs text-gray-400 mb-1">Market Değeri</div>
                        <div className="font-medium">
                          {coin.marketCap ? `$${formatNumber(coin.marketCap)}` : '-'}
                        </div>
                      </div>
                      
                      <div className="bg-[#1a1a1a] p-2.5 rounded col-span-2">
                        <div className="text-xs text-gray-400 mb-1">Likidite</div>
                        <div className="font-medium">
                          {coin.totalLiquidity ? `$${formatNumber(coin.totalLiquidity)}` : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        
        <div className="text-right text-xs text-gray-500 mt-3 sm:mt-4">
          Toplam {sortedCoins.length} aktif coin • Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Aktif coinler yüklenirken hata:', error);
    return <ApiErrorDisplay 
      title="Aktif coinler yüklenemedi" 
      message="Aktif coin verileri getirilirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin."
      backLink="/"
      backText="Ana Sayfaya Dön"
    />;
  }
} 