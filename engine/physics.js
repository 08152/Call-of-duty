import {Events} from "./event.js";

export class Physics{

constructor(){
this.projectiles=[];
}

shoot(bullet){
this.projectiles.push(bullet);
}

update(){

for(const b of this.projectiles){

// gravity
b.vel.y -= 0.01;

// movement
b.pos.add(b.vel);

// trail event
Events.emit("bulletMove",b);

// ground hit
if(b.pos.y<=0){
Events.emit("impact",{pos:b.pos});
b.dead=true;
}

}

this.projectiles=this.projectiles.filter(b=>!b.dead);
}
}

export const physics=new Physics();
