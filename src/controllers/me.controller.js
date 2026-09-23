import { query } from '../config/db.js';
export async function rewards(req,res){
 const {rows}=await query(`SELECT id,event_id,type,amount,status,created_at FROM rewards WHERE user_id=$1 ORDER BY created_at DESC`,[req.user.id]);
 const total=rows.reduce((s,r)=>s+Number(r.amount||0),0); res.json({data:{total,rewards:rows}});
}
export async function registrations(req,res){
 const {rows}=await query(`SELECT er.id,er.event_id,er.status,er.registration_date,json_build_object('id',e.id,'title',e.title,'event_category',e.event_category,'start_date',e.start_date) events FROM event_registrations er JOIN events e ON e.id=er.event_id WHERE er.user_id=$1 ORDER BY er.registration_date DESC`,[req.user.id]);
 res.json({data:rows});
}
