import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { ConfigService } from 'src/app/services/config.service';
import { RiesgosState } from 'src/app/state/state';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.css']
})
export class TutorialComponent {


  public tutorial: "Chile" | "Peru" = "Peru";

  constructor(
    private store: Store<{ riesgos: RiesgosState }>,
    private configService: ConfigService
    ) {
      const allowedScenarios = this.configService.getConfig().allowedScenarios;
      if (allowedScenarios.includes("ChileShort") || allowedScenarios.includes("ChileCached")) this.tutorial = "Chile";
      // if (allowedScenarios.includes("PeruShort") || allowedScenarios.includes("PeruCached")) this.tutorial = "Peru";
    }
}
