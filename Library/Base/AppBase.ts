import { INotifyPropertyChanged } from "../Core/Interfaces/INotifyPropertyChanged";
import { PropertyChangedEvent } from "../Core/Classes/PropertyChangedEvent";
import { PropertyChangedEventArgs } from "../Core/Classes/PropertyChangedEventArgs";
import { ComponentOperations } from "../Core/Operations/ComponentOperations";
import { BindingOperations } from "../Core/Operations/BindingOperations";

export class AppBase implements INotifyPropertyChanged {
    propertyChangedEvent: PropertyChangedEvent;

    constructor() {
        this.propertyChangedEvent = new PropertyChangedEvent();
    }

    propertyChanged(propertyName: string) {
        this.propertyChangedEvent.invoke(this, new PropertyChangedEventArgs(propertyName));
    }

    load() {
        window.onload = () => {
            var elements = document.body.querySelectorAll('*');
            var l = elements.length;
            for (var e = 0; e < l; e++) {
                var element = elements[e];
                let tagName = element.tagName.toLowerCase();
                if (ComponentOperations.components[tagName] != null) {
                    ComponentOperations.attach(element, new ComponentOperations.components[tagName]());
                }
            }
            BindingOperations.setBindings(document.body, app);
        };
    }
}