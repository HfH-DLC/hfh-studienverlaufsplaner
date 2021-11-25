export default class Module {

    constructor(id, name, categoryId, credits, dates = [], prerequisites = []) {
        this.id = id
        this.name = name
        this.categoryId = categoryId
        this.credits = credits
        this.dates = dates
        this.prerequisites = prerequisites
    }
}