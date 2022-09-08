function t(){return t=>t.addInitializer((t=>new s(t)))}class s{constructor(t){this.host=t,this.host.addController(this)}hostUpdated(){null!==this.host.disabled&&(this.host.ariaDisabled=this.host.disabled),this.host.readonly&&(this.host.ariaDisabled=null)}}export{s as AriaDisabledController,t as ariaDisabled};
//# sourceMappingURL=aria-disabled.controller.js.map
