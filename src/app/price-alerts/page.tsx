import { getTrendingCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function PriceAlertsPage() {
  try {
    const allCoins = await getTrendingCoins();

    if (!allCoins || allCoins.length === 0) {
      return (
        <ApiErrorDisplay 
          title="Veri bulunamadı" 
          message="Coin verileri bulunamadı. Lütfen daha sonra tekrar deneyin."
          backLink="/"
          backText="Ana Sayfaya Dön"
        />
      );
    }

    // Büyük fiyat değişikliklerini filtrele ve sınıflandır
    const bigMovers5m = allCoins.filter(coin => Math.abs(coin.priceChange5m || 0) > 2)
      .sort((a, b) => Math.abs(b.priceChange5m || 0) - Math.abs(a.priceChange5m || 0));
    
    const bigMovers1h = allCoins.filter(coin => Math.abs(coin.priceChange1h || 0) > 5)
      .sort((a, b) => Math.abs(b.priceChange1h || 0) - Math.abs(a.priceChange1h || 0));
      
    const bigMovers24h = allCoins.filter(coin => Math.abs(coin.percentagePriceChange24h || 0) > 10)
      .sort((a, b) => Math.abs(b.percentagePriceChange24h || 0) - Math.abs(a.percentagePriceChange24h || 0));

    // Mobil için tablo gösterimleri
    const renderMobileCard = (coin: any, changeValue: number, timeframe: string) => (
      <div className="bg-[#111] p-3 rounded-lg shadow-md mb-2">
        <div className="flex justify-between mb-3">
          <div>
            <div className="font-bold mb-0.5">
              {coin.coinMetadata?.symbol || coin.coin.split('::').pop()}
            </div>
            <div className="text-xs text-gray-400">
              {coin.coinMetadata?.name || ''}
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold">${formatPrice(coin.coinPrice)}</div>
            <div className={`text-xs font-medium ${changeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatNumber(changeValue, 2)}%
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1a1a1a] p-2.5 rounded">
            <div className="text-xs text-gray-400 mb-1">Değişim ({timeframe})</div>
            <div className={`font-medium ${changeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {changeValue >= 0 ? '+' : ''}{formatNumber(changeValue, 2)}%
            </div>
          </div>
          
          <div className="bg-[#1a1a1a] p-2.5 rounded">
            <div className="text-xs text-gray-400 mb-1">Hacim ({timeframe})</div>
            <div className="font-medium">${formatNumber(
              timeframe === '5dk' ? coin.volume5m : 
              timeframe === '1s' ? coin.volume1h : 
              coin.volume24h, 
              0
            )}</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-2.5 rounded col-span-2">
            <div className="text-xs text-gray-400 mb-1">Market Değeri</div>
            <div className="font-medium">${formatNumber(coin.marketCap || 0, 0)}</div>
          </div>
        </div>
      </div>
    );

    // Masaüstü için tablo satırları
    const renderDesktopRow = (coin: any, changeValue: number, volumeValue: number) => (
      <Link 
        key={coin.coin} 
        href={`/coins/${encodeURIComponent(coin.coin)}`}
        className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-[#222] block text-sm md:text-base"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          <div>
            <div className="font-medium">
              {coin.coinMetadata?.symbol || coin.coin.split('::').pop()}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {coin.coinMetadata?.name || ''}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          ${formatPrice(coin.coinPrice)}
        </div>
        
        <div className={`text-right ${changeValue >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {formatNumber(changeValue, 2)}%
        </div>
        
        <div className="text-right">
          ${formatNumber(volumeValue, 0)}
        </div>
        
        <div className="text-right">
          ${formatNumber(coin.marketCap || 0, 0)}
        </div>
      </Link>
    );

    return (
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">Fiyat Alarmları</h1>
        
        {/* Son 5 dakikadaki büyük hareketler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Son 5 Dakika &gt; 2%</h2>
          
          {bigMovers5m.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda bu kriterlere uyan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {bigMovers5m.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileCard(coin, coin.priceChange5m || 0, '5dk')}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div className="text-right">Fiyat</div>
                  <div className="text-right">5dk Değişim</div>
                  <div className="text-right">Hacim (5dk)</div>
                  <div className="text-right">Market Değeri</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {bigMovers5m.map((coin) => 
                    renderDesktopRow(coin, coin.priceChange5m || 0, coin.volume5m || 0)
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Son 1 saatteki büyük hareketler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Son 1 Saat &gt; 5%</h2>
          
          {bigMovers1h.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda bu kriterlere uyan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {bigMovers1h.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileCard(coin, coin.priceChange1h || 0, '1s')}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div className="text-right">Fiyat</div>
                  <div className="text-right">1sa Değişim</div>
                  <div className="text-right">Hacim (1sa)</div>
                  <div className="text-right">Market Değeri</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {bigMovers1h.map((coin) => 
                    renderDesktopRow(coin, coin.priceChange1h || 0, coin.volume1h || 0)
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Son 24 saatteki büyük hareketler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Son 24 Saat &gt; 10%</h2>
          
          {bigMovers24h.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda bu kriterlere uyan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {bigMovers24h.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileCard(coin, coin.percentagePriceChange24h || 0, '24s')}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div className="text-right">Fiyat</div>
                  <div className="text-right">24sa Değişim</div>
                  <div className="text-right">Hacim (24sa)</div>
                  <div className="text-right">Market Değeri</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {bigMovers24h.map((coin) => 
                    renderDesktopRow(coin, coin.percentagePriceChange24h || 0, coin.volume24h || 0)
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-4">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Fiyat alarmları sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Fiyat alarmları yüklenemedi" 
        message="Veriler getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 