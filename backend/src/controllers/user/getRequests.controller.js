import {sql} from '../../config/db.js';
export async function me(req,res){const rows=await sql`SELECT user_id,name,email,role,img_url,created_at FROM users WHERE user_id=${req.user.user_id}`;res.json(rows[0]);}
export async function registrations(req,res){const rows=await sql`SELECT r.*,e.event_id,e.title,e.location,e.start_date,e.end_date,e.event_time,e.img_url,e.modality,e.status FROM event_registrations r JOIN events e ON e.event_id=r.event_id WHERE r.user_id=${req.user.user_id} ORDER BY e.start_date ASC`;res.json(rows);}
export async function rewards(req,res){const rows=await sql`SELECT * FROM rewards WHERE user_id=${req.user.user_id} ORDER BY created_at DESC`;res.json(rows);}
