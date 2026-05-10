'use client';

import { RootState } from '@/redux/store';
import {
  Boxes,
  ClipboardCheck,
  Cross,
  LogOut,
  Menu,
  Package,
  Plus,
  PlusCircle,
  Search,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';

interface IUser {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: 'user' | 'deliveryBoy' | 'admin';
  image?: string;
}

const Navbar = ({ user }: { user: IUser }) => {
  const [open, setOpen] = useState(false);
  const [searchBarOpen, setSearchBarOpen] = useState(false);
  // for admin sidebar open
  const [menuOpen, setMenuOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const router = useRouter();
  // redux
  const { cartData } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
    setMounted(true);
  }, []);
  // ref for clicking outside functionality in profile menu open
  const profileDropDownRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return router.push('/');
    router.push(`/?q=${encodeURIComponent(query)}`);
    setSearch('');
    setSearchBarOpen(false)
  };

  // for admin
  // it creates the sidebar over the layout without affecting others
  const sidebar = mounted
    ? createPortal(
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: -120,
                opacity: 0,
                transition: { type: 'tween', duration: 0.4, ease: 'easeIn' },
              }}
              transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              className="fixed md:hidden top-0 left-0 h-full min-h-screen overflow-y-auto scrollbar-hide w-[75%] sm:w-[60%] z-9999 bg-linear-to-b from-green-800/90 via-green-700/80 to-green-900/90 backdrop-blur-xl border-r border-green-400/20 shadow-[0_0_50px_-10px_rgba(0,255,100,0.3)] flex flex-col p-6 text-white"
            >
              <div className="flex items-center justify-between mb-2">
                <Link
                  className="text-white/90 font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
                  href={'/'}
                >
                  GroceryGo
                </Link>

                <button
                  onClick={() => setMenuOpen(false)}
                  className="cursor-pointer text-white/80 hover:text-red-400 text-2xl font-bold transition"
                >
                  <X />
                </button>
              </div>

              <div className="flex gap-3 items-center p-3 mt-3 rounded-xl bg-white/10 hover:bg-white/15 transition-all shadow-inner">
                <div className="size-12 relative overflow-hidden border-2 rounded-full border-green-400/60 shadow-lg">
                  {user.image ? (
                    <Image
                      src={user.image}
                      fill
                      alt="user"
                      className="object-cover rounded-full "
                    />
                  ) : (
                    <User />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {user.name}
                  </h2>
                  <p className="text-xs text-green-200 capitalize">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex flex-col font-medium mt-6 gap-3">
                <Link
                  href="/admin/add-grocery"
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
                >
                  <PlusCircle className="size-5" /> Add Grocery
                </Link>
                <Link
                  href={'/admin/view-grocery'}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
                >
                  <Boxes className="size-5" /> View Grocery
                </Link>
                <Link
                  href={'/admin/manage-orders'}
                  className="flex items-center gap-3 p-3 rounded-lg bg-white/10 hover:bg-white/20 hover:pl-4 transition-all"
                >
                  <ClipboardCheck className="size-5" /> Manage Orders
                </Link>
              </div>

              <div className="my-5 border-t border-white/20" />

              <div
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 text-red-300 font-semibold mt-auto hover:bg-red-500/20 p-3 rounded-lg transition-all"
              >
                <LogOut className="size-5 text-red-300" /> Logout
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )
    : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        profileDropDownRef.current &&
        !profileDropDownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className="w-[95%] fixed top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-green-500 to-green-700 rounded-2xl shadow-lg shadow-black/30 flex justify-between items-center h-20 px-4 md:px-8 z-50 ">
      <Link
        className="text-white font-extrabold text-2xl sm:text-3xl tracking-wide hover:scale-105 transition-transform"
        href={'/'}
      >
        GroceryGo
      </Link>

      {user.role === 'user' && (
        <form
          onSubmit={handleSubmit}
          className="hidden md:flex items-center bg-white rounded-full px-4 py-2 w-1/2 max-w-lg shadow-md"
        >
          <Search className="text-gray-500 size-5 mr-2" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search groceries..."
            className="w-full outline-none text-gray-700 placeholder-gray-400"
          />
        </form>
      )}

      <div className="flex items-center gap-3 md:gap-6 relative">
        {user.role === 'user' && (
          <>
            <div
              className="bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition md:hidden cursor-pointer"
              onClick={() => setSearchBarOpen((prev) => !prev)}
            >
              <Search className="text-green-600 size-6" />
            </div>
            <Link
              href="/user/cart"
              className="relative bg-white rounded-full w-11 h-11 flex items-center justify-center shadow-md hover:scale-105 transition cursor-pointer"
            >
              <ShoppingCart className="text-green-600 size-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs size-5 flex items-center justify-center rounded-full font-semibold shadow">
                {cartData?.length || '0'}
              </span>
            </Link>
          </>
        )}

        {user.role === 'admin' && (
          <>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href={'/admin/add-grocery'}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <PlusCircle className="size-5" /> Add Grocery
              </Link>
              <Link
                href={'/admin/view-grocery'}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <Boxes className="size-5" /> View Grocery
              </Link>
              <Link
                href={'/admin/manage-orders'}
                className="flex items-center gap-2 bg-white text-green-700 font-semibold px-4 py-2 rounded-full hover:bg-green-100 transition-all"
              >
                <ClipboardCheck className="size-5" /> Manage Orders
              </Link>
            </div>

            <div
              onClick={() => setMenuOpen((prev) => !prev)}
              className="md:hidden bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md cursor-pointer"
            >
              <Menu className="size-6 text-green-600" />
            </div>
          </>
        )}

        <div className="relative">
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="bg-white rounded-full w-11 h-11 flex items-center justify-center overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
          >
            {user.image ? (
              <Image
                src={user.image}
                fill
                alt="user"
                className="object-cover rounded-full "
              />
            ) : (
              <User />
            )}
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 p-3 z-999"
                ref={profileDropDownRef}
              >
                <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center overflow-hidden relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        fill
                        alt="user"
                        className="object-cover rounded-full "
                      />
                    ) : (
                      <User />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-800 font-semibold">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {user.role}
                    </div>
                  </div>
                </div>

                {user.role === 'user' && (
                  <Link
                    href={'/user/my-orders'}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-3 hover:bg-green-50 rounded-lg text-gray-700 font-medium"
                  >
                    <Package className="size-5 text-green-500" />
                    My Orders
                  </Link>
                )}

                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="flex items-center gap-2 w-full text-left px-3 py-3 hover:bg-red-50 rounded-lg text-gray-700 font-medium cursor-pointer"
                >
                  <LogOut className="size-5 text-red-600" />
                  Log Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {searchBarOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-lg z-40 flex items-center px-4 py-2"
              >
                <Search className="text-gray-500 size-5 mr-2" />
                <form onSubmit={handleSubmit} className="grow">
                  <input
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                    type="text"
                    className="w-full outline-none text-gray-700"
                    placeholder="Search groceries..."
                  />
                </form>

                <button onClick={() => setSearchBarOpen(false)}>
                  <X className="text-gray-500 size-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {sidebar}
    </div>
  );
};

export default Navbar;
