'use client';

import {
  EyeIcon,
  EyeOff,
  Leaf,
  Loader,
  Lock,
  LogIn,
  Mail,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import googleImage from '@/assets/google.png';
import Image from 'next/image';
import { signIn, useSession } from 'next-auth/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isFormValid = email !== '' && password !== '';

  const session = useSession();

  console.log(session, 'session');

  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // 👈 prevent auto-redirect so you can handle it
    });

    if (result?.ok) {
      router.push('/'); // 👈 now this will actually run
    } else {
      console.log('Login failed:', result?.error);
      // show error to user
    }
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative">
      <motion.h1
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-700 mb-2"
      >
        Welcome Back
      </motion.h1>
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="text-gray-600 mb-8 flex items-center"
      >
        Login to GroceryGo <Leaf className="size-5 text-green-600" />
      </motion.p>

      <motion.form
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-5 max-w-sm w-full"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="email"
            placeholder="Your email"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="******"
            className="w-full border border-gray-300 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2 focus:ring-green-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {showPassword ? (
            <EyeOff
              onClick={() => setShowPassword(false)}
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer"
            />
          ) : (
            <EyeIcon
              onClick={() => setShowPassword(true)}
              className="absolute right-3 top-3.5 w-5 h-5 text-gray-400 cursor-pointer"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || loading}
          className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md inline-flex items-center justify-center gap-2 cursor-pointer ${isFormValid ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {loading ? <Loader className="size-5 animate-spin" /> : 'Login'}
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
          <span className="flex-1 h-px bg-gray-200 "></span>
          OR
          <span className="flex-1 h-px bg-gray-200"></span>
        </div>

        <button type="button" onClick={()=>signIn("google",{callbackUrl:"/"})} className="flex items-center justify-center gap-3 cursor-pointer w-full border border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium transition-all duration-200 ">
          <Image src={googleImage} width={20} height={20} alt="google" />
          Continue with Google
        </button>
      </motion.form>

      <p
        onClick={() => router.push('/register')}
        className="text-gray-600 cursor-pointer mt-6 text-sm flex items-center gap-1"
      >
        Don't have an account ? <LogIn className="" />
        <span className="text-green-600">Sign up</span>
      </p>
    </div>
  );
};

export default Login;
