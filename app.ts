// library
class Binding {
    path: string;
    source: INotifyPropertyChanged;
    constructor(path: string, source: INotifyPropertyChanged) {
        this.path = path;
        this.source = source;
    }
}

class BindingOperations {
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

class ComponentOperations {
    static components: object = {};
    static attach(element: Element, component: object) {
        //for (let p in component) {
        //    if (p != "constructor") {
        //        let d = Object.getOwnPropertyDescriptor(component, p);
        //        Object.defineProperty(element, p, d);
        //    }
        //}
        for (let p in component) {
            element[p] = component[p];
        }
        Object.defineProperty(element, "DataContext", {
            get: function () {
                return this.dataContext;
            },
            set: function (value) {
                if (this.dataContext != value) {
                    this.dataContext = value;
                    this.initialize();
                }
            },
            enumerable: true,
            configurable: true
        });
    }
    static contains(selector: string): boolean {
        if (ComponentOperations.components[selector] != null) {
            return true;
        }
        return false;
    }
    static register(selector: string, type: Function): string {
        ComponentOperations.components[selector] = type;
        return selector;
    }
    static selectAll(parent: Element): Element[] {
        let elements: Element[] = [];
        let selectors = parent.querySelectorAll("*");
        let l = selectors.length;
        for (let s = 0; s < l; s++) {
            let selector = selectors[s];
            if (ComponentOperations.contains(selector.tagName)) {
                elements.push(selector);
            }
        }
        return elements;
    }
}

class TemplateOperations {
    static fromLiteral(value: string): DocumentFragment {
        let template = document.createElement("template");
        template.innerHTML = value;
        let documentFragment = null;
        if (template.content != null) {
            documentFragment = template.content.cloneNode(true);
        } else {
            documentFragment = template.cloneNode(true);
        }
        return documentFragment;
    }
}

class Delegate {
    target: object;
    method: Function;
    constructor(target: object, method: Function) {
        this.target = target;
        this.method = method;
    }
}

class PropertyChangedEvent {
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

class PropertyChangedEventArgs {
    propertyName: string;
    constructor(propertyName: string) {
        this.propertyName = propertyName;
    }
}

interface INotifyPropertyChanged {
    propertyChangedEvent: PropertyChangedEvent;
}

// mvvm
class ViewModelBase<T> implements INotifyPropertyChanged {
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

class ViewBase {
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

// name
class Name {
    first: string;
    middle: string;
    last: string;
    constructor(first: string, middle: string, last: string) {
        this.first = first;
        this.middle = middle;
        this.last = last;
    }
}

class NameViewModel extends ViewModelBase<Name> {
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

class NameView extends ViewBase {
    static selector: string = ComponentOperations.register("nameview", NameView);
    constructor() {
        super(`
            <label>First</label> <input value="{Binding First}" /> <br/>
            <label>Middle</label> <input value="{Binding Middle}" /> <br/>
            <label>Last</label> <input value="{Binding Last}" /> <br/>
            <br/>
        `);
    }
}

// app
class App implements INotifyPropertyChanged {
    propertyChangedEvent: PropertyChangedEvent;
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
        this.propertyChangedEvent = new PropertyChangedEvent();
        this.name = new Name('Anton', 'C', 'Bursch');
        this.nameViewModel = new NameViewModel(this.name);
    }

    propertyChanged(propertyName: string) {
        this.propertyChangedEvent.invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}

// test
let app = new App();

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