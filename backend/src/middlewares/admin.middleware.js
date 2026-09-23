export function adminOnly(req,res,next){if(req.user?.role!=='admin')return res.status(403).json({message:'Admin access required'});next();}
export function organizerOnly(req,res,next){if(!['organizer','admin'].includes(req.user?.role))return res.status(403).json({message:'Organizer access required'});next();}
