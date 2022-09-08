import{createId as e}from"../utils/identity.js";function t(){return(t,r)=>{const i={get(){const i=void 0!==r?r:t.key;return this["__"+i]||(this["__"+i]=e()),this["__"+i]},enumerable:!0,configurable:!0};return void 0!==r?((e,t,r)=>{Object.defineProperty(t,r,e)})(i,t,r):((e,t)=>({kind:"method",placement:"prototype",key:t.key,descriptor:e}))(i,t)}}export{t as id};
//# sourceMappingURL=id.js.map
