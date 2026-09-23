import {sql} from '../../config/db.js';
export async function getEvents(req,res){
  const {category,modality,search}=req.query;
  const rows=await sql`SELECT e.*,u.name AS organizer_name,
    (SELECT COUNT(*)::int FROM event_registrations r WHERE r.event_id=e.event_id) AS registered_count
    FROM events e JOIN users u ON u.user_id=e.organizer_id
    WHERE e.approval_status='approved' AND e.status IN ('open','closed')
    AND (${category||''}='' OR e.event_category=${category})
    AND (${modality||''}='' OR e.modality=${modality})
    AND (${search||''}='' OR e.title ILIKE '%'||${search||''}||'%' OR COALESCE(e.location,'') ILIKE '%'||${search||''}||'%')
    ORDER BY e.start_date ASC,e.event_time ASC`;
  res.json(rows);
}
export async function getEvent(req,res){
  const rows=await sql`SELECT e.*,u.name AS organizer_name,
    (SELECT COUNT(*)::int FROM event_registrations r WHERE r.event_id=e.event_id) AS registered_count
    FROM events e JOIN users u ON u.user_id=e.organizer_id WHERE e.event_id=${req.params.id} LIMIT 1`;
  if(!rows[0]) return res.status(404).json({message:'Event not found'});
  const reviews=await sql`SELECT r.*,u.name AS user_name,u.img_url FROM reviews r JOIN users u ON u.user_id=r.user_id WHERE r.event_id=${req.params.id} ORDER BY r.created_at DESC`;
  res.json({...rows[0],reviews});
}
export async function geocode(req,res){
  const q=String(req.query.q||'').trim(); if(!q) return res.status(400).json({message:'Query is required'});
  const response=await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(q)}`,{headers:{'User-Agent':'CommunityConnect/1.0'} });
  if(!response.ok) return res.status(502).json({message:'Geocoding service unavailable'});
  res.json(await response.json());
}
