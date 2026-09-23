import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from './env.js';
if (CLOUDINARY.cloud_name && CLOUDINARY.api_key && CLOUDINARY.api_secret) cloudinary.config(CLOUDINARY);
export default cloudinary;
