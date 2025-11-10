'use client';
import { Command } from 'cmdk';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-cyan-500/50 shadow-2xl"
    >
      <Command.Input 
        placeholder="输入命令... (例如: 买入000001)" 
        className="w-full p-4 bg-transparent text-white placeholder-gray-400 focus:outline-none"
      />
      <Command.List className="max-h-96 overflow-y-auto">
        <Command.Empty className="p-4 text-gray-400">未找到命令</Command.Empty>
        
        <Command.Group heading="快速交易" className="px-4 py-2 text-cyan-400 text-xs">
          <Command.Item
            onSelect={() => router.push('/order?type=buy')}
            className="p-3 rounded-lg hover:bg-cyan-500/10 cursor-pointer text-white"
          >
            买入股票
          </Command.Item>
          <Command.Item
            onSelect={() => router.push('/order?type=sell')}
            className="p-3 rounded-lg hover:bg-cyan-500/10 cursor-pointer text-white"
          >
            卖出股票
          </Command.Item>
        </Command.Group>

        <Command.Group heading="导航" className="px-4 py-2 text-purple-400 text-xs">
          <Command.Item
            onSelect={() => router.push('/portfolio')}
            className="p-3 rounded-lg hover:bg-purple-500/10 cursor-pointer text-white"
          >
            查看持仓
          </Command.Item>
          <Command.Item
            onSelect={() => router.push('/history')}
            className="p-3 rounded-lg hover:bg-purple-500/10 cursor-pointer text-white"
          >
            交易历史
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}