'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTradingStore } from '@/store/trading-store';
import pb from '@/lib/pocketbase';

interface Order {
  id: string;
  type: 'buy' | 'sell';
  stockCode: string;
  price: number;
  quantity: number;
  created: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export default function OrdersPage() {
  const { account } = useTradingStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (!account) {
      router.push('/login');
      return;
    }
    
    fetchOrders();
  }, [account, router]);

  const fetchOrders = async () => {
    if (!pb.authStore.isValid) {
      router.push('/login');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // 从PocketBase获取订单数据
      const records: any[] = await pb.collection('orders').getFullList({
        filter: `userId = "${pb.authStore.model?.id}"`,
        sort: '-created',
      });
      
      // 转换数据格式
      const formattedOrders: Order[] = records.map(record => ({
        id: record.id,
        type: record.type,
        stockCode: record.stockCode,
        price: record.price,
        quantity: record.quantity,
        created: record.created,
        status: record.status
      }));
      
      setOrders(formattedOrders);
    } catch (err: any) {
      setError(err.message || '获取订单数据失败');
      console.error('获取订单数据失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'cancelled': return 'text-red-400';
      default: return 'text-yellow-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return '待处理';
    }
  };

  if (!account) {
    return null; // 等待重定向到登录页
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
                交易订单
              </h1>
              <p className="text-gray-400">查看和管理您的交易订单</p>
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-all text-white flex items-center gap-2"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
              )}
              刷新
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">暂无交易订单</div>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg transition-all text-white"
              >
                开始交易
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">股票代码</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">类型</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">价格</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">数量</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">时间</th>
                    <th className="text-left py-4 px-2 text-gray-400 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      <td className="py-4 px-2 text-white font-medium">{order.stockCode}</td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.type === 'buy' 
                            ? 'bg-green-900/50 text-green-400' 
                            : 'bg-red-900/50 text-red-400'
                        }`}>
                          {order.type === 'buy' ? '买入' : '卖出'}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-white">¥{order.price.toFixed(2)}</td>
                      <td className="py-4 px-2 text-white">{order.quantity}</td>
                      <td className="py-4 px-2 text-gray-400">
                        {new Date(order.created).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
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