import multer from 'multer';export const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:5*1024*1024},fileFilter:(r,f,cb)=>cb(null,f.mimetype.startsWith('image/'))});
