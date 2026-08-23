export class RemotePlayers{
constructor(scene){this.scene=scene;this.meshes=new Map();}
add(id,p){
 if(this.meshes.has(id))return this.meshes.get(id);
 const m=new THREE.Mesh(new THREE.BoxGeometry(1,2,1),new THREE.MeshStandardMaterial({color:0x4da6ff}));
 m.position.set(p.x,p.y,p.z);this.scene.add(m);this.meshes.set(id,m);return m;
}
update(players,self){
 for(const [id,p] of players){if(id===self)continue;const m=this.add(id,p);m.position.lerp(new THREE.Vector3(p.x,p.y,p.z),.3);m.rotation.y=p.rotY||0;}
 for(const [id,m] of this.meshes)if(!players.has(id)){this.scene.remove(m);m.geometry.dispose();m.material.dispose();this.meshes.delete(id);}
}}
