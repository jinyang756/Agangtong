'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 在实际应用中，这里会调用后端API发送重置密码邮件
    // 目前我们直接模拟发送成功
    
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              赛博朋克交易终端
            </h1>
            <p className="text-gray-400">
              {isSubmitted ? '重置密码邮件已发送' : '重置您的密码'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {isSubmitted ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-gray-300 mb-6">
                我们已向您的邮箱发送了重置密码的链接，请检查您的收件箱。
              </p>
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                返回登录
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  注册邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                  placeholder="输入您的注册邮箱"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  我们将向您的邮箱发送重置密码的链接
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 py-3 rounded-lg text-white font-medium hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    发送中...
                  </span>
                ) : (
                  '发送重置链接'
                )}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => router.push('/login')}
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              返回登录页面
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}