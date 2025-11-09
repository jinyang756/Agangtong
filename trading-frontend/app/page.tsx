'use client';
import Candlestick3D from '@/components/trading/3d-chart';
import OrderBookHologram from '@/components/trading/order-book-hologram';
import AIAssistant from '@/components/trading/ai-assistant';
import CommandPalette from '@/components/ui/command-palette';
import TradePanel from '@/components/trading/trade-panel';
import { useVoiceTrading } from '@/hooks/use-voice';
import { useState, useEffect } from 'react';
import { getMarketData, generateCandlestickData, generateOrderBookData } from '@/lib/theme';
import { useTradingStore } from '@/store/trading-store';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { isListening, startListening, parseVoiceCommand } = useVoiceTrading();
  const [chartData, setChartData] = useState<any[]>([]);
  const [orderBookData, setOrderBookData] = useState<any>(null);
  const [stockData, setStockData] = useState<any>(null);
  const { account } = useTradingStore();
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (!account) {
      router.push('/login');
    }
  }, [account, router]);

  // 获取真实模拟数据
  useEffect(() => {
    if (!account) return;
    
    // 获取A股行情数据
    const data = getMarketData('000001', 'A股');
    setStockData(data);
    
    // 生成K线数据（基于真实数据）
    const candleData = generateCandlestickData(data.currentPrice);
    setChartData(candleData);
    
    // 生成订单簿数据
    const orderData = generateOrderBookData(data.currentPrice);
    setOrderBookData(orderData);
  }, [account]);

  if (!account) {
    return null; // 等待重定向到登录页
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <CommandPalette />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            赛博朋克交易终端
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={startListening}
              className={`px-4 py-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-cyan-500 to-purple-600'
              }`}
            >
              {isListening ? '停止监听' : '语音交易'}
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Candlestick3D data={chartData} symbol="000001" />
          </div>
          <div>
            <OrderBookHologram data={orderBookData} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">持仓概览</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>000001</span>
                    <span>1000股</span>
                  </div>
                  <div className="flex justify-between">
                    <span>600001</span>
                    <span>500股</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">市场动态</h2>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="text-emerald-400">+2.5%</div>
                    <div>上证指数突破3000点</div>
                  </div>
                  <div className="text-sm">
                    <div className="text-red-400">-1.2%</div>
                    <div>科技股回调</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/60 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
                <h2 className="text-xl font-semibold text-cyan-300 mb-4">交易快捷</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-gradient-to-r from-emerald-500 to-green-600 py-3 rounded-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all">
                    买入
                  </button>
                  <button className="bg-gradient-to-r from-red-500 to-orange-600 py-3 rounded-lg hover:shadow-lg hover:shadow-red-500/30 transition-all">
                    卖出
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            {stockData && (
              <TradePanel 
                stockCode="000001" 
                currentPrice={stockData.currentPrice} 
              />
            )}
          </div>
        </div>
      </div>
      
      <AIAssistant />
    </div>
  );
}