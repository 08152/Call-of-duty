import * as THREE from "three";
import { Events } from "./events.js";

export class EnemySystem{

constructor(scene,player,world){

this.scene = scene;
this.player = player;
this.world = world;

this.enemies = [];

this.speed = 0.04;

}

/* =========================
   SPAWN
========================= */

spawn(x,y,z){

const mesh =
new THREE.Mesh(

new THREE.BoxGeometry(1,2,1),

new THREE.MeshStandardMaterial({
color:0xff0000
})

);

mesh.position.set(x,y,z);

mesh.health = 100;

mesh.state = "idle";

this.scene.add(mesh);

this.enemies.push(mesh);

}

/* =========================
   AI UPDATE
========================= */

update(dt){

for(const e of this.enemies){

const dist =
e.position.distanceTo(
this.player.position
);

/* =========================
   STATE MACHINE
========================= */

/* idle -> detect player */
if(dist < 20){

e.state = "chase";

}

/* chase */
if(e.state === "chase"){

this.chase(e);

}

/* attack */
if(dist < 2){

this.attack(e);

}

/* death */
if(e.health <= 0){

this.scene.remove(e);

e.dead = true;

}

}

/* cleanup */
this.enemies =
this.enemies.filter(e=>!e.dead);

}

/* =========================
   CHASE LOGIC
========================= */

chase(enemy){

const dir =
new THREE.Vector3()
.subVectors(
this.player.position,
enemy.position
);

dir.y = 0;

dir.normalize();

/* simple obstacle avoidance */
const next =
enemy.position.clone()
.addScaledVector(dir,this.speed);

if(!this.world.checkCollisionFromPoint(next)){

enemy.position.copy(next);

}

/* face player */
enemy.lookAt(
this.player.position
);

}

/* =========================
   ATTACK
========================= */

attack(enemy){

Events.emit("playerHit",{
damage:5
});

this.knockback(enemy);

}

/* =========================
   KNOCKBACK
========================= */

knockback(enemy){

const dir =
new THREE.Vector3()
.subVectors(
enemy.position,
this.player.position
)
.normalize();

enemy.position.addScaledVector(dir,0.5);

}

}
