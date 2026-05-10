'use client';

import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminOrderCard, { IOrder } from './AdminOrderCard';
import { getSocket } from '@/lib/socket';

const ManageOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<IOrder[]>([]);
  useEffect(() => {
    const getAllOrders = async () => {
      try {
        const result = await axios.get('/api/admin/get-orders');
        setOrders(result.data.orders);
      } catch (error) {
        console.log(error || 'Failed to fetch all orders in admin');
      }
    };
    getAllOrders();
  }, []);

  useEffect(() => {
    const socket = getSocket();
    socket.on('new-order', (newOrder) => {
      setOrders((prev) => [newOrder, ...prev]);
    });

     socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
     setOrders((prev)=>prev?.map((o)=>(
        o._id === orderId ? {...o,assignedDeliveryBoy}:o
     ) ))
    })

    return () => {
      socket.off('new-order');
      socket.off('order-assigned')
    };
  }, []);

  // console.log(orders);
  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="fixed top-0 left-0 w-full backdrop-blur-lg bg-white/70 shadow-md  z-50">
        <div className="max-w-3xl mx-auto flex items-center gap-4 px-4 py-3">
          <button
            onClick={() => router.push('/')}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition cursor-pointer"
          >
            <ArrowLeft className="size-6 text-green-600" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Manage Orders</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8">
        <div className="space-y-6">
          {orders.map((order, index) => (
            <AdminOrderCard key={index} order={order} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageOrdersPage;
