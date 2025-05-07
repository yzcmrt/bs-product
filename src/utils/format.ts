export function formatNumber(num: number | string | undefined, decimals: number = 2): string {
  if (num === undefined || num === null) return '0';
  
  // String ise number'a çevir
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '0';
  
  // Çok küçük sayılar için bilimsel gösterim
  if (Math.abs(value) > 0 && Math.abs(value) < 0.000001) {
    return value.toExponential(1);
  }
  
  // 1M'den büyükse
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(1) + 'M';
  }
  
  // 1K'dan büyükse
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(1) + 'K';
  }
  
  // Sıfırdan farklı ama çok küçük sayılar için daha net göster (mobil için)
  if (Math.abs(value) > 0 && Math.abs(value) < 0.01) {
    // Mobil için çok uzun sayıları kısalt
    const valueStr = value.toFixed(4);
    if (valueStr === '0.0000') {
      return '<0.0001';
    }
    return valueStr;
  }
  
  return value.toFixed(decimals);
}

export function formatPrice(num: number | string | undefined, decimals: number = 6): string {
  if (num === undefined || num === null) return '0';
  
  const value = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(value)) return '0';
  
  // Çok küçük sayılar için bilimsel gösterim yerine kısaltılmış gösterim kullan
  if (value > 0 && value < 0.000001) {
    return '<0.0001';
  }
  
  // 1M'den büyükse
  if (Math.abs(value) >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  }
  
  // 1K'dan büyükse
  if (Math.abs(value) >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K';
  }
  
  // Sıfırdan farklı ama çok küçük sayılar için daha az ondalık basamakla göster
  if (value > 0 && value < 0.01) {
    const valueStr = value.toFixed(4);
    if (valueStr === '0.0000') {
      return '<0.0001';
    }
    return valueStr;
  }
  
  // Normal aralıktaki sayılar için 2 ondalık basamak yeterli
  if (value >= 0.01 && value < 1000) {
    return value.toFixed(2);
  }
  
  return value.toFixed(2); // Her durumda en fazla 2 ondalık basamak göster
} 