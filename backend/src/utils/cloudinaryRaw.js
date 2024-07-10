import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRETS,
});

const cloudinaryUploadRaw = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file, (result) => {
      if (result.error) {
        reject(result.error);
      } else {
        resolve({ url: result.url });
      }
    }, { resource_type: "raw" }); 
  });
};

const uploadRaw = async (filePath) => {
  try {
    const result = await cloudinaryUploadRaw(filePath);
    return result;
  } catch (error) {
    console.error('Error uploading raw file to Cloudinary:', error);
    throw error;
  }
};

export default uploadRaw;
