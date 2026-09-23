import cloudinary from '../config/cloudinary.js';
export function uploadImage(file,folder='community-connect'){return new Promise((resolve,reject)=>{if(!file||!cloudinary.config().cloud_name)return resolve(null);const s=cloudinary.uploader.upload_stream({folder,resource_type:'image'},(e,r)=>e?reject(e):resolve(r.secure_url));s.end(file.buffer)})}
