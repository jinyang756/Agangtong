'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTradingStore } from '@/store/trading-store';
import { logAccount, logError } from '@/lib/logger';
import pb from '@/lib/pocketbase';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [initialFunds, setInitialFunds] = useState('0');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAccount } = useTradingStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 简单验证
    if (password !== confirmPassword) {
      const errorMsg = '两次输入的密码不一致';
      setError(errorMsg);
      logError('注册失败', new Error(errorMsg));
      return;
    }
    
    if (password.length < 6) {
      const errorMsg = '密码长度至少6位';
      setError(errorMsg);
      logError('注册失败', new Error(errorMsg));
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // 使用PocketBase注册用户
      const userData = await pb.collection('users').create({
        username,
        email,
        password,
        passwordConfirm: password
        // 资金由后端管理，不在注册时设置
      });

      // 自动登录
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // 保存到状态管理
      setAccount({
        id: authData.record.id,
        username: authData.record.username,
        email: authData.record.email
        // 资金由后端管理，不在前端状态中保存
      });

      // 记录注册日志
      logAccount('用户注册', { 
        userId: authData.record.id, 
        username: authData.record.username,
        email: authData.record.email
        // 资金由后端管理，不在日志中记录初始资金
      });

      // 跳转到主页
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.message || '注册失败，请稍后重试';
      setError(errorMsg);
      logError('注册失败', err);
      console.error('注册错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              赛博朋克交易终端
            </h1>
            <p className="text-gray-400">创建您的账户</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                用户名
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
                placeholder="请输入用户名"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                邮箱
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
                placeholder="请输入邮箱"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                密码
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
                placeholder="请输入密码（至少6位）"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                确认密码
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all backdrop-blur-sm text-white"
                placeholder="请再次输入密码"
                required
                disabled={isLoading}
              />
            </div>

            {/* 初始资金由后端管理，不在注册页面设置 */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  注册中...
                </span>
              ) : (
                '注册'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/login')}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              已有账户？立即登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}