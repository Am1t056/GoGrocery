'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, XCircle, RefreshCcw, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const OrderCancelPage = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen h-full px-6 text-center overflow-hidden bg-[#fff5f5]">

      {/* ── Mesh background gradients ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#fecaca,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,#fca5a5,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,#fee2e2,transparent)]" />
      </div>

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #991b1b 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Top-left orb cluster ── */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, #f8717133, #dc262611)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-8 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, #fca5a522, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-20 left-36 w-2.5 h-2.5 rounded-full bg-red-400/60"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, delay: 0.8, repeat: Infinity }}
          className="absolute top-10 left-52 w-2 h-2 rounded-full bg-rose-400/50"
        />
      </div>

      {/* ── Bottom-right orb cluster ── */}
      <div className="absolute bottom-0 right-0 w-[460px] h-[460px] pointer-events-none">
        {/* Expanding rings */}
        {[{ inset: '80px', delay: 0 }, { inset: '30px', delay: 1.3 }, { inset: '130px', delay: 0.7 }].map((r, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 4, delay: r.delay, repeat: Infinity, ease: 'easeOut' }}
            className="absolute rounded-full border border-red-400/20"
            style={{ inset: r.inset }}
          />
        ))}
        {/* Main orb */}
        <motion.div
          animate={{ scale: [1, 1.07, 1], x: [0, -12, 0], y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, #f8717140, #dc262628, #99182610)' }}
        />
        {/* Mid orb */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-28 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, #fca5a535, #ef444420)' }}
        />
        {/* Small orb */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, 12, 0] }}
          transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 right-4 w-36 h-36 rounded-full"
          style={{ background: 'radial-gradient(circle at 45% 45%, #fecaca45, #f8717120)' }}
        />
        {/* Spinning gem orb */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.15, 1] }}
          transition={{
            rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute bottom-36 right-44 w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, #fee2e2aa, #fca5a566, #ef444444)' }}
        />
        {/* Floating tiny orb */}
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-20 w-12 h-12 rounded-full"
          style={{ background: 'radial-gradient(circle, #fca5a5bb, #f8717144)' }}
        />
        {/* Accent dots */}
        {[
          { style: { top: '16px', right: '90px' }, size: 12, delay: 0, color: '#f87171' },
          { style: { top: '72px', right: '36px' }, size: 8, delay: 0.5, color: '#fca5a5' },
          { style: { bottom: '90px', right: '160px' }, size: 14, delay: 1, color: '#fecaca' },
          { style: { bottom: '172px', right: '64px' }, size: 7, delay: 0.3, color: '#fb7185' },
          { style: { bottom: '260px', right: '110px' }, size: 10, delay: 1.4, color: '#fda4af' },
        ].map((dot, i) => (
          <motion.div
            key={i}
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.8, delay: dot.delay, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              width: dot.size,
              height: dot.size,
              borderRadius: '50%',
              background: dot.color,
              ...dot.style,
            }}
          />
        ))}
      </div>

      {/* ── Scattered sparkle dots ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.15, 0.5, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        {[
          { top: '15%', left: '8%', color: 'bg-red-400', anim: 'animate-bounce' },
          { top: '28%', left: '22%', color: 'bg-rose-300', anim: 'animate-pulse' },
          { top: '12%', left: '45%', color: 'bg-orange-300', anim: 'animate-bounce' },
          { top: '35%', left: '75%', color: 'bg-pink-400', anim: 'animate-pulse' },
          { top: '18%', left: '88%', color: 'bg-red-300', anim: 'animate-bounce' },
          { top: '55%', left: '5%', color: 'bg-rose-400', anim: 'animate-pulse' },
          { top: '62%', left: '90%', color: 'bg-pink-300', anim: 'animate-bounce' },
        ].map((p, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${p.color} ${p.anim}`}
            style={{ top: p.top, left: p.left }}
          />
        ))}
      </motion.div>

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center">

        {/* X icon with rings */}
        <motion.div
          initial={{ scale: 0, rotate: 360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 90 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-red-400 blur-2xl"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-dashed border-red-300/50"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-red-200/25"
            style={{ borderStyle: 'dotted' }}
          />
          <div
            className="relative rounded-full p-4 border border-red-100"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 48px #f8717144, 0 4px 24px #dc262622',
            }}
          >
            <XCircle className="size-16 text-red-500 md:size-20" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-5 flex items-center gap-1.5 bg-red-100/80 border border-red-200/70 text-red-700 text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-widest uppercase"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          Order Cancelled
        </motion.div>

        {/* Gradient heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold mt-3 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #991b1b 0%, #dc2626 45%, #e11d48 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Order Cancelled
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="text-gray-500 mt-3 text-sm md:text-base max-w-sm leading-relaxed"
        >
          We're sorry your order didn't go through. Any amount charged
          will be{' '}
          <span className="font-semibold text-red-600">refunded within 5–7 business days.</span>
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-7 w-28 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #f87171, transparent)' }}
        />

        {/* Floating sad package with glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ opacity: { duration: 0.4, delay: 0.85 }, scale: { duration: 0.4, delay: 0.85 } }}
          className="mt-8 relative"
        >
          {/* Subtle shake loop */}
          <motion.div
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          >
            {/* Shadow */}
            <motion.div
              animate={{ scaleX: [1, 0.85, 1], opacity: [0.2, 0.08, 0.2] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full blur-sm"
              style={{ background: '#f87171' }}
            />
            <div
              className="relative rounded-2xl p-5 border border-red-100/80"
              style={{
                background: 'rgba(255,255,255,0.65)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px #f8717120, 0 2px 8px #dc262618',
              }}
            >
              <ShoppingBag className="text-red-400 size-12 md:size-14" strokeWidth={1.5} />
            </div>
          </motion.div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-3"
        >
          {/* Primary — Try Again */}
          <Link href="/shop">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-2.5 text-white text-sm font-semibold px-8 py-3.5 rounded-full cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 55%, #881337 100%)',
                boxShadow: '0 6px 28px #f8717150, inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              <motion.span
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
              >
                <RefreshCcw className="size-4" />
              </motion.span>
              Try Again
            </motion.div>
          </Link>

          {/* Secondary — Back to Shop */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-2.5 text-red-700 text-sm font-semibold px-8 py-3.5 rounded-full cursor-pointer transition-all border border-red-200/80"
              style={{
                background: 'rgba(255,255,255,0.7)',
                backdropFilter: 'blur(8px)',
                boxShadow: '0 2px 12px #f8717118',
              }}
            >
              <ArrowLeft className="size-4" />
              Back to Shop
            </motion.div>
          </Link>
        </motion.div>

        {/* Help link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-4 mb-2"
        >
          <Link href="/support">
            <span className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer underline underline-offset-4 decoration-red-200">
              Need help? Contact Support
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderCancelPage;