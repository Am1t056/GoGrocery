'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import AssignmentCard from './AssignmentCard';
import { getSocket } from '@/lib/socket';
import { IDeliveryAssignment } from '@/models/deliveryAssignment.model';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import LiveMap from '../common/LiveMap';
import DeliveryBoyChat from './DeliveryBoyChat';
import { CircleCheck, Loader } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export interface ILocation {
  latitude: number;
  longitude: number;
}

interface DeliveryBoyProps {
  todaysEarnings: number;
}

const DeliveryBoy = ({ todaysEarnings }: DeliveryBoyProps) => {
  const [assignments, setAssignments] = useState<IDeliveryAssignment[]>([]);
  const [activeAssignment, setActiveAssignment] = useState<any>(null);
  const [userAddressLocation, setUserAddressLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState('');
  const [optError, setOtpError] = useState('');
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const { userData } = useSelector((state: RootState) => state.user);

  const fetchAssignments = async () => {
    try {
      const result = await axios.get('/api/delivery/get-assignments');
      setAssignments(result.data.assignments);
    } catch (error) {
      console.log('Failed to fetchAssignments in deliveryBoy');
    }
  };

  useEffect(() => {
    const socket = getSocket();
    if (!userData?._id) return;
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        setDeliveryBoyLocation({
          latitude: lat,
          longitude: lon,
        });
        socket.emit('update-location', {
          userId: userData?._id,
          latitude: lat,
          longitude: lon,
        });
      },
      (err) => {
        console.log('Unable to watch geo location-', err);
      },
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [userData?._id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('new-assignment', (deliveryAssignment) => {
      setAssignments((prev) => [deliveryAssignment, ...prev]);
    });

    socket.on('update-deliveryBoy-location', ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });

    return () => {
      socket.off('new-assignment');
      socket.off('update-deliveryBoy-location');
    };
  }, []);

  const getAcceptedAssignment = async () => {
    try {
      const result = await axios(`/api/delivery/accepted-order`);
      // console.log(result.data, 'accepted');
      if (result.data.active) {
        setActiveAssignment(result.data.assignment);
        setUserAddressLocation({
          latitude: result.data.assignment.order.address.latitude,
          longitude: result.data.assignment.order.address.longitude,
        });
      }
    } catch (error) {
      console.log('Failed to get accepted assignment', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    getAcceptedAssignment();
  }, [userData]);

  const sendOtp = async () => {
    setSendOtpLoading(true);
    try {
      const result = await axios.post('/api/delivery/otp/send', {
        orderId: activeAssignment.order._id,
      });
      console.log(result.data);
      setShowOtpBox(true);
      setSendOtpLoading(false);
    } catch (error) {
      console.log('Failed to send otp from FE:', error);
      setSendOtpLoading(false);
    }
  };

  const verifyOtp = async () => {
    setVerifyOtpLoading(true);
    try {
      const result = await axios.post('/api/delivery/otp/verify', {
        orderId: activeAssignment.order._id,
        otp,
      });
      console.log(result.data);
      setActiveAssignment(null);
      setVerifyOtpLoading(false);
      await fetchAssignments();
      window.location.reload();
    } catch (error) {
      setOtpError('Otp verification error');
      console.log('Failed to verify otp from FE:', error);
      setVerifyOtpLoading(false);
    }
  };

  if (!activeAssignment && assignments.length === 0) {
    const todayEarning = [
      {
        name: 'Today',
        earning: todaysEarnings,
        deliveries: todaysEarnings / 40,
      },
    ];
    return (
      <div className="flex items-center justify-center min-h-screen h-full bg-linear-to-br from-white to-green-50 px-6 pt-10">
    <div className="max-w-md w-full text-center">
      <h2 className="text-2xl font-bold text-gray-800">
        No Active Deliveries 🚛
      </h2>
      <p className="text-gray-500 mb-5">
        Stay online to receive new orders
      </p>

      <div className="bg-white border rounded-xl shadow-xl p-6">
        <h2 className="font-medium text-green-600 mb-2">
          Today's Performance
        </h2>

        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={todayEarning}>
            <CartesianGrid strokeDasharray="5 5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend/>
            <Bar
              dataKey="earning" 
              fill="green" 
              radius={[8, 8, 0, 0]}
              barSize={60}
            />
            <Bar 
              dataKey="deliveries" 
              fill="#86sfa2" 
              radius={[8, 8, 0, 0]}
              barSize={60}
            />
          </BarChart>
        </ResponsiveContainer>

        <p className='mt-4 text-lg font-bold text-green-700'>
          Rs.{todaysEarnings || 0} Earned Today
        </p>
        <p className='text-sm text-gray-500'>
          {Math.floor(todaysEarnings / 40) || 0} Deliveries
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className='mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg cursor-pointer'
        >
          Refresh Earning
        </button>
      </div>
    </div>
  </div>
    );
  }

  if (activeAssignment && userAddressLocation) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 pt-[120px]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Active Delivery
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Order: #{activeAssignment.order._id}{' '}
          </p>

          <div className="rounded-xl border shadow-md overflow-hidden mb-6">
            <LiveMap
              userLocation={userAddressLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
          <DeliveryBoyChat
            orderId={activeAssignment.order._id}
            deliveryBoyId={userData?._id?.toString()!}
          />

          <div className="mt-6 bg-white rounded-xl border shadow p-6">
            {!activeAssignment.order.deliveryOtpVerification && !showOtpBox && (
              <button
                onClick={sendOtp}
                disabled={sendOtpLoading}
                className="w-full py-4 bg-green-600 text-white rounded-lg cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {sendOtpLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader className="size-4 text-white animate-spin" />{' '}
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    {' '}
                    Mark as Delivered{' '}
                    <CircleCheck className="size-4 text-white" />
                  </span>
                )}
              </button>
            )}

            {showOtpBox && (
              <div className="mt-4">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3 rounded-lg text-center shadow-md border border-gray-800"
                  placeholder="Enter Otp"
                  maxLength={4}
                />
                <button
                  onClick={verifyOtp}
                  disabled={verifyOtpLoading}
                  className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {verifyOtpLoading ? (
                    <span className="flex items-center gap-1">
                      <Loader className="size-4 text-white animate-spin" />{' '}
                      Verifying...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      {' '}
                      Verify Otp <CircleCheck className="size-4 text-white" />
                    </span>
                  )}
                </button>

                {optError && (
                  <div className="text-red-600 mt-2">{optError}</div>
                )}
              </div>
            )}

            {activeAssignment.order.deliveryOtpVerification && (
              <div className="text-green-700 text-center font-bold">
                Delivery Completed!
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 mt-30">Delivery Assignments</h2>
        {assignments?.map((a, index) => (
          <AssignmentCard
            key={index}
            data={a}
            fetchAssignments={fetchAssignments}
          />
        ))}
      </div>
    </div>
  );
};

export default DeliveryBoy;
