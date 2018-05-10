import { Delegate } from "./Delegate";
import { PropertyChangedEventArgs } from "./PropertyChangedEventArgs";

export class PropertyChangedEvent {
    delegates: Delegate[];
    constructor() {
        this.delegates = [];
    }
    add(delegate: Delegate) {
        this.delegates.push(delegate);
    }
    remove(delegate: Delegate) {
        let l = this.delegates.length;
        for (let d = 0; d < l; d++) {
            if (this.delegates[d] == delegate) {
                this.delegates.splice(d, 1);
                break;
            }
        }
    }
    invoke(sender: object, args: PropertyChangedEventArgs) {
        let l = this.delegates.length;
        for (let d = 0; d < l; d++) {
            let delegate = this.delegates[d];
            delegate.method(sender, args);
        }
    }
}
