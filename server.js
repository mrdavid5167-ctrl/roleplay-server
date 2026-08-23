const express=require("express");
const http=require("http");
const path=require("path");
const {Server}=require("socket.io");
const app=express();
const server=http.createServer(app);
const io=new Server(server,{cors:{origin:"*",methods:["GET","POST"]}});
const players=new Map();
const PORT=process.env.PORT||3000;

app.get("/api/health",(req,res)=>res.json({ok:true,players:players.size}));
app.get("/api/status",(req,res)=>res.json({online:true,players:players.size}));
app.use(express.static(path.join(__dirname,"..","client")));

io.on("connection",socket=>{
  const p={id:socket.id,x:0,y:1,z:0,rotY:0};
  players.set(socket.id,p);
  socket.emit("world:init",{selfId:socket.id,players:[...players.values()]});
  socket.broadcast.emit("player:joined",p);

  socket.on("player:update",d=>{
    if(!players.has(socket.id)) return;
    const p={
      id:socket.id,
      x:Number(d?.x)||0,y:Number(d?.y)||1,z:Number(d?.z)||0,
      rotY:Number(d?.rotY)||0
    };
    players.set(socket.id,p);
    socket.broadcast.emit("player:updated",p);
  });

  socket.on("disconnect",()=>{
    players.delete(socket.id);
    socket.broadcast.emit("player:left",socket.id);
  });
});
server.listen(PORT,"0.0.0.0",()=>console.log("RP3D online on port "+PORT));
