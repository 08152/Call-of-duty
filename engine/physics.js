import * as THREE from "three";
import { Events } from "./events.js";

export class Physics{

constructor(scene,player,state,world){

this.scene = scene;
this.player = player;
this.state = state;
this.world = world;

/* movement tuning */
this.acceleration = 0.08;
this.friction = 0.85;
this.airControl = 0.35;

this.gravity = 0.02;
this.jumpPower = 0.35;

this.velocity = new THREE.Vector3();

this.direction = new THREE.Vector3();

}

/* =========================
   INPUT VECTOR
========================= */

getInput(keys){

let dir =
new THREE.Vector3();

if(keys["w"]) dir.z -= 1;
if(keys["s"]) dir.z += 1;
if(keys["a"]) dir.x -= 1;
if(keys["d"]) dir.x += 1;

return dir.normalize();

}

/* =========================
   MOVE CALC
========================= */

applyMovement(keys){

const input =
this.getInput(keys);

/* forward/right */
const forward =
new THREE.Vector3(0,0,-1)
.applyEuler(this.player.rotation);

forward.y = 0;
forward.normalize();

const right =
new THREE.Vector3()
.crossVectors(forward,new THREE.Vector3(0,1,0))
.negate();

/* target direction */
this.direction.set(0,0,0);

this.direction.addScaledVector(
forward,
input.z
);

this.direction.addScaledVector(
right,
input.x
);

/* normalize */
if(this.direction.length() > 0)
this.direction.normalize();

/* sprint */
let speed =
0.15;

if(this.state.sprinting)
speed = 0.28;

if(this.state.crouching)
speed = 0.07;

/* ground vs air */
let control =
this.state.onGround ?
1 :
this.airControl;

/* velocity xz */
this.velocity.x +=
this.direction.x *
this.acceleration *
control;

this.velocity.z +=
this.direction.z *
this.acceleration *
control;

/* clamp speed */
let max =
speed;

let horizontal =
new THREE.Vector2(
this.velocity.x,
this.velocity.z
);

if(horizontal.length() > max){

horizontal.normalize().multiplyScalar(max);

this.velocity.x = horizontal.x;
this.velocity.z = horizontal.y;

}

/* friction */
if(this.state.onGround){

this.velocity.x *= this.friction;
this.velocity.z *= this.friction;

}

}

/* =========================
   GRAVITY
========================= */

applyGravity(){

this.velocity.y -=
this.gravity;

/* ground check */
if(this.player.position.y <= 0){

this.player.position.y = 0;

this.velocity.y = 0;

this.state.onGround = true;

}else{

this.state.onGround = false;

}

}

/* =========================
   COLLISION
========================= */

resolveCollision(){

const next =
this.player.position.clone()
.add(this.velocity);

const box =
new THREE.Box3()
.setFromCenterAndSize(

new THREE.Vector3(
next.x,
next.y + 1,
next.z
),

new THREE.Vector3(
0.8,
2,
0.8
)

);

/* check world barriers */
if(
this.world.checkCollision(
box
)
){

/* slide instead of stop */

const slideX =
this.player.position.clone();
slideX.x += this.velocity.x;

const slideZ =
this.player.position.clone();
slideZ.z += this.velocity.z;

/* try X */
const boxX =
new THREE.Box3()
.setFromCenterAndSize(
new THREE.Vector3(
slideX.x,
slideX.y + 1,
slideX.z
),
new THREE.Vector3(0.8,2,0.8)
);

if(!this.world.checkCollision(boxX)){
this.player.position.x = slideX.x;
}

const boxZ =
new THREE.Box3()
.setFromCenterAndSize(
new THREE.Vector3(
slideZ.x,
slideZ.y + 1,
slideZ.z
),
new THREE.Vector3(0.8,2,0.8)
);

if(!this.world.checkCollision(boxZ)){
this.player.position.z = slideZ.z;
}

return;
}

/* free move */
this.player.position.copy(next);

}

/* =========================
   JUMP
========================= */

jump(){

if(!this.state.onGround) return;

this.velocity.y =
this.jumpPower;

this.state.onGround = false;

}

/* =========================
   MAIN UPDATE
========================= */

update(dt,keys){

this.applyMovement(keys);

this.applyGravity();

this.resolveCollision();

/* apply velocity */
this.player.position.y += this.velocity.y;

}

/* =========================
   DEBUG
========================= */

getSpeed(){

return Math.sqrt(
this.velocity.x**2 +
this.velocity.z**2
);

}

}
