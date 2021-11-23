export default class Module {

    constructor(id, name, credits, dates = [], category) {
        this.id = id
        this.name = name
        this.credits = credits
        this.dates = dates
        this.category = category
    }
}