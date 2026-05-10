import TrackOrderPage from '@/components/user/TrackOrderPage'


const TrackOrder =async ({params}:{params: {orderId:string}}) => {
  const {orderId}=await params
  return (
    <TrackOrderPage orderId={orderId}/>
  )
}

export default TrackOrder