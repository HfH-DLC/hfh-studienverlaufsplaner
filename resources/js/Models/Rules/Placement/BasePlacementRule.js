import Rule from '../Rule';
export default class BasePlacementRule extends Rule {

    constructor(type) {
        if (this.constructor == BasePlacementRule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        super('placement', type);
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