'use client';

import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  CloudUpload,
  Edit,
  Loader,
  Loader2,
  Package,
  Pencil,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { IGrocery } from '@/models/grocery.model';
import Image from 'next/image';

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

const ViewGroceryPage = () => {
  const [groceries, setGroceries] = useState<IGrocery[]>();
  const [editing, setEditing] = useState<IGrocery | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [backendImage, setBackendImage] = useState<Blob | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search,setSearch] = useState('')
  const [filteredGroceries,setFilteredGroceries] = useState<IGrocery[]>()
  const modalRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const getGroceries = async () => {
    try {
      const result = await axios.get('/api/admin/get-groceries');
      setGroceries(result.data);
      setFilteredGroceries(result.data)
    } catch (error) {
      console.log('Failed to fetch groceries', error);
    }
  };

  useEffect(() => {
    getGroceries();
  }, []);

  useEffect(() => {
    if (editing) {
      setImagePreview(editing.image);
    }
  }, [editing]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackendImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = async () => {
    if (!editing) return;
    setIsEditing(true);
    try {
      const formData = new FormData();
      formData.append('groceryId', editing?._id?.toString() || '');
      formData.append('name', editing?.name || '');
      formData.append('price', editing?.price || '');
      formData.append('category', editing?.category || '');
      formData.append('unit', editing?.unit || '');
      if (backendImage) {
        formData.append('image', backendImage);
      } else {
        // convert existing image URL to blob
        const response = await fetch(editing.image);
        const blob = await response.blob();
        formData.append('image', blob, 'existing-image.jpg');
      }

      const result = await axios.post('/api/admin/edit-grocery', formData);
    //   console.log(result, 'edit-grocery');
      if (result.data) {
        setEditing(null);
        window.location.reload(); // reload page to fetch updated groceries
        setIsEditing(false);
      }
    } catch (error) {
      console.log('Failed to edit grocery', error);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!editing) return;
    setIsDeleting(true);
    try {
      const result = await axios.post('/api/admin/delete-grocery', {
        groceryId: editing._id,
      });
      if (result.data) {
        window.location.reload(); // reload page to fetch updated groceries
        setIsDeleting(false);
      }
    } catch (error) {
      console.log('Failed to delete grocery', error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      const target = e.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setEditing(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearch=(e:React.SubmitEvent) => {
    e.preventDefault();
    const q=search.toLowerCase();
    setFilteredGroceries(groceries?.filter(grocery=>grocery.name.toLowerCase().includes(q) || grocery.category.toLowerCase().includes(q)))
  }
  return (
    <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
      >
        <button
          onClick={() => router.push('/')}
          className="flex items-center justify-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full transition w-full sm:w-auto"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2">
          <Package size={28} className="text-green-600" />
          Manage Groceries
        </h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
        onSubmit={handleSearch}
      >
        <Search className="text-gray-500 w-5 h-5 mr-2" />

        <input
          type="text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full outline-none text-gray-700 placeholder-gray-400"
          placeholder="Search by name or category..."
        />
      </motion.form>

      <div className="space-y-4">
        {filteredGroceries?.map((grocery, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 transition-all"
          >
            <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={grocery.image}
                alt={grocery.name}
                fill
                className="object-cover hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                <h3 className=" font-semibold text-gray-800 text-lg truncate">
                  {grocery.name}
                </h3>
                <p className="text-gray-500 text-sm capitalize">
                  {grocery.category}
                </p>
              </div>

              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-green-700 font-bold text-lg">
                  Rs.{grocery.price}/{' '}
                  <span className="text-gray-500 text-sm font-medium ml-1">
                    {grocery.unit}
                  </span>
                </p>
                <button
                  onClick={() => setEditing(grocery)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition-all cursor-pointer"
                >
                  <Pencil size={15} /> Edit
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-139 min-h-137.5 h-full overflow-y-auto scrollbar-hide"
              ref={modalRef}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-green-700 ">
                  Edit Grocery
                </h2>
                <button
                  className="text-gray-600 hover:text-red-600 cursor-pointer"
                  onClick={() => setEditing(null)}
                >
                  <X size={18} />
                </button>
              </div>

              <div className="relative aspect-3/2 w-full overflow-hidden mb-4 border border-gray-200 group rounded-md">
                {imagePreview && (
                  <Image
                    src={imagePreview}
                    alt={editing.name}
                    fill
                    className="object-contain"
                  />
                )}
                <label
                  htmlFor="imageUpload"
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity "
                >
                  <div className="w-10 h-10 bg-green-50 shadow-md rounded-full flex items-center justify-center">
                    <CloudUpload className="size-6 text-green-700" />
                  </div>
                </label>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter grocery name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                />
                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                >
                  <option>Select category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat} className="cursor-pointer">
                      {cat}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Price"
                  value={editing.price}
                  onChange={(e) =>
                    setEditing({ ...editing, price: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
                />

                <select
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none bg-white"
                  value={editing.unit}
                  onChange={(e) =>
                    setEditing({ ...editing, unit: e.target.value })
                  }
                >
                  <option>Select unit</option>
                  {units.map((unit, index) => (
                    <option key={index} value={unit} className="cursor-pointer">
                      {unit}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white flex items-center gap-2 hover:bg-green-700 transition-all cursor-pointer disabled:cursor-not-allowed disabled:bg-green-400"
                  onClick={handleEdit}
                  disabled={isEditing}
                >
                  {isEditing ? (
                    <>
                      <Loader className="size-4 animate-spin" /> Editing...
                    </>
                  ) : (
                    <>
                      <Edit /> Edit Grocery
                    </>
                  )}
                </button>
                <button
                  className="px-4 py-2 rounded-lg
                bg-red-600 text-white flex items-center gap-2 hover:bg-red-700   transition-all cursor-pointer disabled:cursor-not-allowed disabled:bg-red-400"
                disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 />
                      Delete Grocery
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ViewGroceryPage;
