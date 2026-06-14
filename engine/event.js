export class EventBus{

constructor(){

this.events={};

}

on(name,callback){

if(!this.events[name]){

this.events[name]=[];

}

this.events[name].push(callback);

}

off(name,callback){

if(!this.events[name]) return;

this.events[name]=
this.events[name].filter(
fn=>fn!==callback
);

}

emit(name,data={}){

if(!this.events[name]) return;

for(const fn of this.events[name]){

fn(data);

}

}

clear(name){

if(this.events[name]){

delete this.events[name];

}

}

}

export const Events =
new EventBus();
