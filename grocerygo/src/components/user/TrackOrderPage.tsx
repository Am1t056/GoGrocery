'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { IOrder } from '../admin/AdminOrderCard';
import { ILocation } from '../deliveryBoy/DeliveryBoy';
import { ArrowLeft, Loader, Send, Sparkle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LiveMap from '../common/LiveMap';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSocket } from '@/lib/socket';
import { AnimatePresence,motion } from 'motion/react';
import { IMessage } from '@/models/message.model';

interface TrackOrderPageProps {
  orderId: string;
}

const TrackOrderPage = ({ orderId }: TrackOrderPageProps) => {

  const { userData } = useSelector((state: RootState) => state.user);
  const [order, setOrder] = useState<IOrder>();
  const [userAddressLocation, setUserAddressLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState<ILocation>({
    latitude: 0,
    longitude: 0,
  });

    const [newMessage, setNewMessage] = useState('');

    const [messages, setMessages] = useState<IMessage[]>([]);
     const [aiSuggestions,setAiSuggestions]=useState([])
      const [loading,setLoading]=useState(false)
    const chatBoxRef=useRef<HTMLDivElement>(null)
  const router = useRouter();
  const getOrderById = async () => {
    try {
      const result = await axios.get(`/api/user/get-order/${orderId}`);
      setOrder(result.data.order);
      setUserAddressLocation({
        latitude: result.data.order.address.latitude,
        longitude: result.data.order.address.longitude,
      });
      setDeliveryBoyLocation({
        latitude: result.data.order.assignedDeliveryBoy.location.coordinates[1],
        longitude:
          result.data.order.assignedDeliveryBoy.location.coordinates[0],
      });
    } catch (error) {
      console.log('Failed to fetch order by id in tracking order page', error);
    }
  };

  useEffect(() => {
    getOrderById();
  }, [userData?._id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('update-deliveryBoy-location', ({ userId, location }) => {
      setDeliveryBoyLocation({
        latitude: location.coordinates[1],
        longitude: location.coordinates[0],
      });
    });

    return () => {
      socket.off('update-deliveryBoy-location');
    };
  }, []);


    useEffect(() => {
      const socket = getSocket();
      socket.emit('join-room', orderId);

        socket.on('send-message', (message) => {
        if (message.roomId === orderId) {
          setMessages((prev) => [...prev, message]);
        }
      });

      return ()=>{
        socket.off("send-message")
      }
    }, []);
  
    const sendMessage = () => {
      const socket = getSocket();
      const message = {
        roomId: orderId,
        text: newMessage,
        senderId: userData?._id,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      socket.emit('send-message', message);
    
      setNewMessage('');
    };

      useEffect(()=>{
        chatBoxRef.current?.scrollTo({
          top:chatBoxRef.current.scrollHeight,
          behavior:"smooth"
        })
    
      },[messages])

      // fetch all the send messages from backend
  useEffect(() => {
    const getAllMessages = async () => {
      try {
        const result = await axios.post('/api/chat/get-room-message', {
          roomId: orderId,
        });
        // console.log(result.data.messages)
        setMessages(result.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getAllMessages();
  }, []);
  

  
  const getAiChatSuggestions = async () => {
    setLoading(true)
    try {
      const lastMessage = messages.filter((m)=> m.senderId.toString() !== userData?._id)?.at(-1);
      const result = await axios.post('/api/chat/ai-suggestions', {
        message: lastMessage?.text,
        role: 'user',
      });
      // console.log(result.data);
      setAiSuggestions(result.data);
      setLoading(false)
    } catch (error) {
      console.log("Failed to fetch ai chat suggestions",error)
      setLoading(false)
    }
  };




  // console.log(order, 'order');
  return (
    <div className="w-full min-h-screen bg-linear-to-b from-green-50 to-white">
      <div className="max-w-2xl mx-auto pb-24">
        <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-4 border-b shadow-md flex gap-3 items-center z-999">
          <button
            onClick={() => router.back()}
            className="p-2 bg-green-100 rounded-full"
          >
            <ArrowLeft className="text-green-700 size-5" />
          </button>
          <div>
            <h2 className="text-xl font-bold">Track Order</h2>
            <p className="text-sm text-gray-600 ">
              Order #{order?._id?.toString()}{' '}
              <span className={`text-green-600 font-semibold `}>
                {order?.status}
              </span>
            </p>
          </div>
        </div>

        <div className="px-4 mt-6">
          <div className="rounded-3xl overflow-hidden border shadow">
            <LiveMap
              userLocation={userAddressLocation}
              deliveryBoyLocation={deliveryBoyLocation}
            />
          </div>
        </div>


  <div className="bg-white rounded-3xl shadow-xl border p-4 h-107.5 flex flex-col my-5">

    
     <div className='flex justify-between items-center mb-3'>
      <span className=' font-semibold text-gray-700 text-sm'>Quick replies</span>
        <motion.button
          onClick={getAiChatSuggestions}
          disabled={loading}
          whileTap={{ scale: 0.9 }}
          className="px-3 py-1 text-xs flex items-center gap-1 bg-purple-100 text-purple-700 rounded-full shadow-sm border border-purple-200 cursor-pointer disabled:cursor-not-allowed"
        >
          {loading ? <span className='flex items-center gap-1'><Loader className='size-4 animate-spin'/> Loading...</span>: <span className='flex items-center gap-1'> <Sparkle size={14} /> Ai Suggest</span>}
        </motion.button>
     </div>
     <div className='flex gap-2 flex-wrap mb-3'>
      {aiSuggestions.map((suggestion,index)=>(
        <motion.div 
        key={index}
        whileTap={{scale: 0.92}}
        className='px-3 py-1 text-xs bg-green-50 border border-green-200 text-green-700 rounded-full cursor-pointer'
        onClick={()=>setNewMessage(suggestion)}
        >
            {suggestion}
        </motion.div>
      ))}

     </div>


      <div className="flex-1 overflow-y-auto p-2 space-y-3" ref={chatBoxRef}>
        <AnimatePresence>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.senderId.toString() === userData?._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`px-4 py-2 max-w-[75%] rounded-2xl shadow ${msg.senderId.toString() === userData?._id? 'bg-green-600 text-white rounded-br-none' : 'bg-gray-100 text-green-800 rounded-bl-none'}`}
              >
                <p>{msg.text}</p>
                <p className="text-[10px] opacity-70 mt-1 text-right">
                  {msg.time}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 mt-3 border-t pt-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-gray-100 px-4 py-2 rounded-xl outline-none focus:ring-2 focus:ring-green-500"
        />
        <button
        type='submit'
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 p-3 rounded-xl text-white"
        >
          <Send className="size-4.5" />
        </button>
      </div>
    </div>

      </div>
    </div>
  );
};

export default TrackOrderPage;
