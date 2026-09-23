import {Router} from 'express'; import auth from '../middlewares/auth.middleware.js'; import * as c from '../controllers/me.controller.js';
const r=Router(); r.get('/rewards',auth,c.rewards); r.get('/registrations',auth,c.registrations); export default r;
