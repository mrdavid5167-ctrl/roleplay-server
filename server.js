import express from 'express';import http from 'http';import {Server} from 'socket.io';import path from 'path';import {fileURLToPath} from 'url';
const __dirname=path.dirname(fileURLToPath(import.meta.url)),app=express(),server=http.createServer(app),io=new Server(server),players=new Map(),PORT=process.env.PORT||3000;
app.use(express.json());app.use(express.static(path.join(__dirname,'..')));
app.get('/api/health',(q,r)=>r.json({ok:true,players:players.size}));
io.on('connection',s=>{const p={id:s.id,name:'Player-'+s.id.slice(0,5),x:0,y:.5,z:4,rotation:0,inCar:false,money:500};players.set(s.id,p);s.emit('world:init',{self:p,players:[...players.values()]});s.broadcast.emit('player:join',p);
s.on('player:update',d=>{const p=players.get(s.id);if(!p)return;for(const k of ['x','y','z','rotation'])if(typeof d[k]==='number')p[k]=d[k];if(typeof d.inCar==='boolean')p.inCar=d.inCar;s.broadcast.emit('player:update',p)});
s.on('shop:buy',item=>{const prices={Water:20,Food:50,Medkit:100},p=players.get(s.id),price=prices[item];if(!p||!price)return;if(p.money>=price){p.money-=price;s.emit('shop:result',{ok:true,item,money:p.money})}else s.emit('shop:result',{ok:false,error:'Not enough money',money:p.money})});
s.on('disconnect',()=>{players.delete(s.id);s.broadcast.emit('player:leave',s.id)})});
server.listen(PORT,()=>console.log('RP3D server running on port '+PORT));