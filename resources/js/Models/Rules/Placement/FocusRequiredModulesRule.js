import BaseScheduleRule from "./BaseScheduleRule";

export default class FocusRequiredModulesRule extends BaseScheduleRule {
    constructor() {
        super("FocusRequiredModules");
    }

    validatePlacement(state, getters, errors) {}

    validateModule() {}

    validateSelection(module, status) {}
}
