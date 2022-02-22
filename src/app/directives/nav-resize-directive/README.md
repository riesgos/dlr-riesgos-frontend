# nav-resize directive

## Usage

```ts
public nav = {
    leftWidth: 19
};
```

```html
<clr-vertical-nav appNavResize [width]="nav.width" [unit]="'%'" (widthChange)="setNavWidth($event)"...>
```


### Inputs
- `width: number  // width` 
- `unit: string // unit for width`

### Output
- `widthChange: number`
