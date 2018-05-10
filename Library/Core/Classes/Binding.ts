import { INotifyPropertyChanged } from "../Interfaces/INotifyPropertyChanged";

export class Binding {
    path: string;
    source: INotifyPropertyChanged;
    constructor(path: string, source: INotifyPropertyChanged) {
        this.path = path;
        this.source = source;
    }
}