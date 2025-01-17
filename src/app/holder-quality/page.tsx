import { getTopHolderQualityScore } from '@/utils/api';
import { formatNumber } from '@/utils/format';

export default async function HolderQualityPage() {
  const topHolders = await getTopHolderQualityScore();

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">En İyi Holder Kalitesi</h1>
      
      <div className="bg-[#111] rounded-lg overflow-hidden">
        <div className="grid grid-cols-5 gap-4 p-4 font-semibold border-b border-gray-700">
          <div>Coin</div>
          <div className="text-right">Kalite Skoru</div>
          <div className="text-right">NFT Sahipleri</div>
          <div className="text-right">SuiNS Sahipleri</div>
          <div className="text-right">Ort. Holder Yaşı</div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {topHolders.map((holder) => (
            <div key={holder._id} className="grid grid-cols-5 gap-4 p-4 hover:bg-[#222]">
              <div className="truncate">
                {holder.coin.split('::').pop()}
              </div>
              <div className="text-right">
                {formatNumber(holder.holderQualityScore, 2)}
              </div>
              <div className="text-right">
                {holder.holdersWithProminentNft}
              </div>
              <div className="text-right">
                {holder.holdersWithSuiNs}
              </div>
              <div className="text-right">
                {formatNumber(holder.averageAgeOfHolders, 1)} gün
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 