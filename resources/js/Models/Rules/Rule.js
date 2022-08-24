export default class Rule {
    constructor(name) {
        if (this.constructor == Rule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.name;
    }
}
