export class ECS{
constructor(){
this.entities=[];
}

create(){
const e={id:crypto.randomUUID(),components:{}};
this.entities.push(e);
return e;
}

add(e,name,data){
e.components[name]=data;
}

get(e,name){
return e.components[name];
}
}

export const ecs=new ECS();
