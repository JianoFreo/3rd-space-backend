import express from 'express';import cors from 'cors';import path from 'path';import {fileURLToPath} from 'url';import http from 'http';
import authRoute from './routes/auth.route.js';import eventRoute from './routes/event.route.js';import adminRoute from './routes/admin.route.js';import userRoute from './routes/user.route.js';import organizerRoute from './routes/organizer.route.js';import testRoute from './routes/test.routes.js';import {ENV} from './config/env.js';import {connectNeon} from './config/db.js';import {initWebSocket} from './websocket.js';
const app=express();app.use(cors({origin:true,credentials:true}));app.use(express.json());app.use(express.urlencoded({extended:true}));
app.get('/api/health',(_,res)=>res.json({ok:true,service:'community-connect'}));
app.use('/api/test',testRoute);app.use('/api/auth',authRoute);app.use('/api/admin',adminRoute);app.use('/api/events',eventRoute);app.use('/api/organizer',organizerRoute);app.use('/api/users',userRoute);
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({message:err.message||'Internal server error'});});
const __dirname=path.dirname(fileURLToPath(import.meta.url));const frontendPath=path.resolve(__dirname,'../../frontend/dist');app.use(express.static(frontendPath));app.get('/{*splat}',(req,res)=>{if(req.path.startsWith('/api/'))return res.status(404).json({message:'API route not found'});res.sendFile(path.join(frontendPath,'index.html'));});
const server=http.createServer(app);initWebSocket(server);
connectNeon().then(()=>server.listen(ENV.PORT,()=>console.log(`Community Connect running on http://localhost:${ENV.PORT}`))).catch(err=>{console.error('Database initialization failed',err);process.exit(1);});
