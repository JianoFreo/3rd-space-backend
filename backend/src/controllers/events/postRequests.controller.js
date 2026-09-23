import {sql} from '../../config/db.js';
import {makeEventId} from '../../utils/generateId.js';
import {uploadImage} from '../../utils/upload.js';
export async function createEvent(req,res){
  const {title,event_category,description,location,latitude,longitude,start_date,end_date,event_time,capacity,reward_type,modality='in-person'}=req.body;
  if(!title||!event_category||!description||!start_date||!end_date) return res.status(400).json({message:'Title, category, description and dates are required'});
  const count=await sql`SELECT COUNT(*)::int AS count FROM events`; const event_id=makeEventId((count[0]?.count||0)+1);
  const img_url=await uploadImage(req.file);
  const rows=await sql`INSERT INTO events(event_id,title,event_category,description,location,latitude,longitude,start_date,end_date,event_time,capacity,reward_type,modality,organizer_id,img_url)
    VALUES(${event_id},${title},${event_category},${description},${location||null},${latitude?Number(latitude):null},${longitude?Number(longitude):null},${start_date},${end_date},${event_time||null},${Number(capacity||0)},${reward_type||null},${modality},${req.user.user_id},${img_url}) RETURNING *`;
  res.status(201).json({message:'Event submitted for approval',event:rows[0]});
}
export async function registerEvent(req,res){
  const event=await sql`SELECT * FROM events WHERE event_id=${req.params.id} AND approval_status='approved' LIMIT 1`; if(!event[0]) return res.status(404).json({message:'Event not found'});
  const count=await sql`SELECT COUNT(*)::int AS count FROM event_registrations WHERE event_id=${req.params.id}`;
  if(event[0].capacity>0 && count[0].count>=event[0].capacity) return res.status(409).json({message:'Event is full'});
  try{const rows=await sql`INSERT INTO event_registrations(event_id,user_id) VALUES(${req.params.id},${req.user.user_id}) RETURNING *`;res.status(201).json({message:'Registered successfully',registration:rows[0]});}
  catch(e){if(e.code==='23505') return res.status(409).json({message:'You are already registered'});throw e;}
}
