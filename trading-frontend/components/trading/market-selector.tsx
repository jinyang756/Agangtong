'use client';

import { useTradingStore } from '@/store/trading-store';
import { useEffect, useState } from 'react';
import { getMarketStockList } from '@/lib/theme';

// 股票列表数据
const DEFAULT_STOCK_LIST = {
  'A股': [
    { code: '000001', name: '平安银行' },
    { code: '000002', name: '万科A' },
    { code: '000004', name: '*ST国华' },
    { code: '000006', name: '深振业A' },
    { code: '000007', name: '零七股份' }
  ],
  '港股': [
    { code: '09988', name: '阿里巴巴' },
    { code: '03690', name: '美团' },
    { code: '00700', name: '腾讯控股' },
    { code: '09888', name: '百度' },
    { code: '01810', name: '小米集团' }
  ]
};

export default function MarketSelector() {
  const { marketType, setMarketType, currentStock, setCurrentStock } = useTradingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [stockList, setStockList] = useState(DEFAULT_STOCK_LIST);
  const [loading, setLoading] = useState(false);
  
  // 获取市场股票列表
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const stocks = await getMarketStockList(marketType);
        if (stocks.length > 0) {
          // 更新股票列表
          const newStockList = { ...stockList };
          newStockList[marketType] = stocks.map(stock => ({
            code: stock.code,
            name: stock.name
          }));
          setStockList(newStockList);
        }
      } catch (error) {
        console.error('获取股票列表失败:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStocks();
  }, [marketType]);
  
  // 过滤股票列表
  const filteredStocks = stockList[marketType].filter(stock => 
    stock.code.includes(searchTerm) || stock.name.includes(searchTerm)
  );
  
  const handleMarketChange = (newMarket: 'A股' | '港股') => {
    setMarketType(newMarket);
    // 切换市场时，默认选择该市场的第一个股票
    const firstStock = stockList[newMarket][0];
    if (firstStock) {
      setCurrentStock(firstStock.code);
    }
  };
  
  const handleStockChange = (code: string) => {
    setCurrentStock(code);
  };
  
  return (
    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
      <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-6">
        市场选择
      </h2>
      
      <div className="space-y-6">
        {/* 市场切换 */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">市场类型</h3>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarketChange('A股')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                marketType === 'A股'
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              A股市场
            </button>
            <button
              onClick={() => handleMarketChange('港股')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                marketType === '港股'
                  ? 'bg-gradient-to-r from-cyan-600 to-purple-600 text-white'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              港股市场
            </button>
          </div>
        </div>
        
        {/* 股票搜索 */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">股票搜索</h3>
          <input
            type="text"
            placeholder="输入股票代码或名称搜索"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
          />
        </div>
        
        {/* 股票选择 */}
        <div>
          <h3 className="text-lg font-semibold text-cyan-300 mb-3">
            {marketType}股票列表
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {loading ? (
              <div className="text-center py-4 text-gray-400">
                <div className="h-5 w-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="mt-2">加载中...</div>
              </div>
            ) : filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <button
                  key={stock.code}
                  onClick={() => handleStockChange(stock.code)}
                  className={`text-left p-3 rounded-lg transition-all ${
                    currentStock === stock.code
                      ? 'bg-gradient-to-r from-cyan-600/30 to-purple-600/30 border border-cyan-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <div className="font-medium text-white">{stock.code}</div>
                  <div className="text-sm text-gray-400">{stock.name}</div>
                </button>
              ))
            ) : (
              <div className="text-center py-4 text-gray-400">
                未找到匹配的股票
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}