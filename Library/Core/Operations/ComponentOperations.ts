export class ComponentOperations {
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
        ComponentOperations.components[selector.toLowerCase()] = type;
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