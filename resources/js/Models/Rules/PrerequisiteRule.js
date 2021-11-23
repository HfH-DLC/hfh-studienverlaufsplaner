export default class PrerequisiteRule {


    constructor(moduleId, prerequisitIds) {
        this._moduleId = moduleId
        this._prerequisitIds = prerequisitIds
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
        return moduleId == this._moduleId
    }

    validateSelection(moduleId, plan, slotStatus) {
        const selectionErrors = {}
        if (moduleId != this._moduleId) {
            return selectionErrors
        }

        let beforeModules = []
        let prerequisitsMet = false

        plan.timeSlots.forEach((slot) => {
            if (!prerequisitsMet) {
                prerequisitsMet = this._prerequisitIds.every(module => beforeModules.includes(module));
            }
            if (!slot.module && !prerequisitsMet) {
                slotStatus[slot.id].selectable = false;
                slotStatus[slot.id].errors.push[this.getErrorMessage()];
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