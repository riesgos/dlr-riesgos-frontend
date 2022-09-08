function t(){return t=>t.addInitializer((t=>new s(t)))}class s{constructor(t){this.host=t,this.host.addController(this)}hostUpdated(){null!==this.host.selected&&void 0!==this.host.selected&&(this.host.ariaSelected=this.host.selected?"true":"false")}}export{s as AriaSelectedController,t as ariaSelected};
//# sourceMappingURL=aria-selected.controller.js.map
