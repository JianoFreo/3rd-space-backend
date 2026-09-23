import {sql} from '../../config/db.js';
export async function updateEvent(req,res){
  const existing=await sql`SELECT * FROM events WHERE event_id=${req.params.id} LIMIT 1`; if(!existing[0]) return res.status(404).json({message:'Event not found'});
  if(existing[0].organizer_id!==req.user.user_id && req.user.role!=='admin') return res.status(403).json({message:'Not your event'});
  const {title,description,location,latitude,longitude,start_date,end_date,event_time,capacity,reward_type,modality,status}=req.body;
  const rows=await sql`UPDATE events SET title=COALESCE(${title??null},title),description=COALESCE(${description??null},description),location=COALESCE(${location??null},location),latitude=COALESCE(${latitude!=null?Number(latitude):null},latitude),longitude=COALESCE(${longitude!=null?Number(longitude):null},longitude),start_date=COALESCE(${start_date??null},start_date),end_date=COALESCE(${end_date??null},end_date),event_time=COALESCE(${event_time??null},event_time),capacity=COALESCE(${capacity!=null?Number(capacity):null},capacity),reward_type=COALESCE(${reward_type??null},reward_type),modality=COALESCE(${modality??null},modality),status=COALESCE(${status??null},status) WHERE event_id=${req.params.id} RETURNING *`;
  res.json({message:'Event updated',event:rows[0]});
}
export async function deleteEvent(req,res){const existing=await sql`SELECT * FROM events WHERE event_id=${req.params.id} LIMIT 1`;if(!existing[0])return res.status(404).json({message:'Event not found'});if(existing[0].organizer_id!==req.user.user_id&&req.user.role!=='admin')return res.status(403).json({message:'Not your event'});await sql`DELETE FROM events WHERE event_id=${req.params.id}`;res.json({message:'Event deleted'});}
