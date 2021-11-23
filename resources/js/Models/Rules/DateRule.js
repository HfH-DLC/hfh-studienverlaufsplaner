export default class DateRule {

    constructor() {}

    validateSlots(plan) {
        const slotErrors = {}

        return slotErrors
    }

    doesMatchSelection(moduleId) {
        return true
    }

    validateSelection(moduleId, plan, slotStatus) {
        const module = plan.modules.find(module => module.id == moduleId);
        if (module) {
            plan.timeSlots.forEach(slot => {
                if (!module.dates.find(date => this._matchesDate(slot, date))) {
                    slotStatus[slot.id].selectable = false;
                    slotStatus[slot.id].errors.push("The selected module is not available on this date");
                }
            })
        }
    }

    _matchesDate(slot, date) {
        return slot.semester.startsWith(date.semester) &&
            slot.day == date.day &&
            //slot.week == date.week &&
            slot.time == date.time
    }

}