'use client';

import { ArrowLeft, Loader, Plus, PlusCircle, Upload, X } from 'lucide-react';
import Link from 'next/link';
import  { ChangeEvent, FormEvent, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';


const categories = [
  'Fruits & Vegetables',
  'Dairy & Eggs',
  'Rice, Atta & Grains',
  'Snacks & Biscuits',
  'Spices & Masalas',
  'Beverages & Drinks',
  'Personal Care',
  'Household Essentials',
  'Instant & Packaged Food',
  'Baby & Pot Care',
];

const units = ['kg', 'g', 'liter', 'ml', 'piece', 'pack'];

const AddGroceryPage = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');

  const [previewImage, setPreviewImage] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<File | null>();
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    setBackendImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('unit', unit);

      if (backendImage) {
        formData.append('image', backendImage);
      }

      const result = await axios.post('/api/admin/add-grocery', formData);
      console.log(result.data, 'add-grocery');
      toast.success(result.data?.message || "Added successfully")
      setLoading(false)
    } catch (error:any) {
      console.log(error);
        toast.error(error.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative ">
      <Link
        href={'/'}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="size-5 " />
        <span className="hidden md:flex">Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="size-6 md:size-8 text-green-600" />
            <h1 className="text-lg md:text-2xl text-green-500 font-bold">
              Add Your Grocery
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <div>
            <label
              htmlFor="name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter grocery name eg: sweets, milk..."
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium mb-1"
              >
                Category <span className="text-red-500">*</span>
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="category"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white cursor-pointer"
              >
                <option>Select Category</option>
                {categories.map((cat, index) => (
                  <option
                    className="cursor-pointer"
                    key={cat + index}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Unit <span className="text-red-500">*</span>
              </label>

              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                id="unit"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white cursor-pointer"
              >
                <option>Select Unit</option>
                {units.map((unit, index) => (
                  <option
                    className="cursor-pointer capitalize"
                    key={unit + index}
                    value={unit}
                  >
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              id="price"
              type="text"
              placeholder="Enter price"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
            />
          </div>

          <div className="flex md:flex-row flex-col gap-5">
            <label
              htmlFor="image"
              className="cursor-pointer flex gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all w-fit h-fit"
            >
              <Upload className="size-5" />
              Upload image <span className="text-red-500">*</span>
            </label>
            <input
              //   value={backendImage as any}
              onChange={handleImageChange}
              id="image"
              type="file"
              accept="image/*"
              placeholder="Enter price"
              className="hidden"
            />

            {previewImage && (
              <div className="w-25 h-25 rounded-xl border border-gray-200  shadow-md relative p-2">
                <Image
                  src={previewImage}
                  fill
                  alt="preview-img"
                  className="object-cover object-center rounded-xl p-2"
                />

                <div
                  onClick={() => {
                    setPreviewImage(null);
                    setBackendImage(null);
                  }}
                  className="absolute -top-2 -right-2 w-5 h-5 cursor-pointer flex items-center justify-center rounded-full bg-red-500"
                >
                  <X className="size-4 text-white" />
                </div>
              </div>
            )}
          </div>

          <motion.button
            // type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.9 }}
            className="mt-4 bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl  transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader className='size-5 animate-spin' />
            ) : (
              <>
                <Plus className="size-5" /> Add Grocery
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddGroceryPage;
