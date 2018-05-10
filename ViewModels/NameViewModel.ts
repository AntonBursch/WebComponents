import { Name } from "./../Models/Name";
import { ViewModelBase } from "../Library/Base/ViewModelBase";

export class NameViewModel extends ViewModelBase<Name> {
    get First(): string {
        return this.model.first;
    }
    set First(value: string) {
        if (this.model.first != value) {
            this.model.first = value;
            this.propertyChanged('First');
        }
    }

    get Middle(): string {
        return this.model.middle;
    }
    set Middle(value: string) {
        if (this.model.middle != value) {
            this.model.middle = value;
            this.propertyChanged('Middle');
        }
    }

    get Last(): string {
        return this.model.last;
    }
    set Last(value: string) {
        if (this.model.last != value) {
            this.model.last = value;
            this.propertyChanged('Last');
        }
    }

    constructor(model: Name) {
        super(model);
    }
}