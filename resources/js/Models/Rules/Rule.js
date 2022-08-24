export default class Rule {
    constructor(category, type) {
        if (this.constructor == Rule) {
            throw new Error("Abstract classes can't be instantiated.");
        }
        this.category = category;
        this.type = type;
    }
}
