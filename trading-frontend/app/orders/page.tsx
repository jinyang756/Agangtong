'use client';

import { useTradingStore } from '@/store/trading-store';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function OrdersPage() {
  const { account, orders } = useTradingStore();
  const router = useRouter();
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'buy' | 'sell'>('all');

  // 检查是否已登录
  useEffect(() => {
    if (!account) {
      router.push('/login');
    }
  }, [account, router]);

  // 根据筛选条件过滤订单
  useEffect(() => {
    if (filter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.type === filter));
    }
  }, [orders, filter]);

  if (!account) {
    return null; // 等待重定向到登录页
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            订单历史
          </h1>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-slate-800 border border-cyan-500/30 rounded-lg text-cyan-300 hover:bg-cyan-500/10 transition-colors"
          >
            返回交易终端
          </button>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700'
              }`}
            >
              全部订单
            </button>
            <button
              onClick={() => setFilter('buy')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'buy'
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700'
              }`}
            >
              买入订单
            </button>
            <button
              onClick={() => setFilter('sell')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === 'sell'
                  ? 'bg-red-500/30 text-red-300 border border-red-500/50'
                  : 'bg-slate-800/50 text-gray-400 border border-slate-700'
              }`}
            >
              卖出订单
            </button>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">暂无订单记录</div>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                去交易
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">订单ID</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">股票代码</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">类型</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">价格</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">数量</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">时间</th>
                    <th className="py-3 px-4 text-left text-gray-400 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="py-3 px-4 font-mono text-sm">#{order.id.slice(-6)}</td>
                      <td className="py-3 px-4">{order.stockCode}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          order.type === 'buy'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {order.type === 'buy' ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {order.price ? `¥${order.price.toFixed(2)}` : '市价'}
                      </td>
                      <td className="py-3 px-4">{order.quantity}</td>
                      <td className="py-3 px-4 text-sm text-gray-400">
                        {new Date(order.timestamp).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}