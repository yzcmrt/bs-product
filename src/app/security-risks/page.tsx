import { getTrendingCoins } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function SecurityRisksPage() {
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

    // Riskli coinleri filtrele
    const honeypotRisks = allCoins.filter(coin => coin.isCoinHoneyPot)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));
    
    const concentrationRisks = allCoins.filter(coin => (coin.top10HolderPercentage || 0) > 80)
      .sort((a, b) => (b.top10HolderPercentage || 0) - (a.top10HolderPercentage || 0));
      
    const mintableRisks = allCoins.filter(coin => coin.isMintable)
      .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0));

    const suspiciousActivities = allCoins
      .filter(coin => coin.suspiciousActivities && coin.suspiciousActivities.length > 0)
      .sort((a, b) => (b.suspiciousActivities?.length || 0) - (a.suspiciousActivities?.length || 0));

    // Mobil kart bileşeni
    const renderMobileRiskCard = (coin: any, riskType: string, riskData: any) => (
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
            <div className={`text-xs font-medium ${(coin.percentagePriceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(coin.percentagePriceChange24h || 0) >= 0 ? '+' : ''}{formatNumber(coin.percentagePriceChange24h || 0, 2)}%
            </div>
          </div>
        </div>
        
        <div className="mt-2 mb-3">
          {riskType === 'honeypot' && (
            <div className="bg-red-900/30 text-red-400 p-2.5 rounded text-xs font-medium">
              <span className="block font-bold mb-0.5">⚠️ HoneyPot Riski</span>
              Bu coinde işlem yapamama veya çıkamama riski yüksek
            </div>
          )}
          
          {riskType === 'concentration' && (
            <div className="bg-yellow-900/30 text-yellow-400 p-2.5 rounded text-xs font-medium">
              <span className="block font-bold mb-0.5">🔍 Yüksek Konsantrasyon</span>
              Top 10 holder tüm tokenların {formatNumber(coin.top10HolderPercentage || 0, 2)}%'sine sahip
            </div>
          )}
          
          {riskType === 'suspicious' && (
            <div className="bg-red-900/30 text-red-400 p-2.5 rounded text-xs">
              <span className="block font-bold mb-1">❗ Şüpheli Aktiviteler</span>
              <ul className="list-disc list-inside">
                {coin.suspiciousActivities?.map((activity: string, idx: number) => (
                  <li key={idx} className="mb-1">{activity}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#1a1a1a] p-2.5 rounded">
            <div className="text-xs text-gray-400 mb-1">Market Değeri</div>
            <div className="font-medium">${formatNumber(coin.marketCap || 0)}</div>
          </div>
          
          <div className="bg-[#1a1a1a] p-2.5 rounded">
            <div className="text-xs text-gray-400 mb-1">Hacim (24s)</div>
            <div className="font-medium">${formatNumber(coin.volume24h || 0)}</div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">Güvenlik Riskleri</h1>
        
        {/* Honeypot Riskli Coinler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">HoneyPot Riskli Coinler</h2>
          
          {honeypotRisks.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda bu kriterlere uyan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {honeypotRisks.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileRiskCard(coin, 'honeypot', null)}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div className="text-right">Fiyat</div>
                  <div className="text-right">24sa Değişim</div>
                  <div className="text-right">Market Değeri</div>
                  <div className="text-right">Hacim (24sa)</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {honeypotRisks.map((coin) => (
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
                      
                      <div className={`text-right ${(coin.percentagePriceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatNumber(coin.percentagePriceChange24h || 0, 2)}%
                      </div>
                      
                      <div className="text-right">
                        ${formatNumber(coin.marketCap || 0)}
                      </div>
                      
                      <div className="text-right">
                        ${formatNumber(coin.volume24h || 0)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Yüksek Konsantrasyon Riskli Coinler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Yüksek Konsantrasyon (&gt;80% Top 10 Holder)</h2>
          
          {concentrationRisks.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda bu kriterlere uyan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {concentrationRisks.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileRiskCard(coin, 'concentration', null)}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div className="text-right">Top 10 Holder</div>
                  <div className="text-right">Top 20 Holder</div>
                  <div className="text-right">Market Değeri</div>
                  <div className="text-right">Fiyat</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {concentrationRisks.map((coin) => (
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
                      
                      <div className="text-right text-red-400">
                        {formatNumber(coin.top10HolderPercentage || 0, 2)}%
                      </div>
                      
                      <div className="text-right">
                        {formatNumber(coin.top20HolderPercentage || 0, 2)}%
                      </div>
                      
                      <div className="text-right">
                        ${formatNumber(coin.marketCap || 0)}
                      </div>
                      
                      <div className="text-right">
                        ${formatPrice(coin.coinPrice)}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Şüpheli Aktiviteler */}
        <div className="mb-4 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4">Şüpheli Aktiviteler</h2>
          
          {suspiciousActivities.length === 0 ? (
            <div className="bg-[#111] p-3 sm:p-4 rounded-lg shadow-lg">
              Şu anda şüpheli aktiviteleri olan coin bulunmuyor.
            </div>
          ) : (
            <>
              {/* Mobil Görünüm */}
              <div className="sm:hidden">
                {suspiciousActivities.map((coin) => (
                  <Link key={coin.coin} href={`/coins/${encodeURIComponent(coin.coin)}`}>
                    {renderMobileRiskCard(coin, 'suspicious', coin.suspiciousActivities)}
                  </Link>
                ))}
              </div>
              
              {/* Masaüstü Görünüm */}
              <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
                <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
                  <div>Coin</div>
                  <div>Şüpheli Aktiviteler</div>
                  <div className="text-right">Market Değeri</div>
                </div>
                
                <div className="divide-y divide-gray-700">
                  {suspiciousActivities.map((coin) => (
                    <Link 
                      key={coin.coin} 
                      href={`/coins/${encodeURIComponent(coin.coin)}`}
                      className="grid grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-[#222] block text-sm md:text-base"
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
                      
                      <div>
                        <ul className="list-disc list-inside text-xs sm:text-sm">
                          {coin.suspiciousActivities?.map((activity, index) => (
                            <li key={index} className="text-red-400">{activity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="text-right">
                        ${formatNumber(coin.marketCap || 0)}
                      </div>
                    </Link>
                  ))}
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
    console.error('Güvenlik riskleri sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Güvenlik riskleri yüklenemedi" 
        message="Veriler getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 