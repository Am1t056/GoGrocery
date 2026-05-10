'use client';

import axios from "axios";

interface AssignmentCardProps {
  data: any;
  fetchAssignments: () => void;
}

const AssignmentCard = ({ data,fetchAssignments }: AssignmentCardProps) => {
  const handleAccept=async (assignmentId:string)=>{
    try {
      const result=await axios.post(`/api/delivery/accept-assignment/${assignmentId}`);
      // console.log(result.data)
      fetchAssignments()
      
    } catch (error) {
      console.log("Failed to accept delivery",error)
      
    }
  }
  return (
    <div className="p-5 bg-white rounded-xl shadow mb-4 border">
      <p className="">
        <b>Order Id</b> #{data?.order._id}
      </p>
      <p className="text-gray-600">{data.order.address.fullAddress}</p>
      <p className="text-gray-600">{data.order.address.mobile}</p>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-green-600 text-white py-2 rounded-lg cursor-pointer" onClick={()=>handleAccept(data._id!)}>Accept</button>
        <button className="flex-1 bg-red-500 text-white py-2 rounded-lg cursor-pointer">Reject</button>
      </div>
    </div>
  );
};

export default AssignmentCard;
