export default class PrerequisitesRule {

    constructor() {}

    validateSlots(plan) {
        const slotErrors = {}

        let beforeModules = []

        plan.timeSlots.forEach((slot) => {
            const prerequisites = slot.module ? slot.module.prerequisites : [];
            const prerequisitesMet = prerequisites.every(moduleId => beforeModules.includes(moduleId));
            if (!prerequisitesMet) {
                slotErrors[slot.id] = this.getErrorMessage()
            }
            if (slot.module) {
                beforeModules.push(slot.module.id)
            }
        })

        return slotErrors;
    }

    doesMatchSelection(moduleId) {
        return true
    }

    validateSelection(moduleId, plan, slotStatus) {
        const selectionErrors = {}
        const module = plan.modules.find(module => module.id == moduleId);

        let beforeModules = []
        let prerequisitesMet = false

        plan.timeSlots.forEach((slot) => {
            if (!prerequisitesMet) {
                console.log(module);
                prerequisitesMet = module.prerequisites.every(module => beforeModules.includes(module));
            }
            if (!slot.module && !prerequisitesMet) {
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
        return `Missing one or more prerequisites`;
    }

}