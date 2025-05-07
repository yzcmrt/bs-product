/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

const API_BASE = 'https://api-ex.insidex.trade';
const API_KEY = 'insidex_api.lESeS4SIA4WcCR0WPgGTL3Ks';

// API tiplerimizi daha tutarlı şekilde tanımlayalım
export interface TopTradeCount {
  _id: string;
  tradeCount: number;
  volume: number;
  volumeUsd: number;
}

export interface HolderQualityScore {
  coin: string;
  holdersWithProminentNft: number;
  holdersWithSuiNs: number;
  averageAgeOfHolders: number;
  holderQualityScore: number;
}

export interface TopHolderQualityScore extends HolderQualityScore {
  _id: string;
}

// Interface tanımlamaları tutarlı hale getirildi
export interface TrendingCoin {
  coin: string;
  coinMetadata: {
    name: string;
    symbol: string;
    decimals: number;
  };
  coinPrice: number;
  marketCap: number;
  totalLiquidityUsd: number;
  volume24h: number;
  percentagePriceChange24h: number;
  holderQualityScore?: number;
  holderCount?: number;
  // API'den gelebilecek diğer alanlar
  top10HolderPercentage?: number;
  top20HolderPercentage?: number;
  isMintable?: boolean;
  tokensBurned?: number;
  tokensBurnedPercentage?: number;
  lpBurnt?: boolean;
  coinSupply?: number;
  tokensInLiquidity?: number;
  percentageTokenSupplyInLiquidity?: number;
  isCoinHoneyPot?: boolean;
  suspiciousActivities?: string[];
  coinDev?: string;
  coinDevHoldings?: number;
  coinDevHoldingsPercentage?: number;
  priceChange5m?: number;
  priceChange1h?: number;
  priceChange6h?: number;
  buyVolume5m?: number;
  buyVolume1h?: number;
  buyVolume6h?: number;
  sellVolume5m?: number;
  sellVolume1h?: number;
  sellVolume6h?: number;
  volume5m?: number;
  volume1h?: number;
  volume6h?: number;
}

export interface LiquidPool {
  pool: string;
  coinA: string;
  coinB: string;
  platform: string;
  swapCount: number;
  liqA: number;
  liqB: number;
  price: number;
  liqUsd: number;
}

export interface Coin {
  coin: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  totalLiquidity: number;
  holderCount: number;
  isTrending: boolean;
  isActive: boolean;
  isTraded?: boolean;
  tradeCount?: number;
  volume?: number;
  volumeUsd?: number;
  verified?: boolean;
  lastUpdated?: Date;
}

export interface CoinDetail {
  coin: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  totalLiquidity: number;
  top10HolderPercentage: number;
  top20HolderPercentage: number;
  isMintable: boolean;
  tokensBurned: number;
  tokensBurnedPercentage: number;
  lpBurnt: boolean;
  coinSupply: number;
  tokensInLiquidity: number;
  percentageTokenSupplyInLiquidity: number;
  isCoinHoneyPot: boolean;
  suspiciousActivities: string[];
  coinDev: string;
  coinDevHoldings: number;
  coinDevHoldingsPercentage: number;
  priceChange5m: number;
  priceChange1h: number;
  priceChange6h: number;
  buyVolume5m: number;
  buyVolume1h: number;
  buyVolume6h: number;
  sellVolume5m: number;
  sellVolume1h: number;
  sellVolume6h: number;
  volume5m: number;
  volume1h: number;
  volume6h: number;
  hasPartialData?: boolean;
  lastUpdated?: Date;
}

export interface SearchCoinResult {
  symbol: string;
  name: string;
  coinType: string;
  mc: number;
  decimals: number;
  verified: boolean;
}

