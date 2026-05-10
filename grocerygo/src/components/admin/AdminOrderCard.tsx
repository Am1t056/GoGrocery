'use client';

import {
  ChevronDown,
  ChevronUp,
  CreditCard,
  Home,
  Package,
  Phone,
  PhoneCall,
  PhoneCallIcon,
  Truck,
  User,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getStatusColor } from '../user/OrderCard';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { IUser } from '@/models/user.model';
import Link from 'next/link';
import { getSocket } from '@/lib/socket';
import { StringExpressionOperatorReturningArray } from 'mongoose';

export interface IOrder {
  _id?: string;
  user: string;
  items: [
    {
      grocery:string;
      name: string;
      price: string;
      unit: string;
      image: string;
      quantity: number;
    },
  ];
  totalAmount: number;
  paymentMethod: 'cod' | 'online';
  address: {
    fullName: string;
    city: string;
    state: string;
    pincode: string;
    fullAddress: string;
    mobile: string;
    latitude: number;
    longitude: number;
  };
  deliveryAssignment?: StringExpressionOperatorReturningArray;
  assignedDeliveryBoy?: IUser;
  status: 'pending' | 'out of delivery' | 'delivered';
  isPaid: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AdminOrderCardProps {
  order: IOrder;
}

const statusOptions = ['pending', 'out of delivery'];

const AdminOrderCard = ({ order }: AdminOrderCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<string>(order.status);

  const handleUpdateStatusChange = async (orderId: string, status: string) => {
    try {
      const result = await axios.post(
        `/api/admin/update-order-status/${orderId}`,
        { status },
      );
      console.log(result.data);
      setStatus(status);
    } catch (error) {
      console.log('Failed while updating status from frontend', error);
    }
  };

  useEffect(() => {
    setStatus(order.status);
  }, [order]);

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all"
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-1">
          <p className="text-lg font-bold flex items-center gap-2 text-green-700">
            <Package className="size-5" />
            Order #{order._id?.toString()}
          </p>
          {status !== 'delivered' && (
            <span
              className={`inline-block text-xs font-semibold px-3 py-1 rounded-full border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-300' : 'bg-red-100 text-red-700 border-red-300'}`}
            >
              {order.isPaid ? 'Paid' : 'Unpaid'}
            </span>
          )}

          <p className="text-gray-500 text-sm ">
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          <div className="mt-3 space-y-1 text-gray-700 text-sm">
            <p className="flex items-center gap-2 font-semibold">
              <User className="size-4 text-green-600" />{' '}
              <span>{order.address.fullName}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Phone className="size-4 text-green-600" />{' '}
              <span>{order.address.mobile}</span>
            </p>
            <p className="flex items-center gap-2 font-semibold">
              <Home className="size-4 text-green-600" />{' '}
              <span>{order.address.fullAddress}</span>
            </p>
            <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
              <CreditCard className="size-4 text-green-600" />{' '}
              <span>
                {order.paymentMethod === 'cod'
                  ? 'Cash On Delivery'
                  : 'Online Payment'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(status)}`}
          >
            {status}
          </span>
          {status !== 'delivered' && (
            <select
              value={status}
              onChange={(e) =>
                handleUpdateStatusChange(order._id?.toString()!, e.target.value)
              }
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm shadow-sm hover:border-green-400 transition focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
            >
              {statusOptions.map((status, index) => (
                <option key={index} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 pt-3 mt-5">
        <button
          className="w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition cursor-pointer"
          onClick={() => setExpanded((prev) => !prev)}
        >
          <span className="flex items-center gap-2">
            <Package className="size-4 text-green-600" />
            {expanded ? 'Hide Order Items' : `View ${order.items.length} items`}
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

      <div className="border-t pt-3 mt-5 flex justify-between items-center text-sm font-semibold text-gray-800">
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

      {order.assignedDeliveryBoy && (
        <>
          <hr className="my-5" />
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between shadow-md">
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
        </>
      )}
    </motion.div>
  );
};

export default AdminOrderCard;
