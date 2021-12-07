import Rule from "./Rule"
export default class PrerequisitesRule extends Rule {

    constructor() {
        super("prerequisites")
    }

    validateSlots(timeSlots, errors) {

        let beforeModules = []

        timeSlots.forEach((slot) => {
            const prerequisites = slot.module ? slot.module.prerequisites : [];
            const prerequisitesMet = prerequisites.every(moduleId => beforeModules.includes(moduleId));
            if (!prerequisitesMet) {
                errors[slot.id] = this.getErrorMessage()
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })
    }

    doesMatchSelection(moduleId) {
        return true
    }

    validateSelection(module, timeSlots, errors) {

        let beforeModules = []
        let prerequisitesMet = false

        timeSlots.forEach((slot) => {
            if (!prerequisitesMet) {
                prerequisitesMet = module.prerequisites.every(module => beforeModules.includes(module));
            }
            if (!prerequisitesMet) {
                errors[slot.id].push(this.getErrorMessage());
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })
    }

    getErrorMessage() {
        return `Missing one or more prerequisites`;
    }

}