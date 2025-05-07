import { getMostLiquidPools } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function PoolsPage() {
  try {
    const pools = await getMostLiquidPools();

    if (!pools || pools.length === 0) {
      return (
        <ApiErrorDisplay 
          title="Veri bulunamadı" 
          message="Likidite havuzları verisi bulunamadı. Lütfen daha sonra tekrar deneyin."
          backLink="/"
          backText="Ana Sayfaya Dön"
        />
      );
    }

    return (
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">En Likit Havuzlar</h1>
        
        {/* Masaüstü Tablosu */}
        <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
            <div>Çift</div>
            <div className="text-right">Platform</div>
            <div className="text-right">İşlem Sayısı</div>
            <div className="text-right">Fiyat</div>
            <div className="text-right">Likidite (USD)</div>
          </div>
          
          <div className="divide-y divide-gray-700">
            {pools.map((pool) => (
              <div key={pool.pool} className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-[#222] text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <div>
                    <div className="font-medium">
                      <Link href={`/coins/${encodeURIComponent(pool.coinA)}`} className="hover:text-blue-400">
                        {pool.coinA.split('::').pop()}
                      </Link>
                      {'/'}
                      <Link href={`/coins/${encodeURIComponent(pool.coinB)}`} className="hover:text-blue-400">
                        {pool.coinB.split('::').pop()}
                      </Link>
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {pool.pool.substring(0, 6)}...{pool.pool.substring(pool.pool.length - 6)}
                    </div>
                  </div>
                </div>
                
                <div className="text-right capitalize">
                  {pool.platform}
                </div>
                
                <div className="text-right">
                  {formatNumber(pool.swapCount)}
                </div>
                
                <div className="text-right">
                  ${formatPrice(pool.price)}
                </div>
                
                <div className="text-right">
                  ${formatNumber(pool.liqUsd)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Mobil Kartları */}
        <div className="sm:hidden space-y-3">
          {pools.map((pool) => (
            <div key={pool.pool} className="bg-[#111] rounded-lg p-3 shadow-lg">
              <div className="mb-3">
                <div className="font-bold mb-0.5">
                  <Link href={`/coins/${encodeURIComponent(pool.coinA)}`} className="hover:text-blue-400">
                    {pool.coinA.split('::').pop()}
                  </Link>
                  <span className="mx-1 text-gray-400">/</span>
                  <Link href={`/coins/${encodeURIComponent(pool.coinB)}`} className="hover:text-blue-400">
                    {pool.coinB.split('::').pop()}
                  </Link>
                </div>
                <div className="text-xs text-gray-400">
                  ID: {pool.pool.substring(0, 6)}...{pool.pool.substring(pool.pool.length - 6)}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#1a1a1a] p-2.5 rounded">
                  <div className="text-xs text-gray-400 mb-1">Platform</div>
                  <div className="font-medium capitalize">{pool.platform}</div>
                </div>
                
                <div className="bg-[#1a1a1a] p-2.5 rounded">
                  <div className="text-xs text-gray-400 mb-1">İşlem Sayısı</div>
                  <div className="font-medium">{formatNumber(pool.swapCount)}</div>
                </div>
                
                <div className="bg-[#1a1a1a] p-2.5 rounded">
                  <div className="text-xs text-gray-400 mb-1">Fiyat</div>
                  <div className="font-medium">${formatPrice(pool.price)}</div>
                </div>
                
                <div className="bg-[#1a1a1a] p-2.5 rounded">
                  <div className="text-xs text-gray-400 mb-1">Likidite</div>
                  <div className="font-medium">${formatNumber(pool.liqUsd)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-3 sm:mt-4">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Likidite havuzları sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Likidite verileri yüklenemedi" 
        message="Likidite havuzları getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 