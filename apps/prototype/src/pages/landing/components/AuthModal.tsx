import { useState, useCallback } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  defaultMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, onSuccess, defaultMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    setCompanyName('');
    setError('');
    setIsLoading(false);
  }, []);

  const handleSwitchMode = useCallback((newMode: 'login' | 'register') => {
    setMode(newMode);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('请输入邮箱地址');
      return;
    }
    if (!password.trim()) {
      setError('请输入密码');
      return;
    }
    if (mode === 'register' && !companyName.trim()) {
      setError('请输入公司名称');
      return;
    }

    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Simulate auth success - store in localStorage
      localStorage.setItem('growthos_auth_user', JSON.stringify({
        email: email.trim(),
        companyName: mode === 'register' ? companyName.trim() : undefined,
        loggedInAt: new Date().toISOString(),
      }));
      localStorage.setItem('growthos_auth_token', 'mock-jwt-token-' + Date.now());

      setIsLoading(false);
      resetForm();
      onSuccess();
    }, 1200);
  }, [email, password, companyName, mode, resetForm, onSuccess]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.06] bg-[#0d0d12] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-500/15 text-primary-400">
                <i className="ri-hexagon-line text-base"></i>
              </span>
              <span className="text-sm font-bold text-white tracking-wider">GrowthOS</span>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.04] transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            {mode === 'login' ? '欢迎回来' : '创建账号'}
          </h3>
          <p className="text-sm text-foreground-500">
            {mode === 'login'
              ? '登录你的 GrowthOS 工作区'
              : '注册后开启你的出海增长之旅'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs text-foreground-400 mb-1.5">公司名称</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="输入你的公司或品牌名称"
                className="w-full px-3.5 py-2.5 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/40 focus:bg-white/[0.05] transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-foreground-400 mb-1.5">工作邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full px-3.5 py-2.5 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/40 focus:bg-white/[0.05] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-foreground-400 mb-1.5">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'login' ? '输入密码' : '设置密码（至少 8 位）'}
              className="w-full px-3.5 py-2.5 text-sm text-white bg-white/[0.03] border border-white/[0.08] rounded-lg placeholder:text-foreground-600 focus:outline-none focus:border-primary-500/40 focus:bg-white/[0.05] transition-colors"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/15 rounded-lg px-3 py-2">
              <i className="ri-error-warning-line"></i>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 text-sm font-medium text-neutral-950 bg-primary-500 rounded-lg hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <>
                <i className="ri-loader-4-line animate-spin text-base"></i>
                {mode === 'login' ? '登录中...' : '创建中...'}
              </>
            ) : (
              <>
                <i className={mode === 'login' ? 'ri-login-box-line text-base' : 'ri-user-add-line text-base'}></i>
                {mode === 'login' ? '登录' : '创建账号'}
              </>
            )}
          </button>

          {/* Switch mode */}
          <div className="text-center pt-1">
            <span className="text-xs text-foreground-500">
              {mode === 'login' ? '还没有账号？' : '已有账号？'}
            </span>
            <button
              type="button"
              onClick={() => handleSwitchMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-primary-400 hover:text-primary-300 ml-1 transition-colors cursor-pointer"
            >
              {mode === 'login' ? '立即注册' : '直接登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}