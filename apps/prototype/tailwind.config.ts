import type { Config } from 'tailwindcss';

// 重建说明（2026-07-05）：原型自始依赖 Tailwind 工具类，但 tailwind.config 从未入库
// （content 为空时 Tailwind 不生成任何工具类，页面裸奔——dev 日志有 warn，CI 构建不校验视觉）。
// 本文件按 src/index.css 设计令牌 + 组件实际使用的 token 清单重建；
// ai-accent / accent-500 原始值不可考，按紫色体系取 AI 青色与品红强调（可再调）。
// 注意：cyan/fuchsia 等标准色阶被组件直接使用，只 extend 不覆盖。
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          300: '#a29bfe',
          400: '#8b7ff0',
          500: '#6c5ce7',
          600: '#5a4bd8',
        },
        deep: '#0c0a1a',
        success: '#00d4aa',
        warning: '#fbbf24',
        error: '#ff6b6b',
        info: '#60a5fa',
        'ai-accent': '#22d3ee',
        accent: { 500: '#d946ef' },
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out both',
        'slide-up': 'slide-up 0.45s ease-out both',
        'slide-in-right': 'slide-in-right 0.4s ease-out both',
        'scale-in': 'scale-in 0.3s ease-out both',
      },
    },
  },
  plugins: [],
} satisfies Config;
