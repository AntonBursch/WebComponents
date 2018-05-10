import { INotifyPropertyChanged } from "../Interfaces/INotifyPropertyChanged";
import { PropertyChangedEventArgs } from "../Classes/PropertyChangedEventArgs";
import { Binding } from "../Classes/Binding";
import { Delegate } from "../Classes/Delegate";

export class BindingOperations {
    static setBindings(element: Element, dataContext: INotifyPropertyChanged) {
        let selectors = element.querySelectorAll('*');
        let l = selectors.length;
        for (let s = 0; s < l; s++) {
            let selector = selectors[s];
            let l2 = selector.attributes.length;
            for (let a = 0; a < l2; a++) {
                let n = selector.attributes[a].name;
                let v = selector.attributes[a].value;
                if (v.substr(1, 7) == 'Binding') {
                    let p = v.substr(9, v.length - 10);
                    if (n == "datacontext") {
                        n = "DataContext";
                    }
                    BindingOperations.setBinding(n, selector, new Binding(p, dataContext));
                }
            }
        }
    }
    private static setBinding(propertyName: string, target: Element, binding: Binding) {
        target.addEventListener("input", (element) => {
            binding.source[binding.path] = target[propertyName];
        });
        binding.source.propertyChangedEvent.add(new Delegate(null, (sender: object, args: PropertyChangedEventArgs) => {
            if (args.propertyName == binding.path) {
                target[propertyName] = sender[args.propertyName];
            }
        }));
        target[propertyName] = binding.source[binding.path];
    }
}