export class ECS{

constructor(){

this.entities=[];

this.systems=[];

this.nextId=1;

}

/* =========================
   ENTITY
========================= */

createEntity(){

const entity={

id:this.nextId++,

components:{}

};

this.entities.push(entity);

return entity;

}

removeEntity(entity){

this.entities=
this.entities.filter(
e=>e.id!==entity.id
);

}

/* =========================
   COMPONENTS
========================= */

addComponent(
entity,
name,
data
){

entity.components[name]=data;

}

removeComponent(
entity,
name
){

delete entity.components[name];

}

getComponent(
entity,
name
){

return entity.components[name];

}

hasComponent(
entity,
name
){

return entity.components[name]
!==undefined;

}

/* =========================
   SYSTEMS
========================= */

addSystem(system){

this.systems.push(system);

}

update(dt){

for(const system of this.systems){

system.update(
dt,
this.entities
);

}

}

/* =========================
   QUERIES
========================= */

query(...components){

return this.entities.filter(entity=>{

for(const component of components){

if(
!entity.components[
component
]
){

return false;

}

}

return true;

});

}

}

/* =========================
   COMPONENT HELPERS
========================= */

export const Components={

Transform(
position,
rotation,
scale
){

return{

position,

rotation,

scale

};

},

Velocity(
velocity
){

return{

velocity

};

},

Health(
health=100
){

return{

health

};

},

Projectile(
damage=25
){

return{

damage

};

},

Enemy(){

return{

alive:true

};

},

Barrier(){

return{

solid:true

};

}

};
