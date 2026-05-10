'use client';


import axios from 'axios';
import { ArrowLeft, PackageSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import OrderCard from './OrderCard';
import { getSocket } from '@/lib/socket';
import { IOrder } from '../admin/AdminOrderCard';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<IOrder[]>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const getMyOrders = async () => {
      setLoading(true);
      try {
        const result = await axios.get('/api/user/my-orders');
        setOrders(result.data.orders);
      } catch (error) {
        console.log(error || 'Failed to fetch my orders');
      } finally {
        setLoading(false);
      }
    };
    getMyOrders();
  }, []);

  useEffect(()=>{
    const socket=getSocket()
    socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
     setOrders((prev)=>prev?.map((o)=>(
        o._id === orderId ? {...o,assignedDeliveryBoy}:o
     ) ))
    })

    return ()=>{
      socket.off("order-assigned")
    }

  },[])




  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen h-full text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-linear-to-b from-white to-gray-100 min-h-screen h-full w-full">
      <div className="max-w-3xl mx-auto px-4 pt-16 pb-10 relative">
        <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-md  z-50">
          <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
            <button
              onClick={() => router.push('/')}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer"
            >
              <ArrowLeft className="size-6 text-green-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
          </div>
        </div>

        {orders?.length === 0 ? (
          <div className="pt-20 flex flex-col items-center text-center">
            <PackageSearch className="size-17.5 text-green-700 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">
              No Orders Found
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start shopping to view your orders here.
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-6">
            {orders?.map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
