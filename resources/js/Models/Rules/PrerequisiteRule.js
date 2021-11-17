export default class PrerequisiteRule {


    constructor(moduleId, prerequisitIds) {
        this._moduleId = moduleId
        this._prerequisitIds = prerequisitIds
    }

    validateModules(plan) {
        const moduleErrors = {}

        let beforeModules = []
        let prerequisitsMet = false

        plan.timeSlots.forEach((slot) => {
            if (!prerequisitsMet) {
                prerequisitsMet = this._prerequisitIds.every(module => beforeModules.includes(module));
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })
        if (!prerequisitsMet) {
            moduleErrors[this._moduleId] = this.getErrorMessage()
        }

        return moduleErrors;
    }

    validateSlots(plan) {
        const slotErrors = {}

        let beforeModules = []
        let prerequisitsMet = false

        plan.timeSlots.forEach((slot) => {
            if (!prerequisitsMet) {
                prerequisitsMet = this._prerequisitIds.every(module => beforeModules.includes(module));
            }
            if (slot.module && slot.module.id == this._moduleId && !prerequisitsMet) {
                slotErrors[slot.id] = this.getErrorMessage()
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })

        return slotErrors;
    }

    doesMatchSelection(moduleId) {
        return moduleId === this._moduleId
    }

    validateSelection(moduleId, plan) {
        const selectionErrors = {}
        if (moduleId != this._moduleIdId) {
            return selectionErrors
        }

        let beforeModules = []
        let prerequisitsMet = false

        plan.timeSlots.forEach((slot) => {
            if (!prerequisitsMet) {
                prerequisitsMet = this._prerequisitIds.every(module => beforeModules.includes(module));
            }
            if (!slot.module && !prerequisitsMet) {
                selectionErrors[slot.id] = this.getErrorMessage()
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })
        return selectionErrors
    }

    getErrorMessage() {
        return `Missing one or more prerequisites: ${this._prerequisitIds.join(',')}`;
    }

}