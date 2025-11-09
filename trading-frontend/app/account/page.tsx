'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTradingStore } from '@/store/trading-store';

export default function AccountPage() {
  const { account, setAccount, logout } = useTradingStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();

  // 检查是否已登录
  if (!account) {
    router.push('/login');
    return null;
  }

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (newPassword !== confirmPassword) {
      setError('两次输入的新密码不一致');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('新密码长度至少6位');
      return;
    }
    
    // 在实际应用中，这里会调用后端API修改密码
    // 目前我们直接更新本地状态
    setSuccess('密码修改成功');
    setNewPassword('');
    setConfirmPassword('');
    setCurrentPassword('');
    setError('');
    
    // 3秒后清除成功消息
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            账户管理
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors"
          >
            退出登录
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 账户信息 */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">账户信息</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-gray-400">用户名</span>
                <span>{account.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-gray-400">市场类型</span>
                <span>{account.marketType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-700">
                <span className="text-gray-400">账户余额</span>
                <span className="text-emerald-400">¥{account.balance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-400">注册时间</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 修改密码 */}
          <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
            <h2 className="text-xl font-semibold text-cyan-300 mb-4">修改密码</h2>
            
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
            
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  当前密码
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="输入当前密码"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  新密码
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="输入新密码"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  确认新密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="再次输入新密码"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-2 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                修改密码
              </button>
            </form>
          </div>
        </div>

        {/* 账户操作 */}
        <div className="mt-6 bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">账户操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-slate-800/50 rounded-lg border border-emerald-500/30 hover:bg-emerald-500/10 transition-colors">
              <div className="text-emerald-400 font-medium">充值</div>
              <div className="text-sm text-gray-400 mt-1">增加账户资金</div>
            </button>
            <button className="p-4 bg-slate-800/50 rounded-lg border border-amber-500/30 hover:bg-amber-500/10 transition-colors">
              <div className="text-amber-400 font-medium">提现</div>
              <div className="text-sm text-gray-400 mt-1">提取账户资金</div>
            </button>
            <button className="p-4 bg-slate-800/50 rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors">
              <div className="text-red-400 font-medium">注销账户</div>
              <div className="text-sm text-gray-400 mt-1">删除账户信息</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}