import Rule from "./Rule"
export default class PrerequisitesRule extends Rule {

    constructor() {
        super("prerequisites")
    }

    validateSlots(timeSlots, errors) {

        let beforeSlots = []

        //todo ensure sorting
        timeSlots.forEach((slot) => {
            const prerequisites = slot.module ? slot.module.prerequisites : [];
            const prerequisitesMet = prerequisites.every(moduleId => beforeSlots.find(beforeSlot => {
                return moduleId === beforeSlot.module.id && this.isPreviousSemester(beforeSlot, slot);
            }));
            if (!prerequisitesMet) {
                errors[slot.id] = this.getErrorMessage()
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })
    }

    isPreviousSemester(before, after) {
        if (before.year > after.year) {
            return false;
        }
        if (before.year === after.year) {
            return before.semester === 'HS' && after.semester === 'FS'
        }
        return true;
    }

    doesMatchSelection(moduleId) {
        return true
    }

    validateSelection(module, timeSlots, errors) {

        let beforeSlots = []
        let prerequisitesMet = false

        //todo ensure sorting
        timeSlots.forEach((slot) => {
            if (!prerequisitesMet) {
                prerequisitesMet = module.prerequisites.every(moduleId => beforeSlots.find(beforeSlot => {
                    return moduleId === beforeSlot.module.id && this.isPreviousSemester(beforeSlot, slot);
                }));
            }
            if (!prerequisitesMet) {
                errors[slot.id].push(this.getErrorMessage());
            }
            if (slot.module) {
                beforeSlots.push(slot)
            }
        })
    }

    getErrorMessage() {
        return `Missing one or more prerequisites`;
    }

}