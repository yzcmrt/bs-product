const API_BASE = 'https://api-ex.insidex.trade';
const API_KEY = 'insidex_api.lESeS4SIA4WcCR0WPgGTL3Ks';

// API tiplerimizi tanımlayalım
interface TopTradeCount {
  _id: string;
  tradeCount: number;
  volume: number;
  volumeUsd: number;
}

interface HolderQualityScore {
  coin: string;
  holdersWithProminentNft: number;
  holdersWithSuiNs: number;
  averageAgeOfHolders: number;
  holderQualityScore: number;
}

interface TopHolderQualityScore extends HolderQualityScore {
  _id: string;
}

// Interface tanımlamaları
interface TrendingCoin {
  coin: string;
  coinMetadata: {
    name: string;
    symbol: string;
    decimals: string;
  };
  coinPrice: number;
  marketCap: number;
  totalLiquidityUsd: number;
  volume24h: number;
  percentagePriceChange24h: number;
  holderQualityScore?: number;
}

interface LiquidPool {
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

interface Coin {
  coin: string;
  name: string;
  coinMetadata?: {
    name: string;
    symbol: string;
  };
  coinPrice?: number | string;
  symbol?: string;
  percentagePriceChange24h?: number | string;
  marketCap?: number | string;
  volume24h?: number | string;
  totalLiquidityUsd?: number | string;
  holderCount?: number | string;
  price?: number;
  priceChange24h?: number;
  totalLiquidity?: number;
}

interface CoinDetail {
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
}

interface SearchCoinResult {
  symbol: string;
  name: string;
  coinType: string;
  mc: number;
  decimals: number;
  verified: boolean;
}

async function fetchFromApi(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    if (!response.ok) {
      console.error(`API Error: ${response.status} - ${response.statusText}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Top trade count verilerini getiren fonksiyon
export async function getTopTradeCount(): Promise<TopTradeCount[]> {
  try {
    const response = await fetchFromApi('/coins/top-trade-count');
    return response || [];
  } catch (error) {
    console.error('Error fetching top trade count:', error);
    return [];
  }
}

// Top holder quality score listesini getiren fonksiyon
export async function getTopHolderQualityScore(): Promise<TopHolderQualityScore[]> {
  try {
    const response = await fetchFromApi('/coins/top-holder-quality-score');
    return response || [];
  } catch (error) {
    console.error('Error fetching top holder quality scores:', error);
    return [];
  }
}

// Belirli bir coin için holder quality score getiren fonksiyon
export async function getHolderQualityScore(coinAddress: string): Promise<HolderQualityScore | null> {
  try {
    const response = await fetchFromApi(`/coins/${coinAddress}/holder-quality-score`);
    return response;
  } catch (error) {
    console.error('Error fetching holder quality score:', error);
    return null;
  }
}

// Coin detaylarını getiren fonksiyon
export async function getCoinDetails(coinId: string): Promise<CoinDetail | null> {
  try {
    const allCoins = await fetchFromApi('/coins/trending');
    const coinData = allCoins?.find((c: TrendingCoin) => c.coin === coinId);
    
    if (!coinData) return null;
    
    return {
      coin: coinData.coin,
      name: coinData.coinMetadata?.name || coinData.coinMetadata?.symbol,
      symbol: coinData.coinMetadata?.symbol,
      price: parseFloat(coinData.coinPrice || 0),
      priceChange24h: parseFloat(coinData.percentagePriceChange24h || 0),
      marketCap: parseFloat(coinData.marketCap || 0),
      volume24h: parseFloat(coinData.volume24h || 0),
      totalLiquidity: parseFloat(coinData.totalLiquidityUsd || 0),
      top10HolderPercentage: parseFloat(coinData.top10HolderPercentage || 0),
      top20HolderPercentage: parseFloat(coinData.top20HolderPercentage || 0),
      isMintable: coinData.isMintable === 'true',
      tokensBurned: parseFloat(coinData.tokensBurned || 0),
      tokensBurnedPercentage: parseFloat(coinData.tokensBurnedPercentage || 0),
      lpBurnt: coinData.lpBurnt === 'true',
      coinSupply: parseFloat(coinData.coinSupply || 0),
      tokensInLiquidity: parseFloat(coinData.tokensInLiquidity || 0),
      percentageTokenSupplyInLiquidity: parseFloat(coinData.percentageTokenSupplyInLiquidity || 0),
      isCoinHoneyPot: coinData.isCoinHoneyPot === 'true',
      suspiciousActivities: coinData.suspiciousActivities || [],
      coinDev: coinData.coinDev,
      coinDevHoldings: parseFloat(coinData.coinDevHoldings || 0),
      coinDevHoldingsPercentage: parseFloat(coinData.coinDevHoldingsPercentage || 0),
      priceChange5m: parseFloat(coinData.percentagePriceChange5m || 0),
      priceChange1h: parseFloat(coinData.percentagePriceChange1h || 0),
      priceChange6h: parseFloat(coinData.percentagePriceChange6h || 0),
      buyVolume5m: parseFloat(coinData.buyVolume5m || 0),
      buyVolume1h: parseFloat(coinData.buyVolume1h || 0),
      buyVolume6h: parseFloat(coinData.buyVolume6h || 0),
      sellVolume5m: parseFloat(coinData.sellVolume5m || 0),
      sellVolume1h: parseFloat(coinData.sellVolume1h || 0),
      sellVolume6h: parseFloat(coinData.sellVolume6h || 0),
      volume5m: parseFloat(coinData.volume5m || 0),
      volume1h: parseFloat(coinData.volume1h || 0),
      volume6h: parseFloat(coinData.volume6h || 0)
    };
  } catch (error) {
    console.error('Error fetching coin details:', error);
    return null;
  }
}

// Trending coins listesini getiren fonksiyon
export async function getTrendingCoins(): Promise<TrendingCoin[]> {
  try {
    const response = await fetchFromApi('/coins/trending');
    return response?.map((coin: Partial<TrendingCoin>) => ({
      coin: coin.coin ?? '',
      coinMetadata: coin.coinMetadata ? {
        name: coin.coinMetadata.name ?? '',
        symbol: coin.coinMetadata.symbol ?? '',
        decimals: coin.coinMetadata.decimals ?? 18
      } : {
        name: '',
        symbol: '',
        decimals: 18
      },
      coinPrice: parseFloat(String(coin.coinPrice ?? 0)),
      marketCap: parseFloat(String(coin.marketCap ?? 0)),
      totalLiquidityUsd: parseFloat(String(coin.totalLiquidityUsd ?? 0)),
      volume24h: parseFloat(String(coin.volume24h ?? 0)),
      percentagePriceChange24h: parseFloat(String(coin.percentagePriceChange24h ?? 0)),
      holderQualityScore: coin.holderQualityScore ? parseFloat(String(coin.holderQualityScore)) : undefined
    })) || [];
  } catch (error) {
    console.error('Error fetching trending coins:', error);
    return [];
  }
}

// En likit havuzları getiren fonksiyon
export async function getMostLiquidPools(limit: number = 10, platforms: string[] = ['cetus', 'turbos']): Promise<LiquidPool[]> {
  try {
    const platformsParam = platforms.join(',');
    const response = await fetchFromApi(`/pools/top-liquidity?limit=${limit}&platforms=${platformsParam}`);
    return response || [];
  } catch (error) {
    console.error('Error fetching most liquid pools:', error);
    return [];
  }
}

// Coin arama fonksiyonu
async function searchCoin(query: string): Promise<SearchCoinResult[]> {
  try {
    const response = await fetchFromApi(`/search/coin/${query}`);
    return response || [];
  } catch (error) {
    console.error('Error searching coins:', error);
    return [];
  }
}

// getAllCoins fonksiyonunu düzeltelim
export async function getAllCoins(): Promise<Coin[]> {
  try {
    // Önce trending coinleri alalım
    const trendingResponse = await fetchFromApi('/coins/trending') as Partial<Coin>[];
    
    // Popüler SUI token'larını arayalım
    const searchQueries = ['sui', 'move', 'apt', 'bull', 'bear', 'nft', 'dao'];
    const searchResults = await Promise.all(
      searchQueries.map(query => searchCoin(query))
    );
    
    // Tüm sonuçları birleştir ve tekrar edenleri filtrele
    const allCoins = new Map();
    
    // Önce trending coinleri ekle
    if (trendingResponse) {
      trendingResponse.forEach((coin) => {
        if (coin.coin) {
          allCoins.set(coin.coin, {
            coin: coin.coin,
            name: coin.coinMetadata?.name ?? coin.symbol ?? '',
            symbol: coin.coinMetadata?.symbol ?? '',
            price: parseFloat(String(coin.coinPrice ?? 0)),
            priceChange24h: parseFloat(String(coin.percentagePriceChange24h ?? 0)),
            marketCap: parseFloat(String(coin.marketCap ?? 0)),
            volume24h: parseFloat(String(coin.volume24h ?? 0)),
            totalLiquidity: parseFloat(String(coin.totalLiquidityUsd ?? 0)),
            holderCount: parseInt(String(coin.holderCount ?? 0))
          });
        }
      });
    }

    // Sonra arama sonuçlarını ekle
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
          verified: result.verified
        });
      }
    });

    console.log('Total unique coins found:', allCoins.size);
    return Array.from(allCoins.values());
  } catch (error) {
    console.error('Error fetching all coins:', error);
    return [];
  }
}

