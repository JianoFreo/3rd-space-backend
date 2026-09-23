import {Router} from 'express';
import auth from '../middlewares/auth.middleware.js'; import {roles} from '../middlewares/role.middleware.js';
import * as c from '../controllers/events.controller.js';
const r=Router();
r.get('/nearby',auth,c.nearby); r.get('/',auth,c.listEvents); r.get('/:id',auth,c.getEvent); r.post('/',auth,roles('organizer','admin'),c.createEvent); r.patch('/:id/status',auth,roles('admin'),c.updateEventStatus); r.post('/:id/register',auth,roles('user','organizer'),c.registerEvent); r.get('/:id/registrations',auth,roles('organizer','admin'),c.registrations);
export default r;
