import Rule from '../Rule';
export default class BaseModuleSelectionRule extends Rule {

    constructor(type) {
        super('focusCredit', type);
        if (this.constructor == BaseModuleSelectionRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    validate(addError) {
        throw new Error("Method not implemented");
    }
}