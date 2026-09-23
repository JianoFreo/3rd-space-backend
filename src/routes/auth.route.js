import {Router} from 'express'; import {login,me,register} from '../controllers/auth.controller.js'; import auth from '../middlewares/auth.middleware.js';
const r=Router(); r.post('/login',login); r.post('/register',register); r.get('/me',auth,me); export default r;
