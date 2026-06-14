import * as THREE from "three";
import { Events } from "./events.js";

export class Effects{

constructor(scene,camera){

this.scene = scene;
this.camera = camera;

/* shake */
this.shakePower = 0;
this.shakeDecay = 0.85;

/* particles */
this.particles = [];

this.initEvents();

}

/* =========================
   EVENTS
========================= */

initEvents(){

/* shot */
Events.on("shot",()=>{
this.shake(0.05);
});

/* impact */
Events.on("impact",(e)=>{

this.shake(0.12);

this.spawnImpactFX(
e.pos || new THREE.Vector3()
);

});

}

/* =========================
   SCREEN SHAKE
========================= */

shake(power){

this.shakePower = Math.max(
this.shakePower,
power
);

}

/* =========================
   IMPACT FX
========================= */

spawnImpactFX(pos){

for(let i=0;i<8;i++){

const vel =
new THREE.Vector3(
(Math.random()-0.5)*0.2,
Math.random()*0.2,
(Math.random()-0.5)*0.2
);

this.particles.push({

pos: pos.clone(),

vel,

life: 30,

mesh: this.createParticle()

});

}

}

/* =========================
   PARTICLE
========================= */

createParticle(){

const geo =
new THREE.SphereGeometry(0.05,6,6);

const mat =
new THREE.MeshBasicMaterial({
color:0xffaa00
});

const mesh =
new THREE.Mesh(geo,mat);

this.scene.add(mesh);

return mesh;

}

/* =========================
   UPDATE
========================= */

update(dt){

/* SCREEN SHAKE */
if(this.shakePower > 0){

this.camera.position.x +=
(Math.random()-0.5)*this.shakePower;

this.camera.position.y +=
(Math.random()-0.5)*this.shakePower;

this.camera.position.z +=
(Math.random()-0.5)*this.shakePower;

this.shakePower *= this.shakeDecay;

if(this.shakePower < 0.001)
this.shakePower = 0;

}

/* PARTICLES */
for(const p of this.particles){

p.pos.add(p.vel);

p.vel.y -= 0.01;

p.life--;

p.mesh.position.copy(p.pos);

/* fade out */
if(p.life <= 0){

this.scene.remove(p.mesh);

p.dead = true;

}

}

/* cleanup */
this.particles =
this.particles.filter(p=>{

if(p.dead) return false;

return true;

});

}

/* =========================
   FOOTSTEP HOOK (optional)
========================= */

footstep(){

// später sound hook
// new Audio("./footstep.mp3").play();

}

/* =========================
   EXPLOSION FX (simple)
========================= */

explosion(pos){

this.shake(0.25);

for(let i=0;i<20;i++){

this.particles.push({

pos: pos.clone(),

vel: new THREE.Vector3(
(Math.random()-0.5)*0.5,
Math.random()*0.4,
(Math.random()-0.5)*0.5
),

life: 40,

mesh: this.createParticle()

});

}

}

}
