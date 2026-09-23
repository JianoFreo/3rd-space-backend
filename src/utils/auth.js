import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
export function signToken(user) { return jwt.sign({ id: user.id, role: user.role, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' }); }
export function verifyToken(token) { return jwt.verify(token, JWT_SECRET); }
