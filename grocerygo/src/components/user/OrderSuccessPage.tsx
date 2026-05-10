'use client';

import { useEffect, useState } from 'react';
import ReactConfetti from 'react-confetti';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';

const OrderSuccessPage = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen h-full px-6 text-center overflow-hidden bg-[#f0fdf4]">
      <ReactConfetti
        width={size.width}
        height={size.height}
        gravity={0.08}
        style={{ zIndex: 99 }}
        numberOfPieces={600}
        recycle={false}
        // colors={['#4ade80', '#22c55e', '#86efac', '#d9f99d', '#34d399', '#fde68a', '#fbcfe8']}
      />

      {/* ── Mesh background gradients ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#bbf7d0,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_100%,#a7f3d0,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_0%_80%,#d1fae5,transparent)]" />
      </div>

      {/* ── Subtle dot-grid texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: 'radial-gradient(circle, #166534 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Top-left orb cluster ── */}
      <div className="absolute top-0 left-0 w-80 h-80 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.12, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-20 w-72 h-72 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, #4ade8033, #16a34a11)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-8 left-8 w-32 h-32 rounded-full"
          style={{ background: 'radial-gradient(circle, #86efac22, transparent)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute top-20 left-36 w-2.5 h-2.5 rounded-full bg-green-400/60"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.9, 0.4] }}
          transition={{ duration: 2.5, delay: 0.8, repeat: Infinity }}
          className="absolute top-10 left-52 w-2 h-2 rounded-full bg-emerald-400/50"
        />
      </div>

      {/* ── Bottom-right orb cluster ── */}
      <div className="absolute bottom-0 right-0 w-[460px] h-[460px] pointer-events-none">
        {[{ inset: '80px', delay: 0 }, { inset: '30px', delay: 1.3 }, { inset: '130px', delay: 0.7 }].map((r, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.5, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            transition={{ duration: 4, delay: r.delay, repeat: Infinity, ease: 'easeOut' }}
            className="absolute rounded-full border border-green-400/20"
            style={{ inset: r.inset }}
          />
        ))}
        <motion.div
          animate={{ scale: [1, 1.07, 1], x: [0, -12, 0], y: [0, -8, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, #4ade8040, #16a34a28, #15803d10)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], x: [0, 10, 0], y: [0, -16, 0] }}
          transition={{ duration: 10, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-10 right-28 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle at 40% 40%, #86efac35, #22c55e20)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, 12, 0] }}
          transition={{ duration: 7, delay: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-24 right-4 w-36 h-36 rounded-full"
          style={{ background: 'radial-gradient(circle at 45% 45%, #bbf7d045, #4ade8020)' }}
        />
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.15, 1] }}
          transition={{
            rotate: { duration: 14, repeat: Infinity, ease: 'linear' },
            scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute bottom-36 right-44 w-20 h-20 rounded-full"
          style={{ background: 'radial-gradient(circle at 35% 35%, #d1fae5aa, #34d39966, #05966944)' }}
        />
        <motion.div
          animate={{ y: [0, -20, 0], scale: [1, 1.12, 1] }}
          transition={{ duration: 5, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-20 w-12 h-12 rounded-full"
          style={{ background: 'radial-gradient(circle, #a7f3d0bb, #6ee7b744)' }}
        />
        {[
          { style: { top: '16px', right: '90px' }, size: 12, delay: 0, color: '#4ade80' },
          { style: { top: '72px', right: '36px' }, size: 8, delay: 0.5, color: '#34d399' },
          { style: { bottom: '90px', right: '160px' }, size: 14, delay: 1, color: '#a7f3d0' },
          { style: { bottom: '172px', right: '64px' }, size: 7, delay: 0.3, color: '#6ee7b7' },
          { style: { bottom: '260px', right: '110px' }, size: 10, delay: 1.4, color: '#bbf7d0' },
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
          { top: '15%', left: '8%', color: 'bg-green-400', anim: 'animate-bounce' },
          { top: '28%', left: '22%', color: 'bg-emerald-300', anim: 'animate-pulse' },
          { top: '12%', left: '45%', color: 'bg-yellow-300', anim: 'animate-bounce' },
          { top: '35%', left: '75%', color: 'bg-teal-400', anim: 'animate-pulse' },
          { top: '18%', left: '88%', color: 'bg-green-300', anim: 'animate-bounce' },
          { top: '55%', left: '5%', color: 'bg-lime-400', anim: 'animate-pulse' },
          { top: '62%', left: '90%', color: 'bg-emerald-400', anim: 'animate-bounce' },
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

        {/* Check icon with rings */}
        <motion.div
          initial={{ scale: 0, rotate: -360 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 90 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.3, 0.12] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full bg-green-400 blur-2xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-3 rounded-full border border-dashed border-green-300/50"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            className="absolute -inset-6 rounded-full border border-green-200/25"
            style={{ borderStyle: 'dotted' }}
          />
          <div
            className="relative rounded-full p-4 border border-green-100"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 0 48px #4ade8044, 0 4px 24px #16a34a22',
            }}
          >
            <CheckCircle className="size-16 text-green-500 md:size-20" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Badge pill */}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-5 flex items-center gap-1.5 bg-green-100/80 border border-green-200/70 text-green-700 text-xs font-semibold px-3.5 py-1.5 rounded-full tracking-widest uppercase"
        >
          <Sparkles className="size-3" />
          Payment Confirmed
        </motion.div>

        {/* Gradient heading */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold mt-3 leading-tight"
          style={{
            background: 'linear-gradient(135deg, #15803d 0%, #16a34a 45%, #059669 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Order Placed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="text-gray-500 mt-3 text-sm md:text-base max-w-sm leading-relaxed"
        >
          Thank you for shopping with us! Your order is being processed.
          Track it anytime in your{' '}
          <span className="font-semibold text-green-600">My Orders</span> section.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-7 w-28 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #4ade80, transparent)' }}
        />

        {/* Floating package with glass card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 0.4, delay: 0.85 },
            scale: { duration: 0.4, delay: 0.85 },
            y: { duration: 2.8, delay: 0.85, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="mt-8 relative"
        >
          <motion.div
            animate={{ scaleX: [1, 0.7, 1], opacity: [0.25, 0.1, 0.25] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-14 h-2.5 rounded-full blur-sm"
            style={{ background: '#4ade80' }}
          />
          <div
            className="relative rounded-2xl p-5 border border-green-100/80"
            style={{
              background: 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 32px #4ade8020, 0 2px 8px #16a34a18',
            }}
          >
            <Package className="text-green-500 size-12 md:size-14" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="mt-10"
        >
          <Link href="/user/my-orders">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-2.5 text-white text-sm font-semibold px-9 py-3.5 rounded-full cursor-pointer transition-all"
              style={{
                background: 'linear-gradient(135deg, #16a34a 0%, #15803d 55%, #065f46 100%)',
                boxShadow: '0 6px 28px #4ade8050, inset 0 1px 0 rgba(255,255,255,0.15)',
              }}
            >
              View My Orders
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ArrowRight className="size-4" />
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>

        {/* Continue shopping */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="mt-4 mb-2"
        >
          <Link href="/">
            <span className="text-xs text-gray-400 hover:text-green-600 transition-colors cursor-pointer underline underline-offset-4 decoration-green-200">
              Continue Shopping
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;