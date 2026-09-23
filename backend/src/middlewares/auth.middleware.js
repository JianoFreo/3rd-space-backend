import {verifyToken} from '../utils/jwt.js';
import {sql} from '../config/db.js';
export async function auth(req,res,next){
  try{
    const header=req.headers.authorization||'';
    if(!header.startsWith('Bearer ')) return res.status(401).json({message:'Authentication required'});
    const payload=verifyToken(header.slice(7));
    const rows=await sql`SELECT user_id,name,email,role,img_url,created_at FROM users WHERE user_id=${payload.user_id} LIMIT 1`;
    if(!rows[0]) return res.status(401).json({message:'User not found'});
    req.user=rows[0]; next();
  }catch(e){return res.status(401).json({message:'Invalid or expired token'});}
}
