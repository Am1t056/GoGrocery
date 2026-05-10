
import connectDb from '@/lib/db'
import DeliveryBoy from './DeliveryBoy'
import { auth } from '@/auth'
import Order from '@/models/order.model'

const DeliveryBoyDashboard =async () => {
  await connectDb()
  const session=await auth()
  const deliveryBoyId=session?.user?.id;

  const orders=await Order.find({
    assignedDeliveryBoy:deliveryBoyId,
    deliveryOtpVerification:true
  })

  const today=new Date().toDateString();
  const todayOrders=orders.filter((order)=>new Date(order.deliveredAt).toDateString() === today).length;
  const todaysEarnings=todayOrders * 40;


  return (
    <>
    <DeliveryBoy todaysEarnings={todaysEarnings}/>
    
    </>
  )
}

export default DeliveryBoyDashboard