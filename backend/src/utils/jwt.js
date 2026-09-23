import jwt from 'jsonwebtoken';
import {ENV} from '../config/env.js';
export const signToken=user=>jwt.sign({user_id:user.user_id,role:user.role,email:user.email},ENV.JWT_SECRET,{expiresIn:ENV.JWT_EXPIRES_IN});
export const verifyToken=token=>jwt.verify(token,ENV.JWT_SECRET);
