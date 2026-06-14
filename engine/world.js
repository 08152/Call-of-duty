import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export class World{

constructor(scene){

this.scene = scene;

this.loader = new GLTFLoader();

this.barriers = [];

this.ground = null;

}

/* =========================
   INIT (SAFE)
========================= */

async init(){

this.createGround();

/* try load barriers but NEVER block game */
await this.safeLoadBarriers();

console.log("WORLD READY:",this.barriers.length);

}

/* =========================
   GROUND (ALWAYS WORKS)
========================= */

createGround(){

const tex =
new THREE.TextureLoader().load(
"https://threejs.org/examples/textures/terrain/grasslight-big.jpg"
);

tex.wrapS = THREE.RepeatWrapping;
tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(60,60);

this.ground =
new THREE.Mesh(

new THREE.PlaneGeometry(5000,5000),

new THREE.MeshStandardMaterial({
map: tex
})

);

this.ground.rotation.x = -Math.PI/2;

this.scene.add(this.ground);

}

/* =========================
   SAFE BARIER LOADING
========================= */

async safeLoadBarriers(){

const data = [

[-10,-25],
[14,-41],
[27,-75],

[30.23,-61.29],
[23.95,-42.78],
[-21.92,-55.83],
[-2.21,-75.71],

[-23.57,-39.91],
[21.16,-89.84],
[25.66,-52.16]

];

/* IMPORTANT: no crash loop */
for(const b of data){

try{

await this.loadBarrier(b[0],b[1],1);

}catch(e){

console.warn("GLB FAILED → fallback cube");

this.createFallbackBarrier(b[0],b[1]);

}

}

}

/* =========================
   LOAD GLB BARRIER
========================= */

loadBarrier(x,z,scale=1){

return new Promise((resolve,reject)=>{

this.loader.load(

"./barrier.glb",

gltf=>{

const obj = gltf.scene.clone();

obj.scale.set(scale,scale,scale);

obj.position.set(x,0,z);

this.scene.add(obj);

this.barriers.push(obj);

resolve();

},

undefined,

err=>reject(err)

);

});

}

/* =========================
   FALLBACK (IMPORTANT)
========================= */

createFallbackBarrier(x,z){

const mesh =
new THREE.Mesh(

new THREE.BoxGeometry(2,2,2),

new THREE.MeshStandardMaterial({
color:0x333333
})

);

mesh.position.set(x,1,z);

this.scene.add(mesh);

this.barriers.push(mesh);

}

/* =========================
   COLLISION SAFE
========================= */

checkCollision(box){

for(const b of this.barriers){

if(!b) continue;

const meshBox =
new THREE.Box3().setFromObject(b);

if(box.intersectsBox(meshBox)){

return true;

}

}

return false;

}

/* =========================
   POINT CHECK (AI SAFE)
========================= */

checkCollisionFromPoint(pos){

const box =
new THREE.Box3().setFromCenterAndSize(

new THREE.Vector3(pos.x,pos.y+1,pos.z),

new THREE.Vector3(0.8,2,0.8)

);

return this.checkCollision(box);

}

}
