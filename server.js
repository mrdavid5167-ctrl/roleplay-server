const express=require("express"),http=require("http"),path=require("path");
const {Server}=require("socket.io");
const app=express(),server=http.createServer(app),io=new Server(server,{cors:{origin:"*"}});
const players=new Map(),money=new Map(),PORT=process.env.PORT||10000;
app.get("/api/health",(q,r)=>r.json({ok:true,online:true,players:players.size}));
app.get("/api/status",(q,r)=>r.json({online:true,players:players.size}));
app.use(express.static(path.join(__dirname,"public")));
io.on("connection",s=>{
 const p={id:s.id,x:0,y:.5,z:4,rotY:0,inCar:false};players.set(s.id,p);money.set(s.id,500);
 s.emit("world:init",{selfId:s.id,players:[...players.values()]});s.broadcast.emit("player:joined",p);
 s.on("player:update",d=>{const p=players.get(s.id);if(!p)return;for(const k of ["x","y","z","rotY"])if(Number.isFinite(Number(d?.[k])))p[k]=Number(d[k]);p.inCar=!!d?.inCar;s.broadcast.emit("player:updated",p)});
 s.on("shop:buy",item=>{const prices={Water:20,Food:50,Medkit:100},price=prices[item],m=money.get(s.id)||500;if(!price)return s.emit("shop:result",{ok:false,error:"Invalid item"});if(m<price)return s.emit("shop:result",{ok:false,error:"Not enough money",money:m});money.set(s.id,m-price);s.emit("shop:result",{ok:true,item,money:m-price})});
 s.on("disconnect",()=>{players.delete(s.id);money.delete(s.id);s.broadcast.emit("player:left",s.id)});
});
server.listen(PORT,"0.0.0.0",()=>console.log("RP3D server listening on "+PORT));