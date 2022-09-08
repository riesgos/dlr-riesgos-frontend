function t(){return t=>t.addInitializer((t=>new s(t)))}class s{constructor(t){this.host=t,this.host.addController(this)}hostConnected(){this.host.popup&&(this.host.ariaControls=this.host.popup,this.host.ariaHasPopup="true",this.host.ariaExpanded="false")}}export{s as AriaPopupTriggerController,t as ariaPopupTrigger};
//# sourceMappingURL=aria-popup-trigger.controller.js.map
