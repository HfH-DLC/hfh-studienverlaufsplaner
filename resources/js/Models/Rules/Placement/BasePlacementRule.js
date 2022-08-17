import Rule from '../Rule';
export default class BasePlacementRule extends Rule {

    constructor(type) {
        super('placement', type);
        if (this.constructor == BasePlacementRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    validatePlacements() {
        throw new Error("Method not implemented");
    }


    validateModule() {
        throw new Error("Method not implemented");
    }

    validateSelection(module, status) {
        throw new Error("Method not implemented");
    }
}