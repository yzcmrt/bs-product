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
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  totalLiquidity: number;
  holderCount: number;
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
      coinPrice: parseFloat(coin.coinPrice),
      marketCap: parseFloat(coin.marketCap),
      totalLiquidityUsd: parseFloat(coin.totalLiquidityUsd),
      volume24h: parseFloat(coin.volume24h),
      percentagePriceChange24h: parseFloat(coin.percentagePriceChange24h),
      holderQualityScore: coin.holderQualityScore ? parseFloat(coin.holderQualityScore) : undefined
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

// Tüm coinleri getiren fonksiyon
export async function getAllCoins(): Promise<Coin[]> {
  try {
    const response = await fetchFromApi('/coins/trending');
    return response?.map((coin: Partial<Coin>) => ({
      coin: coin.coin,
      name: coin.coinMetadata?.name || coin.symbol,
      symbol: coin.coinMetadata?.symbol,
      price: parseFloat(coin.coinPrice || 0),
      priceChange24h: parseFloat(coin.percentagePriceChange24h || 0),
      marketCap: parseFloat(coin.marketCap || 0),
      volume24h: parseFloat(coin.volume24h || 0),
      totalLiquidity: parseFloat(coin.totalLiquidityUsd || 0),
      holderCount: parseInt(coin.holderCount || 0)
    })) || [];
  } catch (error) {
    console.error('Error fetching all coins:', error);
    return [];
  }
}

