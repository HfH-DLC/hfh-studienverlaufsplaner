import Rule from "../Rule";
export default class BaseScheduleRule extends Rule {
    constructor(name) {
        super(name);
        if (this.constructor == BaseScheduleRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
    validateGlobal() {}
    validatePlacements() {}
    validateModule() {}
    validateSelection() {}
}
