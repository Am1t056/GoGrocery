"use client";

import { motion } from "framer-motion";

export default function AccessDeniedIcon() {
  return (
    <motion.svg
      width="120"
      height="120"
      viewBox="0 0 24 24"
      fill="none"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Circle */}
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke="#ef4444"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* X mark */}
      <motion.path
        d="M8 8L16 16"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      />

      <motion.path
        d="M16 8L8 16"
        stroke="#ef4444"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.9, duration: 0.3 }}
      />
    </motion.svg>
  );
}