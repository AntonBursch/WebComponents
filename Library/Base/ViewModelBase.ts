import { INotifyPropertyChanged } from "../Core/Interfaces/INotifyPropertyChanged";
import { PropertyChangedEvent} from "../Core/Classes/PropertyChangedEvent";
import { PropertyChangedEventArgs } from "../Core/Classes/PropertyChangedEventArgs";

export class ViewModelBase<T> implements INotifyPropertyChanged {
    propertyChangedEvent: PropertyChangedEvent;
    model: T;
    constructor(model: T) {
        this.model = model;
        this.propertyChangedEvent = new PropertyChangedEvent();
    }
    propertyChanged(propertyName: string) {
        this.propertyChangedEvent.invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}