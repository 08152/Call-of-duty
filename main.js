import * as THREE from "three";

import { World } from "./engine/world.js";
import { Physics } from "./engine/physics.js";
import { WeaponSystem } from "./engine/weapons.js";
import { Effects } from "./engine/effects.js";
import { ECS } from "./engine/ecs.js";
import { Events } from "./engine/events.js";

/* =========================
   ENGINE CORE
========================= */

export const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87cfff);

export const camera =
new THREE.PerspectiveCamera(
75,
window.innerWidth/window.innerHeight,
0.1,
5000
);

export const renderer =
new THREE.WebGLRenderer({
antialias:true
});

renderer.setSize(
window.innerWidth,
window.innerHeight
);

renderer.shadowMap.enabled = true;

document.body.appendChild(
renderer.domElement
);

/* =========================
   LIGHTING
========================= */

const ambient =
new THREE.AmbientLight(
0xffffff,
1.2
);

scene.add(ambient);

const sun =
new THREE.DirectionalLight(
0xffffff,
2
);

sun.position.set(
50,
100,
50
);

sun.castShadow=true;

scene.add(sun);

/* =========================
   PLAYER
========================= */

export const player =
new THREE.Object3D();

scene.add(player);

player.add(camera);

camera.position.set(
0,
1.75,
0
);

/* =========================
   PLAYER DATA
========================= */

export const playerState={

health:100,

stamina:100,

ammo:30,

reserveAmmo:120,

sprinting:false,

crouching:false,

aiming:false,

onGround:false,

velocity:new THREE.Vector3(),

yaw:0,

pitch:0

};

/* =========================
   INPUT
========================= */

export const keys={};

window.addEventListener(
"keydown",
e=>{

keys[e.key.toLowerCase()] = true;

if(e.key==="Shift"){
playerState.sprinting=true;
}

}
);

window.addEventListener(
"keyup",
e=>{

keys[e.key.toLowerCase()] = false;

if(e.key==="Shift"){
playerState.sprinting=false;
}

}
);

/* =========================
   POINTER LOCK
========================= */

document.body.addEventListener(
"click",
()=>{

document.body.requestPointerLock();

}
);

document.addEventListener(
"mousemove",
e=>{

if(
document.pointerLockElement
!==document.body
)return;

playerState.yaw -=
e.movementX*0.002;

playerState.pitch -=
e.movementY*0.002;

playerState.pitch =
Math.max(
-1.4,
Math.min(
1.4,
playerState.pitch
)
);

player.rotation.y =
playerState.yaw;

camera.rotation.x =
playerState.pitch;

}
);

/* =========================
   ECS
========================= */

export const ecs =
new ECS();

/* =========================
   WORLD
========================= */

export const world =
new World(
scene
);

/* =========================
   PHYSICS
========================= */

export const physics =
new Physics(
scene,
player,
playerState
);

/* =========================
   EFFECTS
========================= */

export const effects =
new Effects(
scene
);

/* =========================
   WEAPONS
========================= */

export const weapons =
new WeaponSystem(
scene,
camera,
playerState
);

/* =========================
   LOAD
========================= */

async function loadGame(){

await world.init();

await weapons.init();

document
.getElementById(
"loading"
)
.style.display="none";

}

loadGame();

/* =========================
   UI
========================= */

function updateUI(){

document
.getElementById(
"healthFill"
)
.style.width =
playerState.health+"%";

document
.getElementById(
"staminaFill"
)
.style.width =
playerState.stamina+"%";

document
.getElementById(
"ammo"
)
.innerText =
playerState.ammo+
" / "+
playerState.reserveAmmo;

}

/* =========================
   DEBUG
========================= */

function updateDebug(){

const dir =
new THREE.Vector3(
0,
0,
-1
).applyEuler(
player.rotation
);

document
.getElementById(
"debug"
)
.innerText =

`X: ${player.position.x.toFixed(2)}
Y: ${player.position.y.toFixed(2)}
Z: ${player.position.z.toFixed(2)}

DIR X: ${dir.x.toFixed(2)}
DIR Z: ${dir.z.toFixed(2)}

HEALTH: ${playerState.health}

STAMINA: ${playerState.stamina.toFixed(0)}

AMMO: ${playerState.ammo}

FPS ENGINE V4`;

}

/* =========================
   FIXED PHYSICS LOOP
========================= */

const PHYSICS_FPS = 120;

const PHYSICS_STEP =
1 / PHYSICS_FPS;

let previousTime =
performance.now();

let accumulator=0;

function physicsLoop(dt){

physics.update(
dt,
keys
);

weapons.update(
dt
);

effects.update(
dt
);

}

/* =========================
   MAIN LOOP
========================= */

function animate(now){

requestAnimationFrame(
animate
);

let delta =
(now-previousTime)
/1000;

previousTime=now;

accumulator += delta;

while(
accumulator>=PHYSICS_STEP
){

physicsLoop(
PHYSICS_STEP
);

accumulator -=
PHYSICS_STEP;

}

updateUI();

updateDebug();

renderer.render(
scene,
camera
);

}

requestAnimationFrame(
animate
);

/* =========================
   RESIZE
========================= */

window.addEventListener(
"resize",
()=>{

camera.aspect =
window.innerWidth/
window.innerHeight;

camera.updateProjectionMatrix();

renderer.setSize(
window.innerWidth,
window.innerHeight
);

}
);

/* =========================
   INPUT ACTIONS
========================= */

window.addEventListener(
"mousedown",
e=>{

if(e.button===0){

weapons.fire();

}

if(e.button===2){

playerState.aiming=true;

}

}
);

window.addEventListener(
"mouseup",
e=>{

if(e.button===2){

playerState.aiming=false;

}

}
);

window.addEventListener(
"keydown",
e=>{

if(
e.key.toLowerCase()==="r"
){

weapons.reload();

}

}
);
