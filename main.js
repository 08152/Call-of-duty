import {physics} from "./engine/physics.js";
import {Weapon} from "./engine/weapons.js";
import {FX} from "./engine/fx.js";
import {World} from "./engine/world.js";
import {Events} from "./engine/event.js";

const weapon=new Weapon();
const world=new World(scene);
const fx=new FX(scene);

fx.init();

/* INPUT */
addEventListener("mousedown",e=>{
if(e.button===0) weapon.shoot(camera);
if(e.button===2) weapon.reloadWeapon();
});

/* LOOP */
function animate(){

requestAnimationFrame(animate);

physics.update();

/* bullets */
for(const b of physics.projectiles){

b.mesh.position.copy(b.pos);

if(world.checkCollision(b.pos)){
b.dead=true;
}
}

renderer.render(scene,camera);
}

animate();
