import { ModelBase } from "../Library/Base/ModelBase";

export class Name extends ModelBase {
    first: string;
    middle: string;
    last: string;
    
    public from(o: object = {}) {
        return super.from(o, {});
    }
}