'use client';

import { RootState } from '@/redux/store';
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader,
  LocateFixed,
  MapPin,
  MapPinHouse,
  Phone,
  Pin,
  Truck,
  User,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MapView from '../common/MapView';
import axios from 'axios';

const CheckOutPage = () => {
  const router = useRouter();

  //=== redux start======
  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal, cartData } = useSelector(
    (state: RootState) => state.cart,
  );
  //=== redux end========

  const [address, setAddress] = useState({
    fullName: '',
    mobile: '',
    city: '',
    state: '',
    pincode: '',
    fullAddress: '',
  });
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    'cod' | 'online'
  >('cod');

  const handleSearch = async () => {
    setSearchLoading(true);
    const { OpenStreetMapProvider } = await import('leaflet-geosearch');
    const provider = new OpenStreetMapProvider();
    const results = await provider.search({ query: searchQuery });
    // console.log(results, 'search-value');
    // results[0].x => longitude
    // results[0].y => latitude

    if (results) {
      setPosition([results[0].y, results[0].x]);
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log('Cannot access location', err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({ ...prev, fullName: userData?.name || '' }));
      setAddress((prev) => ({ ...prev, mobile: userData?.mobile || '' }));
    }
  }, [userData]);

  // use open street maps reverse geocoding for state,pin,city
  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        );
        // console.log(result.data, 'open-street-data');
        setAddress((prev) => ({
          ...prev,
          city: result.data.address.county || result.data.address.city || '',
          state: result.data.address.state || '',
          pincode: result.data.address.postcode || '',
          fullAddress: result.data.display_name || '',
        }));
      } catch (error) {
        console.log(error);
      }
    };
    fetchAddress();
  }, [position]);

  console.log(position, 'position');

  const handleSetToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log('Cannot access location', err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  };

  const handleCodPayment = async () => {
    if (!position) return null;
    try {
      const result = await axios.post(`/api/user/order`, {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        paymentMethod: selectedPaymentMethod,
        address: {
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          mobile: address.mobile,
          latitude: position[0],
          longitude: position[1],
        },
      });

      console.log(result.data);

      router.push('/user/order-success');
    } catch (error) {
      console.log(error || 'Failed to POST order');
    }
  };

  const handleOnlinePayment = async () => {
    if (!position) return null;
    try {
      const result = await axios.post(`/api/user/online-payment`, {
        userId: userData?._id,
        items: cartData.map((item) => ({
          grocery: item._id,
          name: item.name,
          price: item.price,
          unit: item.unit,
          image: item.image,
          quantity: item.quantity,
        })),
        totalAmount: finalTotal,
        paymentMethod: selectedPaymentMethod,
        address: {
          fullName: address.fullName,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
          fullAddress: address.fullAddress,
          mobile: address.mobile,
          latitude: position[0],
          longitude: position[1],
        },
      });

      window.location.href = result.data.url;
    } catch (error) {
      console.log(error || 'Failed to POST order through online payment');
    }
  };
  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        // whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold cursor-pointer"
        onClick={() => router.push('/user/cart')}
      >
        <ArrowLeft className="size-4" />
        <span>Back to Cart</span>
      </motion.button>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 1ST DIV */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>

          <div className="space-y-4 ">
            <div className="relative">
              <User className="absolute left-3 top-3 text-green-600 size-4.5" />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-green-600 size-4.5" />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    mobile: e.target.value,
                  }))
                }
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="relative">
              <Home className="absolute left-3 top-3 text-green-600 size-4.5" />
              <input
                type="text"
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                placeholder="Enter your address"
                className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="relative">
                <Building className="absolute left-3 top-3 text-green-600 size-4.5" />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  placeholder="Enter city"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <MapPinHouse className="absolute left-3 top-3 text-green-600 size-4.5" />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  placeholder="Enter state"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>

              <div className="relative">
                <Pin className="absolute left-3 top-3 text-green-600 size-4.5" />
                <input
                  type="text"
                  value={address.pincode}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      pincode: e.target.value,
                    }))
                  }
                  placeholder="Enter pin code"
                  className="pl-10 w-full border rounded-lg p-3 text-sm bg-gray-50"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Search city or area..."
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 cursor-pointer transition-all font-medium disabled:cursor-not-allowed"
                disabled={searchLoading}
              >
                {searchLoading ? (
                  <Loader className="animate-spin size-4" />
                ) : (
                  'Search'
                )}
              </button>
            </div>

            <div className="mt-6 relative h-[330px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
              <MapView position={position} setPosition={setPosition} />

              {position && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  title="Original location"
                  className="absolute bottom-5 right-2 bg-green-600 cursor-pointer text-white shadow-2xl rounded-full p-3 hover:bg-green-700 transition-all flex items-center justify-center z-999"
                  onClick={handleSetToCurrentLocation}
                >
                  <LocateFixed size={22} className="text-white" />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 2ND DIV */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-600" /> Payment Method
          </h2>
          <div className="space-y-4 mb-6">
            <button
              onClick={() => setSelectedPaymentMethod('online')}
              className={`flex items-center gap-3 cursor-pointer w-full  rounded-lg p-3 transition-all ${selectedPaymentMethod === 'online' ? 'border-green-600 border-2 bg-green-50 shadow-sm' : 'hover:bg-gray-50 border'}`}
            >
              <CreditCardIcon className="text-green-600" />{' '}
              <span className=" font-medium text-gray-700">
                Pay Online (stripe)
              </span>
            </button>
            <button
              onClick={() => setSelectedPaymentMethod('cod')}
              className={`flex items-center gap-3 cursor-pointer w-full  rounded-lg p-3 transition-all ${selectedPaymentMethod === 'cod' ? 'border-green-600 border-2 bg-green-50 shadow-sm' : 'hover:bg-gray-50 border'}`}
            >
              <Truck className="text-green-600" />{' '}
              <span className=" font-medium text-gray-700">
                Cash On Delivery
              </span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className=" font-semibold">Subtotal</span>
              <span className=" font-semibold text-green-600">
                Rs.{subTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className=" font-semibold">Delivery Fee</span>
              <span className=" font-semibold text-green-600">
                Rs.{deliveryFee}
              </span>
            </div>
            <div className="flex justify-between font-bold border-t border-dashed pt-3">
              <span className="">Total</span>
              <span className=" text-green-600">Rs.{finalTotal}</span>
            </div>

            <motion.button
              whileTap={{ scale: 0.93 }}
              className="w-full mt-6 bg-green-600 text-white py-3 rounded-full cursor-pointer hover:bg-green-700 transition-all font-semibold"
              onClick={() => {
                if (selectedPaymentMethod === 'cod') {
                  handleCodPayment();
                } else {
                  handleOnlinePayment();
                }
              }}
            >
              {selectedPaymentMethod === 'cod'
                ? 'Place Order'
                : 'Pay & Place Order'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckOutPage;
