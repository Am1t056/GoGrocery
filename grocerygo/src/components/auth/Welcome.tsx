'use client';

import React from 'react';
import { easeIn, motion } from 'motion/react';
import { ArrowRight, Bike, ShoppingBasket } from 'lucide-react';

interface WelcomePageProps {
  nextStep: (value: number) => void;
}

const Welcome:React.FC<WelcomePageProps> = ({nextStep}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6 bg-linear-to-b from-green-100 to-white">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ShoppingBasket className="w-10 h-10 text-emerald-600" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-700">
          GroceryGo
        </h1>
      </motion.div>
      <motion.p
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        Your one-stop destination for fresh groceries, organic products, and
        daily essentials delivered right to your doorstep.
      </motion.p>

      <motion.div
        className="flex items-center justify-center mt-6  gap-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <ShoppingBasket className="w-24 h-24 md:w-32 md:h-32 text-emerald-600 drop-shadow-md" />
        <Bike className="w-24 h-24 md:w-32 md:h-32 text-orange-600 drop-shadow-md" />
      </motion.div>

      <motion.button
        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-md shadow-md transition-all duration-200 cursor-pointer mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: easeIn }}
        onClick={()=>nextStep(2)}
      >
        Next <ArrowRight />
      </motion.button>
    </div>
  );
};

export default Welcome;
