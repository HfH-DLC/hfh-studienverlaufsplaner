export default class DateRule {

    constructor() {}

    validateSlots(timeSlots, errors) {
        timeSlots.forEach((slot) => {
            if (slot.module) {
                if (!slot.module.dates.find(date => this._matchesDate(slot, date))) {
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
            if (!module.dates.find(date => this._matchesDate(slot, date))) {
                errors[slot.id].push("The selected module is not available on this date");
            }
        })
    }

    _matchesDate(slot, date) {
        return slot.semester.startsWith(date.semester) &&
            slot.day == date.day &&
            //slot.week == date.week &&
            slot.time == date.time
    }

}