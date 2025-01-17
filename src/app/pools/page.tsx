import { getMostLiquidPools } from '@/utils/api';
import { formatNumber, formatPrice } from '@/utils/format';

export default async function PoolsPage() {
  const pools = await getMostLiquidPools();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">En Likit Havuzlar</h1>
      
      <div className="bg-[#111] rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b border-gray-700">
          <div>Çift</div>
          <div className="text-right">Platform</div>
          <div className="text-right">İşlem Sayısı</div>
          <div className="text-right">Fiyat</div>
          <div className="text-right">Likidite (USD)</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {pools.map((pool) => (
            <div key={pool.pool} className="grid grid-cols-5 gap-4 p-4 hover:bg-[#222]">
              <div className="flex items-center gap-2">
                <div>
                  <div className="font-medium">
                    {pool.coinA.split('::').pop()}/{pool.coinB.split('::').pop()}
                  </div>
                  <div className="text-sm text-gray-400 truncate">
                    {pool.pool.substring(0, 8)}...{pool.pool.substring(pool.pool.length - 8)}
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
    </div>
  );
} 