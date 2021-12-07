export default class Module {

    constructor(id, number, name, categoryId, credits, dates = [], prerequisites = []) {
        this.id = id
        this.number = number
        this.name = name
        this.categoryId = categoryId
        this.credits = credits
        this.dates = dates
        this.prerequisites = prerequisites
    }
}