'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTradingStore } from '@/store/trading-store';
import { logAccount, logError } from '@/lib/logger';
import pb from '@/lib/pocketbase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAccount } = useTradingStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 使用PocketBase进行认证
      const authData = await pb.collection('users').authWithPassword(email, password);
      
      // 设置账户信息
      setAccount({
        id: authData.record.id,
        username: authData.record.username,
        email: authData.record.email,
        funds: authData.record.funds || 100000
      });
      
      // 记录登录日志
      logAccount('用户登录', { userId: authData.record.id, email: authData.record.email });
      
      // 跳转到主页
      router.push('/');
    } catch (err: any) {
      const errorMsg = err.message || '登录失败，请检查邮箱和密码';
      setError(errorMsg);
      logError('登录失败', err);
      console.error('登录错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              聚财众发A港通交易终端
            </h1>
            <p className="text-gray-400">登录聚财众发A港通交易终端账户</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="请输入密码"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleRegisterRedirect}
              className="text-cyan-400 hover:text-cyan-300 text-sm transition-colors"
            >
              还没有账户？立即注册
            </button>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={() => router.push('/forgot-password')}
              className="text-gray-400 hover:text-gray-300 text-sm transition-colors"
            >
              忘记密码？
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            <span>隐私政策</span>
            <span className="mx-2">|</span>
            <span>用户声明</span>
            <div className="mt-1">
              © {new Date().getFullYear()} 武汉聚财众发私募管理有限公司
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}