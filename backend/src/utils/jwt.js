import jwt from 'jsonwebtoken';import {ENV} from '../config/env.js';export const signToken=(user)=>jwt.sign({id:user.id,role:user.role},ENV.JWT_SECRET,{expiresIn:ENV.JWT_EXPIRES_IN});
