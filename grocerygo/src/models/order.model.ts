export interface IOrder {
  _id?: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  items: [
    {
      grocery: mongoose.Types.ObjectId;
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
  deliveryAssignment?:mongoose.Types.ObjectId;
  assignedDeliveryBoy?:mongoose.Types.ObjectId;
  status: 'pending' | 'out of delivery' | 'delivered';
  isPaid:boolean;
  deliveryOtp:string | null;
  deliveryOtpVerification:boolean;
  deliveredAt:Date;
  createdAt?: Date;
  updatedAt?: Date;
}

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema<IOrder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        grocery: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Grocery',
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: String,
          required: true,
        },
        unit: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['cod', 'online'],
      default: 'cod',
    },
    address: {
      fullName: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: false,
      },
      fullAddress: {
        type: String,
        required: true,
      },
      pincode: {
        type: String,
        required: false,
      },
      mobile: {
        type: String,
        required: true,
      },
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    assignedDeliveryBoy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    deliveryAssignment:{
      type:mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAssignment",
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'out of delivery', 'delivered'],
      default: 'pending',
    },
    isPaid:{
      type: Boolean,
      default:false
    },
    deliveryOtp:{
      type:String,
      default:null
    },
    deliveryOtpVerification:{
      type:Boolean,
      default:false
    },
    deliveredAt:{
      type:Date
    }
  },
  { timestamps: true },
);

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
