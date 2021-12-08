import Rule from "./Rule"
export default class DateRule extends Rule {

    constructor() {
        super("date")
    }

    validateSlots(timeSlots, errors) {
        timeSlots.forEach((slot) => {
            if (slot.module) {
                if (!slot.module.timeSlots.find(timeSlot => timeSlot.id == slot.id)) {
                    errors[slot.id] = "This module is not available on this date";
                }
            }
        })
    }

    doesMatchSelection(moduleId) {
        return true
    }

    validateSelection(module, timeSlots, errors) {
        timeSlots.forEach(slot => {
            if (!module.timeSlots.find(timeSlot => timeSlot.id == slot.id)) {
                errors[slot.id].push("The selected module is not available on this date");
            }
        })
    }
}