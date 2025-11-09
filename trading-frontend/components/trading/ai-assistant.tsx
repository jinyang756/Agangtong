'use client';
import { useState, useRef } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { MessageCircle, X, Sparkles } from 'lucide-react';
// @ts-ignore
import { MarketData } from 'trading-simulator';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const { currentStock, marketType } = useTradingStore();

  const analyzeStock = async (query: string) => {
    // 获取实时市场数据
    let stockData;
    try {
      if (marketType === 'A股') {
        // @ts-ignore
        stockData = MarketData.getAShareData(currentStock);
      } else {
        // @ts-ignore
        stockData = MarketData.getHKShareData(currentStock);
      }
    } catch (error) {
      console.error('获取市场数据失败:', error);
      stockData = {
        currentPrice: 100,
        change: 0,
        changePercent: 0
      };
    }

    // 模拟AI分析结果
    return {
      insight: `根据当前市场数据，${currentStock} 的价格为 ¥${stockData.currentPrice.toFixed(2)}，${
        stockData.change >= 0 ? '上涨' : '下跌'
      } ${Math.abs(stockData.changePercent).toFixed(2)}%。
      
技术分析显示：
- 短期趋势：${stockData.change >= 0 ? '看涨' : '看跌'}
- 支撑位：¥${(stockData.currentPrice * 0.98).toFixed(2)}
- 阻力位：¥${(stockData.currentPrice * 1.02).toFixed(2)}
- 建议关注成交量变化`,
      risk: `市场波动可能带来损失，建议设置止损位`,
      suggestion: `可以考虑${stockData.change >= 0 ? '逢低买入' : '逢高卖出'}策略`
    };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // AI分析
    const analysis = await analyzeStock(input);
    const aiMessage = {
      role: 'ai' as const,
      content: `**${currentStock} 分析结果**

${analysis.insight}

**风险提示**: ${analysis.risk}
**建议**: ${analysis.suggestion}`,
    };
    
    setMessages(prev => [...prev, aiMessage]);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* 悬浮球 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/50 animate-pulse flex items-center justify-center"
        >
          <Sparkles className="w-8 h-8 text-white" />
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="w-96 h-[600px] bg-slate-900/90 backdrop-blur-lg rounded-2xl border border-cyan-500/50 shadow-2xl shadow-cyan-500/30 flex flex-col">
          <div className="p-4 border-b border-cyan-500/30 flex justify-between items-center">
            <h3 className="text-cyan-300 font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI交易助手
            </h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-8">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-cyan-500" />
                <p>我是您的AI交易助手</p>
                <p className="text-sm mt-2">可以问我：</p>
                <p className="text-xs">"分析000001"</p>
                <p className="text-xs">"港股的交易规则"</p>
                <p className="text-xs">"帮我设置止损"</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-cyan-500/20 ml-12'
                    : 'bg-purple-500/20 mr-12'
                }`}
              >
                <div className="text-xs text-gray-400 mb-1">
                  {msg.role === 'user' ? '您' : 'AI助手'}
                </div>
                <div className="text-sm text-white whitespace-pre-line">
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-cyan-500/30">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="输入您的问题..."
                className="flex-1 bg-slate-800 border border-cyan-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSend}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}