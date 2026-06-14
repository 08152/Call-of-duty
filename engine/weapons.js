import * as THREE from "three";
import { Events } from "./events.js";

export class WeaponSystem{

constructor(scene,camera,state){

this.scene = scene;
this.camera = camera;
this.state = state;

/* weapon stats */
this.magSize = 30;
this.ammo = 30;
this.reserve = 120;

this.fireRate = 90; // ms
this.lastShot = 0;

this.spread = 0.015;
this.recoil = 0;

this.projectiles = [];

/* sounds */
this.shootSound = new Audio("./shoot.mp3");
this.reloadSound = new Audio("./reload.mp3");

}

/* =========================
   INIT (weapon model hook)
========================= */

async init(){

Events.on("impact",e=>{
// optional fx hook
});

}

/* =========================
   FIRE
========================= */

fire(){

const now =
performance.now();

if(now - this.lastShot < this.fireRate)
return;

if(this.state.reloading)
return;

if(this.ammo <= 0)
return;

this.lastShot = now;

this.ammo--;

/* recoil */
this.recoil += 0.02;

/* spread */
const dir =
new THREE.Vector3(
(Math.random()-0.5)*this.spread,
(Math.random()-0.5)*this.spread,
-1
);

/* apply camera rotation */
dir.applyEuler(
this.camera.rotation
);

/* projectile */
const bullet = {

pos: this.camera.position.clone(),

vel: dir.multiplyScalar(0.8),

life: 120,

damage: 25,

mesh: this.createTracer()

};

this.projectiles.push(bullet);

/* sound */
this.shootSound.currentTime = 0;
this.shootSound.play();

/* event */
Events.emit("shot",{});

}

/* =========================
   TRACER VISUAL
========================= */

createTracer(){

const geo =
new THREE.SphereGeometry(0.03,6,6);

const mat =
new THREE.MeshBasicMaterial({
color:0xffff00
});

const mesh =
new THREE.Mesh(geo,mat);

this.scene.add(mesh);

return mesh;

}

/* =========================
   UPDATE PROJECTILES
========================= */

update(dt){

for(const b of this.projectiles){

/* gravity (bullet drop) */
b.vel.y -= 0.01;

/* move */
b.pos.add(b.vel);

/* sync mesh */
b.mesh.position.copy(b.pos);

b.life--;

/* hit ground */
if(b.pos.y <= 0){

this.explode(b.pos);

b.dead = true;

}

/* remove */
if(b.life <= 0){

this.scene.remove(b.mesh);

b.dead = true;

}

}

/* cleanup */
this.projectiles =
this.projectiles.filter(b=>{

if(b.dead){

this.scene.remove(b.mesh);

return false;

}

return true;

});

}

/* =========================
   EXPLOSION FX
========================= */

explode(pos){

const light =
new THREE.PointLight(
0xffaa00,
2,
10
);

light.position.copy(pos);

this.scene.add(light);

/* screen shake */
Events.emit("impact",{pos});

/* fade */
setTimeout(()=>{

this.scene.remove(light);

},80);

}

/* =========================
   RELOAD
========================= */

reload(){

if(this.state.reloading)
return;

if(this.ammo === this.magSize)
return;

this.state.reloading = true;

this.reloadSound.currentTime = 0;
this.reloadSound.play();

setTimeout(()=>{

const needed =
this.magSize - this.ammo;

const take =
Math.min(
needed,
this.reserve
);

this.ammo += take;
this.reserve -= take;

this.state.reloading = false;

},1200);

}

/* =========================
   UPDATE
========================= */

update(dt){

this.update(dt);

/* recoil decay */
this.recoil *= 0.9;

/* apply recoil camera kick */
this.camera.rotation.x -= this.recoil;

}

}
