'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface OrderBookData {
  bids: [number, number][]; // [价格, 数量]
  asks: [number, number][];
}

interface OrderBookHologramProps {
  data?: OrderBookData;
}

export default function OrderBookHologram({ data }: OrderBookHologramProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: Array.from({ length: 10 }, (_, i) => [100 - i * 0.1, Math.random() * 1000]),
    asks: Array.from({ length: 10 }, (_, i) => [100 + i * 0.1, Math.random() * 1000]),
  });

  // 如果传入了真实数据，则使用真实数据
  useEffect(() => {
    if (data) {
      setOrderBook(data);
    }
  }, [data]);

  // 模拟实时更新（仅在没有真实数据时）
  useEffect(() => {
    if (data) return; // 如果有真实数据，不进行模拟更新
    
    const interval = setInterval(() => {
      setOrderBook(prev => ({
        bids: prev.bids.map(([price, amount]) => [price, amount * (0.95 + Math.random() * 0.1)]),
        asks: prev.asks.map(([price, amount]) => [price, amount * (0.95 + Math.random() * 0.1)]),
      }));
    }, 500);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="relative h-96 bg-slate-900/50 rounded-xl p-4 border border-emerald-500/30 overflow-hidden">
      {/* 全息网格背景 */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #10b981 19px, #10b981 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, #10b981 19px, #10b981 20px)',
        }} />
      </div>

      <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
        {/* 买盘 */}
        <div className="space-y-1">
          <h4 className="text-emerald-400 text-sm font-mono mb-2">买盘 BIDS</h4>
          {orderBook.bids.map(([price, amount], idx) => (
            <motion.div
              key={idx}
              className="flex justify-between items-center text-xs p-1 rounded hover:bg-emerald-500/10 transition-colors"
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-emerald-400 font-mono">{price.toFixed(2)}</span>
              <span className="text-gray-300">{amount.toFixed(0)}</span>
              <div className="w-20 h-2 bg-gradient-to-r from-emerald-500 to-transparent rounded" 
                   style={{ width: `${(amount / 1000) * 80}px` }} />
            </motion.div>
          ))}
        </div>

        {/* 卖盘 */}
        <div className="space-y-1">
          <h4 className="text-red-400 text-sm font-mono mb-2">卖盘 ASKS</h4>
          {orderBook.asks.map(([price, amount], idx) => (
            <motion.div
              key={idx}
              className="flex justify-between items-center text-xs p-1 rounded hover:bg-red-500/10 transition-colors"
              animate={{ opacity: [0.5, 1] }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-2 bg-gradient-to-r from-transparent to-red-500 rounded" 
                   style={{ width: `${(amount / 1000) * 80}px` }} />
              <span className="text-gray-300">{amount.toFixed(0)}</span>
              <span className="text-red-400 font-mono">{price.toFixed(2)}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 全息光效 */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-red-500 animate-pulse" />
    </div>
  );
}