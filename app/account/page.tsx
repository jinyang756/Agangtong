'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTradingStore } from '@/store/trading-store';
import pb from '@/lib/pocketbase';

export default function AccountPage() {
  const { account, setAccount, logout } = useTradingStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  // 检查是否已登录
  useEffect(() => {
    if (!account) {
      router.push('/login');
      return;
    }
    
    // 获取用户详细信息
    fetchUserData();
  }, [account, router]);

  const fetchUserData = async () => {
    if (!pb.authStore.isValid || !pb.authStore.model?.id) {
      router.push('/login');
      return;
    }
    
    try {
      const record = await pb.collection('users').getOne(pb.authStore.model.id);
      setUserData(record);
    } catch (err) {
      console.error('获取用户信息失败:', err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
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
    
    if (!pb.authStore.model?.id) {
      setError('用户未登录');
      return;
    }
    
    setIsChangingPassword(true);
    setError('');
    setSuccess('');
    
    try {
      // 使用PocketBase更新密码
      await pb.collection('users').update(pb.authStore.model.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: newPassword
      });
      
      setSuccess('密码修改成功');
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '密码修改失败，请稍后重试');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = () => {
    // 使用PocketBase登出
    pb.authStore.clear();
    logout();
    router.push('/login');
  };

  if (!account) {
    return null; // 等待重定向到登录页
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8 shadow-2xl shadow-cyan-500/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
              账户管理
            </h1>
            <p className="text-gray-400">管理您的账户信息</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 用户信息 */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">账户信息</h2>
              <div className="space-y-4">
                {userData && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">用户名</label>
                      <div className="text-white">{userData.username}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">邮箱</label>
                      <div className="text-white">{userData.email}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">账户资金</label>
                      <div className="text-2xl font-bold text-cyan-400">¥{userData.funds?.toFixed(2)}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">注册时间</label>
                      <div className="text-white">
                        {new Date(userData.created).toLocaleString('zh-CN')}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 修改密码 */}
            <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-500/20">
              <h2 className="text-xl font-semibold text-white mb-4">修改密码</h2>
              
              {success && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500/50 rounded-lg text-green-300 text-sm">
                  {success}
                </div>
              )}
              
              {error && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-300 text-sm">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    当前密码
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                    placeholder="请输入当前密码"
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    新密码
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                    placeholder="请输入新密码（至少6位）"
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    确认新密码
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-cyan-500/30 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-white"
                    placeholder="请再次输入新密码"
                    required
                    disabled={isChangingPassword}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                >
                  {isChangingPassword ? (
                    <span className="flex items-center justify-center">
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                      修改中...
                    </span>
                  ) : (
                    '修改密码'
                  )}
                </button>
              </form>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all duration-200 text-white"
            >
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}