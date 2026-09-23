import fs from 'fs/promises';
import cloudinary from '../config/cloudinary.js';
import {ENV} from '../config/env.js';
export async function uploadImage(file){
  if(!file) return null;
  if(!ENV.CLOUDINARY_CLOUD_NAME){await fs.unlink(file.path).catch(()=>{});return null;}
  const result=await cloudinary.uploader.upload(file.path,{folder:'community-connect/events',resource_type:'image'});
  await fs.unlink(file.path).catch(()=>{}); return result.secure_url;
}
