import {Events} from "./event.js";

export class FX{

constructor(scene){
this.scene=scene;
}

init(){

Events.on("impact",(e)=>this.impact(e));
Events.on("shot",()=>this.muzzle());
}

impact(e){

const flash=new THREE.PointLight(0xffaa00,2,10);
flash.position.copy(e.pos);
this.scene.add(flash);

setTimeout(()=>this.scene.remove(flash),80);
}

muzzle(){

const shake=0.02;
camera.position.x+=(Math.random()-0.5)*shake;
camera.position.y+=(Math.random()-0.5)*shake;
}
}
