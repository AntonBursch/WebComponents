import { INotifyPropertyChanged } from "../Core/Interfaces/INotifyPropertyChanged";
import { TemplateOperations } from "../Core/Operations/TemplateOperations";
import { BindingOperations } from "../Core/Operations/BindingOperations";

export class ViewBase {
    private dataContext: INotifyPropertyChanged;
    private template: DocumentFragment;

    get DataContext(): INotifyPropertyChanged {
        return this.dataContext;
    }
    set DataContext(value: INotifyPropertyChanged) {
        if (this.dataContext != value) {
            this.dataContext = value;
            this.initialize();
        }
    }

    constructor(template: string) {
        this.dataContext = null;
        this.template = TemplateOperations.fromLiteral(template);
    }

    initialize(): void {
        this.removeChildren();
        let element = <Element><any>this;
        element.appendChild(this.template);
        BindingOperations.setBindings(element, this.DataContext);
    }
    removeChildren() {
        let element = <Element><any>this;
        let l = element.children.length;
        for (let c = 0; c < l; c++) {
            let child = element.children[c];
            child.remove();
        }
    }
}