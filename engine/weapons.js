import {physics} from "./physics.js";
import {Events} from "./event.js";

export class Weapon{

constructor(){
this.mag=30;
this.ammo=30;
this.recoil=0;
this.spread=0.02;
this.reload=false;
}

shoot(camera){

if(this.reload || this.ammo<=0) return;

this.ammo--;

// spread
const dir={
x:(Math.random()-0.5)*this.spread,
y:(Math.random()-0.5)*this.spread,
z:-1
};

physics.shoot({
pos:camera.position.clone(),
vel:new THREE.Vector3(dir.x,dir.y,dir.z).applyEuler(camera.rotation).multiplyScalar(0.6),
life:100
});

this.recoil+=0.02;

Events.emit("shot",{});
}

reloadWeapon(){

this.reload=true;

setTimeout(()=>{
this.ammo=this.mag;
this.reload=false;
},1200);
}
}