// Gelişmiş hata yönetimi için genel bir fetchApi fonksiyonu
export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'x-api-key': API_KEY,
        ...options?.headers
      },
      ...options,
      // Önbelleği devre dışı bırak - her zaman taze veriler al
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error(`API Hatası: ${response.status} - ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API Bağlantı Hatası:', error);
    return null;
  }
}

// Top trade count verilerini getiren fonksiyon
export async function getTopTradeCount(): Promise<TopTradeCount[]> {
  try {
    const response = await fetchFromApi<TopTradeCount[]>('/coins/top-trade-count');
    return response || [];
  } catch (error) {
    console.error('Trade count verisi alınırken hata:', error);
    return [];
  }
}

// Top holder quality score listesini getiren fonksiyon
export async function getTopHolderQualityScore(): Promise<TopHolderQualityScore[]> {
  try {
    const response = await fetchFromApi<TopHolderQualityScore[]>('/coins/top-holder-quality-score');
    return response || [];
  } catch (error) {
    console.error('Holder quality scores alınırken hata:', error);
    return [];
  }
}

// Belirli bir coin için holder quality score getiren fonksiyon
export async function getHolderQualityScore(coinAddress: string): Promise<HolderQualityScore | null> {
  try {
    const response = await fetchFromApi<HolderQualityScore>(`/coins/${coinAddress}/holder-quality-score`);
    return response;
  } catch (error) {
    console.error('Holder quality score alınırken hata:', error);
    return null;
  }
}

// Coin detaylarını getiren fonksiyon - doğru endpoint kullanımı ve gelişmiş hata yönetimi
export async function getCoinDetails(coinId: string): Promise<CoinDetail | null> {
  try {
    // Doğrudan coin detayları için direkt bir endpoint varsa onu kullan
    // Eğer bu endpoint çalışmazsa, alternatif olarak trending içinden ara
    const allCoins = await fetchFromApi<TrendingCoin[]>('/coins/trending');
    if (!allCoins || allCoins.length === 0) return null;
    
    let coinData = allCoins.find(c => c.coin === coinId);
    
    // Eğer trending coinlerde bulunamazsa, arama API'si ile dene
    if (!coinData) {
      const searchResults = await searchCoin(coinId);
      if (!searchResults || searchResults.length === 0) {
        // Eğer arama sonuçları da boşsa null döndür
        return null;
      }
      
      // Arama sonuçlarından bulunan ilk coin için trending listesine tekrar bak
      const matchedCoin = allCoins.find(c => c.coin === searchResults[0].coinType);
      if (!matchedCoin) {
        // En azından temel bilgileri olan kısmi bir detay döndür
        return {
          coin: searchResults[0].coinType,
          name: searchResults[0].name,
          symbol: searchResults[0].symbol,
          price: 0,
          priceChange24h: 0,
          marketCap: searchResults[0].mc || 0,
          volume24h: 0,
          totalLiquidity: 0,
          top10HolderPercentage: 0,
          top20HolderPercentage: 0,
          isMintable: false,
          tokensBurned: 0,
          tokensBurnedPercentage: 0,
          lpBurnt: false,
          coinSupply: 0,
          tokensInLiquidity: 0,
          percentageTokenSupplyInLiquidity: 0,
          isCoinHoneyPot: false,
          suspiciousActivities: [],
          coinDev: '',
          coinDevHoldings: 0,
          coinDevHoldingsPercentage: 0,
          priceChange5m: 0,
          priceChange1h: 0,
          priceChange6h: 0,
          buyVolume5m: 0,
          buyVolume1h: 0,
          buyVolume6h: 0,
          sellVolume5m: 0,
          sellVolume1h: 0,
          sellVolume6h: 0,
          volume5m: 0,
          volume1h: 0,
          volume6h: 0,
          hasPartialData: true,
          lastUpdated: new Date()
        };
      }
      // Burada bulunan coini kullan
      coinData = matchedCoin;
    }
    
    // API'den gelen verilerle detay nesnesini oluştur
    const detail: CoinDetail = {
      coin: coinData.coin,
      name: coinData.coinMetadata?.name || '',
      symbol: coinData.coinMetadata?.symbol || '',
      price: typeof coinData.coinPrice === 'string' ? parseFloat(coinData.coinPrice) : (coinData.coinPrice || 0),
      priceChange24h: typeof coinData.percentagePriceChange24h === 'string' ? parseFloat(coinData.percentagePriceChange24h) : (coinData.percentagePriceChange24h || 0),
      marketCap: typeof coinData.marketCap === 'string' ? parseFloat(coinData.marketCap) : (coinData.marketCap || 0),
      volume24h: typeof coinData.volume24h === 'string' ? parseFloat(coinData.volume24h) : (coinData.volume24h || 0),
      totalLiquidity: typeof coinData.totalLiquidityUsd === 'string' ? parseFloat(coinData.totalLiquidityUsd) : (coinData.totalLiquidityUsd || 0),
      top10HolderPercentage: typeof coinData.top10HolderPercentage === 'string' ? parseFloat(coinData.top10HolderPercentage) : (coinData.top10HolderPercentage || 0),
      top20HolderPercentage: typeof coinData.top20HolderPercentage === 'string' ? parseFloat(coinData.top20HolderPercentage) : (coinData.top20HolderPercentage || 0),
      isMintable: typeof coinData.isMintable === 'string' ? coinData.isMintable === 'true' : !!coinData.isMintable,
      tokensBurned: typeof coinData.tokensBurned === 'string' ? parseFloat(coinData.tokensBurned) : (coinData.tokensBurned || 0),
      tokensBurnedPercentage: typeof coinData.tokensBurnedPercentage === 'string' ? parseFloat(coinData.tokensBurnedPercentage) : (coinData.tokensBurnedPercentage || 0),
      lpBurnt: typeof coinData.lpBurnt === 'string' ? coinData.lpBurnt === 'true' : !!coinData.lpBurnt,
      coinSupply: typeof coinData.coinSupply === 'string' ? parseFloat(coinData.coinSupply) : (coinData.coinSupply || 0),
      tokensInLiquidity: typeof coinData.tokensInLiquidity === 'string' ? parseFloat(coinData.tokensInLiquidity) : (coinData.tokensInLiquidity || 0),
      percentageTokenSupplyInLiquidity: typeof coinData.percentageTokenSupplyInLiquidity === 'string' ? parseFloat(coinData.percentageTokenSupplyInLiquidity) : (coinData.percentageTokenSupplyInLiquidity || 0),
      isCoinHoneyPot: typeof coinData.isCoinHoneyPot === 'string' ? coinData.isCoinHoneyPot === 'true' : !!coinData.isCoinHoneyPot,
      suspiciousActivities: coinData.suspiciousActivities || [],
      coinDev: coinData.coinDev || '',
      coinDevHoldings: typeof coinData.coinDevHoldings === 'string' ? parseFloat(coinData.coinDevHoldings) : (coinData.coinDevHoldings || 0),
      coinDevHoldingsPercentage: typeof coinData.coinDevHoldingsPercentage === 'string' ? parseFloat(coinData.coinDevHoldingsPercentage) : (coinData.coinDevHoldingsPercentage || 0),
      priceChange5m: typeof coinData.priceChange5m === 'string' ? parseFloat(coinData.priceChange5m) : (coinData.priceChange5m || 0),
      priceChange1h: typeof coinData.priceChange1h === 'string' ? parseFloat(coinData.priceChange1h) : (coinData.priceChange1h || 0),
      priceChange6h: typeof coinData.priceChange6h === 'string' ? parseFloat(coinData.priceChange6h) : (coinData.priceChange6h || 0),
      buyVolume5m: typeof coinData.buyVolume5m === 'string' ? parseFloat(coinData.buyVolume5m) : (coinData.buyVolume5m || 0),
      buyVolume1h: typeof coinData.buyVolume1h === 'string' ? parseFloat(coinData.buyVolume1h) : (coinData.buyVolume1h || 0),
      buyVolume6h: typeof coinData.buyVolume6h === 'string' ? parseFloat(coinData.buyVolume6h) : (coinData.buyVolume6h || 0),
      sellVolume5m: typeof coinData.sellVolume5m === 'string' ? parseFloat(coinData.sellVolume5m) : (coinData.sellVolume5m || 0),
      sellVolume1h: typeof coinData.sellVolume1h === 'string' ? parseFloat(coinData.sellVolume1h) : (coinData.sellVolume1h || 0),
      sellVolume6h: typeof coinData.sellVolume6h === 'string' ? parseFloat(coinData.sellVolume6h) : (coinData.sellVolume6h || 0),
      volume5m: typeof coinData.volume5m === 'string' ? parseFloat(coinData.volume5m) : (coinData.volume5m || 0),
      volume1h: typeof coinData.volume1h === 'string' ? parseFloat(coinData.volume1h) : (coinData.volume1h || 0),
      volume6h: typeof coinData.volume6h === 'string' ? parseFloat(coinData.volume6h) : (coinData.volume6h || 0),
      hasPartialData: !coinData.top10HolderPercentage || !coinData.top20HolderPercentage,
      lastUpdated: new Date()
    };
    
    return detail;
  } catch (error) {
    console.error('Coin detayları alınırken hata:', error);
    return null;
  }
}

// Trending coins listesini getiren fonksiyon - daha iyi veri dönüşümü
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const response = await fetchFromApi<any[]>('/coins/trending');
    if (!response || !Array.isArray(response)) return [];
    
    // Tüm verilerin doğru formatta olmasını sağla
    return response.map(coin => normalizeTrendingCoin(coin));
  } catch (error) {
    console.error('Trending coinler alınırken hata:', error);
    return [];
  }
}

// Aktif olan tüm coinleri getiren yeni fonksiyon
export async function getActiveCoins(): Promise<Coin[]> {
  try {
    // Aktif coinleri almak için birden fazla kaynak kullan
    const [trendingCoins, tradedCoins] = await Promise.all([
      fetchFromApi<any[]>('/coins/trending'),
      fetchFromApi<any[]>('/coins/top-trade-count')
    ]);
    
    const allActiveCoins = new Map<string, Coin>();
    
    // Trending coinleri ekle
    if (trendingCoins && Array.isArray(trendingCoins)) {
      trendingCoins.forEach((coin: any) => {
        if (coin.coin) {
          allActiveCoins.set(coin.coin, {
            coin: coin.coin,
            name: coin.coinMetadata?.name || '',
            symbol: coin.coinMetadata?.symbol || '',
            price: parseFloat(String(coin.coinPrice || 0)),
            priceChange24h: parseFloat(String(coin.percentagePriceChange24h || 0)),
            marketCap: parseFloat(String(coin.marketCap || 0)),
            volume24h: parseFloat(String(coin.volume24h || 0)),
            totalLiquidity: parseFloat(String(coin.totalLiquidityUsd || 0)),
            holderCount: parseInt(String(coin.holderCount || 0)),
            isTrending: true,
            isActive: true,
            lastUpdated: new Date()
          });
        }
      });
    }
    
    // Trading yapılan coinleri ekle
    if (tradedCoins && Array.isArray(tradedCoins)) {
      tradedCoins.forEach((coin: any) => {
        if (coin._id) {
          // Eğer coin zaten listede varsa, sadece tradeCount ve volume bilgilerini güncelle
          if (allActiveCoins.has(coin._id)) {
            const existingCoin = allActiveCoins.get(coin._id)!;
            allActiveCoins.set(coin._id, {
              ...existingCoin,
              tradeCount: coin.tradeCount,
              volume: coin.volume,
              volumeUsd: coin.volumeUsd,
              isTraded: true,
              lastUpdated: new Date()
            });
          } else {
            // Eğer coin listede yoksa, yeni bir coin olarak ekle
            allActiveCoins.set(coin._id, {
              coin: coin._id,
              name: '', // Bu veriler coin detail bilgisiyle sonradan doldurulabilir
              symbol: '',
              price: 0,
              priceChange24h: 0,
              marketCap: 0,
              volume24h: coin.volumeUsd || 0,
              totalLiquidity: 0,
              holderCount: 0,
              tradeCount: coin.tradeCount,
              volume: coin.volume,
              volumeUsd: coin.volumeUsd,
              isTrending: false,
              isTraded: true,
              isActive: true,
              lastUpdated: new Date()
            });
          }
        }
      });
    }

    // Eksik bilgileri olan coinleri tamamla
    const coinsNeedingDetails = Array.from(allActiveCoins.values())
      .filter(coin => !coin.name || !coin.symbol);
    
    if (coinsNeedingDetails.length > 0) {
      await enrichCoinsWithSearch(allActiveCoins, coinsNeedingDetails);
    }
    
    return Array.from(allActiveCoins.values());
  } catch (error) {
    console.error('Aktif coinler alınırken hata:', error);
    return [];
  }
}

// En likit havuzları getiren fonksiyon
export async function getMostLiquidPools(limit: number = 10, platforms: string[] = ['cetus', 'turbos']): Promise<LiquidPool[]> {
  try {
    const platformsParam = platforms.join(',');
    const response = await fetchFromApi<LiquidPool[]>(`/pools/top-liquidity?limit=${limit}&platforms=${platformsParam}`);
    return response || [];
  } catch (error) {
    console.error('En likit havuzlar alınırken hata:', error);
    return [];
  }
}

// Coin arama fonksiyonu - export edildi ve erişilebilir hale getirildi
export async function searchCoin(query: string): Promise<SearchCoinResult[]> {
  try {
    const response = await fetchFromApi<SearchCoinResult[]>(`/search/coin/${query}`);
    return response || [];
  } catch (error) {
    console.error('Coin arama sırasında hata:', error);
    return [];
  }
}

// getAllCoins fonksiyonu - search ve trending verilerini birleştirir
export async function getAllCoins(): Promise<Coin[]> {
  try {
    // Aktif coinleri kullan
    const activeCoins = await getActiveCoins();
    
    // Popüler SUI token'larını ara ve ekle
    const searchQueries = ['sui', 'move', 'apt', 'bull', 'bear', 'nft', 'dao'];
    const searchResults = await Promise.all(
      searchQueries.map(query => searchCoin(query))
    );
    
    // Map üzerinde coin bilgilerini tut
    const allCoins = new Map<string, Coin>();
    
    // Aktif coinleri ekle
    activeCoins.forEach(coin => {
      allCoins.set(coin.coin, coin);
    });

    // Arama sonuçlarını ekle
    searchResults.flat().forEach((result) => {
      if (!allCoins.has(result.coinType)) {
        allCoins.set(result.coinType, {
          coin: result.coinType,
          name: result.name,
          symbol: result.symbol,
          price: 0,
          priceChange24h: 0,
          marketCap: result.mc,
          volume24h: 0,
          totalLiquidity: 0,
          holderCount: 0,
          verified: result.verified,
          isTrending: false,
          isActive: false,
          lastUpdated: new Date()
        });
      }
    });

    return Array.from(allCoins.values());
  } catch (error) {
    console.error('Tüm coinler alınırken hata:', error);
    return [];
  }
}

// YARDIMCI FONKSİYONLAR

// TrendingCoin normalleştirme - tutarlı veri tipi dönüşümü için
function normalizeTrendingCoin(coin: any): TrendingCoin {
  return {
    coin: coin.coin || '',
    coinMetadata: {
      name: coin.coinMetadata?.name || '',
      symbol: coin.coinMetadata?.symbol || '',
      decimals: typeof coin.coinMetadata?.decimals === 'string' 
        ? parseInt(coin.coinMetadata.decimals, 10) 
        : (coin.coinMetadata?.decimals || 18)
    },
    coinPrice: typeof coin.coinPrice === 'string' 
      ? parseFloat(coin.coinPrice) 
      : (coin.coinPrice || 0),
    marketCap: typeof coin.marketCap === 'string' 
      ? parseFloat(coin.marketCap) 
      : (coin.marketCap || 0),
    totalLiquidityUsd: typeof coin.totalLiquidityUsd === 'string' 
      ? parseFloat(coin.totalLiquidityUsd) 
      : (coin.totalLiquidityUsd || 0),
    volume24h: typeof coin.volume24h === 'string' 
      ? parseFloat(coin.volume24h) 
      : (coin.volume24h || 0),
    percentagePriceChange24h: typeof coin.percentagePriceChange24h === 'string' 
      ? parseFloat(coin.percentagePriceChange24h) 
      : (coin.percentagePriceChange24h || 0),
    holderQualityScore: coin.holderQualityScore !== undefined 
      ? (typeof coin.holderQualityScore === 'string' 
        ? parseFloat(coin.holderQualityScore) 
        : coin.holderQualityScore) 
      : undefined
  };
}

// Coin bilgilerini zenginleştir - eksik bilgileri arama API'sinden tamamla
async function enrichCoinsWithSearch(coinsMap: Map<string, Coin>, coinsToEnrich: Coin[]): Promise<void> {
  if (coinsToEnrich.length === 0) return;

  // Her bir coin için arama yap
  for (const coin of coinsToEnrich) {
    try {
      const searchResults = await searchCoin(coin.coin);
      
      if (searchResults && searchResults.length > 0) {
        const result = searchResults[0];
        
        if (coinsMap.has(coin.coin)) {
          const existingCoin = coinsMap.get(coin.coin)!;
          coinsMap.set(coin.coin, {
            ...existingCoin,
            name: result.name || existingCoin.name,
            symbol: result.symbol || existingCoin.symbol,
            verified: result.verified,
            lastUpdated: new Date()
          });
        }
      }
    } catch (error) {
      console.error(`${coin.coin} için arama yaparken hata:`, error);
    }
  }
}

