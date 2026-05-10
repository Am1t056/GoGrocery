'use client';

import axios from 'axios';
import { ArrowRight, Bike, Home, User, UserCog } from 'lucide-react';
import { motion } from 'motion/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
const EditRoleMobile = () => {
  const router = useRouter();
  const [roles, setRoles] = useState([
    { id: 'admin', label: 'Admin', icon: UserCog },
    { id: 'user', label: 'User', icon: User },
    { id: 'deliveryBoy', label: 'Delivery Boy', icon: Bike },
  ]);
  const [selectedRole, setSelectedRole] = useState('');
  const [mobile, setMobile] = useState('');

  //the role and phone is updated in database but not updated in the session of next-auth
  const { update } = useSession();

  const handleSubmit = async () => {
    try {
      const result = await axios.post('/api/user/edit-role-mobile', {
        role: selectedRole,
        mobile,
      });

      //the role and phone is updated in database but not updated in the session of next-auth
      //also trigger in next-auth -> auth.ts file
      await update({
        role: selectedRole,
        mobile: mobile,
      });
      // console.log(result.data);
      router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkForAdmin = async () => {
      const result = await axios.get('/api/check-for-admin');
      if(result.data.adminExist){
        setRoles((prev)=> prev.filter(role => role.id !== "admin"))
      }
    };
    checkForAdmin();
  }, []);
  return (
    <div className="flex flex-col items-center min-h-screen p-6 w-full">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8"
      >
        Select Your Role
      </motion.h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-10">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;
          return (
            <motion.div
              whileTap={{ scale: 0.94 }}
              key={role.id}
              className={`flex flex-col items-center justify-center w-48 h-44 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-green-600 bg-green-100 shadow-lg ' : 'border-gray-300 bg-white hover:border-green-400 '}`}
              onClick={() => setSelectedRole(role.id)}
            >
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="flex flex-col items-center mt-10"
      >
        <label htmlFor="mobile" className="text-gray-700 font-medium mb-2">
          Enter Your Mobile Number
        </label>
        <input
          id="mobile"
          type="tel"
          className="w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800"
          placeholder="eg. 0000000000"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        disabled={!selectedRole || mobile.length !== 10}
        className={`inline-flex w-fit cursor-pointer mt-10 items-center gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all duration-200 ${selectedRole && mobile.length === 10 ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed disabled:cursor-not-allowed'}`}
        onClick={handleSubmit}
      >
        Save <ArrowRight />
      </motion.button>
    </div>
  );
};

export default EditRoleMobile;
