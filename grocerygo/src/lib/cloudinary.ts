import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (file: Blob): Promise<string | null> => {
  if (!file) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder: 'groceries' },
      (error, result) => {
        if (error) {
          reject(error); // ← this throws the real Cloudinary error up
        } else {
          resolve(result?.secure_url ?? null);
        }
      },
    );
    uploadStream.end(buffer);
  });
  // ← removed the try/catch that was swallowing the error
};

export default uploadOnCloudinary;
