export const roles = (...allowed) => (req,res,next) => allowed.includes(req.user?.role) ? next() : res.status(403).json({error:'Forbidden'});
