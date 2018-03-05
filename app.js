var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// library
var Binding = (function () {
    function Binding(path, source) {
        this.path = path;
        this.source = source;
    }
    return Binding;
}());
var BindingOperations = (function () {
    function BindingOperations() {
    }
    BindingOperations.setBindings = function (element, dataContext) {
        var selectors = element.querySelectorAll('*');
        var l = selectors.length;
        for (var s = 0; s < l; s++) {
            var selector = selectors[s];
            var l2 = selector.attributes.length;
            for (var a = 0; a < l2; a++) {
                var n = selector.attributes[a].name;
                var v = selector.attributes[a].value;
                if (v.substr(1, 7) == 'Binding') {
                    var p = v.substr(9, v.length - 10);
                    if (n == "datacontext") {
                        n = "DataContext";
                    }
                    BindingOperations.setBinding(n, selector, new Binding(p, dataContext));
                }
            }
        }
    };
    BindingOperations.setBinding = function (propertyName, target, binding) {
        target.addEventListener("input", function (element) {
            binding.source[binding.path] = target[propertyName];
        });
        binding.source.propertyChangedEvent.add(new Delegate(null, function (sender, args) {
            if (args.propertyName == binding.path) {
                target[propertyName] = sender[args.propertyName];
            }
        }));
        target[propertyName] = binding.source[binding.path];
    };
    return BindingOperations;
}());
var ComponentOperations = (function () {
    function ComponentOperations() {
    }
    ComponentOperations.attach = function (element, component) {
        //for (let p in component) {
        //    if (p != "constructor") {
        //        let d = Object.getOwnPropertyDescriptor(component, p);
        //        Object.defineProperty(element, p, d);
        //    }
        //}
        for (var p in component) {
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
    };
    ComponentOperations.contains = function (selector) {
        if (ComponentOperations.components[selector] != null) {
            return true;
        }
        return false;
    };
    ComponentOperations.register = function (selector, type) {
        ComponentOperations.components[selector] = type;
        return selector;
    };
    ComponentOperations.selectAll = function (parent) {
        var elements = [];
        var selectors = parent.querySelectorAll("*");
        var l = selectors.length;
        for (var s = 0; s < l; s++) {
            var selector = selectors[s];
            if (ComponentOperations.contains(selector.tagName)) {
                elements.push(selector);
            }
        }
        return elements;
    };
    return ComponentOperations;
}());
ComponentOperations.components = {};
var TemplateOperations = (function () {
    function TemplateOperations() {
    }
    TemplateOperations.fromLiteral = function (value) {
        var template = document.createElement("template");
        template.innerHTML = value;
        var documentFragment = null;
        if (template.content != null) {
            documentFragment = template.content.cloneNode(true);
        }
        else {
            documentFragment = template.cloneNode(true);
        }
        return documentFragment;
    };
    return TemplateOperations;
}());
var Delegate = (function () {
    function Delegate(target, method) {
        this.target = target;
        this.method = method;
    }
    return Delegate;
}());
var PropertyChangedEvent = (function () {
    function PropertyChangedEvent() {
        this.delegates = [];
    }
    PropertyChangedEvent.prototype.add = function (delegate) {
        this.delegates.push(delegate);
    };
    PropertyChangedEvent.prototype.remove = function (delegate) {
        var l = this.delegates.length;
        for (var d = 0; d < l; d++) {
            if (this.delegates[d] == delegate) {
                this.delegates.splice(d, 1);
                break;
            }
        }
    };
    PropertyChangedEvent.prototype.invoke = function (sender, args) {
        var l = this.delegates.length;
        for (var d = 0; d < l; d++) {
            var delegate = this.delegates[d];
            delegate.method(sender, args);
        }
    };
    return PropertyChangedEvent;
}());
var PropertyChangedEventArgs = (function () {
    function PropertyChangedEventArgs(propertyName) {
        this.propertyName = propertyName;
    }
    return PropertyChangedEventArgs;
}());
// mvvm
var ViewModelBase = (function () {
    function ViewModelBase(model) {
        this.model = model;
        this.propertyChangedEvent = new PropertyChangedEvent();
    }
    ViewModelBase.prototype.propertyChanged = function (propertyName) {
        this.propertyChangedEvent.invoke(this, new PropertyChangedEventArgs(propertyName));
    };
    return ViewModelBase;
}());
var ViewBase = (function () {
    function ViewBase(template) {
        this.dataContext = null;
        this.template = TemplateOperations.fromLiteral(template);
    }
    Object.defineProperty(ViewBase.prototype, "DataContext", {
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
    ViewBase.prototype.initialize = function () {
        this.removeChildren();
        var element = this;
        element.appendChild(this.template);
        BindingOperations.setBindings(element, this.DataContext);
    };
    ViewBase.prototype.removeChildren = function () {
        var element = this;
        var l = element.children.length;
        for (var c = 0; c < l; c++) {
            var child = element.children[c];
            child.remove();
        }
    };
    return ViewBase;
}());
// name
var Name = (function () {
    function Name(first, middle, last) {
        this.first = first;
        this.middle = middle;
        this.last = last;
    }
    return Name;
}());
var NameViewModel = (function (_super) {
    __extends(NameViewModel, _super);
    function NameViewModel(model) {
        return _super.call(this, model) || this;
    }
    Object.defineProperty(NameViewModel.prototype, "First", {
        get: function () {
            return this.model.first;
        },
        set: function (value) {
            if (this.model.first != value) {
                this.model.first = value;
                this.propertyChanged('First');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NameViewModel.prototype, "Middle", {
        get: function () {
            return this.model.middle;
        },
        set: function (value) {
            if (this.model.middle != value) {
                this.model.middle = value;
                this.propertyChanged('Middle');
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NameViewModel.prototype, "Last", {
        get: function () {
            return this.model.last;
        },
        set: function (value) {
            if (this.model.last != value) {
                this.model.last = value;
                this.propertyChanged('Last');
            }
        },
        enumerable: true,
        configurable: true
    });
    return NameViewModel;
}(ViewModelBase));
var NameView = (function (_super) {
    __extends(NameView, _super);
    function NameView() {
        return _super.call(this, "\n            <label>First</label> <input value=\"{Binding First}\" /> <br/>\n            <label>Middle</label> <input value=\"{Binding Middle}\" /> <br/>\n            <label>Last</label> <input value=\"{Binding Last}\" /> <br/>\n            <br/>\n        ") || this;
    }
    return NameView;
}(ViewBase));
NameView.selector = ComponentOperations.register("nameview", NameView);
// app
var App = (function () {
    function App() {
        this.propertyChangedEvent = new PropertyChangedEvent();
        this.name = new Name('Anton', 'C', 'Bursch');
        this.nameViewModel = new NameViewModel(this.name);
    }
    Object.defineProperty(App.prototype, "NameViewModel", {
        get: function () {
            return this.nameViewModel;
        },
        set: function (value) {
            if (this.nameViewModel != value) {
                this.nameViewModel = value;
                this.propertyChanged('NameViewModel');
            }
        },
        enumerable: true,
        configurable: true
    });
    App.prototype.propertyChanged = function (propertyName) {
        this.propertyChangedEvent.invoke(this, new PropertyChangedEventArgs(propertyName));
    };
    return App;
}());
// test
var app = new App();
window.onload = function () {
    var elements = document.body.querySelectorAll('*');
    var l = elements.length;
    for (var e = 0; e < l; e++) {
        var element = elements[e];
        var tagName = element.tagName.toLowerCase();
        if (ComponentOperations.components[tagName] != null) {
            ComponentOperations.attach(element, new ComponentOperations.components[tagName]());
        }
    }
    BindingOperations.setBindings(document.body, app);
};
//# sourceMappingURL=app.js.map