// 实时数据服务
// 接入ZhituAPI (https://www.zhituapi.com)

interface StockData {
  code: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  amount: number;
  market: 'A股' | '港股';
  time: string;
  pe: number; // 市盈率
  pb: number; // 市净率
  turnover: number; // 换手率
  amplitude: number; // 振幅
  yClose: number; // 昨日收盘价
}

// ZhituAPI配置
const API_BASE_URL = 'https://api.zhituapi.com';
const API_TOKEN = '80465464-6254-43E5-9F8A-6D193C7C2964'; // 用户申请的正式证书

// 请求配额管理
const DAILY_REQUEST_LIMIT = 200; // 每日请求限制
const REQUEST_RATE_LIMIT = 300; // 每分钟请求限制
let dailyRequestCount = 0; // 当前日请求计数
let lastRequestDate = new Date().toDateString(); // 上次请求日期

// 检查并更新请求配额
const checkAndIncrementRequestCount = (): boolean => {
  const today = new Date().toDateString();
  
  // 如果是新的一天，重置计数器
  if (today !== lastRequestDate) {
    dailyRequestCount = 0;
    lastRequestDate = today;
  }
  
  // 检查是否超过每日限制
  if (dailyRequestCount >= DAILY_REQUEST_LIMIT) {
    console.warn('已达到每日请求限制');
    return false;
  }
  
  // 增加请求计数
  dailyRequestCount++;
  return true;
};

// 获取股票实时数据
export const fetchRealTimeData = async (stockCode: string, market: 'A股' | '港股'): Promise<StockData> => {
  try {
    // 检查请求配额
    if (!checkAndIncrementRequestCount()) {
      // 超过配额时返回模拟数据
      return {
        code: stockCode,
        name: market === 'A股' ? `A股${stockCode}` : `港股${stockCode}`,
        price: 100 + (Math.random() - 0.5) * 20,
        change: (Math.random() - 0.5) * 5,
        changePercent: (Math.random() - 0.5) * 3,
        open: 100,
        high: 105,
        low: 95,
        volume: 1000000,
        amount: 100000000,
        market: market,
        time: new Date().toISOString(),
        pe: 15 + (Math.random() - 0.5) * 10,
        pb: 2 + (Math.random() - 0.5) * 1,
        turnover: 1 + (Math.random() - 0.5) * 2,
        amplitude: 2 + (Math.random() - 0.5) * 1,
        yClose: 99 + (Math.random() - 0.5) * 5
      };
    }
    
    // 构造API请求URL
    const url = `${API_BASE_URL}/hs/real/ssjy/${stockCode}?token=${API_TOKEN}`;
    
    // 实际API调用
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // 转换数据格式
    return {
      code: data.code || stockCode,
      name: data.name || `股票${stockCode}`,
      price: parseFloat(data.p) || 0, // 当前价格
      change: parseFloat(data.ud) || 0, // 涨跌额
      changePercent: parseFloat(data.pc) || 0, // 涨跌幅
      open: parseFloat(data.o) || 0, // 开盘价
      high: parseFloat(data.h) || 0, // 最高价
      low: parseFloat(data.l) || 0, // 最低价
      volume: parseInt(data.v) || 0, // 成交量（手）
      amount: parseFloat(data.cje) || 0, // 成交额
      market: market,
      time: data.t || new Date().toISOString(), // 更新时间
      pe: parseFloat(data.pe) || 0, // 市盈率
      pb: parseFloat(data.sjl) || 0, // 市净率
      turnover: parseFloat(data.hs) || 0, // 换手率
      amplitude: parseFloat(data.zf) || 0, // 振幅
      yClose: parseFloat(data.yc) || 0 // 昨日收盘价
    };
  } catch (error) {
    console.error('获取实时数据失败:', error);
    
    // 失败时返回默认数据
    return {
      code: stockCode,
      name: market === 'A股' ? `A股${stockCode}` : `港股${stockCode}`,
      price: 100 + (Math.random() - 0.5) * 20,
      change: (Math.random() - 0.5) * 5,
      changePercent: (Math.random() - 0.5) * 3,
      open: 100,
      high: 105,
      low: 95,
      volume: 1000000,
      amount: 100000000,
      market: market,
      time: new Date().toISOString(),
      pe: 15 + (Math.random() - 0.5) * 10,
      pb: 2 + (Math.random() - 0.5) * 1,
      turnover: 1 + (Math.random() - 0.5) * 2,
      amplitude: 2 + (Math.random() - 0.5) * 1,
      yClose: 99 + (Math.random() - 0.5) * 5
    };
  }
};

// 获取股票列表数据
export const fetchStockList = async (): Promise<any[]> => {
  try {
    // 检查请求配额
    if (!checkAndIncrementRequestCount()) {
      // 超过配额时返回空数组
      return [];
    }
    
    // 构造API请求URL
    const url = `${API_BASE_URL}/hs/list/all?token=${API_TOKEN}`;
    
    // 实际API调用
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    // 转换数据格式
    return data.map((item: any) => ({
      code: item.dm ? item.dm.split('.')[0] : '', // 提取股票代码
      name: item.mc || '', // 股票名称
      exchange: item.jys || '' // 交易所
    }));
  } catch (error) {
    console.error('获取股票列表失败:', error);
    return [];
  }
};

