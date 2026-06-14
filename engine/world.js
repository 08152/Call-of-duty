import * as THREE from "three";
import { GLTFLoader } from "gltfloader";

export class World{

constructor(scene){

this.scene = scene;

this.loader =
new GLTFLoader();

this.barriers = [];

this.ground = null;

}

/* =========================
   INIT
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

tex.wrapS =
THREE.RepeatWrapping;

tex.wrapT =
THREE.RepeatWrapping;

tex.repeat.set(
60,
60
);

this.ground =
new THREE.Mesh(

new THREE.PlaneGeometry(
5000,
5000
),

new THREE.MeshStandardMaterial({
map:tex
})

);

this.ground.rotation.x =
-Math.PI/2;

this.ground.receiveShadow =
true;

this.scene.add(
this.ground
);

}

/* =========================
   LOAD GLB
========================= */

loadBarrier(
x,
z,
scale=1
){

return new Promise(resolve=>{

this.loader.load(

"./barrier.glb",

gltf=>{

const obj =
gltf.scene.clone();

obj.scale.set(
scale,
scale,
scale
);

obj.position.set(
x,
0,
z
);

obj.traverse(mesh=>{

if(mesh.isMesh){

mesh.castShadow=true;
mesh.receiveShadow=true;

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
   MAP
========================= */

async loadBarriers(){

const data=[

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
   COLLISION
========================= */

checkCollision(box){

for(const barrier of this.barriers){

const meshBox =
new THREE.Box3()
.setFromObject(
barrier
);

if(
box.intersectsBox(
meshBox
)
){

return true;

}

}

return false;

}

/* =========================
   DEBUG
========================= */

getBarrierCount(){

return this.barriers.length;

}

}
