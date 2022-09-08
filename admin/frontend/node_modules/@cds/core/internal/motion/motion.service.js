import{GlobalStateService as t}from"../services/global.service.js";class r{static get registry(){return{...t.state.motionRegistry}}static has(t){return!!t&&!!r.registry[t]}static get(t){return r.registry[t]||[]}static add(r,s){r&&s&&(t.state.motionRegistry={...t.state.motionRegistry,[r]:s})}}export{r as ClarityMotion};
//# sourceMappingURL=motion.service.js.map