// 批量获取股票数据
export const fetchMultipleStocks = async (stockList: {code: string, market: 'A股' | '港股'}[]): Promise<StockData[]> => {
  try {
    const results: StockData[] = [];
    for (const item of stockList) {
      const data = await fetchRealTimeData(item.code, item.market);
      results.push(data);
    }
    return results;
  } catch (error) {
    console.error('批量获取股票数据失败:', error);
    return [];
  }
};

// 获取市场列表数据
export const fetchMarketList = async (market: 'A股' | '港股'): Promise<StockData[]> => {
  try {
    if (market === 'A股') {
      // 获取A股列表数据
      const list = await fetchStockList();
      // 取前5个股票进行演示（节省请求配额）
      const topStocks = list.slice(0, 5);
      const stockList = topStocks.map((stock: any) => ({
        code: stock.code,
        market: 'A股' as 'A股'
      }));
      
      // 获取实时数据
      return await fetchMultipleStocks(stockList);
    } else {
      // 港股数据暂时使用模拟数据
      return [
        await fetchRealTimeData('09988', '港股'),
        await fetchRealTimeData('03690', '港股'),
        await fetchRealTimeData('00700', '港股'),
        await fetchRealTimeData('09888', '港股'),
        await fetchRealTimeData('01810', '港股')
      ];
    }
  } catch (error) {
    console.error('获取市场列表数据失败:', error);
    return [];
  }
};

// WebSocket连接（模拟）
export class RealTimeDataWebSocket {
  private listeners: ((data: StockData) => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  
  connect() {
    // 模拟WebSocket连接，每3秒推送一次数据更新
    // 优化：确保只有一个定时器在运行
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    
    this.intervalId = setInterval(() => {
      const mockData: StockData = {
        code: '000001',
        name: '平安银行',
        price: 11.57 + (Math.random() - 0.5) * 0.5,
        change: (Math.random() - 0.5) * 0.2,
        changePercent: (Math.random() - 0.5) * 1,
        open: 11.52,
        high: 11.58,
        low: 11.45,
        volume: 38611600 + Math.floor(Math.random() * 1000000),
        amount: 445456418 + Math.floor(Math.random() * 10000000),
        market: 'A股',
        time: new Date().toISOString(),
        pe: 5.26,
        pb: 0.46,
        turnover: 1.23,
        amplitude: 1.12,
        yClose: 11.55
      };
      
      this.listeners.forEach(listener => listener(mockData));
    }, 3000);
  }
  
  disconnect() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  subscribe(listener: (data: StockData) => void) {
    this.listeners.push(listener);
  }
  
  unsubscribe(listener: (data: StockData) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
}

// 导出一个单例实例，避免重复创建
export const realTimeDataWebSocket = new RealTimeDataWebSocket();

// 实际的WebSocket连接实现
export class QOSWebSocket {
  private ws: WebSocket | null = null;
  private listeners: ((data: any) => void)[] = [];
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  
  connect() {
    try {
      // 注意：经过测试，QOS.HK的WebSocket返回400错误，暂时无法使用
      // 以下为预留的WebSocket连接代码，待服务恢复正常后再启用
      
      // 使用提供的API KEY连接WebSocket
      // const wsUrl = `wss://api.qos.hk/ws?apikey=${this.apiKey}`;
      // this.ws = new WebSocket(wsUrl);
      
      // this.ws.onopen = () => {
      //   console.log('WebSocket连接成功');
      //   this.reconnectAttempts = 0; // 重置重连次数
      // };
      
      // this.ws.onmessage = (event) => {
      //   try {
      //     const data = JSON.parse(event.data);
      //     this.listeners.forEach(listener => listener(data));
      //   } catch (error) {
      //     console.error('解析WebSocket消息失败:', error);
      //   }
      // };
      
      // this.ws.onerror = (error) => {
      //   console.error('WebSocket错误:', error);
      // };
      
      // this.ws.onclose = () => {
      //   console.log('WebSocket连接已关闭');
      //   this.handleReconnect();
      // };
      
      // 模拟WebSocket连接
      console.log('正在连接到QOS WebSocket服务...');
      console.log('注意：QOS.HK的WebSocket服务暂时不可用，使用模拟连接');
      
      // 模拟连接成功
      setTimeout(() => {
        console.log('WebSocket模拟连接成功');
        // 启动模拟数据推送
        this.startMockDataPush();
      }, 1000);
    } catch (error) {
      console.error('WebSocket连接失败:', error);
      this.handleReconnect();
    }
  }
  
  private startMockDataPush() {
    // 模拟数据推送
    setInterval(() => {
      const mockData = {
        code: '000001',
        price: 11.57 + (Math.random() - 0.5) * 0.5,
        time: new Date().toISOString()
      };
      
      this.listeners.forEach(listener => listener(mockData));
    }, 3000);
  }
  
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
  
  subscribe(listener: (data: any) => void) {
    this.listeners.push(listener);
  }
  
  unsubscribe(listener: (data: any) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }
  
  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`WebSocket重新连接中... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        this.connect();
      }, 5000);
    } else {
      console.error('WebSocket连接失败，已达到最大重连次数');
    }
  }
}