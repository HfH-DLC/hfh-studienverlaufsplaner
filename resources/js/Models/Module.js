export default class Module {

    constructor(id, name, credits, dates = [], prerequisites = []) {
        this.id = id
        this.name = name
        this.credits = credits
        this.dates = dates
        this.prerequisites = prerequisites
    }
}