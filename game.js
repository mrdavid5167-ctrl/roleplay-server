import{state,sendPosition}from"./network.js";
import{RemotePlayers}from"./remotePlayers.js";
const canvas=document.getElementById("game");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
const scene=new THREE.Scene();scene.background=new THREE.Color(0x87ceeb);
const camera=new THREE.PerspectiveCamera(60,1,.1,500);
scene.add(new THREE.HemisphereLight(0xffffff,0x445566,2));
const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),new THREE.MeshStandardMaterial({color:0x4c7a45}));
ground.rotation.x=-Math.PI/2;scene.add(ground);scene.add(new THREE.GridHelper(120,60));
const player=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial({color:0xffcc66}));
player.position.y=1;scene.add(player);
const remotes=new RemotePlayers(scene),keys={};let last=0;
addEventListener("keydown",e=>keys[e.key.toLowerCase()]=true);
addEventListener("keyup",e=>keys[e.key.toLowerCase()]=false);
for(const [id,key] of Object.entries({up:"w",down:"s",left:"a",right:"d"})){
 const b=document.getElementById(id);
 b.onpointerdown=e=>{e.preventDefault();keys[key]=true};
 b.onpointerup=e=>{e.preventDefault();keys[key]=false};
 b.onpointercancel=()=>keys[key]=false;b.onpointerleave=()=>keys[key]=false;
}
function resize(){renderer.setSize(innerWidth,innerHeight,false);camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix()}addEventListener("resize",resize);resize();
function loop(t){
 const dt=Math.min((t-last)/1000,.05);last=t;let x=0,z=0;
 if(keys.w||keys.arrowup)z--;if(keys.s||keys.arrowdown)z++;if(keys.a||keys.arrowleft)x--;if(keys.d||keys.arrowright)x++;
 const n=Math.hypot(x,z);if(n){x/=n;z/=n;player.position.x+=x*5*dt;player.position.z+=z*5*dt;player.rotation.y=Math.atan2(x,z);}
 camera.position.set(player.position.x,7,player.position.z+10);camera.lookAt(player.position.x,1,player.position.z);
 if(t-last<1e3&&t-(loop.sent||0)>50){sendPosition({x:player.position.x,y:player.position.y,z:player.position.z,rotY:player.rotation.y});loop.sent=t}
 remotes.update(state.players,state.selfId);document.getElementById("players").textContent="Players: "+state.players.size;
 renderer.render(scene,camera);requestAnimationFrame(loop)
}requestAnimationFrame(loop);
