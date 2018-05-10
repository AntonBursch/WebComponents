import { ViewBase } from "../Library/Base/ViewBase";
import { ComponentOperations } from "../Library/Core/Operations/ComponentOperations";

export class NameView extends ViewBase {
    static selector: string = ComponentOperations.register("NameView", NameView);
    constructor() {
        super(`
            <label>First</label> <input value="{Binding First}" /> <br/>
            <label>Middle</label> <input value="{Binding Middle}" /> <br/>
            <label>Last</label> <input value="{Binding Last}" /> <br/>
            <br/>
        `);
    }
}