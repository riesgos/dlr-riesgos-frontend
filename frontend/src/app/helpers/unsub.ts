import { Subscription } from 'rxjs';
import { unByKey } from 'ol/Observable';
import { EventsKey } from 'ol/events';

export class CollectSub {
  protected privSubs: Array<Subscription | EventsKey> = [];
  public get subs(): Array<Subscription | EventsKey> {
    return this.privSubs;
  }


  public set subs(value: Subscription | EventsKey | Array<Subscription | EventsKey>) {
    if (Array.isArray(value)) {
      this.privSubs.push(...value);
    } else {
      this.privSubs.push(value);
    }
  }

  public unsubscribe(): void {
    this.subs.forEach(s => {
      console.log(s)
      if (s instanceof Subscription) {
        s.unsubscribe();
      } else if ('listener' in s && 'target' in s && 'type' in s) {
        unByKey(s);
      }
    });
  }
}
