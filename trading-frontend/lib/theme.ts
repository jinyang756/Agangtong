// @ts-ignore
import { MarketData } from 'trading-simulator';

// 获取实时市场数据
export const getMarketData = (symbol: string, marketType: 'A股' | '港股') => {
  try {
    if (marketType === 'A股') {
      // @ts-ignore
      return MarketData.getAShareData(symbol);
    } else {
      // @ts-ignore
      return MarketData.getHKShareData(symbol);
    }
  } catch (error) {
    console.warn('获取市场数据失败，使用模拟数据:', error);
    // 如果获取失败，返回模拟数据
    return {
      currentPrice: 100 + (Math.random() - 0.5) * 10,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 10,
      open: 100,
      high: 105,
      low: 95,
      volume: Math.random() * 1000000,
      turnover: Math.random() * 10000000
    };
  }
};

// 生成K线数据
export const generateCandlestickData = (basePrice: number, count: number = 50) => {
  return Array.from({ length: count }, (_, i) => {
    const open = basePrice + (Math.random() - 0.5) * 5;
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    const volume = Math.random() * 1000 + 500;
    
    return { open, high, low, close, volume };
  });
};

// 生成订单簿数据
export const generateOrderBookData = (basePrice: number, levels: number = 10) => {
  return {
    bids: Array.from({ length: levels }, (_, i) => [
      basePrice - (i + 1) * 0.05,
      Math.random() * 1000 + 500
    ]),
    asks: Array.from({ length: levels }, (_, i) => [
      basePrice + (i + 1) * 0.05,
      Math.random() * 1000 + 500
    ])
  };
};