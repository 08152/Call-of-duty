export class EventBus{
constructor(){
this.events={};
}

on(name,fn){
(this.events[name]??=[]).push(fn);
}

emit(name,data){
(this.events[name]||[]).forEach(fn=>fn(data));
}
}

export const Events=new EventBus();
