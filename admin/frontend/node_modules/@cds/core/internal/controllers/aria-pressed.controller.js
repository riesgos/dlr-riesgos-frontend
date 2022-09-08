function s(){return s=>s.addInitializer((s=>new t(s)))}class t{constructor(s){this.host=s,this.host.addController(this)}hostUpdated(){null!==this.host.pressed&&void 0!==this.host.pressed&&(this.host.ariaPressed=this.host.pressed?"true":"false"),this.host.readonly&&(this.host.ariaPressed=null)}}export{t as AriaPressedController,s as ariaPressed};
//# sourceMappingURL=aria-pressed.controller.js.map
