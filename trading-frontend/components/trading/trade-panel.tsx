'use client';

import { useState } from 'react';
import { useTradingStore } from '@/store/trading-store';
// @ts-ignore
import { LimitOrder, MarketOrder } from 'trading-simulator';

interface TradePanelProps {
  stockCode: string;
  currentPrice: number;
}

export default function TradePanel({ stockCode, currentPrice }: TradePanelProps) {
  const { account, addOrder } = useTradingStore();
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState(currentPrice.toString());
  const [quantity, setQuantity] = useState('100');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      setError('请先登录账户');
      return;
    }
    
    const qty = parseInt(quantity);
    const orderPrice = orderType === 'limit' ? parseFloat(price) : currentPrice;
    
    if (isNaN(qty) || qty <= 0) {
      setError('请输入有效的数量');
      return;
    }
    
    if (orderType === 'limit' && (isNaN(orderPrice) || orderPrice <= 0)) {
      setError('请输入有效的价格');
      return;
    }
    
    try {
      // 创建订单对象
      let order;
      if (orderType === 'limit') {
        // @ts-ignore
        order = new LimitOrder({
          stockCode,
          price: orderPrice,
          quantity: qty,
          type: tradeType
        });
      } else {
        // @ts-ignore
        order = new MarketOrder({
          stockCode,
          quantity: qty,
          type: tradeType
        });
      }
      
      // 在实际应用中，这里会调用后端API提交订单
      // 目前我们直接更新本地状态
      addOrder({
        id: Date.now().toString(),
        ...order,
        timestamp: new Date().toISOString(),
        status: '已提交'
      });
      
      setSuccess(`${tradeType === 'buy' ? '买入' : '卖出'}订单已提交`);
      setQuantity('100');
      if (orderType === 'limit') {
        setPrice(currentPrice.toString());
      }
      setError('');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('订单提交失败，请稍后重试');
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
      <h2 className="text-xl font-semibold text-cyan-300 mb-4">交易面板</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg text-emerald-300 text-sm">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmitOrder} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setTradeType('buy')}
            className={`py-2 rounded-lg font-medium transition-all ${
              tradeType === 'buy'
                ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                : 'bg-slate-800/50 text-gray-400 border border-slate-700'
            }`}
          >
            买入
          </button>
          <button
            type="button"
            onClick={() => setTradeType('sell')}
            className={`py-2 rounded-lg font-medium transition-all ${
              tradeType === 'sell'
                ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                : 'bg-slate-800/50 text-gray-400 border border-slate-700'
            }`}
          >
            卖出
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setOrderType('limit')}
            className={`py-2 rounded-lg font-medium transition-all ${
              orderType === 'limit'
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                : 'bg-slate-800/50 text-gray-400 border border-slate-700'
            }`}
          >
            限价单
          </button>
          <button
            type="button"
            onClick={() => setOrderType('market')}
            className={`py-2 rounded-lg font-medium transition-all ${
              orderType === 'market'
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-slate-800/50 text-gray-400 border border-slate-700'
            }`}
          >
            市价单
          </button>
        </div>
        
        {orderType === 'limit' && (
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              价格
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="输入价格"
              step="0.01"
              min="0"
            />
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            数量
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
            placeholder="输入数量"
            min="1"
          />
        </div>
        
        <div className="bg-slate-800/50 rounded-lg p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">股票代码</span>
            <span className="text-white">{stockCode}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">当前价格</span>
            <span className="text-white">¥{currentPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">交易类型</span>
            <span className={tradeType === 'buy' ? 'text-emerald-400' : 'text-red-400'}>
              {tradeType === 'buy' ? '买入' : '卖出'}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-400">订单类型</span>
            <span className={orderType === 'limit' ? 'text-cyan-400' : 'text-purple-400'}>
              {orderType === 'limit' ? '限价单' : '市价单'}
            </span>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
        >
          {tradeType === 'buy' ? '买入' : '卖出'}
        </button>
      </form>
    </div>
  );
}