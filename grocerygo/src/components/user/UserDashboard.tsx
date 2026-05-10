
import HeroSection from '../home/HeroSection';
import CategorySlider from '../home/CategorySlider';
import { IGrocery } from '@/models/grocery.model';
import connectDb from '@/lib/db';
import GroceryItemCard from '../home/GroceryItemCard';

const UserDashboard = async ({groceryList}:{groceryList:IGrocery[]}) => {
  await connectDb();
  // const groceries = await Grocery.find({});

  const plainGroceries = JSON.parse(JSON.stringify(groceryList));
  // console.log(plainGroceries, 'plain-groceries');
  return (
    <>
      <HeroSection />
      <CategorySlider />

      <div className="w-[90%] md:w-[80%] mx-auto mt-10">
        <h2 className="text-2xl amd:text-3xl font-bold text-green-700 mb-6 text-center">
          Popular Grocery Items
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {plainGroceries.map((item: any, index: number) => (
            <GroceryItemCard key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
