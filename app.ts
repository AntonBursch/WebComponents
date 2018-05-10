import { AppBase } from "./Library/Base/AppBase";
import { Name } from "./Models/Name";
import { NameViewModel } from "./ViewModels/NameViewModel";
import { NameView } from "./Views/NameView";

class App extends AppBase {
    name: Name;
    nameViewModel: NameViewModel;

    get NameViewModel(): NameViewModel {
        return this.nameViewModel;
    }
    set NameViewModel(value: NameViewModel) {
        if (this.nameViewModel != value) {
            this.nameViewModel = value;
            this.propertyChanged('NameViewModel');
        }
    }

    constructor() {
        super();
        this.name = new Name().from({
            first: "Anton",
            middle: "C",
            last: "Bursch"
        });
        this.nameViewModel = new NameViewModel(this.name);
    }
}

let app = new App().load();