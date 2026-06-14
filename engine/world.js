import * as THREE from "three";
import { GLTFLoader } from "gltfloader";

export class World{

constructor(scene){

this.scene = scene;

this.loader = new GLTFLoader();

this.barriers = [];
this.ground = null;

}

/* =========================
   INIT WORLD
========================= */

async init(){

this.createGround();

await this.loadBarriers();

}

/* =========================
   GROUND
========================= */

createGround(){

const tex =
new THREE.TextureLoader().load(
"https://threejs.org/examples/textures/terrain/grasslight-big.jpg"
);

tex.wrapS = THREE.RepeatWrapping;
tex.wrapT = THREE.RepeatWrapping;
tex.repeat.set(80,80);

this.ground =
new THREE.Mesh(

new THREE.PlaneGeometry(5000,5000),

new THREE.MeshStandardMaterial({
map: tex
})

);

this.ground.rotation.x = -Math.PI/2;

this.ground.receiveShadow = true;

this.scene.add(this.ground);

}

/* =========================
   LOAD SINGLE BARRIER
========================= */

loadBarrier(x,z,scale=1){

return new Promise(resolve=>{

this.loader.load(

"./barrier.glb",

gltf=>{

const obj = gltf.scene.clone();

obj.scale.set(scale,scale,scale);

/* snap to ground */
const ray =
new THREE.Raycaster();

ray.set(
new THREE.Vector3(x,100,z),
new THREE.Vector3(0,-1,0)
);

const hit =
ray.intersectObject(this.ground);

const y =
hit.length ? hit[0].point.y : 0;

obj.position.set(x,y,z);

obj.traverse(m=>{

if(m.isMesh){

m.castShadow = true;
m.receiveShadow = true;

}

});

this.scene.add(obj);

this.barriers.push(obj);

resolve();

}

);

});

}

/* =========================
   MAP DATA (ALL BARRIERS)
========================= */

async loadBarriers(){

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

for(const b of data){

await this.loadBarrier(
b[0],
b[1],
1
);

}

}

/* =========================
   COLLISION CHECK
========================= */

checkCollision(box){

for(const b of this.barriers){

const meshBox =
new THREE.Box3()
.setFromObject(b);

if(box.intersectsBox(meshBox)){
return true;
}

}

return false;

}

/* =========================
   POINT COLLISION (AI USE)
========================= */

checkCollisionFromPoint(pos){

const box =
new THREE.Box3()
.setFromCenterAndSize(

new THREE.Vector3(
pos.x,
pos.y + 1,
pos.z
),

new THREE.Vector3(
0.8,
2,
0.8
)

);

return this.checkCollision(box);

}

/* =========================
   UTIL
========================= */

getBarrierCount(){

return this.barriers.length;

}

}
