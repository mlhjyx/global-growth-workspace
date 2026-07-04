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
        deep: {
          DEFAULT: '#0c0a1a',
          dark: '#0c0a1a', // Layout/goal 全屏底（index.css body 渐变起点，保持视觉一致）
          purple: '#1a103c', // --bg-purple
        },
        success: '#00d4aa',
        warning: '#fbbf24',
        error: '#ff6b6b',
        info: '#60a5fa',
        'ai-accent': '#22d3ee',
        accent: { 500: '#d946ef' },
        // 文字灰阶（紫调）：100 近白 → 900 近底色；次级文案的主要载体
        foreground: {
          100: '#f5f4fa',
          200: '#e2e0f0',
          300: '#c7c4dd',
          400: '#a5a1c2',
          500: '#8b87a8',
          600: '#6f6b8f',
          700: '#575376',
          800: '#403d5c',
          900: '#2b2945',
        },
        // 表面填充（玻璃面板层次）
        background: {
          50: 'rgba(255,255,255,0.03)',
          100: 'rgba(255,255,255,0.05)',
          200: 'rgba(255,255,255,0.08)',
        },
        'input-bg': 'rgba(255,255,255,0.04)',
        'input-border': 'rgba(255,255,255,0.10)',
        'data-highlight': '#38bdf8',
        'link-color': '#8b7ff0',
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
