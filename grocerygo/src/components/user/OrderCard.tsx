'use client';

import { getSocket } from '@/lib/socket';
import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  MapPin,
  Package,
  PhoneCall,
  PhoneCallIcon,
  Truck,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IOrder } from '../admin/AdminOrderCard';
import { useRouter } from 'next/navigation';

interface OrderCardProps {
  order: IOrder;
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'out of delivery':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'delivered':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300';
  }
};
const OrderCard = ({ order }: OrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const router = useRouter();

  useEffect(() => {
    const socket = getSocket();
    socket.on('order-status-update', (data) => {
      // console.log(data,"data-from-order-status-update-scoket-emit")
      if (data.orderId === order._id) {
        setStatus(data.status);
      }
    });

    return () => {
      socket.off('order-status-update');
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Order:{' '}
            <span className="text-green-700 font-bold">
              #{order?._id?.toString()}
            </span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
        </div>

        {status !== 'delivered' && (
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
            >
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
            <span
              className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(status)}`}
            >
              {status}
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        {order.paymentMethod === 'cod' ? (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck className="size-4 text-green-600" />
            Cash On Delivery
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <CreditCard className="size-4 text-green-600" />
            Online Payment
          </div>
        )}

        <div className="flex items-center gap-2 text-gray-700 text-sm">
          <MapPin className="size-4 text-green-600" />
          <span className="line-clamp-2">{order.address.fullAddress}</span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <button
            className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer"
            onClick={() => setExpanded((prev) => !prev)}
          >
            <span className="flex items-center gap-2">
              <Package className="size-4 text-green-600" />
              {expanded
                ? 'Hide Order Items'
                : `View ${order.items.length} items`}
            </span>

            {expanded ? (
              <ChevronUp className="size-4 text-green-600" />
            ) : (
              <ChevronDown className="size-4 text-green-600" />
            )}
          </button>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: expanded ? 'auto' : 0,
              opacity: expanded ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={100}
                      height={100}
                      className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.quantity} {item.unit}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-800">
                    Rs.{Number(item.price) * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Truck className="size-4 text-green-600" />
            <span className="flex items-center gap-2">
              Delivery:{' '}
              <span
                className={`${getStatusColor(status)} py-1 px-2 rounded-full shadow-md flex items-center justify-center font-semibold`}
              >
                {status}
              </span>
            </span>
          </div>

          <div>
            Total :{' '}
            <span className=" font-bold text-green-600">
              Rs.{order.totalAmount}
            </span>
          </div>
        </div>
      </div>

      {order.assignedDeliveryBoy && status !== 'delivered' && (
        <>
          <hr className="my-5 mx-4" />
          <div className=" bg-green-50 border rounded-xl border-green-200 m-3 p-4 flex items-center justify-between shadow-md">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <UserCheck className="text-green-600" size={18} />
                <div className=" font-semibold text-gray-800">
                  <p>
                    <span className="font-bold">Assigned To:</span>{' '}
                    <span>{order.assignedDeliveryBoy.name}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <PhoneCall className="text-green-600" size={18} />
                <div className=" font-semibold text-gray-800">
                  <p>
                    <span className="font-bold">Mobile:</span>{' '}
                    <Link href={`tel:${order.assignedDeliveryBoy.mobile}`}>
                      ( +977 ) {order.assignedDeliveryBoy.mobile}
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            <Link
              className="px-3 py-2 rounded-2xl bg-green-600 text-white text-sm flex items-center gap-1"
              href={`tel:${order.assignedDeliveryBoy.mobile} `}
            >
              <span>
                <PhoneCallIcon size={18} />
              </span>{' '}
              Call
            </Link>
          </div>

          <div className="px-4">
            <button
              onClick={() =>
                router.push(`/user/track-order/${order._id?.toString()}`)
              }
              className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold px-4 py-2 rounded-xl shadow hover:bg-green-700 transition mb-3 cursor-pointer"
            >
              <Truck className="size-4" /> Track your order
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default OrderCard;
