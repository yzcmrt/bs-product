import { getTopHolderQualityScore } from '@/utils/api';
import { formatNumber } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function HolderQualityPage() {
  try {
    const topHolders = await getTopHolderQualityScore();

    if (!topHolders || topHolders.length === 0) {
      return (
        <ApiErrorDisplay 
          title="Veri bulunamadı" 
          message="Holder kalitesi verisi bulunamadı. Lütfen daha sonra tekrar deneyin."
          backLink="/"
          backText="Ana Sayfaya Dön"
        />
      );
    }

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
              <Link 
                key={holder._id} 
                href={`/coins/${encodeURIComponent(holder.coin)}`}
                className="grid grid-cols-5 gap-4 p-4 hover:bg-[#222] block"
              >
                <div className="truncate">
                  {holder.coin.split('::').pop() || holder.coin}
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
              </Link>
            ))}
          </div>
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-2">
          Son güncelleme: {new Date().toLocaleString('tr-TR')}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Holder kalitesi sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="Holder kalitesi verileri yüklenemedi" 
        message="Veriler getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 