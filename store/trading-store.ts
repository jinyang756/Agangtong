import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface TradingState {
  account: {
    id: string;
    balance: number;
    marketType: 'A股' | '港股';
  } | null;
  currentStock: string;
  marketType: 'A股' | '港股';
  orders: any[];
  portfolio: any[];
  setAccount: (account: any) => void;
  setCurrentStock: (code: string) => void;
  setMarketType: (marketType: 'A股' | '港股') => void;
  addOrder: (order: any) => void;
  logout: () => void;
}

export const useTradingStore = create<TradingState>()(
  devtools(
    persist(
      (set) => ({
        account: null,
        currentStock: '000001', // 默认股票代码
        marketType: 'A股', // 默认市场类型
        orders: [],
        portfolio: [],
        setAccount: (account) => set({ account }),
        setCurrentStock: (code) => set({ currentStock: code }),
        setMarketType: (marketType) => set({ marketType }),
        addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
        logout: () => set({ account: null }),
      }),
      {
        name: 'trading-storage',
      }
    )
  )
);