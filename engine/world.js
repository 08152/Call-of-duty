import {Events} from "./event.js";

export class World{

constructor(scene){
this.scene=scene;
this.barriers=[];
}

addBarrier(mesh){
this.scene.add(mesh);
this.barriers.push(mesh);
}

checkCollision(pos){

for(const b of this.barriers){
if(b.position.distanceTo(pos)<1.2){
Events.emit("collision",{});
return true;
}
}

return false;
}
}
