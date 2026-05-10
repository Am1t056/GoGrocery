'use client';

import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";

interface AssignmentCardProps {
  data: any;
  fetchAssignments: () => void;
  onAssignmentAccepted: (assignment: any) => void;
}

const AssignmentCard = ({ data, fetchAssignments, onAssignmentAccepted }: AssignmentCardProps) => {
  const [loading, setLoading] = useState(false);

  const handleAccept = async (assignmentId: string) => {
    setLoading(true);
    try {
      const result = await axios.post(`/api/delivery/accept-assignment/${assignmentId}`);
      onAssignmentAccepted(data);
      fetchAssignments();
    } catch (error) {
      console.log("Failed to accept delivery", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow mb-4 border">
      <p className="">
        <b>Order Id</b> #{data?.order._id}
      </p>
      <p className="text-gray-600">{data.order.address.fullAddress}</p>
      <p className="text-gray-600">{data.order.address.mobile}</p>

      <div className="flex gap-3 mt-4">
        <button 
          className="flex-1 bg-green-600 text-white py-2 rounded-lg cursor-pointer disabled:bg-green-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={() => handleAccept(data._id!)}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="size-4 animate-spin" />
              Accepting...
            </>
          ) : (
            'Accept'
          )}
        </button>
        <button className="flex-1 bg-red-500 text-white py-2 rounded-lg cursor-pointer">Reject</button>
      </div>
    </div>
  );
};

export default AssignmentCard;