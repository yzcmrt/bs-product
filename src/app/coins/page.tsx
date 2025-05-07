import { getAllCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function CoinsPage() {
  try {
    const allCoins = await getAllCoins();
    
    if (!allCoins || allCoins.length === 0) {
      return (
        <ApiErrorDisplay 
          title="Veri bulunamadı" 
          message="Coin verisi bulunamadı. Lütfen daha sonra tekrar deneyin."
          backLink="/"
          backText="Ana Sayfaya Dön"
        />
      );
    }

    // Market değerine göre sırala
    const sortedCoins = [...allCoins].sort((a, b) => 
      (b.marketCap || 0) - (a.marketCap || 0)
    );

    return (
      <div className="max-w-7xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Tüm Coinler</h1>
        
        <div className="bg-[#111] rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-4 font-semibold border-b border-gray-700">
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
                className="grid grid-cols-7 gap-4 p-4 hover:bg-[#222] block"
              >
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">{coin.name || 'İsimsiz Coin'}</div>
                    <div className="text-sm text-gray-400">{coin.symbol || '???'}</div>
                    {coin.verified && (
                      <span className="inline-flex items-center rounded-full bg-green-100/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20 mt-1">
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
                      <span className="inline-flex items-center rounded-full bg-blue-100/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-500/20">
                        Trend
                      </span>
                    )}
                    {coin.isActive && (
                      <span className="inline-flex items-center rounded-full bg-green-100/10 px-2 py-1 text-xs font-medium text-green-400 ring-1 ring-inset ring-green-500/20">
                        Aktif
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-2">
          Toplam {sortedCoins.length} coin listeleniyor • Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Coins sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Coinler yüklenemedi" 
        message="Coin verileri getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 