import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { signToken } from '../utils/auth.js';

export async function login(req,res){
  const {email,password}=req.body||{};
  if(!email||!password) return res.status(400).json({error:'Email and password are required'});
  const {rows}=await query('SELECT id,name,email,role,img_url,password,created_at FROM users WHERE lower(email)=lower($1)',[email]);
  const user=rows[0];
  if(!user || !(await bcrypt.compare(password,user.password))) return res.status(401).json({error:'Invalid email or password'});
  delete user.password;
  res.json({data:{user,token:signToken(user)}});
}
export async function me(req,res){
  const {rows}=await query('SELECT id,name,email,role,img_url,created_at FROM users WHERE id=$1',[req.user.id]);
  if(!rows[0]) return res.status(404).json({error:'User not found'});
  res.json({data:rows[0]});
}
export async function register(req,res){
  const {name,email,password,role='user',img_url=null}=req.body||{};
  if(!name||!email||!password) return res.status(400).json({error:'name, email and password are required'});
  if(!['user','organizer'].includes(role)) return res.status(400).json({error:'Invalid role'});
  const passwordHash=await bcrypt.hash(password,10);
  try {
    const {rows}=await query(`INSERT INTO users(name,email,password,role,img_url) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role,img_url,created_at`,[name,email,passwordHash,role,img_url]);
    const token=signToken(rows[0]); res.status(201).json({data:{user:rows[0],token}});
  } catch(e){ if(e.code==='23505') return res.status(409).json({error:'Email already exists'}); throw e; }
}
