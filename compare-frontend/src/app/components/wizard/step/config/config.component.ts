import { Component, Input } from '@angular/core';
import { RiesgosStep } from 'src/app/state/state';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})
export class ConfigComponent {
  @Input() step!: RiesgosStep["step"];
}
