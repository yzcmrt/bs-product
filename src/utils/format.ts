export function formatNumber(num: number | string | undefined, decimals: number = 2): string {
  if (num === undefined || num === null) return '0';
  
  // String ise number'a çevir
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '0';
  
  // Çok küçük sayılar için bilimsel gösterim
  if (Math.abs(value) > 0 && Math.abs(value) < 0.000001) {
    return value.toExponential(decimals);
  }
  
  // 1M'den büyükse
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(decimals) + 'M';
  }
  
  // 1K'dan büyükse
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(decimals) + 'K';
  }
  
  // Sıfırdan farklı ama çok küçük sayılar için daha fazla ondalık basamak göster
  if (Math.abs(value) > 0 && Math.abs(value) < 0.01) {
    return value.toFixed(6);
  }
  
  return value.toFixed(decimals);
}

export function formatPrice(num: number | string | undefined, decimals: number = 6): string {
  if (num === undefined || num === null) return '$0';
  
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '$0';
  
  // Çok küçük sayılar için bilimsel gösterim
  if (value > 0 && value < 0.000001) {
    return value.toExponential(decimals);
  }
  
  // Sıfırdan farklı ama çok küçük sayılar için daha fazla ondalık basamak göster
  if (value > 0 && value < 0.01) {
    return value.toFixed(8);
  }
  
  return value.toFixed(decimals);
} 