import dotenv from 'dotenv';
dotenv.config();
export const PORT = Number(process.env.PORT || 5000);
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-hardcoded-jwt-secret-change-me';
export const CLOUDINARY = { cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '', api_key: process.env.CLOUDINARY_API_KEY || '', api_secret: process.env.CLOUDINARY_API_SECRET || '' };
