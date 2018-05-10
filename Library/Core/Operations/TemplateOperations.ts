

export class TemplateOperations {
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