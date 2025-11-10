// 主题配置和数据生成
import { fetchRealTimeData, fetchMarketList, fetchMultipleStocks } from './realtime-data';

// 蜡烛图数据生成
export const generateCandlestickData = (currentPrice: number) => {
  const data = [];
  let price = currentPrice;
  
  // 生成100个数据点
  for (let i = 99; i >= 0; i--) {
    const open = price;
    const volatility = Math.random() * 2;
    const change = (Math.random() - 0.5) * volatility;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility;
    const low = Math.min(open, close) - Math.random() * volatility;
    
    // 确保最低价不低于0.01
    const finalLow = Math.max(0.01, low);
    
    data.unshift({
      time: new Date(Date.now() - i * 60000).toISOString(), // 每分钟一个数据点
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(finalLow.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 10000) + 1000
    });
    
    price = close;
  }
  
  return data;
};

// 订单簿数据生成
export const generateOrderBookData = (currentPrice: number) => {
  const bids = [];
  const asks = [];
  
  // 生成买单（价格低于当前价）
  for (let i = 1; i <= 10; i++) {
    const price = currentPrice - (i * 0.05);
    const quantity = Math.floor(Math.random() * 1000) + 100;
    
    bids.push({
      price: parseFloat(price.toFixed(2)),
      quantity
    });
  }
  
  // 生成卖单（价格高于当前价）
  for (let i = 1; i <= 10; i++) {
    const price = currentPrice + (i * 0.05);
    const quantity = Math.floor(Math.random() * 1000) + 100;
    
    asks.push({
      price: parseFloat(price.toFixed(2)),
      quantity
    });
  }
  
  return {
    bids: bids.reverse(), // 买单按价格从高到低排序
    asks // 卖单按价格从低到高排序
  };
};

// 获取市场数据（接入实时数据API）
export const getMarketData = async (code: string, market: 'A股' | '港股') => {
  try {
    // 从实时数据API获取数据
    const realTimeData = await fetchRealTimeData(code, market);
    
    return {
      code: realTimeData.code,
      name: realTimeData.name,
      currentPrice: parseFloat(realTimeData.price.toFixed(2)),
      change: parseFloat(realTimeData.change.toFixed(2)),
      changePercent: parseFloat(realTimeData.changePercent.toFixed(2)),
      open: parseFloat(realTimeData.open.toFixed(2)),
      high: parseFloat(realTimeData.high.toFixed(2)),
      low: parseFloat(realTimeData.low.toFixed(2)),
      volume: realTimeData.volume,
      amount: realTimeData.amount,
      market: realTimeData.market,
      time: realTimeData.time,
      pe: parseFloat(realTimeData.pe.toFixed(2)), // 市盈率
      pb: parseFloat(realTimeData.pb.toFixed(2)), // 市净率
      turnover: parseFloat(realTimeData.turnover.toFixed(2)), // 换手率
      amplitude: parseFloat(realTimeData.amplitude.toFixed(2)), // 振幅
      yClose: parseFloat(realTimeData.yClose.toFixed(2)) // 昨日收盘价
    };
  } catch (error) {
    console.error('获取市场数据失败:', error);
    
    // 失败时返回默认数据
    return {
      code,
      name: market === 'A股' ? `A股${code}` : `港股${code}`,
      currentPrice: 100 + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      open: 100,
      high: 105,
      low: 95,
      volume: 1000000,
      amount: 100000000,
      market,
      time: new Date().toISOString(),
      pe: 15 + (Math.random() - 0.5) * 10,
      pb: 2 + (Math.random() - 0.5) * 1,
      turnover: 1 + (Math.random() - 0.5) * 2,
      amplitude: 2 + (Math.random() - 0.5) * 1,
      yClose: 99 + (Math.random() - 0.5) * 5
    };
  }
};

// 获取多个股票数据
export const getMultipleMarketData = async (stockList: {code: string, market: 'A股' | '港股'}[]) => {
  try {
    // 从实时数据API批量获取数据
    const results = await fetchMultipleStocks(stockList);
    return results;
  } catch (error) {
    console.error('获取批量市场数据失败:', error);
    return [];
  }
};

// 获取市场股票列表
export const getMarketStockList = async (market: 'A股' | '港股') => {
  try {
    // 从实时数据API获取市场列表数据
    const results = await fetchMarketList(market);
    return results;
  } catch (error) {
    console.error('获取市场股票列表失败:', error);
    return [];
  }
};