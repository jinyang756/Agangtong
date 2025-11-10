'use client';
import Candlestick3D from '@/components/trading/3d-chart';
import OrderBookHologram from '@/components/trading/order-book-hologram';
import AIAssistant from '@/components/trading/ai-assistant';
import CommandPalette from '@/components/ui/command-palette';
import TradePanel from '@/components/trading/trade-panel';
import MarketSelector from '@/components/trading/market-selector';
import { useVoiceTrading } from '@/hooks/use-voice';
import { useState, useEffect, useRef } from 'react';
import { getMarketData } from '@/lib/theme';
import { RealTimeDataWebSocket, realTimeDataWebSocket } from '@/lib/realtime-data';
import { useTradingStore } from '@/store/trading-store';
import { useRouter } from 'next/navigation';

// 创建模拟数据生成函数
const generateCandlestickData = (currentPrice: number) => {
  return Array.from({ length: 20 }, (_, i) => ({
    time: new Date(Date.now() - (20 - i) * 60000).toISOString(),
    open: currentPrice + (Math.random() - 0.5) * 2,
    high: currentPrice + Math.random() * 2,
    low: currentPrice - Math.random() * 2,
    close: currentPrice + (Math.random() - 0.5) * 2,
    volume: Math.floor(Math.random() * 1000000)
  }));
};

const generateOrderBookData = (currentPrice: number) => {
  const bids = [];
  const asks = [];
  
  for (let i = 0; i < 10; i++) {
    bids.push({
      price: currentPrice - (i + 1) * 0.05,
      quantity: Math.floor(Math.random() * 1000) + 100
    });
    
    asks.push({
      price: currentPrice + (i + 1) * 0.05,
      quantity: Math.floor(Math.random() * 1000) + 100
    });
  }
  
  return { bids, asks };
};

export default function Home() {
  const { isListening, startListening, parseVoiceCommand } = useVoiceTrading();
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderBookData, setOrderBookData] = useState<any>(null);
  const [stockData, setStockData] = useState<any>(null);
  const { account, currentStock, marketType } = useTradingStore();
  const router = useRouter();
  const [websocket, setWebsocket] = useState<RealTimeDataWebSocket | null>(null);

  // 添加一个useRef来保存定时器ID
  const dataIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const websocketRef = useRef<RealTimeDataWebSocket | null>(null);

  // 检查是否已登录
  useEffect(() => {
    if (!account) {
      router.push('/login');
    }
  }, [account, router]);

  // 连接WebSocket获取实时数据更新
  useEffect(() => {
    if (!account) return;
    
    // 优化：确保只有一个WebSocket连接在运行
    if (websocketRef.current) {
      websocketRef.current.disconnect();
      websocketRef.current = null;
    }
    
    // 使用单例WebSocket实例
    const ws = realTimeDataWebSocket;
    ws.connect();
    
    ws.subscribe((data) => {
      if (data.code === currentStock) {
        setStockData((prev: any) => ({
          ...prev,
          currentPrice: data.price,
          change: data.change,
          changePercent: data.changePercent,
          open: data.open,
          high: data.high,
          low: data.low,
          volume: data.volume,
          amount: data.amount,
          time: data.time,
          pe: data.pe,
          pb: data.pb,
          turnover: data.turnover,
          amplitude: data.amplitude,
          yClose: data.yClose
        }));
      }
    });
    
    websocketRef.current = ws;
    setWebsocket(ws);
    
    return () => {
      if (websocketRef.current) {
        websocketRef.current.disconnect();
        websocketRef.current = null;
      }
    };
  }, [account, currentStock]);

  // 获取实时数据
  useEffect(() => {
    if (!account) return;
    
    const fetchData = async () => {
      try {
        // 获取实时行情数据
        const data = await getMarketData(currentStock, marketType);
        setStockData(data);
        
        // 生成K线数据（基于实时数据）
        const candleData = generateCandlestickData(data.currentPrice);
        setChartData(candleData);
        
        // 生成订单簿数据
        const orderData = generateOrderBookData(data.currentPrice);
        setOrderBookData(orderData);
      } catch (error) {
        console.error('获取数据失败:', error);
      }
    };
    
    fetchData();
    
    // 每30秒刷新一次数据（合理分配请求配额）
    // 优化：确保只有一个定时器在运行
    if (dataIntervalRef.current) {
      clearInterval(dataIntervalRef.current);
    }
    
    dataIntervalRef.current = setInterval(fetchData, 30000);
    
    return () => {
      if (dataIntervalRef.current) {
        clearInterval(dataIntervalRef.current);
        dataIntervalRef.current = null;
      }
    };
  }, [account, currentStock, marketType]);

  if (!account) {
    return null; // 等待重定向到登录页
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-6">
      <CommandPalette />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            赛博朋克交易终端
          </h1>
          <div className="flex gap-2 md:gap-4">
            <button 
              onClick={startListening}
              className={`px-3 py-2 md:px-4 md:py-2 rounded-lg transition-all text-sm md:text-base ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600'
              }`}
            >
              {isListening ? '停止监听' : '语音交易'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="lg:col-span-2">
            <Candlestick3D data={chartData} symbol={currentStock} />
          </div>
          <div>
            <OrderBookHologram data={orderBookData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-cyan-300 mb-3 md:mb-4">持仓概览</h2>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex justify-between text-sm md:text-base">
                    <span>000001</span>
                    <span>1000股</span>
                  </div>
                  <div className="flex justify-between text-sm md:text-base">
                    <span>600001</span>
                    <span>500股</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-cyan-300 mb-3 md:mb-4">市场动态</h2>
                <div className="space-y-2 md:space-y-3">
                  <div className="text-xs md:text-sm">
                    <div className="text-emerald-400">+2.5%</div>
                    <div>上证指数突破3000点</div>
                  </div>
                  <div className="text-xs md:text-sm">
                    <div className="text-red-400">-1.2%</div>
                    <div>科技股回调</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-cyan-300 mb-3 md:mb-4">交易快捷</h2>
                <div className="grid grid-cols-2 gap-2 md:gap-3">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 py-2 md:py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-sm md:text-base">
                    买入
                  </button>
                  <button className="bg-gradient-to-r from-red-500 to-orange-600 py-2 md:py-3 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all text-sm md:text-base">
                    卖出
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {stockData && (
              <TradePanel 
                stockCode={currentStock} 
                currentPrice={stockData.currentPrice} 
              />
            )}
          </div>
        </div>
        
        {/* 新增市场选择器 */}
        <div className="mt-4 md:mt-6">
          <MarketSelector />
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
}