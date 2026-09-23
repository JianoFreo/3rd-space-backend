import bcrypt from 'bcryptjs';
import {sql} from '../../config/db.js';
import {signToken} from '../../utils/jwt.js';
import {makeUserId} from '../../utils/generateId.js';
export async function register(req,res){
  const {name,email,password,role='user'}=req.body;
  if(!name||!email||!password) return res.status(400).json({message:'Name, email and password are required'});
  const normalized=String(email).trim().toLowerCase();
  if(!['user','organizer'].includes(role)) return res.status(400).json({message:'Invalid registration role'});
  const exists=await sql`SELECT user_id FROM users WHERE email=${normalized} LIMIT 1`; if(exists[0]) return res.status(409).json({message:'Email already registered'});
  const count=await sql`SELECT COUNT(*)::int AS count FROM users`; const user_id=makeUserId((count[0]?.count||0)+1);
  const hash=await bcrypt.hash(password,12);
  const rows=await sql`INSERT INTO users(user_id,name,email,password,role) VALUES(${user_id},${name.trim()},${normalized},${hash},${role}) RETURNING user_id,name,email,role,img_url,created_at`;
  const user=rows[0]; res.status(201).json({message:'Registration successful',user,token:signToken(user)});
}
export async function login(req,res){
  const {email,password}=req.body; if(!email||!password) return res.status(400).json({message:'Email and password are required'});
  const rows=await sql`SELECT * FROM users WHERE email=${String(email).trim().toLowerCase()} LIMIT 1`; const user=rows[0];
  if(!user||!(await bcrypt.compare(password,user.password))) return res.status(401).json({message:'Invalid email or password'});
  const safe={user_id:user.user_id,name:user.name,email:user.email,role:user.role,img_url:user.img_url,created_at:user.created_at};
  res.json({message:'Login successful',user:safe,token:signToken(safe)});
}
