import { query } from '../config/db.js';

const EVENT_FIELDS=`e.id,e.title,e.description,e.event_category,e.address,e.latitude,e.longitude,e.start_date,e.end_date,e.start_time,e.capacity,e.status,e.fee_type,e.reward_type,e.modality,e.approval_status,e.approved_by,e.organizer_id,e.img_url,e.created_at`;

export async function listEvents(req,res){
  const {category,search,organizer}=req.query;
  const params=[]; const where=[];
  if(organizer==='me'){params.push(req.user.id);where.push(`e.organizer_id=$${params.length}`);}
  else if(req.user.role!=='admin') where.push(`e.approval_status='approved' AND e.status NOT IN ('cancelled','completed')`);
  if(category){params.push(category);where.push(`lower(e.event_category)=lower($${params.length})`);}
  if(search){params.push(`%${search}%`);where.push(`(e.title ILIKE $${params.length} OR e.description ILIKE $${params.length} OR e.address ILIKE $${params.length})`);}
  const sql=`SELECT ${EVENT_FIELDS} FROM events e ${where.length?'WHERE '+where.join(' AND '):''} ORDER BY e.start_date,e.start_time`;
  const {rows}=await query(sql,params); res.json({data:rows});
}
export async function getEvent(req,res){
  const {rows}=await query(`SELECT ${EVENT_FIELDS} FROM events e WHERE e.id=$1`,[req.params.id]);
  if(!rows[0]) return res.status(404).json({error:'Event not found'});
  if(req.user.role!=='admin' && rows[0].organizer_id!==req.user.id && rows[0].approval_status!=='approved') return res.status(404).json({error:'Event not found'});
  res.json({data:rows[0]});
}
export async function createEvent(req,res){
  const b=req.body||{};
  const required=['title','description','event_modality','address','start_date','start_time','capacity'];
  const missing=required.find(k=>b[k]===undefined||b[k]===null||b[k]===''); if(missing) return res.status(400).json({error:`${missing} is required`});
  const {rows}=await query(`INSERT INTO events(title,description,event_category,address,latitude,longitude,start_date,end_date,start_time,capacity,status,fee_type,reward_type,modality,organizer_id,img_url,approval_status)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'submitted',$11,$12,$13,$14,$15,'pending') RETURNING ${EVENT_FIELDS}`,
  [b.title,b.description,b.event_category||null,b.address,b.latitude??null,b.longitude??null,b.start_date,b.end_date||null,b.start_time,b.capacity,b.fee_type||null,b.reward_type||null,b.event_modality,b.organizer_id||req.user.id,b.img_url||null]);
  res.status(201).json({data:rows[0]});
}
export async function updateEventStatus(req,res){
  const {approval_status}=req.body||{};
  if(!['approved','rejected','changes_requested'].includes(approval_status)) return res.status(400).json({error:'Invalid approval_status'});
  const {rows}=await query(`UPDATE events SET approval_status=$1,approved_by=$2 WHERE id=$3 RETURNING id,approval_status,approved_by`,[approval_status,req.user.id,req.params.id]);
  if(!rows[0]) return res.status(404).json({error:'Event not found'}); res.json({data:rows[0]});
}
export async function registerEvent(req,res){
  const {rows:eventRows}=await query('SELECT id,capacity,status,approval_status FROM events WHERE id=$1',[req.params.id]);
  const event=eventRows[0]; if(!event) return res.status(404).json({error:'Event not found'});
  if(event.status!=='submitted' || event.approval_status!=='approved') return res.status(400).json({error:'Event is not open for registration'});
  const {rows:existing}=await query('SELECT id,status,registration_date FROM event_registrations WHERE event_id=$1 AND user_id=$2',[req.params.id,req.user.id]);
  if(existing[0] && existing[0].status!=='cancelled') return res.status(409).json({error:'Already registered for this event'});
  const {rows:countRows}=await query(`SELECT count(*)::int count FROM event_registrations WHERE event_id=$1 AND status='registered'`,[req.params.id]);
  const status=countRows[0].count < event.capacity ? 'registered' : 'waitlisted';
  let rows;
  if(existing[0]) ({rows}=await query(`UPDATE event_registrations SET status=$1,registration_date=now() WHERE id=$2 RETURNING id,event_id,user_id,status,registration_date`,[status,existing[0].id]));
  else ({rows}=await query(`INSERT INTO event_registrations(event_id,user_id,status) VALUES($1,$2,$3) RETURNING id,event_id,user_id,status,registration_date`,[req.params.id,req.user.id,status]));
  res.status(201).json({data:rows[0]});
}
export async function registrations(req,res){
  const {rows:eventRows}=await query('SELECT organizer_id FROM events WHERE id=$1',[req.params.id]);
  if(!eventRows[0]) return res.status(404).json({error:'Event not found'});
  if(req.user.role!=='admin' && eventRows[0].organizer_id!==req.user.id) return res.status(403).json({error:'Forbidden'});
  const {rows}=await query(`SELECT er.id,er.event_id,er.user_id,er.registration_date,er.status,json_build_object('id',u.id,'name',u.name,'email',u.email,'img_url',u.img_url) users FROM event_registrations er JOIN users u ON u.id=er.user_id WHERE er.event_id=$1 ORDER BY er.registration_date DESC`,[req.params.id]);
  res.json({data:rows});
}
export async function nearby(req,res){
  const lat=Number(req.query.lat),lng=Number(req.query.lng),radius=Number(req.query.radius||5000);
  if(!Number.isFinite(lat)||!Number.isFinite(lng)||!Number.isFinite(radius)) return res.status(400).json({error:'lat, lng and radius are required numbers'});
  const {rows}=await query(`SELECT * FROM nearby_events($1,$2,$3)`,[lat,lng,radius]); res.json({data:rows});
}
