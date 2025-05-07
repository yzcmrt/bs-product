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
      <div className="w-full mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">En İyi Holder Kalitesi</h1>
        
        {/* Masaüstü Tablosu */}
        <div className="hidden sm:block bg-[#111] rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 font-semibold border-b border-gray-700 text-sm md:text-base">
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
                className="grid grid-cols-5 gap-2 sm:gap-4 p-3 sm:p-4 hover:bg-[#222] block text-sm md:text-base"
              >
                <div className="truncate">
                  {holder.coin.split('::').pop() || holder.coin}
                </div>
                <div className="text-right text-purple-400 font-medium">
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
        
        {/* Mobil Kartları */}
        <div className="sm:hidden space-y-3">
          {topHolders.map((holder) => (
            <Link 
              key={holder._id} 
              href={`/coins/${encodeURIComponent(holder.coin)}`}
              className="block"
            >
              <div className="bg-[#111] rounded-lg p-3 shadow-lg">
                <div className="mb-3">
                  <div className="font-bold mb-1 flex justify-between items-center">
                    <div>{holder.coin.split('::').pop() || holder.coin}</div>
                    <div className="text-purple-400">
                      {formatNumber(holder.holderQualityScore, 2)} puan
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#1a1a1a] p-2.5 rounded">
                    <div className="text-xs text-gray-400 mb-1">NFT Sahipleri</div>
                    <div className="font-medium">
                      {holder.holdersWithProminentNft}
                    </div>
                  </div>
                  
                  <div className="bg-[#1a1a1a] p-2.5 rounded">
                    <div className="text-xs text-gray-400 mb-1">SuiNS Sahipleri</div>
                    <div className="font-medium">
                      {holder.holdersWithSuiNs}
                    </div>
                  </div>
                  
                  <div className="bg-[#1a1a1a] p-2.5 rounded col-span-2">
                    <div className="text-xs text-gray-400 mb-1">Ortalama Holder Yaşı</div>
                    <div className="font-medium">
                      {formatNumber(holder.averageAgeOfHolders, 1)} gün
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="text-right text-xs text-gray-500 mt-3 sm:mt-4">
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