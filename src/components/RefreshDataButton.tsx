'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RefreshDataButtonProps {
  interval?: number; // Otomatik yenileme aralığı (ms cinsinden)
  className?: string; // İlave stil sınıfları
}

export default function RefreshDataButton({ 
  interval = 30000, // Varsayılan olarak 30 saniye
  className = ''
}: RefreshDataButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interval / 1000);

  const refreshData = () => {
    setLoading(true);
    
    // Next.js router.refresh ile sayfayı taze verilerle yenileriz
    router.refresh();
    
    // Yenileme durumunu sıfırla
    setTimeout(() => {
      setLoading(false);
      setLastUpdated(new Date());
      setTimeLeft(interval / 1000);
    }, 1000); // Kullanıcı deneyimi için kısa bir gecikme
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    if (isAutoRefresh) {
      // Otomatik yenileme başlat
      timer = setInterval(refreshData, interval);
      
      // Geri sayım için zamanlayıcı
      countdownTimer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) return interval / 1000;
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      // Temizlik fonksiyonu
      if (timer) clearInterval(timer);
      if (countdownTimer) clearInterval(countdownTimer);
    };
  }, [isAutoRefresh, interval]);

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center">
          <label htmlFor="auto-refresh" className="text-xs text-gray-400 mr-2 cursor-pointer">
            Otomatik Yenileme
          </label>
          <div className="relative inline-block w-10 align-middle select-none">
            <input
              type="checkbox"
              id="auto-refresh"
              checked={isAutoRefresh}
              onChange={() => setIsAutoRefresh(!isAutoRefresh)}
              className="sr-only peer"
            />
            <div className="w-10 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </div>
        
        <button
          onClick={refreshData}
          disabled={loading}
          className={`flex items-center justify-center text-xs text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors px-3 py-1 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
          )}
          <span className="ml-1">Yenile</span>
        </button>
      </div>
      
      <div className="text-xs text-gray-500">
        {isAutoRefresh ? (
          <span>{timeLeft} saniye sonra otomatik yenilenecek</span>
        ) : (
          <span>Son güncelleme: {lastUpdated.toLocaleString('tr-TR')}</span>
        )}
      </div>
    </div>
  );
} 