# vertical-nav-resize

## Usage

```ts
public nav = {
    leftWidth: 19
};
```

```html
<clr-vertical-nav appNavResize [width]="nav.width" [unit]="'%'" (widthChange)="setNavWidth($event)"...>
  <app-vertical-nav-resize [width]="nav.width" [minWidth]="10" [maxWidth]="40" (widthChange)="setNavWidth($event)">
  </app-vertical-nav-resize>
```


### Inputs
- `width: number  // startWidth and width` 
- `steps: number // number of steps from min to max`
- `minWidth: number`
- `maxWidth: number`
- `slider: boolean // use range as input`

### Output
- `widthChange: number`
