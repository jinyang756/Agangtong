'use client';

import { useState, useEffect } from 'react';
import { useTradingStore } from '@/store/trading-store';
import { logTrade, logError } from '@/lib/logger';
import pb from '@/lib/pocketbase';

interface Order {
  id: string;
  type: 'buy' | 'sell';
  stockCode: string;
  price: number;
  quantity: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'cancelled';
}

interface TradePanelProps {
  stockCode?: string;
  currentPrice?: number;
}

export default function TradePanel({ stockCode, currentPrice }: TradePanelProps) {
  const { account, currentStock, marketType, addOrder } = useTradingStore();
  const [price, setPrice] = useState(currentPrice?.toString() || '');
  const [quantity, setQuantity] = useState('');
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 当currentPrice变化时更新价格输入框
  useEffect(() => {
    if (currentPrice) {
      setPrice(currentPrice.toString());
    }
  }, [currentPrice]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      const errorMsg = '请先登录账户';
      setError(errorMsg);
      logError('交易失败', new Error(errorMsg));
      return;
    }
    
    const priceNum = parseFloat(price);
    const quantityNum = parseInt(quantity);
    
    // 验证输入
    if (isNaN(priceNum) || isNaN(quantityNum) || priceNum <= 0 || quantityNum <= 0) {
      const errorMsg = '请输入有效的价格和数量';
      setError(errorMsg);
      logError('交易失败', new Error(errorMsg));
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // 创建订单对象
      const order: Order = {
        id: Math.random().toString(36).substr(2, 9),
        type: orderType,
        stockCode: stockCode || currentStock,
        price: priceNum,
        quantity: quantityNum,
        timestamp: new Date(),
        status: 'pending'
      };
      
      // 保存订单到PocketBase
      if (pb.authStore.isValid) {
        await pb.collection('orders').create({
          userId: account.id,
          type: orderType,
          stockCode: stockCode || currentStock,
          price: priceNum,
          quantity: quantityNum,
          status: 'pending'
        });
      }
      
      // 添加到状态管理
      addOrder(order);
      
      // 记录交易日志
      logTrade('提交订单', order, { success: true, message: '订单已提交' });
      
      // 清空表单
      setPrice(currentPrice?.toString() || '');
      setQuantity('');
      
      // 显示成功消息（实际项目中可能需要更复杂的处理）
      console.log('订单已提交:', order);
    } catch (err: any) {
      // 提供更友好的错误提示
      const errorMsg = err.message && typeof err.message === 'string' 
        ? `订单提交失败: ${err.message}` 
        : '订单提交失败，请稍后重试';
      
      setError(errorMsg);
      logError('订单提交错误', err);
      console.error('订单提交错误:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 shadow-2xl shadow-cyan-500/20">
      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
        交易面板
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOrderType('buy')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'buy'
                ? 'bg-green-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            买入
          </button>
          <button
            type="button"
            onClick={() => setOrderType('sell')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              orderType === 'sell'
                ? 'bg-red-600 text-white'
                : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
            }`}
          >
            卖出
          </button>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            股票代码
          </label>
          <div className="px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white">
            {(stockCode || currentStock)} ({marketType})
          </div>
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
            价格
          </label>
          <input
            id="price"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
            placeholder="请输入价格"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
            数量
          </label>
          <input
            id="quantity"
            type="number"
            step="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
            placeholder="请输入数量"
            required
            disabled={isSubmitting}
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
              提交中...
            </span>
          ) : (
            `${orderType === 'buy' ? '买入' : '卖出'} ${stockCode || currentStock}`
          )}
        </button>
      </form>
    </div>
  );
}