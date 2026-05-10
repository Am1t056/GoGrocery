"use client"

import AccessDeniedIcon from '@/assets/Assests';
import { Home } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';

const Unauthorized = () => {
    const router=useRouter()
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-linear-to-br from-green-300 via-green-500/40 to-green-500">
      <AccessDeniedIcon />
      <motion.h1
       initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}

       className="text-xl font-semibold text-red-500">Access Denied</motion.h1>
      <motion.button
      onClick={()=>router.push("/")}
        whileHover={{ scale: 1.09 }}
        whileTap={{ scale: 2 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.4 }}
        className="px-3 py-2 rounded-lg flex items-center gap-1 border-2 border-green-500 cursor-pointer text-[18px] text-green-500 hover:bg-white hover:text-gray-300 transition-colors"
      >
        Go to Home <Home className="size-5 text-green-500 " />
      </motion.button>
    </div>
  );
};

export default Unauthorized;
