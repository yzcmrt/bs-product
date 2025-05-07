import { getTopTradeCount } from '@/utils/api';
import { formatNumber } from '@/utils/format';
import Link from 'next/link';
import ApiErrorDisplay from '@/components/ApiErrorDisplay';

export const dynamic = 'force-dynamic'; // Her seferinde güncel verileri getir

export default async function TopTradesPage() {
  try {
    const topTrades = await getTopTradeCount();

    if (!topTrades || topTrades.length === 0) {
      return (
        <ApiErrorDisplay 
          title="Veri bulunamadı" 
          message="En çok işlem gören coinler verisi bulunamadı. Lütfen daha sonra tekrar deneyin."
          backLink="/"
          backText="Ana Sayfaya Dön"
        />
      );
    }

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
              <Link 
                key={trade._id} 
                href={`/coins/${encodeURIComponent(trade._id)}`}
                className="grid grid-cols-4 gap-4 p-4 hover:bg-[#222] block"
              >
                <div className="truncate">
                  {trade._id.split('::').pop() || trade._id}
                </div>
                <div className="text-right">
                  {formatNumber(trade.tradeCount)}
                </div>
                <div className="text-right">
                  {formatNumber(trade.volume)}
                </div>
                <div className="text-right">
                  ${formatNumber(trade.volumeUsd)}
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
    console.error('En çok işlem gören coinler sayfası yüklenirken hata:', error);
    return (
      <ApiErrorDisplay 
        title="İşlem verileri yüklenemedi" 
        message="Veriler getirilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin."
        backLink="/"
        backText="Ana Sayfaya Dön"
      />
    );
  }
} 