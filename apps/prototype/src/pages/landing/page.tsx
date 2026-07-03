import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthModal from './components/AuthModal';

export default function LandingPage() {
  const navigate = useNavigate();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [hasCompletedGoal, setHasCompletedGoal] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('ggw_auth_token');
    const completed = localStorage.getItem('ggw_onboarding_completed');
    const goalDone = localStorage.getItem('ggw_goal_completed');
    setIsLoggedIn(!!auth);
    setHasCompletedOnboarding(!!completed);
    setHasCompletedGoal(!!goalDone);
  }, []);

  const openLogin = useCallback(() => {
    setAuthModalMode('login');
    setAuthModalOpen(true);
  }, []);

  const openRegister = useCallback(() => {
    setAuthModalMode('register');
    setAuthModalOpen(true);
  }, []);

  const handleAuthSuccess = useCallback(() => {
    setAuthModalOpen(false);
    setIsLoggedIn(true);
    // 新注册用户先走企业画像向导
    navigate('/onboarding');
  }, [navigate]);

  const handleGoToWorkspace = useCallback(() => {
    if (!isLoggedIn) {
      openLogin();
    } else if (hasCompletedOnboarding && hasCompletedGoal) {
      navigate('/dashboard');
    } else if (hasCompletedOnboarding) {
      navigate('/goal');
    } else {
      navigate('/onboarding');
    }
  }, [isLoggedIn, hasCompletedOnboarding, hasCompletedGoal, navigate, openLogin]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden" style={{ background: '#010102' }}>
      {/* ===== 弧形地平线光带 ===== */}

      {/* 深黑基底 */}
      <div className="absolute inset-0 z-0" style={{ background: '#010102' }} />

      {/* 弧顶大气散射底光 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 49% 40%, rgba(34,211,238,0.05) 0%, rgba(56,189,248,0.03) 35%, transparent 70%)',
          filter: 'blur(70px)',
        }}
      />

      {/* 弧形光带 - 宽雾光层 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 155% 118% at 49% 130%, transparent 70%, rgba(34,211,238,0.05) 75%, rgba(56,189,248,0.08) 78%, rgba(168,85,247,0.04) 81%, transparent 87%)',
          filter: 'blur(40px)',
          maskImage: 'linear-gradient(90deg, transparent 2%, #000 28%, #000 72%, transparent 98%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 2%, #000 28%, #000 72%, transparent 98%)',
          animation: 'horizonBreatheSlow 20s ease-in-out infinite',
        }}
      />

      {/* 弧形光带 - 中光带层 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 150% 116% at 49% 130%, transparent 75%, rgba(34,211,238,0.12) 77.4%, rgba(103,232,249,0.26) 78.2%, rgba(168,85,247,0.12) 79%, transparent 82%)',
          filter: 'blur(8px)',
          maskImage: 'linear-gradient(90deg, transparent 8%, #000 34%, #000 66%, transparent 92%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 8%, #000 34%, #000 66%, transparent 92%)',
          animation: 'horizonBreatheSlow 20s ease-in-out infinite 1s',
        }}
      />

      {/* 弧形光带 - 核心锐线 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 148% 115% at 49% 130%, transparent 77.3%, rgba(34,211,238,0.50) 77.9%, rgba(190,242,255,0.88) 78.15%, rgba(168,85,247,0.45) 78.4%, transparent 79%)',
          filter: 'blur(1px)',
          maskImage: 'linear-gradient(90deg, transparent 15%, #000 40%, #000 60%, transparent 85%)',
          WebkitMaskImage:
            'linear-gradient(90deg, transparent 15%, #000 40%, #000 60%, transparent 85%)',
          animation: 'horizonBreatheSlow 20s ease-in-out infinite 0.5s',
        }}
      />

      {/* 制高点高光 */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 26% 14% at 49% 40%, rgba(190,242,255,0.28) 0%, rgba(103,232,249,0.10) 45%, transparent 72%)',
          filter: 'blur(14px)',
          animation: 'horizonBreatheSlow 20s ease-in-out infinite 0.5s',
        }}
      />

      {/* Top navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-10 py-5">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-500/15 text-cyan-400">
            <i className="ri-hexagon-line text-lg"></i>
          </span>
          <span
            className="text-lg text-white"
            style={{
              fontFamily: '"Clash Display", Outfit, sans-serif',
              fontWeight: 600,
              letterSpacing: '-0.005em',
            }}
          >
            Growth
            <span className="text-cyan-300" style={{ fontWeight: 500 }}>
              OS
            </span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleGoToWorkspace}
            className="hidden sm:inline-flex text-sm text-white/40 hover:text-white/80 transition-colors duration-300 cursor-pointer"
          >
            进入工作台
          </button>
          <button
            onClick={openLogin}
            className="px-4 py-2 text-sm font-medium text-white/70 border border-white/8 rounded-lg hover:border-cyan-500/30 hover:text-white hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer"
          >
            登录
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main
        className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        {/* Brand name */}
        <h1
          className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-white mb-6 select-none"
          style={{
            fontFamily: '"Clash Display", Outfit, "Noto Sans SC", sans-serif',
            fontWeight: 600,
            textShadow: '0 0 40px rgba(34,211,238,0.18), 0 0 90px rgba(34,211,238,0.06)',
            letterSpacing: '-0.02em',
          }}
        >
          Growth
          <span className="text-cyan-300" style={{ fontWeight: 500 }}>
            OS
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg md:text-xl text-cyan-100/90 font-light tracking-[0.42em] uppercase mb-9 pl-[0.42em]"
          style={{
            fontFamily: '"Noto Sans SC", Sora, sans-serif',
            textShadow:
              '0 0 20px rgba(34,211,238,0.35), 0 0 50px rgba(34,211,238,0.15), 0 0 100px rgba(34,211,238,0.06)',
          }}
        >
          AI 原生增长引擎
        </p>

        {/* Description */}
        <p
          className="text-white/35 text-sm sm:text-base max-w-xl mb-14 leading-loose"
          style={{
            fontFamily: '"Noto Sans SC", Sora, sans-serif',
            fontWeight: 300,
            letterSpacing: '0.03em',
          }}
        >
          面向中国出海企业的智能增长工作台
          <br />
          赋能海外市场研究、获客、内容、运营、销售协同与数据学习全链路增长
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={openRegister}
            className="group relative w-44 px-5 py-2.5 text-sm font-medium tracking-wide text-neutral-950 bg-cyan-300 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-[0_0_32px_rgba(103,232,249,0.35)] hover:scale-[1.02] cursor-pointer"
          >
            <span className="relative z-10">免费体验</span>
            <div className="absolute inset-0 bg-white/25 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>

          <button
            onClick={openRegister}
            className="w-44 px-5 py-2.5 text-sm font-normal tracking-wide text-white/85 border border-fuchsia-400/25 rounded-lg hover:border-fuchsia-300/45 hover:text-white hover:bg-fuchsia-400/5 transition-all duration-300 cursor-pointer"
          >
            注册账号
          </button>

          <button
            onClick={openLogin}
            className="w-44 px-5 py-2 text-sm font-light tracking-wide text-cyan-400/55 hover:text-cyan-300/85 transition-colors duration-300 cursor-pointer"
          >
            登录
          </button>
        </div>

        {/* Bottom stats */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-5 text-white/20 text-xs font-mono tracking-[0.15em]">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center text-cyan-500/30">
              <i className="ri-cpu-line text-sm"></i>
            </span>
            SYS.READY
          </span>
          <span className="w-1 h-1 rounded-full bg-cyan-500/25"></span>
          <span>12,847 NODES</span>
          <span className="w-1 h-1 rounded-full bg-cyan-500/25"></span>
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 flex items-center justify-center text-cyan-500/30">
              <i className="ri-global-line text-sm"></i>
            </span>
            GLOBAL.NET
          </span>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        defaultMode={authModalMode}
      />
    </div>
  );
}
