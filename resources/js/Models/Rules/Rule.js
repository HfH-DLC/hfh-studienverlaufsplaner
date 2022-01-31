export default class Rule {

    constructor(type) {
        if (this.constructor == Rule) {
            throw new Error("Abstract classes can't be instantiated.");
        }

        this.type = type;
    }

    validateSlots() {
        throw new Error("Method not implemented");
    }


    validateModule() {
        throw new Error("Method not implemented");
    }

    validateSelection(module, timeSlots, status) {
        throw new Error("Method not implemented");
    }
}