import dotenv from 'dotenv';
dotenv.config();
export const ENV={
  DATABASE_URL:process.env.DATABASE_URL||'',
  NODE_ENV:process.env.NODE_ENV||'development',
  PORT:Number(process.env.PORT||5000),
  FRONTEND_URL:process.env.FRONTEND_URL||'http://localhost:5173',
  JWT_SECRET:process.env.JWT_SECRET||'dev-secret-change-me',
  JWT_EXPIRES_IN:process.env.JWT_EXPIRES_IN||'1d',
  REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET||'dev-refresh-change-me',
  CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME||'',
  CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY||'',
  CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET||''
};
