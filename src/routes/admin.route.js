import {Router} from 'express'; import auth from '../middlewares/auth.middleware.js'; import {roles} from '../middlewares/role.middleware.js'; import * as c from '../controllers/admin.controller.js';
const r=Router(); r.use(auth,roles('admin')); r.get('/users',c.users); r.patch('/users/:id',c.updateUser); r.get('/analytics',c.analytics); r.get('/leaderboard',c.leaderboard); export default r;
