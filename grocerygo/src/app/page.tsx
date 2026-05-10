import { auth } from '@/auth';
import Navbar from '@/components/common/Navbar';
import AdminDashboard from '@/components/admin/AdminDashboard';
import DeliveryBoyDashboard from '@/components/deliveryBoy/DeliveryBoyDashboard';
import EditRoleMobile from '@/components/home/EditRoleMobile';
import UserDashboard from '@/components/user/UserDashboard';
import connectDb from '@/lib/db';
import User from '@/models/user.model';
import { redirect } from 'next/navigation';
import GeoUpdater from '@/components/user/GeoUpdater';
import Grocery, { IGrocery } from '@/models/grocery.model';
import Footer from '@/components/common/Footer';

export default async function Home(props: {
  searchParams: Promise<{
    q: string;
  }>;
}) {
  await connectDb();

  const searchParams = await props.searchParams;

  const session = await auth();
  // console.log(session,"session-from-home-server-page")

  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect('/login');
  }

  const inComplete =
    !user.mobile || !user.role || (!user.mobile && user.role === 'user');
  if (inComplete) {
    return <EditRoleMobile />;
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  let groceryList: IGrocery[] = [];
  if (user.role === 'user') {
    if (searchParams.q) {
      groceryList = await Grocery.find({
        $or: [
          { name: { $regex: searchParams?.q || '', $options: 'i' } },
          { category: { $regex: searchParams?.q || '', $options: 'i' } },
        ],
      });
    }else{
      groceryList=await Grocery.find({})
    }
  }

  return (
    <>
      <Navbar user={plainUser} />
      <GeoUpdater userId={plainUser._id} />

      {user.role === 'user' ? (
        <UserDashboard groceryList={groceryList}/>
      ) : user.role === 'admin' ? (
        <AdminDashboard />
      ) : (
        <DeliveryBoyDashboard />
      )}
      <Footer/>
    </>
  );
}
