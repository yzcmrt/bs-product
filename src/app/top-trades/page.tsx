import { getTopTradeCount } from '@/utils/api';
import { formatNumber } from '@/utils/format';

export default async function TopTradesPage() {
  const topTrades = await getTopTradeCount();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">En Çok İşlem Gören Coinler</h1>
      
      <div className="bg-[#111] rounded-lg overflow-hidden">
        <div className="grid grid-cols-4 gap-4 p-4 font-semibold border-b border-gray-700">
          <div>Coin</div>
          <div className="text-right">İşlem Sayısı</div>
          <div className="text-right">Hacim</div>
          <div className="text-right">Hacim (USD)</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {topTrades.map((trade) => (
            <div key={trade._id} className="grid grid-cols-4 gap-4 p-4 hover:bg-[#222]">
              <div className="truncate">{trade._id.split('::').pop()}</div>
              <div className="text-right">{formatNumber(trade.tradeCount)}</div>
              <div className="text-right">{formatNumber(trade.volume)}</div>
              <div className="text-right">${formatNumber(trade.volumeUsd)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 