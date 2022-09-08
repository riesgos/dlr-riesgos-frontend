import{createId as t}from"./identity.js";import{setAttributes as i}from"./dom.js";function r(r,a){i(r,["aria-describedby",!!a.length&&a.map((i=>i.id=t())).join(" ")])}function a(t){return t.hasAttribute("aria-label")||t.hasAttribute("aria-labelledby")}export{r as describeElementByElements,a as hasAriaLabelTypeAttr};
//# sourceMappingURL=a11y.js.map
