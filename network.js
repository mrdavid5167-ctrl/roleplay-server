export const socket=io();
export const state={selfId:null,players:new Map(),connected:false};
socket.on("connect",()=>{state.connected=true;state.selfId=socket.id;document.getElementById("status").textContent="Online";});
socket.on("disconnect",()=>{state.connected=false;document.getElementById("status").textContent="Offline";});
socket.on("connect_error",()=>{state.connected=false;document.getElementById("status").textContent="Connection failed";});
socket.on("world:init",d=>{state.selfId=d.selfId;state.players.clear();d.players.forEach(p=>state.players.set(p.id,p));});
socket.on("player:joined",p=>state.players.set(p.id,p));
socket.on("player:updated",p=>state.players.set(p.id,p));
socket.on("player:left",id=>state.players.delete(id));
export function sendPosition(p){if(state.connected)socket.emit("player:update",p);}
