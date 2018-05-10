export class Delegate {
    target: object;
    method: Function;
    constructor(target: object, method: Function) {
        this.target = target;
        this.method = method;
    }
}